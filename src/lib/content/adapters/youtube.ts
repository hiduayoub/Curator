import {
  type UnifiedContentModel,
  type YouTubeContent,
} from "../unified-content-model";
import { NormalizationError } from "./errors";
import { randomChoice, randomInt, simulateNetwork } from "./mock-utils";
import { type PlatformAdapter } from "./types";

/** Extract the 11-char video id from any common YouTube URL shape. */
function extractVideoId(url: URL): string | null {
  if (url.hostname.replace(/^www\./, "") === "youtu.be") {
    return url.pathname.slice(1) || null;
  }
  return (
    url.searchParams.get("v") ??
    url.pathname.split("/").filter(Boolean).at(-1) ??
    null
  );
}

const CHANNELS = ["Fireship", "Vercel", "Theo - t3.gg", "Lex Fridman"] as const;

export const youtubeAdapter: PlatformAdapter = {
  platform: "youtube",

  async fetchAndNormalize(url: string): Promise<UnifiedContentModel> {
    await simulateNetwork();

    const parsed = new URL(url);
    const videoId = extractVideoId(parsed);
    if (!videoId) {
      throw new NormalizationError(`Could not extract a video id from ${url}`);
    }

    const channel = randomChoice(CHANNELS);
    const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    const content: YouTubeContent = {
      platform: "youtube",
      url,
      canonicalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      title: `${channel}: ${randomChoice(["Building", "Shipping", "Understanding"])} in ${randomInt(5, 30)} minutes`,
      description:
        "A mock-normalized YouTube video used during Phase 3 development.",
      author: {
        name: channel,
        handle: channel.toLowerCase().replace(/[^a-z0-9]/g, ""),
        url: `https://www.youtube.com/@${channel.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        avatarUrl: null,
      },
      thumbnailUrl: thumbnail,
      publishedAt: new Date(
        Date.now() - randomInt(1, 400) * 86_400_000,
      ).toISOString(),
      metrics: {
        likes: randomInt(100, 90_000),
        comments: randomInt(10, 8_000),
        shares: null,
        views: randomInt(1_000, 4_000_000),
      },
      data: {
        videoId,
        channelTitle: channel,
        channelUrl: `https://www.youtube.com/@${channel.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        durationSeconds: randomInt(60, 3_600),
        thumbnails: {
          default: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
          high: thumbnail,
        },
      },
    };

    return content;
  },
};
