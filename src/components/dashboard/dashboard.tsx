"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  CommandPalette,
  type LibraryFilter,
  type PlatformCounts,
} from "@/components/command-palette";
import { ContentGrid } from "@/components/dashboard/content-grid";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { detectPlatform } from "@/lib/content/platform-detector";
import { type ClientItem } from "@/lib/client/types";
import { buildSimulatedItem, SAMPLE_ITEMS } from "@/lib/sample-content";

const POLL_INTERVAL_MS = 1_500;
const MAX_POLL_ATTEMPTS = 40;
const SIMULATED_INGEST_MS = 1_700;

export function Dashboard({
  initialItems,
  dbAvailable,
}: {
  initialItems: ClientItem[];
  dbAvailable: boolean;
}) {
  const [items, setItems] = useState<ClientItem[]>(initialItems);
  const [filter, setFilter] = useState<LibraryFilter>("all");
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Active polling/simulation timers, cleared on unmount.
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const active = timers.current;
    return () => {
      for (const timer of active.values()) clearTimeout(timer);
      active.clear();
    };
  }, []);

  // ⌘K / Ctrl+K toggles the palette from anywhere.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function patchItem(id: string, next: Partial<ClientItem>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...next } : item)),
    );
  }

  function replaceItem(id: string, next: ClientItem) {
    setItems((prev) => prev.map((item) => (item.id === id ? next : item)));
  }

  // Poll a saved item until it finishes ingesting, then swap it in.
  function poll(id: string, attempt = 0) {
    if (attempt > MAX_POLL_ATTEMPTS) {
      patchItem(id, {
        status: "failed",
        error: "Timed out waiting for ingestion.",
      });
      return;
    }
    void (async () => {
      try {
        const res = await fetch(`/api/items/${id}`, { cache: "no-store" });
        if (res.ok) {
          const { item } = (await res.json()) as { item: ClientItem };
          if (item.status === "ready" || item.status === "failed") {
            replaceItem(id, item);
            return;
          }
        }
      } catch {
        // Ignore and retry on the next tick.
      }
      const timer = setTimeout(() => poll(id, attempt + 1), POLL_INTERVAL_MS);
      timers.current.set(id, timer);
    })();
  }

  function saveUrl(rawUrl: string) {
    const url = rawUrl.trim();
    if (!url) return;

    const tempId = `temp-${crypto.randomUUID()}`;
    const optimistic: ClientItem = {
      id: tempId,
      url,
      platform: detectPlatform(url),
      status: "pending",
      title: null,
      content: null,
      error: null,
      savedAt: new Date().toISOString(),
    };
    setItems((prev) => [optimistic, ...prev]);

    // No backend: simulate the worker locally so the UI stays demonstrable.
    if (!dbAvailable) {
      const timer = setTimeout(() => {
        const built = buildSimulatedItem(url);
        replaceItem(tempId, { ...built, savedAt: optimistic.savedAt });
      }, SIMULATED_INGEST_MS);
      timers.current.set(tempId, timer);
      return;
    }

    void (async () => {
      try {
        const res = await fetch("/api/save", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ url }),
        });
        if (res.status === 202) {
          const data = (await res.json()) as {
            id: string;
            platform: ClientItem["platform"];
          };
          patchItem(tempId, { id: data.id, platform: data.platform });
          poll(data.id);
        } else {
          const data = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          patchItem(tempId, {
            status: "failed",
            error: data?.error ?? "Couldn't save this link.",
          });
        }
      } catch {
        patchItem(tempId, {
          status: "failed",
          error: "Network error while saving.",
        });
      }
    })();
  }

  function loadSample() {
    setItems((prev) => [...SAMPLE_ITEMS, ...prev]);
  }

  const counts = useMemo<PlatformCounts>(() => {
    const base: PlatformCounts = {
      all: items.length,
      youtube: 0,
      twitter: 0,
      reddit: 0,
      github: 0,
    };
    for (const item of items) {
      if (item.platform) base[item.platform] += 1;
    }
    return base;
  }, [items]);

  const visible = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.platform === filter);
  }, [items, filter]);

  return (
    <div className="flex min-h-dvh">
      <Sidebar active={filter} counts={counts} onFilter={setFilter} />

      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar
          active={filter}
          counts={counts}
          onFilter={setFilter}
          onOpenPalette={() => setPaletteOpen(true)}
          onSave={saveUrl}
        />

        {visible.length === 0 ? (
          <EmptyState
            filtered={items.length > 0}
            dbAvailable={dbAvailable}
            onLoadSample={loadSample}
            onOpenPalette={() => setPaletteOpen(true)}
          />
        ) : (
          <ContentGrid items={visible} />
        )}
      </main>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        items={items}
        counts={counts}
        onFilter={setFilter}
        onSave={saveUrl}
      />
    </div>
  );
}
