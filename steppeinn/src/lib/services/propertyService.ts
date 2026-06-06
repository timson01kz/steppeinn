import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import type { ServiceResult } from "./types";

type PropertyStatus = Database["public"]["Enums"]["property_status"];

export type OwnerDashboardProperty = {
  id: string;
  name: string;
  slug: string;
  location: string;
  status: PropertyStatus;
  views: string;
  requests: number;
};

export type AdminModerationProperty = {
  id: string;
  name: string;
  owner: string;
  city: string;
  status: PropertyStatus;
  date: string;
};

export async function getPublishedPropertiesCount(): Promise<ServiceResult<number>> {
  try {
    const supabase = createServiceSupabaseClient();
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

export async function getCurrentOwnerProperties(): Promise<
  ServiceResult<OwnerDashboardProperty[]>
> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { data: [], error: userError?.message ?? "Owner session not found." };
    }

    const { data, error } = await supabase
      .from("properties")
      .select("id,name,slug,status,city,address,price_from,created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return {
      data: (data ?? []).map((property) => ({
        id: property.id,
        name: property.name,
        slug: property.slug,
        location: property.address || property.city,
        status: property.status,
        views: "0",
        requests: 0,
      })),
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load owner properties.",
    };
  }
}

export async function getPendingModerationProperties(): Promise<
  ServiceResult<AdminModerationProperty[]>
> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("properties")
      .select("id,name,owner_id,city,status,submitted_at,created_at")
      .eq("status", "pending")
      .order("submitted_at", { ascending: true, nullsFirst: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return {
      data: (data ?? []).map((property) => ({
        id: property.id,
        name: property.name,
        owner: `Owner ${property.owner_id.slice(0, 8)}`,
        city: property.city,
        status: property.status,
        date: formatModerationDate(property.submitted_at ?? property.created_at),
      })),
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load moderation queue.",
    };
  }
}

function formatModerationDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
