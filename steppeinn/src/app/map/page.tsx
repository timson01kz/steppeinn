import Link from "next/link";
import { getAlmatyLocations } from "@/lib/services/locationService";

export const dynamic = "force-dynamic";

const keyLocationNames = [
  "Shymbulak",
  "Medeu",
  "Kok-Tobe",
  "Airport",
  "Arbat",
  "Esentai",
  "Mega",
];

export default async function MapPage() {
  const { data: locations, error } = await getAlmatyLocations();

  const locationCards = keyLocationNames.map((name) => {
    const supabaseLocation = locations.find((location) =>
      location.name.toLowerCase().includes(name.toLowerCase()),
    );

    return {
      name,
      description:
        supabaseLocation?.description ??
        `Find SteppeInn stays near ${name} and compare nearby Almaty options.`,
      type: supabaseLocation?.type ?? "Almaty location",
    };
  });

  return (
    <main className="min-h-screen bg-[#f6f3ed] px-5 py-12 text-[#17130f] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link className="font-semibold text-[#2f4d46]" href="/">
          SteppeInn
        </Link>
        <h1 className="mt-8 text-4xl font-semibold">Explore Almaty locations</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          Start from the city places travelers ask about most, then open hotel
          results nearby.
        </p>
        {error ? (
          <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
            Supabase locations could not be loaded: {error}
          </div>
        ) : null}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {locationCards.map((location) => (
            <article
              className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
              key={location.name}
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a66f2d]">
                {location.type}
              </p>
              <h2 className="mt-3 text-2xl font-semibold">{location.name}</h2>
              <p className="mt-3 min-h-20 text-sm leading-6 text-stone-600">
                {location.description}
              </p>
              <Link
                className="mt-5 inline-flex h-11 items-center justify-center rounded-md bg-[#17130f] px-5 text-sm font-bold text-white transition hover:bg-[#2f4d46]"
                href={`/hotels?nearby=${encodeURIComponent(location.name)}`}
              >
                Find hotels nearby
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
