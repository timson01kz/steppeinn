import type { LocationCardData, NearbyPlace } from "@/types";

export const almatyMapLocations: LocationCardData[] = [
  { name: "Shymbulak", type: "Mountain resort", x: "33%", y: "20%", description: "Ski slopes, alpine dining, and premium weekend escapes." },
  { name: "Medeu", type: "Landmark arena", x: "42%", y: "31%", description: "Iconic ice rink route with nature-focused stays nearby." },
  { name: "Kok-Tobe", type: "City viewpoint", x: "53%", y: "40%", description: "Panoramic city views and restaurants above Almaty." },
  { name: "Airport", type: "Arrival hub", x: "80%", y: "66%", description: "Convenient stays for early flights and business arrivals." },
  { name: "Arbat", type: "Walking district", x: "49%", y: "62%", description: "Cafes, galleries, shopping streets, and central hotels." },
  { name: "Mega", type: "Retail and dining", x: "37%", y: "71%", description: "Family-friendly hotels near dining and entertainment." },
  { name: "Esentai", type: "Business and luxury", x: "59%", y: "56%", description: "Premium stays close to offices, shopping, and fine dining." },
];

export const nearbyPlaceOptions = [
  "Shymbulak",
  "Medeu",
  "Kok-Tobe",
  "Airport",
  "Arbat",
  "Mega",
  "Esentai",
];

export const hotelNearbyPlaces: NearbyPlace[] = [
  { name: "Shymbulak", distance: "18.4 km" },
  { name: "Medeu", distance: "12.2 km" },
  { name: "Kok-Tobe", distance: "1.8 km" },
  { name: "Airport", distance: "17.6 km" },
  { name: "Arbat", distance: "5.1 km" },
];

export const adminLocations = [
  "Shymbulak",
  "Medeu",
  "Kok-Tobe",
  "Airport",
  "Arbat",
  "Mega Alma-Ata",
  "Mega Park",
  "Esentai Mall",
  "Republic Square",
];
