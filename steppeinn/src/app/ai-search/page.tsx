import Link from "next/link";
import { HotelCard } from "@/components/HotelCard";
import { getServerI18n } from "@/i18n/server";
import { getPublishedCatalogProperties } from "@/lib/services/propertyService";

export const dynamic = "force-dynamic";

export default async function AiSearchPage() {
  const { data: publishedHotels, error } = await getPublishedCatalogProperties();
  const { t } = await getServerI18n();

  return (
    <main className="min-h-screen bg-[#f6f3ed] px-5 py-12 text-[#17130f] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link className="font-semibold text-[#2f4d46]" href="/">
          SteppeInn
        </Link>
        <h1 className="mt-8 text-4xl font-semibold">{t("aiSearchPage.title")}</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          {t("aiSearchPage.description")}
        </p>
        <div className="mt-8 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <label className="grid gap-3 font-semibold">
            {t("aiSearchPage.travelPrompt")}
            <textarea
              className="min-h-40 rounded-md border border-stone-300 p-4 font-normal outline-none"
              defaultValue={t("aiSearchPage.promptExample")}
            />
          </label>
        </div>
        {error ? (
          <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
            {t("aiSearchPage.supabaseError")} {error}
          </div>
        ) : null}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {publishedHotels.slice(0, 4).map((hotel) => (
            <HotelCard hotel={hotel} key={hotel.slug} />
          ))}
        </div>
        {publishedHotels.length === 0 ? (
          <p className="mt-6 rounded-lg border border-stone-200 bg-white p-5 text-sm font-semibold text-stone-600">
            {t("aiSearchPage.emptyState")}
          </p>
        ) : null}
      </div>
    </main>
  );
}
