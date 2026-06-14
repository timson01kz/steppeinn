"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HotelCard } from "@/components/HotelCard";
import { LocationCard } from "@/components/LocationCard";
import { SearchBar } from "@/components/SearchBar";
import { SectionTitle } from "@/components/SectionTitle";
import { featuredHotels } from "@/data/hotels";
import { almatyMapLocations } from "@/data/locations";
import { useI18n } from "@/i18n";
import type { LocationCardData } from "@/types";
import type { DictionaryKey } from "@/i18n";

type TFunction = (key: DictionaryKey) => string;

const designTokens = (t: TFunction) => [
  t("home.design.tokens.stoneCanvas"),
  t("home.design.tokens.almatyGreen"),
  t("home.design.tokens.mountainGold"),
  t("home.design.tokens.glassSurface"),
];

const getScenarios = (t: TFunction) => [
  {
    title: t("home.scenarios.mountainWeekend.title"),
    text: t("home.scenarios.mountainWeekend.description"),
  },
  {
    title: t("home.scenarios.businessComfort.title"),
    text: t("home.scenarios.businessComfort.description"),
  },
  {
    title: t("home.scenarios.firstTime.title"),
    text: t("home.scenarios.firstTime.description"),
  },
  {
    title: t("home.scenarios.familyBreak.title"),
    text: t("home.scenarios.familyBreak.description"),
  },
];

const getFallbackMapLocations = (t: TFunction): LocationCardData[] =>
  almatyMapLocations.map((location) => ({
    ...location,
    type: t(`home.map.locations.${location.name}.type` as DictionaryKey),
    description: t(`home.map.locations.${location.name}.description` as DictionaryKey),
  }));

function getAlmatyHour() {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Almaty",
    }).format(new Date()),
  );
}
type HomePageClientProps = {
  initialAlmatyHour: number;
  locations: LocationCardData[];
  locationsError?: string | null;
};

