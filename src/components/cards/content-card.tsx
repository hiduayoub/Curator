import { type ClientItem } from "@/lib/client/types";
import {
  type GitHubContent,
  type RedditContent,
  type TwitterContent,
  type UnifiedContentModel,
  type YouTubeContent,
} from "@/lib/content/unified-content-model";
import { cn } from "@/lib/utils/cn";
import {
  formatCompact,
  formatDuration,
  formatRelative,
} from "@/lib/utils/format";
import { PlatformBadge } from "@/components/cards/platform-badge";
import { AlertIcon, ArrowUpRightIcon } from "@/components/icons";

/* ------------------------------- shell ---------------------------------- */

function CardShell({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        "group animate-card-in border-hairline bg-surface relative mb-4 block break-inside-avoid rounded-[18px] border p-4",
        "shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-200 ease-out",
        "hover:border-hairline-strong hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <ArrowUpRightIcon
        size={15}
        className="text-text-tertiary absolute top-3.5 right-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
      {children}
    </a>
  );
}

function Metric({ value, label }: { value: string | null; label: string }) {
  if (value === null) return null;
  return (
    <span className="text-text-tertiary inline-flex items-baseline gap-1">
      <span className="text-text-secondary font-mono tabular-nums">
        {value}
      </span>
      {label}
    </span>
  );
}

function MetricRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
      {children}
    </div>
  );
}

/* ----------------------------- platform bodies --------------------------- */

function YouTubeBody({ content }: { content: YouTubeContent }) {
  const duration = formatDuration(content.data.durationSeconds);
  const thumb = content.thumbnailUrl ?? content.data.thumbnails.high;
  return (
    <>
      <div className="bg-surface-hover relative mt-3 mb-3 aspect-video w-full overflow-hidden rounded-xl">
        {thumb ? (
          // External thumbnail; plain <img> avoids next/image remote config.
          <img
            src={thumb}
            alt=""
            loading="lazy"
            className="size-full object-cover"
          />
        ) : null}
        {duration ? (
          <span className="absolute right-2 bottom-2 rounded-md bg-black/75 px-1.5 py-0.5 font-mono text-[11px] font-medium text-white tabular-nums">
            {duration}
          </span>
        ) : null}
      </div>
      <h3 className="text-text line-clamp-2 text-[15px] leading-snug font-medium [text-wrap:balance]">
        {content.title}
      </h3>
      <MetricRow>
        <span className="text-text-secondary">{content.data.channelTitle}</span>
        <Metric value={formatCompact(content.metrics.views)} label="views" />
      </MetricRow>
    </>
  );
}

function TwitterBody({ content }: { content: TwitterContent }) {
  return (
    <>
      <p className="text-text mt-3 line-clamp-5 text-[15px] leading-relaxed">
        {content.data.text}
      </p>
      <div className="text-text-secondary mt-3 text-[13px]">
        @{content.author.handle ?? content.author.name}
      </div>
      <MetricRow>
        <Metric value={formatCompact(content.metrics.likes)} label="likes" />
        <Metric
          value={formatCompact(content.metrics.comments)}
          label="replies"
        />
        <Metric value={formatCompact(content.metrics.shares)} label="reposts" />
      </MetricRow>
    </>
  );
}

function RedditBody({ content }: { content: RedditContent }) {
  return (
    <>
      <h3 className="text-text mt-3 line-clamp-3 text-[15px] leading-snug font-medium [text-wrap:balance]">
        {content.title}
      </h3>
      {content.data.selfText ? (
        <p className="text-text-secondary mt-2 line-clamp-2 text-[13px] leading-relaxed">
          {content.data.selfText}
        </p>
      ) : null}
      <MetricRow>
        <span className="text-text-secondary font-mono">
          r/{content.data.subreddit}
        </span>
        <Metric value={formatCompact(content.data.score)} label="points" />
        <Metric
          value={formatCompact(content.data.numComments)}
          label="comments"
        />
      </MetricRow>
    </>
  );
}

function GitHubBody({ content }: { content: GitHubContent }) {
  return (
    <>
      <h3 className="mt-3 font-mono text-[14px] leading-snug">
        <span className="text-text-secondary">{content.data.owner}/</span>
        <span className="text-text font-semibold">{content.data.repo}</span>
      </h3>
      {content.description ? (
        <p className="text-text-secondary mt-2 line-clamp-2 text-[13px] leading-relaxed">
          {content.description}
        </p>
      ) : null}
      <MetricRow>
        {content.data.primaryLanguage ? (
          <span className="text-text-secondary inline-flex items-center gap-1.5">
            <span className="bg-accent size-2 rounded-full" />
            {content.data.primaryLanguage}
          </span>
        ) : null}
        <Metric value={formatCompact(content.data.stars)} label="stars" />
        <Metric value={formatCompact(content.data.forks)} label="forks" />
      </MetricRow>
    </>
  );
}

function Body({ content }: { content: UnifiedContentModel }) {
  switch (content.platform) {
    case "youtube":
      return <YouTubeBody content={content} />;
    case "twitter":
      return <TwitterBody content={content} />;
    case "reddit":
      return <RedditBody content={content} />;
    case "github":
      return <GitHubBody content={content} />;
  }
}

/* -------------------------------- cards ---------------------------------- */

/** A fully-ingested item. */
export function ContentCard({ item }: { item: ClientItem }) {
  if (!item.content) return null;
  return (
    <CardShell href={item.url}>
      <PlatformBadge platform={item.content.platform} savedAt={item.savedAt} />
      <Body content={item.content} />
    </CardShell>
  );
}

/** An item whose ingestion failed — explains what happened, offers the raw link. */
export function FailedCard({ item }: { item: ClientItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer noopener"
      className="animate-card-in group border-hairline-strong bg-surface hover:border-text-tertiary mb-4 block break-inside-avoid rounded-[18px] border border-dashed p-4 transition-colors"
    >
      <div className="text-text-tertiary flex items-center gap-2 text-[12px]">
        <AlertIcon size={13} />
        <span className="font-medium">Couldn&apos;t ingest</span>
        <span className="ml-auto font-mono text-[11px] tabular-nums">
          {formatRelative(item.savedAt)}
        </span>
      </div>
      <p className="text-text-secondary mt-3 truncate text-[13px]">
        {item.url}
      </p>
      <p className="text-text-tertiary mt-2 line-clamp-2 text-[12px] leading-relaxed">
        {item.error ?? "Something went wrong while fetching this link."}
      </p>
    </a>
  );
}
