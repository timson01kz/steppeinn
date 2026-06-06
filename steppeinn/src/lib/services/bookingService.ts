import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import type { ServiceResult } from "./types";

type BookingStatus = Database["public"]["Enums"]["booking_status"];

export type DashboardBookingRequest = {
  id: string;
  propertyId: string;
  propertyName: string;
  roomId: string | null;
  roomName: string;
  guestName: string;
  dates: string;
  guests: string;
  status: BookingStatus;
  specialRequests: string | null;
  responseMessage: string | null;
  createdAt: string;
  respondedAt: string | null;
};

export async function getOwnerBookingRequests(): Promise<
  ServiceResult<DashboardBookingRequest[]>
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

    const { data: properties, error: propertiesError } = await supabase
      .from("properties")
      .select("id,name")
      .eq("owner_id", user.id);

    if (propertiesError) {
      return { data: [], error: propertiesError.message };
    }

    const propertyIds = (properties ?? []).map((property) => property.id);

    if (propertyIds.length === 0) {
      return { data: [], error: null };
    }

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(
        "id,property_id,room_id,guest_name,check_in,check_out,guests,special_requests,response_message,status,created_at,responded_at",
      )
      .in("property_id", propertyIds)
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    const roomIds = (bookings ?? [])
      .map((booking) => booking.room_id)
      .filter((roomId): roomId is string => Boolean(roomId));
    const roomsById = await getRoomsById(supabase, roomIds);

    if (roomsById.error) {
      return { data: [], error: roomsById.error };
    }

    const propertiesById = new Map(
      (properties ?? []).map((property) => [property.id, property.name]),
    );

    return {
      data: (bookings ?? []).map((booking) =>
        toDashboardBooking(booking, propertiesById, roomsById.data),
      ),
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load owner booking requests.",
    };
  }
}

export async function getClientBookingRequests(): Promise<
  ServiceResult<DashboardBookingRequest[]>
> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { data: [], error: userError?.message ?? "Client session not found." };
    }

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select(
        "id,property_id,room_id,guest_name,check_in,check_out,guests,special_requests,response_message,status,created_at,responded_at",
      )
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    const propertyIds = (bookings ?? []).map((booking) => booking.property_id);
    const roomIds = (bookings ?? [])
      .map((booking) => booking.room_id)
      .filter((roomId): roomId is string => Boolean(roomId));
    const [propertiesById, roomsById] = await Promise.all([
      getPropertiesById(supabase, propertyIds),
      getRoomsById(supabase, roomIds),
    ]);

    if (propertiesById.error) {
      return { data: [], error: propertiesById.error };
    }

    if (roomsById.error) {
      return { data: [], error: roomsById.error };
    }

    return {
      data: (bookings ?? []).map((booking) =>
        toDashboardBooking(booking, propertiesById.data, roomsById.data),
      ),
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load client booking requests.",
    };
  }
}

async function getPropertiesById(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  propertyIds: string[],
): Promise<ServiceResult<Map<string, string>>> {
  if (propertyIds.length === 0) {
    return { data: new Map(), error: null };
  }

  const { data, error } = await supabase
    .from("properties")
    .select("id,name")
    .in("id", propertyIds);

  if (error) {
    return { data: new Map(), error: error.message };
  }

  return {
    data: new Map((data ?? []).map((property) => [property.id, property.name])),
    error: null,
  };
}

async function getRoomsById(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  roomIds: string[],
): Promise<ServiceResult<Map<string, string>>> {
  if (roomIds.length === 0) {
    return { data: new Map(), error: null };
  }

  const { data, error } = await supabase
    .from("rooms")
    .select("id,name")
    .in("id", roomIds);

  if (error) {
    return { data: new Map(), error: error.message };
  }

  return {
    data: new Map((data ?? []).map((room) => [room.id, room.name])),
    error: null,
  };
}

function toDashboardBooking(
  booking: {
    id: string;
    property_id: string;
    room_id: string | null;
    guest_name: string;
    check_in: string;
    check_out: string;
    guests: number;
    special_requests: string | null;
    response_message: string | null;
    status: BookingStatus;
    created_at: string;
    responded_at: string | null;
  },
  propertiesById: Map<string, string>,
  roomsById: Map<string, string>,
): DashboardBookingRequest {
  return {
    id: booking.id,
    propertyId: booking.property_id,
    propertyName: propertiesById.get(booking.property_id) ?? "SteppeInn property",
    roomId: booking.room_id,
    roomName: booking.room_id
      ? roomsById.get(booking.room_id) ?? "Selected room"
      : "Room to be assigned",
    guestName: booking.guest_name,
    dates: `${formatDate(booking.check_in)} - ${formatDate(booking.check_out)}`,
    guests: `${booking.guests} ${booking.guests === 1 ? "guest" : "guests"}`,
    status: booking.status,
    specialRequests: booking.special_requests,
    responseMessage: booking.response_message,
    createdAt: formatDateTime(booking.created_at),
    respondedAt: booking.responded_at ? formatDateTime(booking.responded_at) : null,
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
