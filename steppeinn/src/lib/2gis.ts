const TWO_GIS_ALMATY_SEARCH_URL = "https://2gis.kz/almaty/search";

type TwoGisLinkInput = {
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  name?: string | null;
};

export function createTwoGisLink({
  address,
  latitude,
  longitude,
  name,
}: TwoGisLinkInput) {
  const query =
    typeof latitude === "number" && typeof longitude === "number"
      ? `${latitude}, ${longitude}`
      : [name, address, "Almaty"].filter(Boolean).join(", ");

  return `${TWO_GIS_ALMATY_SEARCH_URL}/${encodeURIComponent(query)}`;
}
