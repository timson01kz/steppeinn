import Link from "next/link";
import { HotelCard } from "@/components/HotelCard";
import { TwoGisMap } from "@/components/maps/TwoGisMap";
import { getAlmatyLocations } from "@/lib/services/locationService";
import { getPublishedCatalogProperties } from "@/lib/services/propertyService";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const [
    { data: publishedHotels, error: propertiesError },
    { data: locations, error: locationsError },
  ] = await Promise.all([getPublishedCatalogProperties(), getAlmatyLocations()]);
  const error = propertiesError ?? locationsError;

  return (
    <main className="min-h-screen bg-[#f6f3ed] px-5 py-12 text-[#17130f] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link className="font-semibold text-[#2f4d46]" href="/">
          SteppeInn
        </Link>
        <h1 className="mt-8 text-4xl font-semibold">Almaty map</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Explore approved SteppeInn properties and active Supabase locations on
          a live 2GIS map.
        </p>
        {error ? (
          <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
            Supabase map data could not be loaded: {error}
          </div>
        ) : null}
        <TwoGisMap
          className="mt-8 h-[620px] shadow-sm"
          locations={locations}
          properties={publishedHotels}
        />
        {publishedHotels.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {publishedHotels.slice(0, 6).map((hotel) => (
              <HotelCard hotel={hotel} key={hotel.slug} />
            ))}
          </div>
        ) : (
          <p className="mt-6 rounded-lg border border-stone-200 bg-white p-5 text-sm font-semibold text-stone-600">
            Approved Supabase properties will appear on this map.
          </p>
        )}
      </div>
    </main>
  );
}
