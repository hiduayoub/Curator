import { createIngestionWorker } from "../lib/queue/worker";

/**
 * Standalone ingestion worker process.
 *
 * Run with `npm run worker`, which loads `.env` (via Node's
 * `--env-file-if-exists`) before this module evaluates, so the queue and DB
 * connections see their configuration.
 */
const worker = createIngestionWorker();

console.warn("[curator] ingestion worker started — waiting for jobs…");

async function shutdown(signal: string): Promise<void> {
  console.warn(`[curator] received ${signal}, shutting down worker…`);
  await worker.close();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
