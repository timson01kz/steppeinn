import Link from "next/link";
import { getServerI18n } from "@/i18n/server";
import { createTwoGisLink } from "@/lib/2gis";
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

export default async function ExploreAlmatyPage() {
  const { data: locations, error } = await getAlmatyLocations();
  const { t } = await getServerI18n();

  const locationCards = keyLocationNames.map((name) => {
    const supabaseLocation = locations.find((location) =>
      location.name.toLowerCase().includes(name.toLowerCase()),
    );

    return {
      name,
      description:
        supabaseLocation?.description ??
        `${t("mapPage.locationFallbackPrefix")} ${name} ${t("mapPage.locationFallbackSuffix")}`,
      latitude: supabaseLocation?.latitude,
      longitude: supabaseLocation?.longitude,
      type: supabaseLocation?.type ?? t("mapPage.locationType"),
    };
  });

  return (
    <main className="min-h-screen bg-[#f6f3ed] px-5 py-12 text-[#17130f] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link className="font-semibold text-[#2f4d46]" href="/">
          SteppeInn
        </Link>
        <h1 className="mt-8 text-4xl font-semibold">{t("mapPage.title")}</h1>
        <p className="mt-3 max-w-2xl text-stone-600">
          {t("mapPage.description")}
        </p>
        {error ? (
          <div className="mt-6 rounded-lg border border-[#efc4bd] bg-[#fff0ed] px-5 py-4 text-sm font-semibold text-[#9b2d25]">
            {t("mapPage.supabaseError")} {error}
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
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-md bg-[#17130f] px-5 text-sm font-bold text-white transition hover:bg-[#2f4d46]"
                  href={`/hotels?nearby=${encodeURIComponent(location.name)}`}
                >
                  {t("mapPage.findHotelsNearby")}
                </Link>
                <a
                  className="inline-flex h-11 items-center justify-center rounded-md border border-stone-300 bg-white px-5 text-sm font-bold text-[#2f4d46] transition hover:border-[#2f4d46]"
                  href={createTwoGisLink({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    name: location.name,
                  })}
                  rel="noreferrer"
                  target="_blank"
                >
                  {t("Open in 2GIS")}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
