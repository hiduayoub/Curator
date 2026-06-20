import { Queue } from "bullmq";

import { redisConnection } from "./connection";
import {
  INGESTION_JOB_NAME,
  INGESTION_QUEUE_NAME,
  type IngestionJobData,
  type IngestionJobResult,
} from "./types";

/**
 * The ingestion queue. Producers (the `POST /api/save` route in Phase 4) push
 * jobs here and return immediately; the worker drains them asynchronously.
 *
 * Cached on `globalThis` so Next.js hot-reloads in development don't open a new
 * Redis connection on every change.
 */
const globalForQueue = globalThis as unknown as {
  __curatorIngestionQueue?: Queue<IngestionJobData, IngestionJobResult>;
};

export const ingestionQueue =
  globalForQueue.__curatorIngestionQueue ??
  new Queue<IngestionJobData, IngestionJobResult>(INGESTION_QUEUE_NAME, {
    connection: redisConnection,
    defaultJobOptions: {
      // Retry transient failures (rate limits, flaky fetches) with backoff.
      attempts: 5,
      backoff: { type: "exponential", delay: 2_000 },
      removeOnComplete: { age: 3_600, count: 1_000 },
      removeOnFail: { age: 24 * 3_600 },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForQueue.__curatorIngestionQueue = ingestionQueue;
}

/**
 * Enqueue a saved item for asynchronous ingestion.
 *
 * The `saved_items` id is reused as the job id so a given row is never queued
 * twice concurrently (idempotent enqueue).
 */
export function enqueueIngestion(data: IngestionJobData) {
  return ingestionQueue.add(INGESTION_JOB_NAME, data, {
    jobId: data.savedItemId,
  });
}
