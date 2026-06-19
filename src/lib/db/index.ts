import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";
import * as schema from "./schema";

/**
 * A single, long-lived `postgres` connection pool.
 *
 * Next.js hot-reloads modules in development, which would otherwise open a new
 * pool on every change and exhaust connections. We cache the client on
 * `globalThis` to survive reloads.
 */
const globalForDb = globalThis as unknown as {
  __curatorDbClient?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.__curatorDbClient ??
  postgres(env.DATABASE_URL, {
    max: env.NODE_ENV === "production" ? 10 : 1,
  });

if (env.NODE_ENV !== "production") {
  globalForDb.__curatorDbClient = client;
}

/** The typed Drizzle client used across the app. */
export const db = drizzle(client, { schema });

export type Database = typeof db;
