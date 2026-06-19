import { z } from "zod";

/**
 * The Unified Content Model.
 *
 * Social APIs (YouTube, X/Twitter, Reddit, GitHub) return wildly different
 * payloads. Every adapter (Phase 3) is responsible for mapping its raw response
 * into this strict, discriminated shape so the rest of the application — queue,
 * database, and UI — only ever speaks one language.
 *
 * The schemas are defined with Zod so they double as **runtime validators** at
 * the normalization boundary, while their inferred types provide compile-time
 * guarantees everywhere else.
 */

/** Every platform Curator can ingest. Single source of truth for the DB enum. */
export const PLATFORMS = ["youtube", "twitter", "reddit", "github"] as const;

export const platformSchema = z.enum(PLATFORMS);
export type Platform = z.infer<typeof platformSchema>;

/** The author / publisher of a piece of content. */
export const authorSchema = z.object({
  /** Display name, e.g. "Vercel". */
  name: z.string(),
  /** Platform handle without decoration, e.g. "vercel". */
  handle: z.string().nullable(),
  /** Canonical profile URL. */
  url: z.url().nullable(),
  /** Avatar image URL. */
  avatarUrl: z.url().nullable(),
});
export type Author = z.infer<typeof authorSchema>;

/** Normalized engagement counts. `null` means "unknown", never "zero". */
export const engagementMetricsSchema = z.object({
  likes: z.number().int().nonnegative().nullable(),
  comments: z.number().int().nonnegative().nullable(),
  shares: z.number().int().nonnegative().nullable(),
  views: z.number().int().nonnegative().nullable(),
});
export type EngagementMetrics = z.infer<typeof engagementMetricsSchema>;

/** A single piece of attached media (image, video, gif). */
export const mediaAssetSchema = z.object({
  type: z.enum(["image", "video", "gif"]),
  url: z.url(),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
});
export type MediaAsset = z.infer<typeof mediaAssetSchema>;

/**
 * Fields shared by every platform. Platform-specific data hangs off the
 * `data` property of each variant below.
 */
const baseContentSchema = z.object({
  /** The URL the user originally saved. */
  url: z.url(),
  /** Cleaned, canonical URL (tracking params stripped, IDs resolved). */
  canonicalUrl: z.url(),
  /** Human-facing title used in cards and the command palette. */
  title: z.string(),
  /** Optional summary / body excerpt. */
  description: z.string().nullable(),
  author: authorSchema,
  /** Primary preview image for the content card. */
  thumbnailUrl: z.url().nullable(),
  /** Original publish time as an ISO-8601 string. */
  publishedAt: z.iso.datetime().nullable(),
  metrics: engagementMetricsSchema,
});

/** YouTube video. */
export const youtubeContentSchema = baseContentSchema.extend({
  platform: z.literal("youtube"),
  data: z.object({
    videoId: z.string(),
    channelTitle: z.string(),
    channelUrl: z.url().nullable(),
    durationSeconds: z.number().int().nonnegative().nullable(),
    thumbnails: z.object({
      default: z.url().nullable(),
      high: z.url().nullable(),
    }),
  }),
});
export type YouTubeContent = z.infer<typeof youtubeContentSchema>;

/** X / Twitter post. */
export const twitterContentSchema = baseContentSchema.extend({
  platform: z.literal("twitter"),
  data: z.object({
    tweetId: z.string(),
    text: z.string(),
    media: z.array(mediaAssetSchema),
    isRetweet: z.boolean(),
    quotedTweetUrl: z.url().nullable(),
  }),
});
export type TwitterContent = z.infer<typeof twitterContentSchema>;

/** Reddit post — either a self/text post or a link post. */
export const redditContentSchema = baseContentSchema.extend({
  platform: z.literal("reddit"),
  data: z.object({
    postId: z.string(),
    subreddit: z.string(),
    /** `true` for text posts, `false` for link posts. */
    isSelfPost: z.boolean(),
    selfText: z.string().nullable(),
    linkUrl: z.url().nullable(),
    score: z.number().int().nullable(),
    upvoteRatio: z.number().min(0).max(1).nullable(),
    numComments: z.number().int().nonnegative().nullable(),
    flair: z.string().nullable(),
  }),
});
export type RedditContent = z.infer<typeof redditContentSchema>;

/** GitHub repository. */
export const githubContentSchema = baseContentSchema.extend({
  platform: z.literal("github"),
  data: z.object({
    owner: z.string(),
    repo: z.string(),
    fullName: z.string(),
    defaultBranch: z.string().nullable(),
    stars: z.number().int().nonnegative(),
    forks: z.number().int().nonnegative(),
    watchers: z.number().int().nonnegative(),
    openIssues: z.number().int().nonnegative(),
    primaryLanguage: z.string().nullable(),
    topics: z.array(z.string()),
    license: z.string().nullable(),
    isArchived: z.boolean(),
  }),
});
export type GitHubContent = z.infer<typeof githubContentSchema>;

/**
 * The normalized content payload stored on every `SavedItem`. A discriminated
 * union keyed on `platform`, so narrowing on `content.platform` gives full,
 * exhaustive type-safety over the platform-specific `data`.
 */
export const unifiedContentSchema = z.discriminatedUnion("platform", [
  youtubeContentSchema,
  twitterContentSchema,
  redditContentSchema,
  githubContentSchema,
]);
export type UnifiedContentModel = z.infer<typeof unifiedContentSchema>;
