import { type Platform } from "../content/unified-content-model";

/** Name of the BullMQ queue that drives content ingestion. */
export const INGESTION_QUEUE_NAME = "content-ingestion";

/** The single job name on the ingestion queue. */
export const INGESTION_JOB_NAME = "ingest";

/**
 * Payload handed to the worker. Deliberately tiny — it carries the row id and
 * the raw URL only; everything else is fetched and normalized by the worker.
 */
export interface IngestionJobData {
  /** Primary key of the `saved_items` row to hydrate. */
  savedItemId: string;
  /** The raw URL the user saved. */
  url: string;
}

/** Value resolved by a successful job. */
export interface IngestionJobResult {
  platform: Platform;
}
