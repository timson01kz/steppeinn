import Link from "next/link";
import { HotelCard } from "@/components/HotelCard";
import { getPublishedCatalogProperties } from "@/lib/services/propertyService";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const { data: publishedHotels, error } = await getPublishedCatalogProperties();

  return (
    <main className="min-h-screen bg-[#f6f3ed] px-5 py-12 text-[#17130f] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link className="font-semibold text-[#2f4d46]" href="/">
          SteppeInn
        </Link>
        <h1 className="mt-8 text-4xl font-semibold">Almaty map</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Interactive map placeholder for hotel search, landmarks, routes, and
          nearby recommendations.
        </p>
        {error ? (
          <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
            Supabase map properties could not be loaded: {error}
          </div>
        ) : null}
        <div className="relative mt-8 h-[560px] overflow-hidden rounded-lg border border-stone-200 bg-[linear-gradient(135deg,#c8d6c9,#f2d49b_45%,#8aa8b5)] shadow-sm">
          <div className="absolute inset-0 city-map-grid" />
          {publishedHotels.map((hotel) => (
            <Link
              className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#2f4d46] shadow-[0_0_0_9px_rgba(240,187,103,.22)]"
              href={`/hotels/${hotel.slug}`}
              key={hotel.slug}
              style={{ left: hotel.mapX, top: hotel.mapY }}
              title={hotel.name}
            />
          ))}
        </div>
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
