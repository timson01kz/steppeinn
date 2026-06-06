import Link from "next/link";
import type { HotelCardData } from "@/types";

export type { HotelCardData };

type HotelCardProps = {
  hotel: HotelCardData;
};

export function HotelCard({ hotel }: HotelCardProps) {
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
        <span className="absolute bottom-4 left-4 rounded-full border border-white/35 bg-white/18 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
          {hotel.imageUrl ? "Photo" : "Mock image"}
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
        <Link
          className="mt-5 flex h-11 items-center justify-center rounded-md bg-[#17130f] text-sm font-bold text-white transition group-hover:bg-[#2f4d46]"
          href={`/hotels/${hotel.slug}`}
        >
          View stay
        </Link>
      </div>
    </article>
  );
}
