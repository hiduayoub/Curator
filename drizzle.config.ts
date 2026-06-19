import { defineConfig } from "drizzle-kit";

/**
 * drizzle-kit loads this file through esbuild, which does not resolve the
 * `@/*` TS path alias — so we read `DATABASE_URL` directly here instead of
 * importing `src/env.ts`. drizzle-kit auto-loads `.env` from the project root.
 */
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env before running drizzle-kit.",
  );
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
});
