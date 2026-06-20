"use client";

import {
  type LibraryFilter,
  type PlatformCounts,
} from "@/components/command-palette";
import { PLATFORM_META, PLATFORM_ORDER } from "@/lib/client/platforms";
import { cn } from "@/lib/utils/cn";
import { LibraryIcon } from "@/components/icons";

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <span className="bg-text text-bg grid size-7 place-items-center rounded-lg">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 8h14M7 12h10M9 16h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-[15px] font-semibold tracking-tight">Curator</span>
    </div>
  );
}

function NavItem({
  active,
  label,
  count,
  leading,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  leading: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors",
        active
          ? "bg-surface-hover text-text font-medium"
          : "text-text-secondary hover:bg-surface-hover hover:text-text",
      )}
    >
      <span className="grid size-4 place-items-center">{leading}</span>
      <span className="truncate">{label}</span>
      <span
        className={cn(
          "ml-auto font-mono text-[12px] tabular-nums",
          active ? "text-text-secondary" : "text-text-tertiary",
        )}
      >
        {count}
      </span>
    </button>
  );
}

/** The left rail (lg+): brand, library filters with live counts, ⌘K hint. */
export function Sidebar({
  active,
  counts,
  onFilter,
}: {
  active: LibraryFilter;
  counts: PlatformCounts;
  onFilter: (filter: LibraryFilter) => void;
}) {
  return (
    <aside className="border-hairline hidden w-60 shrink-0 flex-col gap-0.5 border-r px-3 py-5 lg:flex">
      <div className="mb-7">
        <Brand />
      </div>

      <p className="text-text-tertiary px-2.5 pb-1.5 text-[11px] font-medium tracking-wider uppercase">
        Library
      </p>

      <NavItem
        active={active === "all"}
        label="All items"
        count={counts.all}
        onClick={() => onFilter("all")}
        leading={<LibraryIcon size={15} className="text-current" />}
      />

      {PLATFORM_ORDER.map((platform) => (
        <NavItem
          key={platform}
          active={active === platform}
          label={PLATFORM_META[platform].label}
          count={counts[platform]}
          onClick={() => onFilter(platform)}
          leading={
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: PLATFORM_META[platform].dot }}
            />
          }
        />
      ))}

      <div className="text-text-tertiary mt-auto px-2.5 pt-6 text-[11px] leading-relaxed">
        Press{" "}
        <kbd className="border-hairline-strong rounded border px-1 font-mono text-[10px]">
          ⌘K
        </kbd>{" "}
        anywhere to search or save.
      </div>
    </aside>
  );
}
