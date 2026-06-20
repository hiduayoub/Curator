import { type ClientItem } from "./client/types";
import { detectPlatform } from "./content/platform-detector";
import { type UnifiedContentModel } from "./content/unified-content-model";

const newId = (): string => crypto.randomUUID();
const minutesAgo = (m: number): string =>
  new Date(Date.now() - m * 60_000).toISOString();

function ready(
  url: string,
  content: UnifiedContentModel,
  savedAt: string,
): ClientItem {
  return {
    id: newId(),
    url,
    platform: content.platform,
    status: "ready",
    title: content.title,
    content,
    error: null,
    savedAt,
  };
}

/**
 * A curated, realistic library used by the empty-state "Load sample content"
 * action so the full UI — cards, masonry, palette, filtering — can be explored
 * without a running backend.
 */
export const SAMPLE_ITEMS: ClientItem[] = [
  ready(
    "https://github.com/drizzle-team/drizzle-orm",
    {
      platform: "github",
      url: "https://github.com/drizzle-team/drizzle-orm",
      canonicalUrl: "https://github.com/drizzle-team/drizzle-orm",
      title: "drizzle-team/drizzle-orm",
      description:
        "Headless TypeScript ORM with a head. Lightweight, performant, and serverless-ready.",
      author: {
        name: "drizzle-team",
        handle: "drizzle-team",
        url: "https://github.com/drizzle-team",
        avatarUrl: null,
      },
      thumbnailUrl: null,
      publishedAt: minutesAgo(60 * 24 * 120),
      metrics: { likes: 24800, comments: null, shares: 760, views: null },
      data: {
        owner: "drizzle-team",
        repo: "drizzle-orm",
        fullName: "drizzle-team/drizzle-orm",
        defaultBranch: "main",
        stars: 24800,
        forks: 760,
        watchers: 120,
        openIssues: 312,
        primaryLanguage: "TypeScript",
        topics: ["orm", "typescript", "sql", "postgres"],
        license: "Apache-2.0",
        isArchived: false,
      },
    },
    minutesAgo(8),
  ),
  ready(
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    {
      platform: "youtube",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      canonicalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Building a job queue from first principles",
      description:
        "A calm walkthrough of backpressure, retries, and idempotency.",
      author: {
        name: "Fireship",
        handle: "fireship",
        url: "https://www.youtube.com/@fireship",
        avatarUrl: null,
      },
      thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      publishedAt: minutesAgo(60 * 24 * 9),
      metrics: { likes: 41200, comments: 1900, shares: null, views: 880000 },
      data: {
        videoId: "dQw4w9WgXcQ",
        channelTitle: "Fireship",
        channelUrl: "https://www.youtube.com/@fireship",
        durationSeconds: 734,
        thumbnails: {
          default: "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg",
          high: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        },
      },
    },
    minutesAgo(42),
  ),
  ready(
    "https://x.com/dan_abramov/status/1790000000000000000",
    {
      platform: "twitter",
      url: "https://x.com/dan_abramov/status/1790000000000000000",
      canonicalUrl: "https://x.com/dan_abramov/status/1790000000000000000",
      title:
        "The best abstraction is the one you can delete in an afternoon when you're wrong.",
      description:
        "The best abstraction is the one you can delete in an afternoon when you're wrong.",
      author: {
        name: "dan",
        handle: "dan_abramov",
        url: "https://x.com/dan_abramov",
        avatarUrl: null,
      },
      thumbnailUrl: null,
      publishedAt: minutesAgo(190),
      metrics: { likes: 9800, comments: 240, shares: 1100, views: 410000 },
      data: {
        tweetId: "1790000000000000000",
        text: "The best abstraction is the one you can delete in an afternoon when you're wrong.",
        media: [],
        isRetweet: false,
        quotedTweetUrl: null,
      },
    },
    minutesAgo(95),
  ),
  ready(
    "https://www.reddit.com/r/typescript/comments/abc123/strict_mode_tips/",
    {
      platform: "reddit",
      url: "https://www.reddit.com/r/typescript/comments/abc123/strict_mode_tips/",
      canonicalUrl:
        "https://www.reddit.com/r/typescript/comments/abc123/strict_mode_tips/",
      title: "What finally made `noUncheckedIndexedAccess` click for me",
      description:
        "Spent a week fighting it, then realized it was catching real bugs the whole time.",
      author: {
        name: "u_quartz42",
        handle: "u_quartz42",
        url: "https://www.reddit.com/user/u_quartz42",
        avatarUrl: null,
      },
      thumbnailUrl: null,
      publishedAt: minutesAgo(60 * 14),
      metrics: { likes: 1240, comments: 186, shares: null, views: null },
      data: {
        postId: "abc123",
        subreddit: "typescript",
        isSelfPost: true,
        selfText:
          "Spent a week fighting it, then realized it was catching real bugs the whole time.",
        linkUrl: null,
        score: 1240,
        upvoteRatio: 0.97,
        numComments: 186,
        flair: "Discussion",
      },
    },
    minutesAgo(260),
  ),
  ready(
    "https://github.com/vercel/next.js",
    {
      platform: "github",
      url: "https://github.com/vercel/next.js",
      canonicalUrl: "https://github.com/vercel/next.js",
      title: "vercel/next.js",
      description: "The React Framework — created and maintained by Vercel.",
      author: {
        name: "vercel",
        handle: "vercel",
        url: "https://github.com/vercel",
        avatarUrl: null,
      },
      thumbnailUrl: null,
      publishedAt: minutesAgo(60 * 24 * 800),
      metrics: { likes: 128000, comments: null, shares: 27000, views: null },
      data: {
        owner: "vercel",
        repo: "next.js",
        fullName: "vercel/next.js",
        defaultBranch: "canary",
        stars: 128000,
        forks: 27000,
        watchers: 1500,
        openIssues: 2900,
        primaryLanguage: "JavaScript",
        topics: ["react", "nextjs", "ssr", "framework"],
        license: "MIT",
        isArchived: false,
      },
    },
    minutesAgo(420),
  ),
  ready(
    "https://www.youtube.com/watch?v=a9iqzZbZHGw",
    {
      platform: "youtube",
      url: "https://www.youtube.com/watch?v=a9iqzZbZHGw",
      canonicalUrl: "https://www.youtube.com/watch?v=a9iqzZbZHGw",
      title: "Designing calmer software",
      description:
        "On restraint, negative space, and earning the user's trust.",
      author: {
        name: "Theo",
        handle: "theo",
        url: "https://www.youtube.com/@theo",
        avatarUrl: null,
      },
      thumbnailUrl: "https://i.ytimg.com/vi/a9iqzZbZHGw/hqdefault.jpg",
      publishedAt: minutesAgo(60 * 24 * 30),
      metrics: { likes: 12400, comments: 540, shares: null, views: 210000 },
      data: {
        videoId: "a9iqzZbZHGw",
        channelTitle: "Theo",
        channelUrl: "https://www.youtube.com/@theo",
        durationSeconds: 1583,
        thumbnails: {
          default: "https://i.ytimg.com/vi/a9iqzZbZHGw/default.jpg",
          high: "https://i.ytimg.com/vi/a9iqzZbZHGw/hqdefault.jpg",
        },
      },
    },
    minutesAgo(1180),
  ),
];

