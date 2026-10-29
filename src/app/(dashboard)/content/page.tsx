import { getContentDrops } from "@/lib/supabase/queries";
import ContentPageClient from "./content-page-client";

export default async function ContentPage() {
  const drops = await getContentDrops();
  return <ContentPageClient drops={drops} />;
}
