import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { LocationCardData } from "@/types";
import type { ServiceResult } from "./types";

const mapPositions: Record<string, Pick<LocationCardData, "x" | "y">> = {
  Shymbulak: { x: "33%", y: "20%" },
  Medeu: { x: "42%", y: "31%" },
  "Kok-Tobe": { x: "53%", y: "40%" },
  Airport: { x: "80%", y: "66%" },
  Arbat: { x: "49%", y: "62%" },
  "Mega Alma-Ata": { x: "37%", y: "71%" },
  "Mega Park": { x: "40%", y: "68%" },
  "Esentai Mall": { x: "59%", y: "56%" },
};

function getMapPosition(name: string) {
  return mapPositions[name] ?? { x: "50%", y: "50%" };
}

export async function getAlmatyLocations(): Promise<
  ServiceResult<LocationCardData[]>
> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("locations")
      .select("name, category, description, description_en")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }

    return {
      data: (data ?? []).map((location) => {
        const position = getMapPosition(location.name);

        return {
          name: location.name,
          type: location.category,
          x: position.x,
          y: position.y,
          description:
            location.description_en ??
            location.description ??
            "SteppeInn location from Supabase.",
        };
      }),
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load Supabase locations.",
    };
  }
}
