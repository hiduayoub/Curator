import { type Platform } from "./unified-content-model";

/**
 * Classify a raw URL into a supported {@link Platform}, or `null` when the URL
 * is malformed or unsupported. Host-based and intentionally cheap so it can run
 * synchronously at save-time and again inside the worker.
 */
export function detectPlatform(rawUrl: string): Platform | null {
  let host: string;
  try {
    host = new URL(rawUrl).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }

  if (
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtu.be"
  ) {
    return "youtube";
  }

  if (
    host === "twitter.com" ||
    host === "mobile.twitter.com" ||
    host === "x.com"
  ) {
    return "twitter";
  }

  if (
    host === "reddit.com" ||
    host.endsWith(".reddit.com") ||
    host === "redd.it"
  ) {
    return "reddit";
  }

  if (host === "github.com") {
    return "github";
  }

  return null;
}
