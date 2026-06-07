export type HotelCardData = {
  name: string;
  area: string;
  imageClass: string;
  imageUrl?: string;
  rating: string;
  distance: string;
  price: string;
  slug: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type PropertyType =
  | "Hotel"
  | "Boutique"
  | "Apart-hotel"
  | "Resort"
  | "Guesthouse";

export type CatalogHotel = HotelCardData & {
  priceValue: number;
  ratingValue: number;
  distanceValue: number;
  type: PropertyType;
  amenities: string[];
  nearby: string;
  mapX: string;
  mapY: string;
};

export type LocationCardData = {
  name: string;
  type: string;
  x: string;
  y: string;
  description: string;
  latitude?: number | null;
  longitude?: number | null;
};

export type NearbyPlace = {
  name: string;
  distance: string;
};

export type Room = {
  name: string;
  imageClass: string;
  capacity: string;
  bed: string;
  size: string;
  price: string;
};

export type Review = {
  author: string;
  rating: string;
  text: string;
};

export type Booking = {
  hotel: string;
  dates: string;
  guests: string;
  room: string;
  status: string;
};

export type OwnerProperty = {
  name: string;
  location: string;
  status: string;
  views: string;
  requests: number;
};

export type User = {
  name: string;
  role: string;
  status: string;
};

export type Tariff = {
  name: string;
  price: string;
  period?: string;
  note?: string;
};

export type SortMode = "recommended" | "price" | "rating" | "distance";
export type ViewMode = "list" | "map";
