"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type RoomInsert = Database["public"]["Tables"]["rooms"]["Insert"];
type RoomUpdate = Database["public"]["Tables"]["rooms"]["Update"];
type AvailabilityStatus = "available" | "unavailable";

export async function createPropertyRoomAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const user = await requireCurrentUser(supabase);
  const propertyId = getRequiredText(formData, "property_id");

  await assertOwnsProperty(supabase, propertyId, user.id);

  const room = parseRoomForm(formData, propertyId);
  const { error } = await supabase.from("rooms").insert(room);

  if (error) {
    redirect(`/dashboard/owner/properties?rooms_error=${encodeURIComponent(error.message)}`);
  }

  refreshRoomPaths();
  redirect("/dashboard/owner/properties?rooms_success=Room created.");
}

export async function updatePropertyRoomAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const user = await requireCurrentUser(supabase);
  const propertyId = getRequiredText(formData, "property_id");
  const roomId = getRequiredText(formData, "room_id");

  await assertOwnsProperty(supabase, propertyId, user.id);

  const room = parseRoomForm(formData, propertyId);
  const payload: RoomUpdate = {
    ...room,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("rooms")
    .update(payload)
    .eq("id", roomId)
    .eq("property_id", propertyId);

  if (error) {
    redirect(`/dashboard/owner/properties?rooms_error=${encodeURIComponent(error.message)}`);
  }

  refreshRoomPaths();
  redirect("/dashboard/owner/properties?rooms_success=Room updated.");
}

export async function deletePropertyRoomAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const user = await requireCurrentUser(supabase);
  const propertyId = getRequiredText(formData, "property_id");
  const roomId = getRequiredText(formData, "room_id");

  await assertOwnsProperty(supabase, propertyId, user.id);

  const { error } = await supabase
    .from("rooms")
    .delete()
    .eq("id", roomId)
    .eq("property_id", propertyId);

  if (error) {
    redirect(`/dashboard/owner/properties?rooms_error=${encodeURIComponent(error.message)}`);
  }

  refreshRoomPaths();
  redirect("/dashboard/owner/properties?rooms_success=Room deleted.");
}

function parseRoomForm(formData: FormData, propertyId: string): RoomInsert {
  const maxGuests = getRequiredNumber(formData, "max_guests");
  const areaM2 = getOptionalNumber(formData, "area_m2");
  const quantity = getRequiredNumber(formData, "quantity");
  const pricePerNight = getRequiredNumber(formData, "price_per_night");
  const availabilityStatus = parseAvailabilityStatus(formData.get("availability_status"));

  return {
    property_id: propertyId,
    name: getRequiredText(formData, "room_name"),
    room_type: getRequiredText(formData, "room_type"),
    description: String(formData.get("description") ?? "").trim() || null,
    area_m2: areaM2,
    max_guests: maxGuests,
    capacity: maxGuests,
    bed_type: getRequiredText(formData, "bed_type"),
    size_m2: areaM2,
    quantity,
    price_per_night: pricePerNight,
    availability_status: availabilityStatus,
  };
}

async function requireCurrentUser(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?error=Please sign in as an owner to manage rooms.");
  }

  return user;
}

async function assertOwnsProperty(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  propertyId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (error || !data) {
    redirect("/dashboard/owner/properties?rooms_error=Property access denied.");
  }
}

function getRequiredText(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();

  if (!value) {
    redirect(`/dashboard/owner/properties?rooms_error=${encodeURIComponent(`${name} is required.`)}`);
  }

  return value;
}

function getRequiredNumber(formData: FormData, name: string) {
  const value = Number(formData.get(name));

  if (!Number.isFinite(value) || value <= 0) {
    redirect(`/dashboard/owner/properties?rooms_error=${encodeURIComponent(`${name} must be greater than zero.`)}`);
  }

  return Math.round(value);
}

function getOptionalNumber(formData: FormData, name: string) {
  const text = String(formData.get(name) ?? "").trim();

  if (!text) return null;

  const value = Number(text);
  return Number.isFinite(value) && value > 0 ? Math.round(value) : null;
}

function parseAvailabilityStatus(value: FormDataEntryValue | null): AvailabilityStatus {
  return value === "unavailable" ? "unavailable" : "available";
}

function refreshRoomPaths() {
  revalidatePath("/dashboard/owner/properties");
  revalidatePath("/hotels");
  revalidatePath("/map");
  revalidatePath("/ai-search");
}
