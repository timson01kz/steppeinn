import { HomePageClient } from "@/components/home/HomePageClient";
import { getAlmatyLocations } from "@/lib/services/locationService";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data, error } = await getAlmatyLocations();

  return <HomePageClient locations={data} locationsError={error} />;
}
