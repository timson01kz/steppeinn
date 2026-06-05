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
import type { LocationCardData } from "@/types";

const scenarios = [
  { title: "Mountain weekend", text: "Wake up near Shymbulak, then come back for dinner in the city." },
  { title: "Business comfort", text: "Quiet hotels near Esentai, airport transfer, and late checkout." },
  { title: "First time in Almaty", text: "Stay between Arbat, Kok-Tobe, and the classic city routes." },
  { title: "Family city break", text: "Larger rooms, nearby malls, easy walks, and calmer neighborhoods." },
];

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
  locations: LocationCardData[];
  locationsError?: string | null;
};

export function HomePageClient({
  locations,
  locationsError = null,
}: HomePageClientProps) {
  const mapLocations = locations.length > 0 ? locations : almatyMapLocations;
  const [almatyHour, setAlmatyHour] = useState(12);
  const [activeLocation, setActiveLocation] = useState(mapLocations[0].name);

  useEffect(() => {
    const updateAlmatyTime = () => setAlmatyHour(getAlmatyHour());

    updateAlmatyTime();
    const interval = window.setInterval(updateAlmatyTime, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const isDay = almatyHour >= 7 && almatyHour < 20;
  const selectedLocation = useMemo(
    () =>
      mapLocations.find((location) => location.name === activeLocation) ??
      mapLocations[0],
    [activeLocation, mapLocations],
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f3ed] text-[#17130f]">
      <section
        className={`relative min-h-[880px] overflow-hidden ${
          isDay ? "hero-day" : "hero-night"
        }`}
      >
        <div className="absolute inset-0 opacity-80">
          <div className="absolute inset-x-0 bottom-0 h-[430px] mountain-layer" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-[linear-gradient(90deg,rgba(23,19,15,.52),rgba(23,19,15,.15),rgba(23,19,15,.42))]" />
          <div className="absolute left-[7%] top-[18%] h-40 w-40 rounded-full border border-white/25 bg-white/10 blur-2xl" />
        </div>

        <Header overlay />

        <div className="relative z-10 mx-auto flex min-h-[740px] w-full max-w-7xl flex-col justify-center px-5 pb-16 pt-8 sm:px-8">
          <div className="animate-rise max-w-5xl text-white">
            <p className="mb-5 inline-flex rounded-full border border-white/35 bg-white/15 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-xl">
              {isDay ? "Almaty daylight" : "Almaty after dark"} · local hour{" "}
              {almatyHour}:00
            </p>
            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.98] sm:text-7xl lg:text-8xl">
              Stay beautifully in Almaty.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
              SteppeInn blends premium hotel discovery, local context, and
              route-aware search for Kazakhstan travel.
            </p>
          </div>

          <div className="mt-10 max-w-6xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.9fr_1.1fr]">
        <div>
          <SectionTitle
            description="A reusable design language for the MVP: warm neutrals, deep green, mountain gold, soft glass panels, and calm product spacing."
            eyebrow="Design system"
            title="Quiet luxury for local travel."
          />
          <div className="mt-8 grid gap-3">
            {["Stone canvas", "Almaty green", "Mountain gold", "Glass surface"].map(
              (token, index) => (
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
              ),
            )}
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
                Scenario
              </span>
              <h3 className="mt-4 text-2xl font-semibold">{scenario.title}</h3>
              <p className="mt-3 leading-7 text-stone-600">{scenario.text}</p>
              <span className="mt-6 inline-flex font-bold text-[#2f4d46] transition group-hover:translate-x-1">
                Explore
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle
              description="Realistic mock cards with visual placeholders, rating, distance, price, and a clear booking CTA."
              eyebrow="Best offers"
              title="Hotels that feel ready to book."
            />
            <Link className="font-bold text-[#2f4d46]" href="/hotels">
              View all hotels
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
            description="Click each location to preview the travel context around Almaty. Locations are loaded from Supabase when credentials are available."
            eyebrow="Interactive map"
            title="Almaty, mapped for intent."
          />
          {locationsError ? (
            <p className="mt-4 rounded-md border border-[#f0bb67]/40 bg-[#fff8e8] px-4 py-3 text-sm font-semibold text-[#8a5a17]">
              Supabase locations unavailable. Showing fallback map points.
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
            Selected
          </p>
          <h3 className="mt-4 text-4xl font-semibold">{selectedLocation.name}</h3>
          <p className="mt-2 font-semibold text-white/62">{selectedLocation.type}</p>
          <p className="mt-6 leading-7 text-white/72">
            {selectedLocation.description}
          </p>
          <Link
            className="mt-8 flex h-12 items-center justify-center rounded-md bg-white font-bold text-[#17130f]"
            href="/map"
          >
            Open full map
          </Link>
        </aside>
      </section>

      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-lg bg-[#2f4d46] shadow-[0_30px_100px_rgba(34,28,18,.16)] lg:grid-cols-[1fr_.78fr]">
          <div className="p-8 text-white sm:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f0bb67]">
              For hotels
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
              A marketplace shell built for owners from day one.
            </h2>
            <p className="mt-6 max-w-2xl leading-8 text-white/72">
              Listing management, owner dashboard, and operations routes are in
              place as mock surfaces. Supabase can be added later without
              changing the product direction.
            </p>
            <Link
              className="mt-8 inline-flex rounded-md bg-white px-6 py-3 font-bold text-[#2f4d46]"
              href="/for-hotels"
            >
              Partner with SteppeInn
            </Link>
          </div>
          <div className="min-h-80 bg-[linear-gradient(135deg,#f0bb67_0%,#7fb5a5_48%,#1b332f_100%)]" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
