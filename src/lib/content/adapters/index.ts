import { type Platform } from "../unified-content-model";
import { githubAdapter } from "./github";
import { redditAdapter } from "./reddit";
import { twitterAdapter } from "./twitter";
import { type PlatformAdapter } from "./types";
import { youtubeAdapter } from "./youtube";

/** Registry of every platform adapter, keyed by platform. */
const ADAPTERS: Record<Platform, PlatformAdapter> = {
  youtube: youtubeAdapter,
  twitter: twitterAdapter,
  reddit: redditAdapter,
  github: githubAdapter,
};

/** Resolve the adapter for a given platform. */
export function getAdapter(platform: Platform): PlatformAdapter {
  return ADAPTERS[platform];
}

export { type PlatformAdapter } from "./types";
export {
  AdapterError,
  FetchError,
  NormalizationError,
  RateLimitError,
} from "./errors";
