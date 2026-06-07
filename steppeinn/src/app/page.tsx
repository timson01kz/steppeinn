import { HomePageClient } from "@/components/home/HomePageClient";
import { getAlmatyLocations } from "@/lib/services/locationService";

export const dynamic = "force-dynamic";

function getInitialAlmatyHour() {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Almaty",
    }).format(new Date()),
  );
}

export default async function Home() {
  const { data, error } = await getAlmatyLocations();

  return (
    <HomePageClient
      initialAlmatyHour={getInitialAlmatyHour()}
      locations={data}
      locationsError={error}
    />
  );
}
