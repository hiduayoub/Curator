import { UnrecoverableError, Worker, type Job } from "bullmq";
import { eq } from "drizzle-orm";

import { getAdapter } from "../content/adapters";
import { AdapterError } from "../content/adapters/errors";
import { detectPlatform } from "../content/platform-detector";
import {
  unifiedContentSchema,
  type UnifiedContentModel,
} from "../content/unified-content-model";
import { db } from "../db";
import { savedItems } from "../db/schema";
import { redisConnection } from "./connection";
import {
  INGESTION_QUEUE_NAME,
  type IngestionJobData,
  type IngestionJobResult,
} from "./types";

/** Persist a permanent failure and stop BullMQ from retrying. */
async function failPermanently(
  savedItemId: string,
  message: string,
): Promise<never> {
  await db
    .update(savedItems)
    .set({ status: "failed", error: message, processedAt: new Date() })
    .where(eq(savedItems.id, savedItemId));
  throw new UnrecoverableError(message);
}

/**
 * Process a single ingestion job: classify the URL, run the matching adapter,
 * validate the normalized payload, and hydrate the `saved_items` row.
 *
 * Throwing a plain error lets BullMQ retry (transient failures); throwing
 * `UnrecoverableError` (via {@link failPermanently}) stops retries.
 */
async function processJob(
  job: Job<IngestionJobData>,
): Promise<IngestionJobResult> {
  const { savedItemId, url } = job.data;

  await db
    .update(savedItems)
    .set({ status: "processing", error: null })
    .where(eq(savedItems.id, savedItemId));

  const platform = detectPlatform(url);
  if (!platform) {
    return failPermanently(savedItemId, `Unsupported or invalid URL: ${url}`);
  }

  let content: UnifiedContentModel;
  try {
    const raw = await getAdapter(platform).fetchAndNormalize(url);
    // Re-validate at the boundary: never trust an adapter blindly.
    content = unifiedContentSchema.parse(raw);
  } catch (error) {
    // Non-retryable adapter errors (e.g. normalization) fail immediately.
    if (error instanceof AdapterError && !error.retryable) {
      return failPermanently(savedItemId, error.message);
    }
    // Everything else (rate limits, transient fetches, validation) is retried
    // by BullMQ according to the queue's backoff policy.
    throw error;
  }

  await db
    .update(savedItems)
    .set({
      status: "ready",
      platform,
      title: content.title,
      content,
      rawPayload: content,
      error: null,
      processedAt: new Date(),
    })
    .where(eq(savedItems.id, savedItemId));

  return { platform };
}

/**
 * Construct (and start) the ingestion worker. Call this from the standalone
 * worker process — see `src/worker/index.ts`.
 */
export function createIngestionWorker(): Worker<
  IngestionJobData,
  IngestionJobResult
> {
  const worker = new Worker<IngestionJobData, IngestionJobResult>(
    INGESTION_QUEUE_NAME,
    processJob,
    {
      connection: redisConnection,
      concurrency: 5,
      // Crude client-side rate limit shared across the worker: 10 jobs/sec.
      limiter: { max: 10, duration: 1_000 },
    },
  );

  worker.on("completed", (job, result) => {
    console.warn(`[ingestion] ✓ ${job.id} → ${result.platform}`);
  });

  worker.on("failed", (job, error) => {
    if (!job) return;
    const attempts = job.opts.attempts ?? 1;
    const exhausted = job.attemptsMade >= attempts;
    console.warn(
      `[ingestion] ✗ ${job.id} (attempt ${job.attemptsMade}/${attempts})` +
        `${exhausted ? " — exhausted" : " — will retry"}: ${error.message}`,
    );

    // When retries are exhausted, record the final failure. (Unrecoverable
    // errors are already persisted by `failPermanently` inside the processor.)
    if (exhausted) {
      void db
        .update(savedItems)
        .set({
          status: "failed",
          error: error.message,
          processedAt: new Date(),
        })
        .where(eq(savedItems.id, job.data.savedItemId));
    }
  });

  worker.on("error", (error) => {
    console.error("[ingestion] worker error:", error);
  });

  return worker;
}