/**
 * Build a plausible "ready" item from a URL, used to simulate ingestion in the
 * browser when no backend is connected. Mirrors what the worker would produce.
 */
export function buildSimulatedItem(url: string): ClientItem {
  const platform = detectPlatform(url);
  const savedAt = new Date().toISOString();

  if (!platform) {
    return {
      id: newId(),
      url,
      platform: null,
      status: "failed",
      title: null,
      content: null,
      error: "That link isn't from a supported platform yet.",
      savedAt,
    };
  }

  const host = (() => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return platform;
    }
  })();

  const base = {
    url,
    canonicalUrl: url,
    description: null,
    author: { name: host, handle: null, url: null, avatarUrl: null },
    thumbnailUrl: null,
    publishedAt: savedAt,
    metrics: { likes: null, comments: null, shares: null, views: null },
  };

  let content: UnifiedContentModel;
  switch (platform) {
    case "youtube":
      content = {
        ...base,
        platform: "youtube",
        title: "Saved YouTube video",
        data: {
          videoId: "preview",
          channelTitle: host,
          channelUrl: null,
          durationSeconds: null,
          thumbnails: { default: null, high: null },
        },
      };
      break;
    case "twitter":
      content = {
        ...base,
        platform: "twitter",
        title: "Saved post on X",
        data: {
          tweetId: "preview",
          text: "Saved post on X",
          media: [],
          isRetweet: false,
          quotedTweetUrl: null,
        },
      };
      break;
    case "reddit":
      content = {
        ...base,
        platform: "reddit",
        title: "Saved Reddit post",
        data: {
          postId: "preview",
          subreddit: "saved",
          isSelfPost: true,
          selfText: null,
          linkUrl: null,
          score: null,
          upvoteRatio: null,
          numComments: null,
          flair: null,
        },
      };
      break;
    case "github":
      content = {
        ...base,
        platform: "github",
        title: "Saved repository",
        data: {
          owner: host,
          repo: "repository",
          fullName: `${host}/repository`,
          defaultBranch: null,
          stars: 0,
          forks: 0,
          watchers: 0,
          openIssues: 0,
          primaryLanguage: null,
          topics: [],
          license: null,
          isArchived: false,
        },
      };
      break;
  }

  return {
    id: newId(),
    url,
    platform,
    status: "ready",
    title: content.title,
    content,
    error: null,
    savedAt,
  };
}
