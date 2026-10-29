import { JourneyLibrary } from "@/Components/journey-library";
import { getScriptureDrops } from "@/lib/supabase/journey-queries";

export default async function JourneyPage() {
  const drops = await getScriptureDrops();

  return <JourneyLibrary drops={drops} />;
}