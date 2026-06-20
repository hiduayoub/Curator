import { NextResponse } from "next/server";

import { listItems } from "@/lib/ingestion/list-items";
import { getOrCreateDemoUser } from "@/lib/users/demo-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** List the current (demo) user's saved items, newest first. */
export async function GET(): Promise<NextResponse> {
  try {
    const user = await getOrCreateDemoUser();
    const items = await listItems(user.id);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("[api/items] failed to list items:", error);
    return NextResponse.json(
      { error: "Could not load your library." },
      { status: 503 },
    );
  }
}
