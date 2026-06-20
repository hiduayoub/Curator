import { PLATFORMS, type Platform } from "../content/unified-content-model";

export interface PlatformMeta {
  /** Human label shown in eyebrows, filters, and the palette. */
  label: string;
  /** Tiny accent dot — the only place platform color is allowed. */
  dot: string;
}

/** Display metadata for each platform. Color lives here and nowhere else. */
export const PLATFORM_META: Record<Platform, PlatformMeta> = {
  youtube: { label: "YouTube", dot: "#ff3b30" },
  twitter: { label: "X", dot: "#1d9bf0" },
  reddit: { label: "Reddit", dot: "#ff4500" },
  github: { label: "GitHub", dot: "#8e8e93" },
};

/** Stable, intentional ordering for filters and the sidebar. */
export const PLATFORM_ORDER: readonly Platform[] = PLATFORMS;
