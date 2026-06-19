/**
 * Drizzle schema.
 *
 * Phase 1 establishes the database connection only. The full relational model
 * (`User`, `Folder`/`Tag`, `SavedItem` and the polymorphic content tables that
 * back the `UnifiedContentModel`) is defined in Phase 2.
 *
 * This file is intentionally minimal so `drizzle-kit` and the typed client
 * have a valid schema entrypoint to import.
 */

export {};
