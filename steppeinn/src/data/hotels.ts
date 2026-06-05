import type { CatalogHotel, HotelCardData, Review, Room } from "@/types";

export const catalogHotels: CatalogHotel[] = [
  { name: "Kok-Tobe Skyline Residence", area: "Dostyk Avenue, upper city", imageClass: "bg-[linear-gradient(135deg,#1d403a_0%,#79a99d_44%,#e4b15f_100%)]", rating: "4.9", ratingValue: 4.9, distance: "1.8 km to Kok-Tobe", distanceValue: 1.8, price: "52 000 KZT", priceValue: 52000, slug: "kok-tobe-skyline-residence", type: "Boutique", amenities: ["Breakfast", "Spa", "Transfer"], nearby: "Kok-Tobe", mapX: "54%", mapY: "39%" },
  { name: "Medeu Alpine Rooms", area: "Mountain route", imageClass: "bg-[linear-gradient(135deg,#16334b_0%,#8eb7c1_48%,#f3e3bd_100%)]", rating: "4.8", ratingValue: 4.8, distance: "1.2 km to Medeu", distanceValue: 1.2, price: "39 500 KZT", priceValue: 39500, slug: "medeu-alpine-rooms", type: "Guesthouse", amenities: ["Breakfast", "Transfer", "Family"], nearby: "Medeu", mapX: "42%", mapY: "29%" },
  { name: "Esentai Urban Hotel", area: "Business district", imageClass: "bg-[linear-gradient(135deg,#25213a_0%,#9a8f83_48%,#f0bb67_100%)]", rating: "4.7", ratingValue: 4.7, distance: "0.6 km to Esentai", distanceValue: 0.6, price: "46 000 KZT", priceValue: 46000, slug: "esentai-urban-hotel", type: "Hotel", amenities: ["Workspace", "Spa", "Breakfast"], nearby: "Esentai", mapX: "60%", mapY: "56%" },
  { name: "Arbat Heritage Boutique", area: "Central walking district", imageClass: "bg-[linear-gradient(135deg,#733f33_0%,#d6a86b_52%,#f7dfb5_100%)]", rating: "4.6", ratingValue: 4.6, distance: "0.4 km to Arbat", distanceValue: 0.4, price: "33 000 KZT", priceValue: 33000, slug: "arbat-heritage-boutique", type: "Boutique", amenities: ["Breakfast", "Workspace"], nearby: "Arbat", mapX: "49%", mapY: "62%" },
  { name: "Shymbulak Snowline Resort", area: "Alpine village", imageClass: "bg-[linear-gradient(135deg,#294057_0%,#b8d5df_48%,#ffffff_100%)]", rating: "4.9", ratingValue: 4.9, distance: "0.8 km to Shymbulak", distanceValue: 0.8, price: "68 000 KZT", priceValue: 68000, slug: "shymbulak-snowline-resort", type: "Resort", amenities: ["Spa", "Transfer", "Family"], nearby: "Shymbulak", mapX: "33%", mapY: "20%" },
  { name: "Airport Nomad Inn", area: "Airport corridor", imageClass: "bg-[linear-gradient(135deg,#28313b_0%,#66717a_50%,#d7c2a1_100%)]", rating: "4.3", ratingValue: 4.3, distance: "2.1 km to Airport", distanceValue: 2.1, price: "24 000 KZT", priceValue: 24000, slug: "airport-nomad-inn", type: "Hotel", amenities: ["Transfer", "Workspace"], nearby: "Airport", mapX: "80%", mapY: "66%" },
  { name: "Mega Family Aparts", area: "Rozybakiev district", imageClass: "bg-[linear-gradient(135deg,#314d43_0%,#bfcf9b_46%,#f0bb67_100%)]", rating: "4.5", ratingValue: 4.5, distance: "0.7 km to Mega", distanceValue: 0.7, price: "31 500 KZT", priceValue: 31500, slug: "mega-family-aparts", type: "Apart-hotel", amenities: ["Family", "Pool", "Breakfast"], nearby: "Mega", mapX: "37%", mapY: "71%" },
  { name: "Golden Square Grand", area: "Old center", imageClass: "bg-[linear-gradient(135deg,#17130f_0%,#8a6a42_52%,#f6dba6_100%)]", rating: "4.8", ratingValue: 4.8, distance: "1.1 km to Arbat", distanceValue: 1.1, price: "58 000 KZT", priceValue: 58000, slug: "golden-square-grand", type: "Hotel", amenities: ["Spa", "Workspace", "Breakfast"], nearby: "Arbat", mapX: "52%", mapY: "60%" },
  { name: "Green Bazaar Guesthouse", area: "Historic market area", imageClass: "bg-[linear-gradient(135deg,#31523f_0%,#c3b36b_50%,#f7e4bf_100%)]", rating: "4.2", ratingValue: 4.2, distance: "1.4 km to Arbat", distanceValue: 1.4, price: "21 000 KZT", priceValue: 21000, slug: "green-bazaar-guesthouse", type: "Guesthouse", amenities: ["Breakfast", "Family"], nearby: "Arbat", mapX: "57%", mapY: "64%" },
  { name: "Dostyk Business Suites", area: "Dostyk Plaza side", imageClass: "bg-[linear-gradient(135deg,#1f2937_0%,#68806f_50%,#d9b26f_100%)]", rating: "4.6", ratingValue: 4.6, distance: "1.6 km to Esentai", distanceValue: 1.6, price: "44 000 KZT", priceValue: 44000, slug: "dostyk-business-suites", type: "Apart-hotel", amenities: ["Workspace", "Transfer"], nearby: "Esentai", mapX: "58%", mapY: "52%" },
  { name: "Alatau Garden Hotel", area: "Southern gardens", imageClass: "bg-[linear-gradient(135deg,#2f4d46_0%,#9bbf9c_48%,#f3ecd8_100%)]", rating: "4.4", ratingValue: 4.4, distance: "3.2 km to Mega", distanceValue: 3.2, price: "29 000 KZT", priceValue: 29000, slug: "alatau-garden-hotel", type: "Hotel", amenities: ["Pool", "Family", "Breakfast"], nearby: "Mega", mapX: "34%", mapY: "75%" },
  { name: "Central Opera Rooms", area: "Abay Opera neighborhood", imageClass: "bg-[linear-gradient(135deg,#332c40_0%,#a57c5b_50%,#f1d7aa_100%)]", rating: "4.5", ratingValue: 4.5, distance: "0.9 km to Arbat", distanceValue: 0.9, price: "36 000 KZT", priceValue: 36000, slug: "central-opera-rooms", type: "Boutique", amenities: ["Breakfast", "Workspace", "Transfer"], nearby: "Arbat", mapX: "47%", mapY: "58%" },
];

