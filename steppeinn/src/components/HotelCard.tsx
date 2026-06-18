"use client";

import Link from "next/link";
import { useI18n } from "@/i18n";
import { createTwoGisLink } from "@/lib/2gis";
import type { HotelCardData } from "@/types";

export type { HotelCardData };

type HotelCardProps = {
  hotel: HotelCardData;
};

export function HotelCard({ hotel }: HotelCardProps) {
  const { translate } = useI18n();
  const twoGisUrl = createTwoGisLink({
    address: hotel.address ?? hotel.area,
    latitude: hotel.latitude,
    longitude: hotel.longitude,
    name: hotel.name,
  });

  return (
    <article className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_22px_70px_rgba(34,28,18,.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(34,28,18,.16)]">
      <div
        className={`relative h-56 ${hotel.imageUrl ? "bg-cover bg-center" : hotel.imageClass}`}
        style={hotel.imageUrl ? { backgroundImage: `url(${hotel.imageUrl})` } : undefined}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_42%,rgba(0,0,0,.46)_100%)]" />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-sm font-bold text-[#17130f] shadow-sm">
          {hotel.rating}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-[#17130f]">{hotel.name}</h3>
            <p className="mt-1 text-sm text-stone-500">{hotel.area}</p>
          </div>
          <p className="whitespace-nowrap text-sm font-bold text-[#2f4d46]">
            {hotel.price}
          </p>
        </div>
        <p className="mt-4 text-sm font-medium text-stone-600">{hotel.distance}</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Link
            className="flex h-11 items-center justify-center rounded-md bg-[#17130f] text-sm font-bold text-white transition group-hover:bg-[#2f4d46]"
            href={`/hotels/${hotel.slug}`}
          >
            {translate("View stay")}
          </Link>
          <a
            className="flex h-11 items-center justify-center rounded-md border border-stone-300 bg-white text-sm font-bold text-[#2f4d46] transition hover:border-[#2f4d46]"
            href={twoGisUrl}
            rel="noreferrer"
            target="_blank"
          >
            {translate("Open in 2GIS")}
          </a>
        </div>
      </div>
    </article>
  );
}
