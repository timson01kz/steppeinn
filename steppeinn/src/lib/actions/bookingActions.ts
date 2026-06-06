"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
type BookingStatus = Database["public"]["Enums"]["booking_status"];

export async function createBookingRequestAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?error=Please sign in as a client to send a booking request.");
  }

  const propertyId = getRequiredText(formData, "property_id");
  const roomId = String(formData.get("room_id") ?? "").trim() || null;
  const returnPath = String(formData.get("return_path") ?? "/hotels");
  const guests = getRequiredNumber(formData, "guests");
  const checkIn = getRequiredText(formData, "check_in");
  const checkOut = getRequiredText(formData, "check_out");

  if (new Date(checkOut) <= new Date(checkIn)) {
    redirect(`${returnPath}?booking_error=Check-out must be after check-in.#booking-request`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name,phone,role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "client") {
    redirect(`${returnPath}?booking_error=Only client accounts can send booking requests.#booking-request`);
  }

  const payload: BookingInsert = {
    property_id: propertyId,
    room_id: roomId,
    client_id: user.id,
    guest_name:
      String(formData.get("guest_name") ?? "").trim() ||
      profile?.full_name ||
      user.email ||
      "SteppeInn guest",
    phone: String(formData.get("phone") ?? "").trim() || profile?.phone || null,
    email: String(formData.get("email") ?? "").trim() || user.email || null,
    check_in: checkIn,
    check_out: checkOut,
    guests,
    comment: String(formData.get("special_requests") ?? "").trim() || null,
    special_requests: String(formData.get("special_requests") ?? "").trim() || null,
    status: "pending",
  };

  const { error } = await supabase.from("bookings").insert(payload);

  if (error) {
    redirect(`${returnPath}?booking_error=${encodeURIComponent(error.message)}#booking-request`);
  }

  revalidatePath("/dashboard/client");
  revalidatePath("/dashboard/owner");
  redirect(`${returnPath}?booking_success=1#booking-request`);
}

export async function respondToBookingRequestAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?error=Please sign in as an owner to respond to bookings.");
  }

  const bookingId = getRequiredText(formData, "booking_id");
  const action = getRequiredText(formData, "action");
  const status = bookingActionToStatus(action);
  const responseMessage =
    String(formData.get("response_message") ?? "").trim() ||
    (status === "confirmed"
      ? "Your booking request is confirmed."
      : "The hotel cannot confirm availability for these dates.");
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("bookings")
    .update({
      status,
      response_message: responseMessage,
      responded_at: now,
      status_changed_at: now,
      updated_at: now,
    })
    .eq("id", bookingId);

  if (error) {
    redirect(`/dashboard/owner?booking_error=${encodeURIComponent(error.message)}#requests`);
  }

  revalidatePath("/dashboard/owner");
  revalidatePath("/dashboard/client");
  redirect("/dashboard/owner?booking_success=1#requests");
}

function getRequiredText(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();

  if (!value) {
    redirect(`/hotels?booking_error=${encodeURIComponent(`${name} is required.`)}`);
  }

  return value;
}

function getRequiredNumber(formData: FormData, name: string) {
  const value = Number(formData.get(name));

  if (!Number.isFinite(value) || value <= 0) {
    redirect(`/hotels?booking_error=${encodeURIComponent(`${name} must be greater than zero.`)}`);
  }

  return Math.round(value);
}

function bookingActionToStatus(action: string): BookingStatus {
  if (action === "confirm") return "confirmed";
  if (action === "decline") return "declined";

  redirect("/dashboard/owner?booking_error=Unknown booking action.#requests");
}
