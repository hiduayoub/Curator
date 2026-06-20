"use client";

import { useState } from "react";

import {
  type LibraryFilter,
  type PlatformCounts,
} from "@/components/command-palette";
import { PLATFORM_META, PLATFORM_ORDER } from "@/lib/client/platforms";
import { cn } from "@/lib/utils/cn";
import { PlusIcon, SearchIcon } from "@/components/icons";

const VIEW_TITLES: Record<LibraryFilter, string> = {
  all: "All items",
  youtube: "YouTube",
  twitter: "X",
  reddit: "Reddit",
  github: "GitHub",
};

/** Compact filter chips shown below the header on small screens. */
function MobileFilters({
  active,
  counts,
  onFilter,
}: {
  active: LibraryFilter;
  counts: PlatformCounts;
  onFilter: (filter: LibraryFilter) => void;
}) {
  const chip = (filter: LibraryFilter, label: string, count: number) => (
    <button
      key={filter}
      type="button"
      onClick={() => onFilter(filter)}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[12.5px] transition-colors",
        active === filter
          ? "bg-text text-bg border-transparent"
          : "border-hairline text-text-secondary hover:border-hairline-strong",
      )}
    >
      {filter !== "all" ? (
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: PLATFORM_META[filter].dot }}
        />
      ) : null}
      {label}
      <span className="font-mono text-[11px] tabular-nums opacity-60">
        {count}
      </span>
    </button>
  );

  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 lg:hidden">
      {chip("all", "All", counts.all)}
      {PLATFORM_ORDER.map((p) => chip(p, PLATFORM_META[p].label, counts[p]))}
    </div>
  );
}

/** Sticky header: current view, ⌘K trigger, and the inline save-a-link field. */
export function TopBar({
  active,
  counts,
  onFilter,
  onOpenPalette,
  onSave,
}: {
  active: LibraryFilter;
  counts: PlatformCounts;
  onFilter: (filter: LibraryFilter) => void;
  onOpenPalette: () => void;
  onSave: (url: string) => void;
}) {
  const [url, setUrl] = useState("");
  const count = active === "all" ? counts.all : counts[active];

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!url.trim()) return;
    onSave(url.trim());
    setUrl("");
  };

  return (
    <header className="border-hairline bg-bg/80 sticky top-0 z-10 flex flex-col gap-3 border-b px-4 py-3.5 backdrop-blur-xl lg:px-7 lg:py-4">
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <h1 className="text-text truncate text-[17px] font-semibold tracking-tight">
            {VIEW_TITLES[active]}
          </h1>
          <p className="text-text-secondary text-[12.5px]">
            {count} {count === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            className="border-hairline text-text-secondary hover:border-hairline-strong hover:text-text flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] transition-colors"
          >
            <SearchIcon size={15} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="bg-surface-hover text-text-tertiary hidden rounded px-1.5 font-mono text-[11px] sm:inline">
              ⌘K
            </kbd>
          </button>

          <form onSubmit={submit} className="hidden items-center md:flex">
            <div className="border-hairline bg-surface focus-within:border-accent flex items-center rounded-full border pr-1 pl-3 transition-colors">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                inputMode="url"
                placeholder="Paste a link to save…"
                aria-label="Paste a link to save"
                className="text-text placeholder:text-text-tertiary w-44 bg-transparent py-1.5 text-[13px] focus:outline-none xl:w-56"
              />
              <button
                type="submit"
                aria-label="Save link"
                className="bg-text text-bg grid size-7 shrink-0 place-items-center rounded-full transition-transform hover:scale-105 active:scale-95"
              >
                <PlusIcon size={15} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <MobileFilters active={active} counts={counts} onFilter={onFilter} />
    </header>
  );
}
