"use client";

import { Command } from "cmdk";
import { useState } from "react";

import { PLATFORM_META, PLATFORM_ORDER } from "@/lib/client/platforms";
import { type ClientItem } from "@/lib/client/types";
import { type Platform } from "@/lib/content/unified-content-model";
import {
  LibraryIcon,
  PlatformGlyph,
  PlusIcon,
  ReturnKeyIcon,
  SearchIcon,
} from "@/components/icons";

export type LibraryFilter = Platform | "all";

export interface PlatformCounts extends Record<Platform, number> {
  all: number;
}

const ITEM =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-text cursor-pointer select-none transition-colors data-[selected=true]:bg-surface-hover";

function isUrl(value: string): boolean {
  const v = value.trim();
  if (!/^https?:\/\//i.test(v)) return false;
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

function Count({ value }: { value: number }) {
  return (
    <span className="text-text-tertiary ml-auto font-mono text-[12px] tabular-nums">
      {value}
    </span>
  );
}

/**
 * Keyboard-first command palette (⌘K). Filters the library by platform, jumps
 * straight to any saved item, and — when you paste a link — offers to save it.
 */
export function CommandPalette({
  open,
  onOpenChange,
  items,
  counts,
  onFilter,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ClientItem[];
  counts: PlatformCounts;
  onFilter: (filter: LibraryFilter) => void;
  onSave: (url: string) => void;
}) {
  const [search, setSearch] = useState("");
  const url = isUrl(search);

  const close = () => {
    onOpenChange(false);
    setSearch("");
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setSearch("");
      }}
      label="Command menu"
      shouldFilter={!url}
      className="border-hairline bg-surface overflow-hidden rounded-2xl border shadow-[var(--shadow-overlay)]"
    >
      <div className="border-hairline flex items-center gap-3 border-b px-4">
        <SearchIcon size={17} className="text-text-tertiary shrink-0" />
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search, filter, or paste a link to save…"
          className="text-text placeholder:text-text-tertiary h-[54px] w-full bg-transparent text-[15px] focus:outline-none"
        />
      </div>

      <Command.List className="max-h-[min(420px,60vh)] overflow-y-auto overscroll-contain p-2">
        {!url ? (
          <Command.Empty className="text-text-tertiary px-3 py-10 text-center text-[13px]">
            Nothing matches. Paste a link to save it.
          </Command.Empty>
        ) : null}

        {url ? (
          <Command.Group>
            <Command.Item
              value="save link"
              onSelect={() => {
                onSave(search.trim());
                close();
              }}
              className={ITEM}
            >
              <PlusIcon size={16} className="text-text-secondary shrink-0" />
              <span className="flex-1 truncate">
                Save{" "}
                <span className="text-text-secondary">{search.trim()}</span>
              </span>
              <ReturnKeyIcon size={14} className="text-text-tertiary" />
            </Command.Item>
          </Command.Group>
        ) : (
          <>
            <Command.Group heading="Filter">
              <Command.Item
                value="all items library"
                onSelect={() => {
                  onFilter("all");
                  close();
                }}
                className={ITEM}
              >
                <LibraryIcon
                  size={15}
                  className="text-text-secondary shrink-0"
                />
                All items
                <Count value={counts.all} />
              </Command.Item>
              {PLATFORM_ORDER.map((platform) => (
                <Command.Item
                  key={platform}
                  value={`${PLATFORM_META[platform].label} ${platform}`}
                  onSelect={() => {
                    onFilter(platform);
                    close();
                  }}
                  className={ITEM}
                >
                  <PlatformGlyph
                    platform={platform}
                    size={15}
                    className="text-text-secondary shrink-0"
                  />
                  {PLATFORM_META[platform].label}
                  <Count value={counts[platform]} />
                </Command.Item>
              ))}
            </Command.Group>

            {items.length > 0 ? (
              <Command.Group heading="Jump to">
                {items.slice(0, 40).map((item) => (
                  <Command.Item
                    key={item.id}
                    value={`${item.title ?? item.url} ${item.id}`}
                    onSelect={() => {
                      window.open(item.url, "_blank", "noopener,noreferrer");
                      close();
                    }}
                    className={ITEM}
                  >
                    {item.platform ? (
                      <PlatformGlyph
                        platform={item.platform}
                        size={15}
                        className="text-text-tertiary shrink-0"
                      />
                    ) : (
                      <SearchIcon
                        size={15}
                        className="text-text-tertiary shrink-0"
                      />
                    )}
                    <span className="flex-1 truncate">
                      {item.title ?? item.url}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            ) : null}
          </>
        )}
      </Command.List>

      <div className="border-hairline text-text-tertiary flex items-center gap-4 border-t px-4 py-2.5 text-[11px]">
        <span className="flex items-center gap-1.5">
          <ReturnKeyIcon size={12} /> open
        </span>
        <span className="flex items-center gap-1.5">
          <span className="font-mono">↑↓</span> navigate
        </span>
        <span className="ml-auto flex items-center gap-1.5">
          <span className="border-hairline-strong rounded border px-1 font-mono">
            esc
          </span>
          close
        </span>
      </div>
    </Command.Dialog>
  );
}