export const featuredHotels: HotelCardData[] = catalogHotels.slice(0, 3).map((hotel) => ({
  name: hotel.name,
  area: hotel.area,
  imageClass: hotel.imageClass,
  rating: hotel.rating,
  distance: hotel.slug === "kok-tobe-skyline-residence" ? "1.8 km to Kok-Tobe cable car" : hotel.distance,
  price: hotel.price,
  slug: hotel.slug,
}));

export const favoriteHotels: HotelCardData[] = featuredHotels;

export const similarHotels: HotelCardData[] = catalogHotels.slice(1, 4).map((hotel) => ({
  name: hotel.name,
  area: hotel.area,
  imageClass: hotel.imageClass,
  rating: hotel.rating,
  distance: hotel.distance,
  price: hotel.price,
  slug: hotel.slug,
}));

export const propertyTypes = ["Hotel", "Boutique", "Apart-hotel", "Resort", "Guesthouse"];
export const amenityOptions = ["Breakfast", "Spa", "Transfer", "Workspace", "Pool", "Family"];

export const hotelDetail = {
  name: "Kok-Tobe Skyline Residence",
  rating: "4.9",
  address: "Dostyk Avenue 162, Almaty, Kazakhstan",
  type: "Premium boutique hotel",
  price: "52 000 KZT",
  slug: "kok-tobe-skyline-residence",
  description:
    "A calm upper-city stay with panoramic Almaty views, fast access to Kok-Tobe, and warm interiors designed for weekend escapes, business trips, and first-time city discovery.",
  amenities: ["Mountain-view rooms", "Breakfast", "Spa access", "Airport transfer", "Workspace", "Family rooms", "Concierge", "Late checkout"],
  gallery: [
    "bg-[linear-gradient(135deg,#1d403a_0%,#79a99d_44%,#e4b15f_100%)]",
    "bg-[linear-gradient(135deg,#233047_0%,#738d8a_50%,#f0bb67_100%)]",
    "bg-[linear-gradient(135deg,#73553c_0%,#e4c288_52%,#fbf5e7_100%)]",
    "bg-[linear-gradient(135deg,#183b35_0%,#b9c7b3_48%,#ffffff_100%)]",
    "bg-[linear-gradient(135deg,#17130f_0%,#75624b_52%,#d9b26f_100%)]",
  ],
};

export const rooms: Room[] = [
  { name: "Panorama King Room", imageClass: "bg-[linear-gradient(135deg,#1d403a_0%,#94b9ae_48%,#f0bb67_100%)]", capacity: "2 guests", bed: "1 king bed", size: "34 m2", price: "52 000 KZT" },
  { name: "Mountain Family Suite", imageClass: "bg-[linear-gradient(135deg,#263c4d_0%,#a9c8cf_48%,#f6ead0_100%)]", capacity: "4 guests", bed: "1 king bed + sofa", size: "52 m2", price: "78 000 KZT" },
  { name: "City Business Studio", imageClass: "bg-[linear-gradient(135deg,#25213a_0%,#8d826e_48%,#e8bd70_100%)]", capacity: "2 guests", bed: "1 queen bed", size: "29 m2", price: "44 000 KZT" },
];

export const hotelReviews: Review[] = [
  { author: "Aigerim", rating: "5.0", text: "Beautiful view, quiet rooms, and the location felt perfect for a relaxed Almaty weekend." },
  { author: "Daniel", rating: "4.8", text: "Great mock stay concept. The business room layout and transfer flow make sense for MVP." },
  { author: "Timur", rating: "4.9", text: "Premium feel without being loud. The Kok-Tobe access is the main reason I would book." },
];
