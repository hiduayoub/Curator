import { PLATFORM_META } from "@/lib/client/platforms";
import { type Platform } from "@/lib/content/unified-content-model";
import { cn } from "@/lib/utils/cn";

function Bar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "shimmer bg-hairline relative overflow-hidden rounded-md",
        className,
      )}
    />
  );
}

/**
 * A loading placeholder sized to match the real card it will become, so the
 * grid never reflows when an item finishes ingesting. When the platform is
 * already known (detected at save-time) the silhouette adapts to it.
 */
export function SkeletonCard({ platform }: { platform?: Platform | null }) {
  const dot = platform ? PLATFORM_META[platform].dot : "var(--text-tertiary)";
  const showMedia = platform === "youtube";

  return (
    <article
      className="border-hairline bg-surface mb-4 break-inside-avoid rounded-[18px] border p-4 shadow-[var(--shadow-card)]"
      aria-busy="true"
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className="size-1.5 shrink-0 rounded-full opacity-50"
          style={{ backgroundColor: dot }}
        />
        <Bar className="h-2.5 w-16" />
      </div>

      {showMedia ? (
        <Bar className="mb-3 aspect-video w-full rounded-xl" />
      ) : null}

      <div className="space-y-2">
        <Bar className="h-3.5 w-[92%]" />
        <Bar className="h-3.5 w-[64%]" />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Bar className="h-2.5 w-12" />
        <Bar className="h-2.5 w-10" />
      </div>
    </article>
  );
}
