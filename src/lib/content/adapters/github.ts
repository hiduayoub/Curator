import {
  type GitHubContent,
  type UnifiedContentModel,
} from "../unified-content-model";
import { NormalizationError } from "./errors";
import { randomChoice, randomInt, simulateNetwork } from "./mock-utils";
import { type PlatformAdapter } from "./types";

/** Pull `{ owner, repo }` from a `/<owner>/<repo>` URL. */
function parseRepoUrl(url: URL): { owner: string; repo: string } | null {
  const segments = url.pathname.split("/").filter(Boolean);
  const owner = segments[0];
  const repo = segments[1]?.replace(/\.git$/, "");
  if (!owner || !repo) return null;
  return { owner, repo };
}

const LANGUAGES = ["TypeScript", "Rust", "Go", "Python"] as const;

export const githubAdapter: PlatformAdapter = {
  platform: "github",

  async fetchAndNormalize(url: string): Promise<UnifiedContentModel> {
    await simulateNetwork();

    const parsed = parseRepoUrl(new URL(url));
    if (!parsed) {
      throw new NormalizationError(`Could not extract owner/repo from ${url}`);
    }
    const { owner, repo } = parsed;
    const fullName = `${owner}/${repo}`;
    const stars = randomInt(0, 180_000);

    const content: GitHubContent = {
      platform: "github",
      url,
      canonicalUrl: `https://github.com/${fullName}`,
      title: fullName,
      description: `A mock-normalized GitHub repository (${fullName}).`,
      author: {
        name: owner,
        handle: owner,
        url: `https://github.com/${owner}`,
        avatarUrl: `https://github.com/${owner}.png`,
      },
      thumbnailUrl: `https://opengraph.githubassets.com/1/${fullName}`,
      publishedAt: new Date(
        Date.now() - randomInt(30, 3_000) * 86_400_000,
      ).toISOString(),
      metrics: {
        likes: stars,
        comments: null,
        shares: randomInt(0, 20_000),
        views: null,
      },
      data: {
        owner,
        repo,
        fullName,
        defaultBranch: "main",
        stars,
        forks: randomInt(0, 20_000),
        watchers: randomInt(0, stars),
        openIssues: randomInt(0, 1_500),
        primaryLanguage: randomChoice(LANGUAGES),
        topics: ["mock", "curator", randomChoice(LANGUAGES).toLowerCase()],
        license: randomChoice(["MIT", "Apache-2.0", "BSD-3-Clause"]),
        isArchived: false,
      },
    };

    return content;
  },
};
