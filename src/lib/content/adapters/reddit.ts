import {
  type RedditContent,
  type UnifiedContentModel,
} from "../unified-content-model";
import { NormalizationError } from "./errors";
import { randomChoice, randomInt, simulateNetwork } from "./mock-utils";
import { type PlatformAdapter } from "./types";

/** Pull `{ subreddit, postId }` from a `/r/<sub>/comments/<id>/...` URL. */
function parsePostUrl(url: URL): { subreddit: string; postId: string } | null {
  const segments = url.pathname.split("/").filter(Boolean);
  const rIndex = segments.indexOf("r");
  const commentsIndex = segments.indexOf("comments");
  if (rIndex < 0 || commentsIndex < 0) return null;
  const subreddit = segments[rIndex + 1];
  const postId = segments[commentsIndex + 1];
  if (!subreddit || !postId) return null;
  return { subreddit, postId };
}

export const redditAdapter: PlatformAdapter = {
  platform: "reddit",

  async fetchAndNormalize(url: string): Promise<UnifiedContentModel> {
    await simulateNetwork();

    const parsed = parsePostUrl(new URL(url));
    if (!parsed) {
      throw new NormalizationError(`Could not extract a post id from ${url}`);
    }
    const { subreddit, postId } = parsed;

    const isSelfPost = Math.random() < 0.5;
    const author = `u_${randomChoice(["pixel", "nimbus", "quartz", "vector"])}${randomInt(10, 99)}`;
    const score = randomInt(-50, 75_000);

    const content: RedditContent = {
      platform: "reddit",
      url,
      canonicalUrl: `https://www.reddit.com/r/${subreddit}/comments/${postId}/`,
      title: `[${subreddit}] ${randomChoice(["Discussion", "Show & Tell", "Question"])}: ${postId}`,
      description: isSelfPost ? "A mock-normalized Reddit self post." : null,
      author: {
        name: author,
        handle: author,
        url: `https://www.reddit.com/user/${author}`,
        avatarUrl: null,
      },
      thumbnailUrl: null,
      publishedAt: new Date(
        Date.now() - randomInt(1, 300) * 3_600_000,
      ).toISOString(),
      metrics: {
        likes: score,
        comments: randomInt(0, 4_000),
        shares: null,
        views: null,
      },
      data: {
        postId,
        subreddit,
        isSelfPost,
        selfText: isSelfPost ? "Mock body text for a Reddit self post." : null,
        linkUrl: isSelfPost ? null : "https://example.com/shared-link",
        score,
        upvoteRatio: Math.round(randomInt(50, 99)) / 100,
        numComments: randomInt(0, 4_000),
        flair: randomChoice(["Help", "News", "Meta", "Guide"]),
      },
    };

    return content;
  },
};
