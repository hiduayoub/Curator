"use client";

/** First-run / zero-results state — an invitation to act, not a dead end. */
export function EmptyState({
  filtered,
  dbAvailable,
  onLoadSample,
  onOpenPalette,
}: {
  /** `true` when the library has items but the active filter hides them all. */
  filtered: boolean;
  dbAvailable: boolean;
  onLoadSample: () => void;
  onOpenPalette: () => void;
}) {
  if (filtered) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-28 text-center">
        <p className="text-text text-[15px] font-medium">Nothing here yet</p>
        <p className="text-text-secondary mt-1.5 max-w-xs text-[13.5px] leading-relaxed">
          No saved items match this filter. Try another platform, or save
          something new.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      {/* Signature: three quietly stacked cards — the act of curation itself. */}
      <div className="relative mb-9 h-20 w-28" aria-hidden>
        <div className="border-hairline bg-surface absolute top-2 left-1/2 h-16 w-24 -translate-x-1/2 rotate-[-7deg] rounded-xl border shadow-[var(--shadow-card)]" />
        <div className="border-hairline bg-surface absolute top-1 left-1/2 h-16 w-24 -translate-x-1/2 rotate-[5deg] rounded-xl border shadow-[var(--shadow-card)]" />
        <div className="border-hairline-strong bg-surface absolute top-0 left-1/2 h-16 w-24 -translate-x-1/2 rounded-xl border shadow-[var(--shadow-lift)]" />
      </div>

      <h2 className="text-text text-[19px] font-semibold tracking-tight">
        Your library is quiet
      </h2>
      <p className="text-text-secondary mt-2 max-w-sm text-[14px] leading-relaxed">
        Save a link from YouTube, X, Reddit, or GitHub and Curator normalizes it
        into a clean, fast card — automatically, in the background.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={onLoadSample}
          className="bg-text text-bg rounded-full px-4 py-2 text-[13.5px] font-medium transition-transform hover:scale-[1.02] active:scale-[0.99]"
        >
          Load sample content
        </button>
        <button
          type="button"
          onClick={onOpenPalette}
          className="border-hairline text-text-secondary hover:border-hairline-strong hover:text-text rounded-full border px-4 py-2 text-[13.5px] transition-colors"
        >
          Save a link
          <kbd className="bg-surface-hover text-text-tertiary ml-2 rounded px-1.5 font-mono text-[11px]">
            ⌘K
          </kbd>
        </button>
      </div>

      {!dbAvailable ? (
        <p className="text-text-tertiary mt-8 max-w-sm text-[12px] leading-relaxed">
          No database is connected, so saving runs in a local preview that
          simulates the real ingestion pipeline.
        </p>
      ) : null}
    </div>
  );
}