export function HomePageClient({
  initialAlmatyHour,
  locations,
  locationsError = null,
}: HomePageClientProps) {
  const { t } = useI18n();
  const mapLocations = locations.length > 0 ? locations : getFallbackMapLocations(t);
  const scenarios = getScenarios(t);
  const [almatyHour, setAlmatyHour] = useState(initialAlmatyHour);
  const [activeLocation, setActiveLocation] = useState(mapLocations[0].name);

  useEffect(() => {
    const updateAlmatyTime = () => setAlmatyHour(getAlmatyHour());

    updateAlmatyTime();
    const interval = window.setInterval(updateAlmatyTime, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const isDay = almatyHour >= 6 && almatyHour < 19;
  const selectedLocation = useMemo(
    () =>
      mapLocations.find((location) => location.name === activeLocation) ??
      mapLocations[0],
    [activeLocation, mapLocations],
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f3ed] text-[#17130f]">
      <section
        className={`relative min-h-[900px] overflow-hidden ${
          isDay ? "hero-day" : "hero-night"
        }`}
      >
        <div className="absolute inset-0">
          <div className="hero-ambient" />
        </div>
        <button
          aria-disabled="true"
          aria-label="Previous city"
          className="pointer-events-none absolute left-4 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/12 text-2xl font-semibold text-white/45 shadow-[0_18px_60px_rgba(0,0,0,.18)] backdrop-blur md:flex"
          disabled
          type="button"
        >
          {"<"}
        </button>
        <button
          aria-disabled="true"
          aria-label="Next city"
          className="pointer-events-none absolute right-4 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/12 text-2xl font-semibold text-white/45 shadow-[0_18px_60px_rgba(0,0,0,.18)] backdrop-blur md:flex"
          disabled
          type="button"
        >
          {">"}
        </button>

        <Header overlay />

        <div className="relative z-10 mx-auto flex min-h-[760px] w-full max-w-7xl flex-col justify-center px-5 pb-20 pt-10 sm:px-8">
          <div className="animate-rise max-w-5xl text-white">
            <p className="mb-5 inline-flex rounded-full border border-white/35 bg-white/15 px-4 py-2 font-[Arial,sans-serif] text-sm font-semibold shadow-sm backdrop-blur-xl">
              {t("home.hero.city")} • {t("home.hero.localTime")} {almatyHour}:00 •{" "}
              {t("home.hero.weather")}
            </p>
            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.94] sm:text-7xl lg:text-8xl">
              {t("home.hero.title")}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/84 sm:text-xl">
              {t("home.hero.subtitle")}
            </p>
          </div>

          <div className="mt-12 max-w-6xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <SectionTitle
            description={t("home.design.description")}
            eyebrow={t("home.design.eyebrow")}
            title={t("home.design.title")}
          />
          <div className="mt-8 grid gap-3">
            {designTokens(t).map((token, index) => (
                <div
                  className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
                  key={token}
                >
                  <span className="font-semibold">{token}</span>
                  <span
                    className={`h-9 w-20 rounded-md ${
                      [
                        "bg-[#f6f3ed]",
                        "bg-[#2f4d46]",
                        "bg-[#f0bb67]",
                        "bg-white/70 shadow-inner",
                      ][index]
                    }`}
                  />
                </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {scenarios.map((scenario) => (
            <Link
              className="group rounded-lg border border-stone-200 bg-white p-6 shadow-[0_18px_60px_rgba(34,28,18,.08)] transition duration-300 hover:-translate-y-1 hover:border-[#f0bb67]"
              href="/hotels"
              key={scenario.title}
            >
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#a66f2d]">
                {t("home.scenarios.eyebrow")}
              </span>
              <h3 className="mt-4 text-2xl font-semibold">{scenario.title}</h3>
              <p className="mt-3 leading-7 text-stone-600">{scenario.text}</p>
              <span className="mt-6 inline-flex font-bold text-[#2f4d46] transition group-hover:translate-x-1">
                {t("common.explore")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle
              description={t("home.offers.description")}
              eyebrow={t("home.offers.eyebrow")}
              title={t("home.offers.title")}
            />
            <Link className="font-bold text-[#2f4d46]" href="/hotels">
              {t("home.offers.viewAll")}
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredHotels.map((hotel) => (
              <HotelCard hotel={hotel} key={hotel.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_.72fr]">
        <div>
          <SectionTitle
            description={t("home.map.description")}
            eyebrow={t("home.map.eyebrow")}
            title={t("home.map.title")}
          />
          {locationsError ? (
            <p className="mt-4 rounded-md border border-[#f0bb67]/40 bg-[#fff8e8] px-4 py-3 text-sm font-semibold text-[#8a5a17]">
              {t("home.map.fallbackNotice")}
            </p>
          ) : null}
          <div className="relative mt-10 min-h-[520px] overflow-hidden rounded-lg border border-stone-200 bg-[#dde8df] shadow-[0_28px_90px_rgba(34,28,18,.12)]">
            <div className="absolute inset-0 city-map-grid" />
            <div className="absolute left-[8%] top-[8%] h-[34%] w-[52%] rounded-[100%] bg-white/35 blur-sm" />
            <div className="absolute bottom-[8%] right-[8%] h-[42%] w-[58%] rounded-[100%] bg-[#f0bb67]/28 blur-md" />
            <div className="absolute left-[18%] top-[30%] h-2 w-[68%] rotate-[24deg] rounded-full bg-white/70" />
            <div className="absolute left-[22%] top-[58%] h-2 w-[62%] -rotate-[11deg] rounded-full bg-white/70" />
            <div className="absolute left-[44%] top-[12%] h-[76%] w-2 rotate-[7deg] rounded-full bg-white/70" />
            {mapLocations.map((location) => (
              <LocationCard
                active={location.name === activeLocation}
                key={location.name}
                location={location}
                onSelect={setActiveLocation}
              />
            ))}
          </div>
        </div>

        <aside className="self-end rounded-lg bg-[#17130f] p-7 text-white shadow-[0_28px_90px_rgba(34,28,18,.18)]">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f0bb67]">
            {t("home.map.selected")}
          </p>
          <h3 className="mt-4 text-4xl font-semibold">{selectedLocation.name}</h3>
          <p className="mt-2 font-semibold text-white/62">{selectedLocation.type}</p>
          <p className="mt-6 leading-7 text-white/72">{selectedLocation.description}</p>
          <Link
            className="mt-8 flex h-12 items-center justify-center rounded-md bg-white font-bold text-[#17130f]"
            href="/map"
          >
            {t("home.map.openFull")}
          </Link>
        </aside>
      </section>

      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-lg bg-[#2f4d46] shadow-[0_30px_100px_rgba(34,28,18,.16)] lg:grid-cols-[1fr_.78fr]">
          <div className="p-8 text-white sm:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f0bb67]">
              {t("home.forHotels.eyebrow")}
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
              {t("home.forHotels.title")}
            </h2>
            <p className="mt-6 max-w-2xl leading-8 text-white/72">
              {t("home.forHotels.description")}
            </p>
            <Link
              className="mt-8 inline-flex rounded-md bg-white px-6 py-3 font-bold text-[#2f4d46]"
              href="/for-hotels"
            >
              {t("home.forHotels.cta")}
            </Link>
          </div>
          <div className="min-h-80 bg-[linear-gradient(135deg,#f0bb67_0%,#7fb5a5_48%,#1b332f_100%)]" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
