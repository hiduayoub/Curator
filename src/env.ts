import { z } from "zod";

/**
 * Strongly-typed, validated environment.
 *
 * Importing this module throws immediately (at boot) if any required variable
 * is missing or malformed, so the rest of the codebase can trust `env.*`.
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  /** PostgreSQL connection string, e.g. postgres://user:pass@host:5432/db */
  DATABASE_URL: z.url(),

  /** Redis connection string used by the BullMQ queue (Phase 3). */
  REDIS_URL: z.url().default("redis://localhost:6379"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    z.flattenError(parsed.error).fieldErrors,
  );
  throw new Error("Invalid environment variables. See logs above.");
}

export const env = parsed.data;

export type Env = z.infer<typeof envSchema>;
