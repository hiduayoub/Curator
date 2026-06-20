import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { saveItem } from "@/lib/ingestion/save-item";
import { getOrCreateDemoUser } from "@/lib/users/demo-user";

// Postgres (postgres.js) and the BullMQ/Redis client require the Node runtime.
export const runtime = "nodejs";

/** Body accepted by `POST /api/save`. */
const saveRequestSchema = z.object({
  url: z.url(),
  folderId: z.uuid().optional(),
  tagIds: z.array(z.uuid()).max(50).optional(),
  /** Optional until auth lands; falls back to the demo user. */
  userId: z.uuid().optional(),
});

/**
 * Ingestion endpoint.
 *
 * Validates the URL, writes a `pending` `saved_items` row, pushes a job onto
 * the Redis queue, and returns `202 Accepted` immediately — the client never
 * blocks on the upstream fetch/normalize.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const parsed = saveRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        details: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const userId = parsed.data.userId ?? (await getOrCreateDemoUser()).id;

    const result = await saveItem({
      url: parsed.data.url,
      userId,
      folderId: parsed.data.folderId,
      tagIds: parsed.data.tagIds,
    });

    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    console.error("[api/save] ingestion enqueue failed:", error);
    return NextResponse.json(
      { error: "Failed to queue item for ingestion. Please try again." },
      { status: 503 },
    );
  }
}
