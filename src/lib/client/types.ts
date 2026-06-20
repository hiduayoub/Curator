import {
  type Platform,
  type UnifiedContentModel,
} from "../content/unified-content-model";

/** Ingestion lifecycle, mirrored from the DB enum for the client. */
export type ItemStatus = "pending" | "processing" | "ready" | "failed";

/**
 * A saved item as it crosses the wire to the browser. Dates are ISO strings
 * (JSON has no Date), and `content` is the normalized {@link UnifiedContentModel}.
 */
export interface ClientItem {
  id: string;
  url: string;
  platform: Platform | null;
  status: ItemStatus;
  title: string | null;
  content: UnifiedContentModel | null;
  error: string | null;
  savedAt: string;
}

/** `true` while an item is still being fetched/normalized (shows a skeleton). */
export function isPending(item: ClientItem): boolean {
  return item.status === "pending" || item.status === "processing";
}
