import { desc, eq } from "drizzle-orm";

import { type ClientItem } from "../client/types";
import { db } from "../db";
import { savedItems, type SavedItem } from "../db/schema";

/** Map a DB row to the wire-safe shape sent to the browser. */
export function toClientItem(row: SavedItem): ClientItem {
  return {
    id: row.id,
    url: row.url,
    platform: row.platform,
    status: row.status,
    title: row.title,
    content: row.content,
    error: row.error,
    savedAt: row.savedAt.toISOString(),
  };
}

/** All of a user's saved items, newest first. */
export async function listItems(userId: string): Promise<ClientItem[]> {
  const rows = await db
    .select()
    .from(savedItems)
    .where(eq(savedItems.userId, userId))
    .orderBy(desc(savedItems.savedAt));

  return rows.map(toClientItem);
}

/** A single saved item by id, or `null`. Used by the client poller. */
export async function getItem(id: string): Promise<ClientItem | null> {
  const [row] = await db
    .select()
    .from(savedItems)
    .where(eq(savedItems.id, id))
    .limit(1);

  return row ? toClientItem(row) : null;
}
