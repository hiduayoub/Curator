import { eq } from "drizzle-orm";

import { db } from "../db";
import { users, type User } from "../db/schema";

/**
 * Curator has no auth yet (that arrives with the frontend). Until then, items
 * are attributed to a single stable demo user so the ingestion pipeline is
 * fully exercisable end-to-end.
 */
const DEMO_USER_EMAIL = "demo@curator.local";

/** Fetch the demo user, creating it on first use. Safe under concurrent calls. */
export async function getOrCreateDemoUser(): Promise<User> {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, DEMO_USER_EMAIL))
    .limit(1);
  if (existing[0]) return existing[0];

  const inserted = await db
    .insert(users)
    .values({ email: DEMO_USER_EMAIL, name: "Demo User" })
    .onConflictDoNothing()
    .returning();
  if (inserted[0]) return inserted[0];

  // Lost an insert race — read the row the other writer just created.
  const row = await db
    .select()
    .from(users)
    .where(eq(users.email, DEMO_USER_EMAIL))
    .limit(1);
  if (!row[0]) throw new Error("Failed to get or create the demo user");
  return row[0];
}
