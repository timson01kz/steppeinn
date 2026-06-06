import { HotelsCatalogClient } from "./HotelsCatalogClient";
import { getAlmatyLocations } from "@/lib/services/locationService";
import { getPublishedCatalogProperties } from "@/lib/services/propertyService";

export const dynamic = "force-dynamic";

export default async function HotelsPage() {
  const [
    { data: publishedHotels, error: propertiesError },
    { data: locations, error: locationsError },
  ] = await Promise.all([getPublishedCatalogProperties(), getAlmatyLocations()]);
  const error = propertiesError ?? locationsError;

  return (
    <HotelsCatalogClient
      locations={locations}
      publishedHotels={publishedHotels}
      supabaseError={error}
    />
  );
}
