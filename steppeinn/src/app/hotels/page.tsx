import { HotelsCatalogClient } from "./HotelsCatalogClient";
import { getPublishedCatalogProperties } from "@/lib/services/propertyService";

export const dynamic = "force-dynamic";

export default async function HotelsPage() {
  const { data: publishedHotels, error } = await getPublishedCatalogProperties();

  return (
    <HotelsCatalogClient
      publishedHotels={publishedHotels}
      supabaseError={error}
    />
  );
}
