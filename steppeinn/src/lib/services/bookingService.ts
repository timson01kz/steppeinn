import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ServiceResult } from "./types";

export async function createBookingRequest(input: {
  propertyId: string;
  guestName: string;
  phone?: string;
  email?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  comment?: string;
}): Promise<ServiceResult<{ id: string } | null>> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        property_id: input.propertyId,
        guest_name: input.guestName,
        phone: input.phone,
        email: input.email,
        check_in: input.checkIn,
        check_out: input.checkOut,
        guests: input.guests,
        comment: input.comment,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Unable to create booking request.",
    };
  }
}
