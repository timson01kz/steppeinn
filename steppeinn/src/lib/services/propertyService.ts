import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import type { CatalogHotel, PropertyType } from "@/types";
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
  moderationNotes: string | null;
  moderationHistory: PropertyModerationEvent[];
  photos: PropertyPhoto[];
  rooms: PropertyRoom[];
};

export type AdminModerationProperty = {
  id: string;
  name: string;
  owner: string;
  city: string;
  status: PropertyStatus;
  date: string;
};

export type PropertyModerationEvent = {
  id: string;
  status: PropertyStatus;
  notes: string | null;
  date: string;
};

export type PropertyPhoto = {
  id: string;
  propertyId: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type PublicPropertyDetail = {
  id: string;
  name: string;
  slug: string;
  address: string;
  type: string;
  rating: string;
  price: string;
  description: string;
  amenities: string[];
  photos: PropertyPhoto[];
  rooms: PropertyRoom[];
};

export type PropertyRoom = {
  id: string;
  propertyId: string;
  name: string;
  roomType: string | null;
  description: string | null;
  areaM2: number | null;
  maxGuests: number;
  bedType: string | null;
  quantity: number;
  pricePerNight: number;
  availabilityStatus: "available" | "unavailable";
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
      .select("id,name,slug,status,city,address,price_from,moderation_notes,created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    const propertyIds = (data ?? []).map((property) => property.id);
    const [
      { data: events, error: eventsError },
      { data: photos, error: photosError },
      { data: rooms, error: roomsError },
    ] = propertyIds.length
      ? await Promise.all([
            supabase
              .from("property_moderation_events")
              .select("id,property_id,status,notes,created_at")
              .in("property_id", propertyIds)
              .order("created_at", { ascending: false }),
            supabase
              .from("property_media")
              .select("id,property_id,url,alt_text,sort_order,is_primary")
              .in("property_id", propertyIds)
              .eq("media_type", "image")
              .order("sort_order", { ascending: true }),
            supabase
              .from("rooms")
              .select(
                "id,property_id,name,room_type,description,area_m2,max_guests,capacity,bed_type,size_m2,quantity,price_per_night,availability_status",
              )
              .in("property_id", propertyIds)
              .order("created_at", { ascending: false }),
          ])
      : [
            { data: [], error: null },
            { data: [], error: null },
            { data: [], error: null },
          ];

    if (eventsError) {
      return { data: [], error: eventsError.message };
    }

    if (photosError) {
      return { data: [], error: photosError.message };
    }

    if (roomsError) {
      return { data: [], error: roomsError.message };
    }

    const eventsByProperty = new Map<string, PropertyModerationEvent[]>();
    (events ?? []).forEach((event) => {
      const current = eventsByProperty.get(event.property_id) ?? [];
      current.push({
        id: event.id,
        status: event.status,
        notes: event.notes,
        date: formatModerationDate(event.created_at),
      });
      eventsByProperty.set(event.property_id, current);
    });

    const photosByProperty = groupPhotosByProperty(photos ?? []);
    const roomsByProperty = groupRoomsByProperty(rooms ?? []);

    return {
      data: (data ?? []).map((property) => ({
        id: property.id,
        name: property.name,
        slug: property.slug,
        location: property.address || property.city,
        status: property.status,
        views: "0",
        requests: 0,
        moderationNotes: property.moderation_notes,
        moderationHistory: eventsByProperty.get(property.id) ?? [],
        photos: photosByProperty.get(property.id) ?? [],
        rooms: roomsByProperty.get(property.id) ?? [],
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
      .in("status", ["pending", "changes_requested"])
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

export async function getPublishedCatalogProperties(): Promise<
  ServiceResult<CatalogHotel[]>
> {
  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase
      .from("properties")
      .select(
        "id,name,slug,address,city,property_type,rating,price_from,amenities,latitude,longitude,created_at",
      )
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false });

    if (error) {
      return { data: [], error: error.message };
    }

    const mediaByProperty = await getPublicMediaByProperty(
      supabase,
      (data ?? []).map((property) => property.id),
    );

    if (mediaByProperty.error) {
      return { data: [], error: mediaByProperty.error };
    }

    return {
      data: (data ?? []).map((property, index) =>
        toCatalogHotel(
          property,
          index,
          pickPrimaryPhoto(mediaByProperty.data.get(property.id) ?? [])?.url,
        ),
      ),
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Unable to load published properties.",
    };
  }
}

export async function getPublishedPropertyDetail(
  slug: string,
): Promise<ServiceResult<PublicPropertyDetail | null>> {
  try {
    const supabase = createServiceSupabaseClient();
    const { data: property, error } = await supabase
      .from("properties")
      .select(
        "id,name,slug,address,city,property_type,rating,price_from,amenities,description,short_description",
      )
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    if (!property) {
      return { data: null, error: null };
    }

    const [mediaByProperty, roomsByProperty] = await Promise.all([
      getPublicMediaByProperty(supabase, [property.id]),
      getPublicRoomsByProperty(supabase, [property.id]),
    ]);

    if (mediaByProperty.error) {
      return { data: null, error: mediaByProperty.error };
    }

    if (roomsByProperty.error) {
      return { data: null, error: roomsByProperty.error };
    }

    const price = property.price_from ?? 35000;

    return {
      data: {
        id: property.id,
        name: property.name,
        slug: property.slug,
        address: property.address || property.city,
        type: property.property_type,
        rating: Number(property.rating ?? 4.6).toFixed(1),
        price: `${price.toLocaleString("ru-RU")} KZT`,
        description:
          property.description ??
          property.short_description ??
          "A SteppeInn property submitted by a verified owner.",
        amenities: property.amenities,
        photos: mediaByProperty.data.get(property.id) ?? [],
        rooms: roomsByProperty.data.get(property.id) ?? [],
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load published property.",
    };
  }
}

async function getPublicRoomsByProperty(
  supabase: ReturnType<typeof createServiceSupabaseClient>,
  propertyIds: string[],
): Promise<ServiceResult<Map<string, PropertyRoom[]>>> {
  if (propertyIds.length === 0) {
    return { data: new Map(), error: null };
  }

  const { data, error } = await supabase
    .from("rooms")
    .select(
      "id,property_id,name,room_type,description,area_m2,max_guests,capacity,bed_type,size_m2,quantity,price_per_night,availability_status",
    )
    .in("property_id", propertyIds)
    .eq("availability_status", "available")
    .order("price_per_night", { ascending: true });

  if (error) {
    return { data: new Map(), error: error.message };
  }

  return { data: groupRoomsByProperty(data ?? []), error: null };
}

function toCatalogHotel(
  property: {
    id: string;
    name: string;
    slug: string;
    address: string | null;
    city: string;
    property_type: string;
    rating: number | null;
    price_from: number | null;
    amenities: string[];
    latitude: number | null;
    longitude: number | null;
  },
  index: number,
  imageUrl?: string,
): CatalogHotel {
  const ratingValue = Number(property.rating ?? 4.6);
  const priceValue = property.price_from ?? 35000;

  return {
    name: property.name,
    area: property.address || property.city,
    imageClass: publicImageClasses[index % publicImageClasses.length],
    imageUrl,
    rating: ratingValue.toFixed(1),
    ratingValue,
    distance: "Listed on SteppeInn",
    distanceValue: index + 1,
    price: `${priceValue.toLocaleString("ru-RU")} KZT`,
    priceValue,
    slug: property.slug,
    type: normalizePropertyType(property.property_type),
    amenities: property.amenities.length > 0 ? property.amenities : ["Breakfast"],
    nearby: "All",
    mapX: coordinateToMapPosition(property.longitude, 76.8, 77.05, 48 + index * 5),
    mapY: coordinateToMapPosition(property.latitude, 43.35, 43.15, 42 + index * 4),
  };
}

async function getPublicMediaByProperty(
  supabase: ReturnType<typeof createServiceSupabaseClient>,
  propertyIds: string[],
): Promise<ServiceResult<Map<string, PropertyPhoto[]>>> {
  if (propertyIds.length === 0) {
    return { data: new Map(), error: null };
  }

  const { data, error } = await supabase
    .from("property_media")
    .select("id,property_id,url,alt_text,sort_order,is_primary")
    .in("property_id", propertyIds)
    .eq("media_type", "image")
    .order("sort_order", { ascending: true });

  if (error) {
    return { data: new Map(), error: error.message };
  }

  return { data: groupPhotosByProperty(data ?? []), error: null };
}

function groupPhotosByProperty(
  photos: {
    id: string;
    property_id: string | null;
    url: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: boolean;
  }[],
) {
  const photosByProperty = new Map<string, PropertyPhoto[]>();

  photos.forEach((photo) => {
    if (!photo.property_id) return;

    const current = photosByProperty.get(photo.property_id) ?? [];
    current.push({
      id: photo.id,
      propertyId: photo.property_id,
      url: photo.url,
      altText: photo.alt_text,
      sortOrder: photo.sort_order,
      isPrimary: photo.is_primary,
    });
    photosByProperty.set(photo.property_id, current);
  });

  return photosByProperty;
}

function pickPrimaryPhoto(photos: PropertyPhoto[]) {
  return photos.find((photo) => photo.isPrimary) ?? photos[0];
}

function groupRoomsByProperty(
  rooms: {
    id: string;
    property_id: string;
    name: string;
    room_type: string | null;
    description: string | null;
    area_m2: number | null;
    max_guests: number | null;
    capacity: number;
    bed_type: string | null;
    size_m2: number | null;
    quantity: number;
    price_per_night: number;
    availability_status: "available" | "unavailable";
  }[],
) {
  const roomsByProperty = new Map<string, PropertyRoom[]>();

  rooms.forEach((room) => {
    const current = roomsByProperty.get(room.property_id) ?? [];
    current.push({
      id: room.id,
      propertyId: room.property_id,
      name: room.name,
      roomType: room.room_type,
      description: room.description,
      areaM2: room.area_m2 ?? room.size_m2,
      maxGuests: room.max_guests ?? room.capacity,
      bedType: room.bed_type,
      quantity: room.quantity,
      pricePerNight: room.price_per_night,
      availabilityStatus: room.availability_status,
    });
    roomsByProperty.set(room.property_id, current);
  });

  return roomsByProperty;
}

function normalizePropertyType(type: string): PropertyType {
  const normalized = type.toLowerCase();

  if (normalized.includes("boutique")) return "Boutique";
  if (normalized.includes("apart")) return "Apart-hotel";
  if (normalized.includes("resort")) return "Resort";
  if (normalized.includes("guest")) return "Guesthouse";

  return "Hotel";
}

function coordinateToMapPosition(
  value: number | null,
  min: number,
  max: number,
  fallback: number,
) {
  if (value === null) {
    return `${Math.max(16, Math.min(84, fallback))}%`;
  }

  const percent = ((value - min) / (max - min)) * 100;
  return `${Math.max(12, Math.min(88, percent)).toFixed(1)}%`;
}

const publicImageClasses = [
  "bg-[linear-gradient(135deg,#1d403a_0%,#79a99d_44%,#e4b15f_100%)]",
  "bg-[linear-gradient(135deg,#16334b_0%,#8eb7c1_48%,#f3e3bd_100%)]",
  "bg-[linear-gradient(135deg,#733f33_0%,#d6a86b_52%,#f7dfb5_100%)]",
  "bg-[linear-gradient(135deg,#314d43_0%,#bfcf9b_46%,#f0bb67_100%)]",
];

function formatModerationDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
