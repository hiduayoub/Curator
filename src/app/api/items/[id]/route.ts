import { type NextRequest, NextResponse } from "next/server";

import { getItem } from "@/lib/ingestion/list-items";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Fetch a single saved item — polled by the client until it hydrates. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  try {
    const item = await getItem(id);
    if (!item) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (error) {
    console.error(`[api/items/${id}] failed:`, error);
    return NextResponse.json(
      { error: "Could not load this item." },
      { status: 503 },
    );
  }
}
