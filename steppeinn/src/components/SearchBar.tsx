import Link from "next/link";

export function SearchBar() {
  return (
    <form className="glass-panel animate-rise grid gap-4 p-4 sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[1.3fr_.9fr_.9fr_.8fr_auto]">
        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white/78">
          Destination
          <input
            className="h-14 rounded-md border border-white/40 bg-white/92 px-4 text-base font-semibold text-[#17130f] outline-none transition focus:border-white"
            defaultValue="Almaty"
          />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white/78">
          Check-in
          <input
            className="h-14 rounded-md border border-white/40 bg-white/92 px-4 text-base font-semibold text-[#17130f] outline-none"
            type="date"
          />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white/78">
          Check-out
          <input
            className="h-14 rounded-md border border-white/40 bg-white/92 px-4 text-base font-semibold text-[#17130f] outline-none"
            type="date"
          />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-white/78">
          Guests
          <select className="h-14 rounded-md border border-white/40 bg-white/92 px-4 text-base font-semibold text-[#17130f] outline-none">
            <option>2 adults</option>
            <option>1 adult</option>
            <option>Family</option>
          </select>
        </label>
        <div className="flex items-end">
          <Link
            className="flex h-14 w-full items-center justify-center rounded-md bg-[#f0bb67] px-6 text-sm font-black uppercase tracking-[0.08em] text-[#17130f] shadow-xl transition hover:-translate-y-0.5 hover:bg-[#ffd189]"
            href="/ai-search"
          >
            Search
          </Link>
        </div>
      </div>
    </form>
  );
}
