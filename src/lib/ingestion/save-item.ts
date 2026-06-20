import { eq } from "drizzle-orm";

import { detectPlatform } from "../content/platform-detector";
import { type Platform } from "../content/unified-content-model";
import { db } from "../db";
import { savedItems, savedItemTags } from "../db/schema";
import { enqueueIngestion } from "../queue/ingestion-queue";

export interface SaveItemInput {
  url: string;
  userId: string;
  folderId?: string | undefined;
  tagIds?: string[] | undefined;
}

export interface SaveItemResult {
  id: string;
  status: "pending";
  /** Platform detected synchronously at save-time (the worker re-confirms). */
  platform: Platform | null;
}

/**
 * Persist a saved item as `pending` and enqueue it for asynchronous ingestion.
 *
 * This is the heart of the non-blocking design: we write a placeholder row,
 * push a queue job, and return immediately. The worker hydrates the row later.
 */
export async function saveItem(input: SaveItemInput): Promise<SaveItemResult> {
  const platform = detectPlatform(input.url);

  const [row] = await db
    .insert(savedItems)
    .values({
      userId: input.userId,
      url: input.url,
      folderId: input.folderId ?? null,
      platform,
      status: "pending",
    })
    .returning({ id: savedItems.id });

  if (!row) throw new Error("Failed to create saved item");

  if (input.tagIds && input.tagIds.length > 0) {
    await db
      .insert(savedItemTags)
      .values(input.tagIds.map((tagId) => ({ savedItemId: row.id, tagId })))
      .onConflictDoNothing();
  }

  try {
    await enqueueIngestion({ savedItemId: row.id, url: input.url });
  } catch (error) {
    // The row exists but we couldn't queue it — record the failure so it isn't
    // left stuck in `pending` forever.
    await db
      .update(savedItems)
      .set({ status: "failed", error: "Failed to enqueue ingestion job" })
      .where(eq(savedItems.id, row.id));
    throw error;
  }

  return { id: row.id, status: "pending", platform };
}
