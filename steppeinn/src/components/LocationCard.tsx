import type { LocationCardData } from "@/types";

export type { LocationCardData };

type LocationCardProps = {
  location: LocationCardData;
  active: boolean;
  onSelect: (name: string) => void;
};

export function LocationCard({ location, active, onSelect }: LocationCardProps) {
  return (
    <button
      className={`group absolute -translate-x-1/2 -translate-y-1/2 text-left transition duration-300 ${
        active ? "z-20 scale-105" : "z-10 hover:scale-105"
      }`}
      onClick={() => onSelect(location.name)}
      style={{ left: location.x, top: location.y }}
      type="button"
    >
      <span
        className={`block h-5 w-5 rounded-full border-2 border-white shadow-[0_0_0_9px_rgba(240,187,103,.22)] ${
          active ? "bg-[#f0bb67]" : "bg-[#2f4d46]"
        }`}
      />
      <span
        className={`pointer-events-none absolute left-1/2 top-7 w-44 -translate-x-1/2 rounded-lg border border-white/70 bg-white/92 p-3 text-[#17130f] shadow-xl backdrop-blur transition ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <span className="block text-sm font-bold">{location.name}</span>
        <span className="mt-1 block text-xs text-stone-600">{location.type}</span>
      </span>
    </button>
  );
}
