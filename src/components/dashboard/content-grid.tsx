import { type ClientItem, isPending } from "@/lib/client/types";
import { ContentCard, FailedCard } from "@/components/cards/content-card";
import { SkeletonCard } from "@/components/cards/skeleton-card";

/**
 * Masonry layout via CSS columns. Cards carry their own bottom margin and
 * `break-inside-avoid`, so the grid balances naturally and never reflows when a
 * skeleton becomes a real card (it keeps its place in the column flow).
 */
export function ContentGrid({ items }: { items: ClientItem[] }) {
  return (
    <div className="columns-1 gap-4 px-4 py-5 sm:columns-2 lg:px-7 xl:columns-3 [@media(min-width:1700px)]:columns-4">
      {items.map((item) => {
        if (isPending(item)) {
          return <SkeletonCard key={item.id} platform={item.platform} />;
        }
        if (item.status === "failed") {
          return <FailedCard key={item.id} item={item} />;
        }
        return <ContentCard key={item.id} item={item} />;
      })}
    </div>
  );
}
