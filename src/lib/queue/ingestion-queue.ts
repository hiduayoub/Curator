import { Queue } from "bullmq";

import { redisConnection } from "./connection";
import {
  INGESTION_JOB_NAME,
  INGESTION_QUEUE_NAME,
  type IngestionJobData,
  type IngestionJobResult,
} from "./types";

/**
 * Lazily-constructed ingestion queue.
 *
 * Built on first use (not at import) so merely importing this module — e.g.
 * when Next.js analyses the route during `next build` — never opens a Redis
 * connection. Cached on `globalThis` so dev hot-reloads reuse one connection.
 */
const globalForQueue = globalThis as unknown as {
  __curatorIngestionQueue?: Queue<IngestionJobData, IngestionJobResult>;
};

export function getIngestionQueue(): Queue<
  IngestionJobData,
  IngestionJobResult
> {
  const existing = globalForQueue.__curatorIngestionQueue;
  if (existing) return existing;

  const queue = new Queue<IngestionJobData, IngestionJobResult>(
    INGESTION_QUEUE_NAME,
    {
      connection: redisConnection,
      defaultJobOptions: {
        // Retry transient failures (rate limits, flaky fetches) with backoff.
        attempts: 5,
        backoff: { type: "exponential", delay: 2_000 },
        removeOnComplete: { age: 3_600, count: 1_000 },
        removeOnFail: { age: 24 * 3_600 },
      },
    },
  );

  globalForQueue.__curatorIngestionQueue = queue;
  return queue;
}

/**
 * Enqueue a saved item for asynchronous ingestion.
 *
 * The `saved_items` id is reused as the job id so a given row is never queued
 * twice concurrently (idempotent enqueue).
 */
export function enqueueIngestion(data: IngestionJobData) {
  return getIngestionQueue().add(INGESTION_JOB_NAME, data, {
    jobId: data.savedItemId,
  });
}
