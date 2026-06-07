import { HotelsCatalogClient } from "./HotelsCatalogClient";
import { getPublishedCatalogProperties } from "@/lib/services/propertyService";

export const dynamic = "force-dynamic";

export default async function HotelsPage({
  searchParams,
}: {
  searchParams: Promise<{ nearby?: string }>;
}) {
  const [{ data: publishedHotels, error }, query] = await Promise.all([
    getPublishedCatalogProperties(),
    searchParams,
  ]);

  return (
    <HotelsCatalogClient
      initialNearby={query.nearby}
      publishedHotels={publishedHotels}
      supabaseError={error}
    />
  );
}
