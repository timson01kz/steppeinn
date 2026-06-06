import Link from "next/link";
import { HotelCard } from "@/components/HotelCard";
import { getPublishedCatalogProperties } from "@/lib/services/propertyService";

export const dynamic = "force-dynamic";

export default async function AiSearchPage() {
  const { data: publishedHotels, error } = await getPublishedCatalogProperties();

  return (
    <main className="min-h-screen bg-[#f6f3ed] px-5 py-12 text-[#17130f] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link className="font-semibold text-[#2f4d46]" href="/">
          SteppeInn
        </Link>
        <h1 className="mt-8 text-4xl font-semibold">AI search</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Prompt-led hotel discovery placeholder. No AI service is connected in
          this MVP shell.
        </p>
        <div className="mt-8 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <label className="grid gap-3 font-semibold">
            Travel prompt
            <textarea
              className="min-h-40 rounded-md border border-stone-300 p-4 font-normal outline-none"
              defaultValue="I need a quiet hotel near the mountains for two nights."
            />
          </label>
        </div>
        {error ? (
          <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
            Supabase search properties could not be loaded: {error}
          </div>
        ) : null}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {publishedHotels.slice(0, 4).map((hotel) => (
            <HotelCard hotel={hotel} key={hotel.slug} />
          ))}
        </div>
        {publishedHotels.length === 0 ? (
          <p className="mt-6 rounded-lg border border-stone-200 bg-white p-5 text-sm font-semibold text-stone-600">
            Approved Supabase properties will appear in search results.
          </p>
        ) : null}
      </div>
    </main>
  );
}
