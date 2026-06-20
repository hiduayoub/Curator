import { Dashboard } from "@/components/dashboard/dashboard";
import { type ClientItem } from "@/lib/client/types";
import { listItems } from "@/lib/ingestion/list-items";
import { getOrCreateDemoUser } from "@/lib/users/demo-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let initialItems: ClientItem[] = [];
  let dbAvailable = true;

  try {
    const user = await getOrCreateDemoUser();
    initialItems = await listItems(user.id);
  } catch {
    // No database connected (e.g. local preview). The dashboard falls back to a
    // simulated ingestion pipeline so the experience is still fully explorable.
    dbAvailable = false;
  }

  return <Dashboard initialItems={initialItems} dbAvailable={dbAvailable} />;
}
