import { PLATFORM_META } from "@/lib/client/platforms";
import { type Platform } from "@/lib/content/unified-content-model";
import { formatRelative } from "@/lib/utils/format";
import { PlatformGlyph } from "@/components/icons";

/** The quiet eyebrow shared by every card: platform dot + glyph + label + time. */
export function PlatformBadge({
  platform,
  savedAt,
}: {
  platform: Platform;
  savedAt?: string;
}) {
  const meta = PLATFORM_META[platform];
  return (
    <div className="text-text-tertiary flex items-center gap-2 text-[12px]">
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: meta.dot }}
      />
      <PlatformGlyph
        platform={platform}
        size={13}
        className="text-text-secondary"
      />
      <span className="text-text-secondary font-medium tracking-tight">
        {meta.label}
      </span>
      {savedAt ? (
        <span className="ml-auto font-mono text-[11px] tabular-nums">
          {formatRelative(savedAt)}
        </span>
      ) : null}
    </div>
  );
}
