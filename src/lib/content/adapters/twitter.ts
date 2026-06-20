import {
  type TwitterContent,
  type UnifiedContentModel,
} from "../unified-content-model";
import { NormalizationError } from "./errors";
import { randomChoice, randomInt, simulateNetwork } from "./mock-utils";
import { type PlatformAdapter } from "./types";

/** Pull `{ handle, tweetId }` from a `/<handle>/status/<id>` URL. */
function parseTweetUrl(url: URL): { handle: string; tweetId: string } | null {
  const segments = url.pathname.split("/").filter(Boolean);
  const statusIndex = segments.indexOf("status");
  if (statusIndex <= 0) return null;
  const handle = segments[statusIndex - 1];
  const tweetId = segments[statusIndex + 1];
  if (!handle || !tweetId) return null;
  return { handle, tweetId };
}

export const twitterAdapter: PlatformAdapter = {
  platform: "twitter",

  async fetchAndNormalize(url: string): Promise<UnifiedContentModel> {
    await simulateNetwork();

    const parsed = parseTweetUrl(new URL(url));
    if (!parsed) {
      throw new NormalizationError(`Could not extract a tweet id from ${url}`);
    }
    const { handle, tweetId } = parsed;

    const text = randomChoice([
      "Just shipped something I'm genuinely proud of. Threads below 🧵",
      "Hot take: most abstractions are premature.",
      "This changes how I think about background jobs entirely.",
    ]);

    const content: TwitterContent = {
      platform: "twitter",
      url,
      canonicalUrl: `https://x.com/${handle}/status/${tweetId}`,
      title: text.slice(0, 80),
      description: text,
      author: {
        name: handle,
        handle,
        url: `https://x.com/${handle}`,
        avatarUrl: null,
      },
      thumbnailUrl: null,
      publishedAt: new Date(
        Date.now() - randomInt(1, 200) * 3_600_000,
      ).toISOString(),
      metrics: {
        likes: randomInt(0, 50_000),
        comments: randomInt(0, 3_000),
        shares: randomInt(0, 9_000),
        views: randomInt(500, 2_000_000),
      },
      data: {
        tweetId,
        text,
        media: [],
        isRetweet: false,
        quotedTweetUrl: null,
      },
    };

    return content;
  },
};
