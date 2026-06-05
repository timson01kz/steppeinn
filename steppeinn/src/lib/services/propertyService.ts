import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ServiceResult } from "./types";

export async function getPublishedPropertiesCount(): Promise<ServiceResult<number>> {
  try {
    const supabase = createServerSupabaseClient();
    const { count, error } = await supabase
      .from("properties")
      .select("id", { count: "exact", head: true })
      .eq("status", "published");

    if (error) {
      return { data: 0, error: error.message };
    }

    return { data: count ?? 0, error: null };
  } catch (error) {
    return {
      data: 0,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load Supabase properties.",
    };
  }
}
