"use client";

import { useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HotelCard } from "@/components/HotelCard";
import { SectionTitle } from "@/components/SectionTitle";
import { amenityOptions, catalogHotels, propertyTypes } from "@/data/hotels";
import { nearbyPlaceOptions } from "@/data/locations";
import { useI18n } from "@/i18n";
import type { CatalogHotel, SortMode, ViewMode } from "@/types";

function toggleFilter(value: string, selected: string[]) {
  return selected.includes(value)
    ? selected.filter((item) => item !== value)
    : [...selected, value];
}

export function HotelsCatalogClient({
  initialNearby,
  publishedHotels,
  supabaseError,
}: {
  initialNearby?: string;
  publishedHotels: CatalogHotel[];
  supabaseError: string | null;
}) {
  const { t, translate } = useI18n();
  const isUsingDemoHotels = publishedHotels.length === 0;
  const hotels = useMemo(
    () => (isUsingDemoHotels ? catalogHotels : publishedHotels),
    [isUsingDemoHotels, publishedHotels],
  );
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(70000);
  const [types, setTypes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState("0");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [nearby, setNearby] = useState(
    initialNearby && nearbyPlaceOptions.includes(initialNearby) ? initialNearby : "All",
  );
  const [sort, setSort] = useState<SortMode>("recommended");
  const [view, setView] = useState<ViewMode>("list");

  const filteredHotels = useMemo(() => {
    const result = hotels.filter((hotel) => {
      const matchesSearch = hotel.name.toLowerCase().includes(search.toLowerCase());
      const matchesPrice = hotel.priceValue <= maxPrice;
      const matchesType = types.length === 0 || types.includes(hotel.type);
      const matchesRating = hotel.ratingValue >= Number(minRating);
      const matchesAmenities =
        amenities.length === 0 ||
        amenities.every((amenity) => hotel.amenities.includes(amenity));
      const matchesNearby = nearby === "All" || hotel.nearby === nearby;

      return (
        matchesSearch &&
        matchesPrice &&
        matchesType &&
        matchesRating &&
        matchesAmenities &&
        matchesNearby
      );
    });

    return result.sort((a, b) => {
      if (sort === "price") return a.priceValue - b.priceValue;
      if (sort === "rating") return b.ratingValue - a.ratingValue;
      if (sort === "distance") return a.distanceValue - b.distanceValue;

      return b.ratingValue * 10 - b.distanceValue - (a.ratingValue * 10 - a.distanceValue);
    });
  }, [amenities, hotels, maxPrice, minRating, nearby, search, sort, types]);

  return (
    <main className="min-h-screen bg-[#f6f3ed] text-[#17130f]">
      <Header />

      <section className="mx-auto w-full max-w-7xl px-5 pb-8 pt-10 sm:px-8">
        <div className="rounded-lg bg-[#17130f] p-6 text-white shadow-[0_28px_90px_rgba(34,28,18,.16)] sm:p-10">
          <SectionTitle
            description="Search and compare mock Almaty hotels by price, rating, amenities, property type, and nearby place."
            eyebrow="Hotel catalog"
            tone="dark"
            title="Find the right stay for Almaty."
          />
          <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <input
              className="h-13 rounded-md border border-white/20 bg-white px-4 text-base font-semibold text-[#17130f] outline-none"
              onChange={(event) => setSearch(event.target.value)}
              placeholder={translate("Search by hotel name")}
              value={search}
            />
            <select
              className="h-13 rounded-md border border-white/20 bg-white px-4 font-semibold text-[#17130f] outline-none"
              onChange={(event) => setSort(event.target.value as SortMode)}
              value={sort}
            >
              <option value="recommended">{translate("Recommended")}</option>
              <option value="price">{translate("Price low to high")}</option>
              <option value="rating">{translate("Rating high to low")}</option>
              <option value="distance">{translate("Distance")}</option>
            </select>
            <div className="grid h-13 grid-cols-2 rounded-md bg-white/12 p-1">
              {(["list", "map"] as ViewMode[]).map((mode) => (
                <button
                  className={`rounded px-5 text-sm font-bold capitalize transition ${
                    view === mode ? "bg-white text-[#17130f]" : "text-white/72 hover:text-white"
                  }`}
                  key={mode}
                  onClick={() => setView(mode)}
                  type="button"
                >
                  {translate(`catalog.view.${mode}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 pb-16 sm:px-8 lg:grid-cols-[290px_1fr]">
        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{translate("Filters")}</h2>
            <button
              className="text-sm font-bold text-[#2f4d46]"
              onClick={() => {
                setSearch("");
                setMaxPrice(70000);
                setTypes([]);
                setMinRating("0");
                setAmenities([]);
                setNearby("All");
              }}
              type="button"
            >
              {translate("Reset")}
            </button>
          </div>

          <div className="mt-6 grid gap-6">
            <label className="grid gap-3">
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-stone-500">
                {t("catalog.priceUpTo")} {maxPrice.toLocaleString("ru-RU")} KZT
              </span>
              <input
                max="70000"
                min="20000"
                onChange={(event) => setMaxPrice(Number(event.target.value))}
                step="1000"
                type="range"
                value={maxPrice}
              />
            </label>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-stone-500">
                {translate("Property type")}
              </p>
              <div className="mt-3 grid gap-2">
                {propertyTypes.map((type) => (
                  <label className="flex items-center gap-3 text-sm font-semibold" key={type}>
                    <input
                      checked={types.includes(type)}
                      onChange={() => setTypes(toggleFilter(type, types))}
                      type="checkbox"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <label className="grid gap-3">
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-stone-500">
                {translate("Rating")}
              </span>
              <select
                className="h-11 rounded-md border border-stone-300 px-3 font-semibold outline-none"
                onChange={(event) => setMinRating(event.target.value)}
                value={minRating}
              >
                <option value="0">{translate("Any rating")}</option>
                <option value="4.3">4.3+</option>
                <option value="4.5">4.5+</option>
                <option value="4.7">4.7+</option>
                <option value="4.8">4.8+</option>
              </select>
            </label>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-stone-500">
                {translate("Amenities")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {amenityOptions.map((amenity) => (
                  <button
                    className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                      amenities.includes(amenity)
                        ? "border-[#2f4d46] bg-[#2f4d46] text-white"
                        : "border-stone-300 bg-white text-stone-700 hover:border-[#2f4d46]"
                    }`}
                    key={amenity}
                    onClick={() => setAmenities(toggleFilter(amenity, amenities))}
                    type="button"
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <label className="grid gap-3">
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-stone-500">
                {translate("Nearby place")}
              </span>
              <select
                className="h-11 rounded-md border border-stone-300 px-3 font-semibold outline-none"
                onChange={(event) => setNearby(event.target.value)}
                value={nearby}
              >
                <option value="All">{translate("All")}</option>
                {nearbyPlaceOptions.map((place) => (
                  <option key={place}>{place}</option>
                ))}
              </select>
            </label>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a66f2d]">
                {filteredHotels.length} {t("catalog.properties")}
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{translate("Almaty stays")}</h2>
            </div>
            <p className="text-sm font-semibold text-stone-500">
              {publishedHotels.length > 0
                ? `${publishedHotels.length} ${t("catalog.approvedListingsIncluded")}`
                : t("catalog.noApprovedListings")}
            </p>
          </div>
          {isUsingDemoHotels && process.env.NODE_ENV === "development" ? (
            <div className="mb-5 rounded-lg border border-[#f0bb67]/50 bg-[#fff8e8] px-5 py-4 text-sm font-semibold text-[#8a5a17]">
              {t("catalog.demoNotice")}
            </div>
          ) : null}
          {supabaseError ? (
            <div className="mb-5 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
              {t("catalog.supabaseError")} {supabaseError}
            </div>
          ) : null}

          {view === "list" ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredHotels.map((hotel) => (
                <HotelCard hotel={hotel} key={hotel.slug} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a66f2d]">
                    {t("catalog.locationView")}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">{t("catalog.openStaysIn2Gis")}</h3>
                </div>
                <p className="max-w-md text-sm font-semibold text-stone-500">
                  {t("catalog.twoGisDescription")}
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {filteredHotels.map((hotel) => (
                  <HotelCard hotel={hotel} key={hotel.slug} />
                ))}
              </div>
            </div>
          )}

          {filteredHotels.length === 0 ? (
            <div className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
              <h3 className="text-2xl font-semibold">{translate("No matches yet")}</h3>
              <p className="mt-3 text-stone-600">
                {translate("Try a lower rating, wider price range, or fewer amenities.")}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </main>
  );
}
