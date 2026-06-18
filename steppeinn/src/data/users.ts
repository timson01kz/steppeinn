import type { OwnerProperty, User } from "@/types";

export const clientStats = [
  { label: "Active bookings", value: "2" },
  { label: "Pending requests", value: "3" },
  { label: "Favorite hotels", value: "6" },
  { label: "Recent notifications", value: "4" },
];

export const clientProfile = [
  { label: "Full name", value: "Aigerim Saparova" },
  { label: "Phone", value: "+7 701 000 00 00" },
  { label: "Email", value: "aigerim@example.com" },
];

export const clientCountries = [
  "Kazakhstan",
  "Uzbekistan",
  "Kyrgyzstan",
  "Russia",
  "UAE",
  "Turkey",
  "China",
  "India",
  "Germany",
  "France",
  "UK",
  "USA",
  "Other",
];

export const clientNotifications = [
  { type: "Booking confirmed", text: "Medeu Alpine Rooms confirmed your June stay." },
  { type: "Booking declined", text: "Esentai Urban Hotel is unavailable for selected dates." },
  { type: "Hotel message", text: "Kok-Tobe Skyline Residence asked about arrival time." },
  { type: "Promo offer", text: "Weekend mountain stays are 10% off this week." },
];

export const clientSupportRequests = [
  {
    topic: "Arrival time question",
    messagePreview: "I want to confirm whether late check-in is possible.",
    status: "sent",
    createdDate: "08 Jun 2026",
  },
  {
    topic: "Change guest count",
    messagePreview: "Please update my request from two guests to three guests.",
    status: "in review",
    createdDate: "07 Jun 2026",
  },
  {
    topic: "Hotel contact",
    messagePreview: "I need help reaching the hotel before arrival.",
    status: "answered",
    createdDate: "05 Jun 2026",
  },
];

export const ownerMetrics = [
  { label: "Total views", value: "18 420", trend: "+14% this month" },
  { label: "Booking requests", value: "126", trend: "+22 new" },
  { label: "Published properties", value: "8", trend: "2 premium" },
  { label: "Pending moderation", value: "3", trend: "Average review time" },
];

export const ownerProperties: OwnerProperty[] = [
  { name: "Kok-Tobe Skyline Residence", location: "Dostyk Avenue", status: "published", views: "5 840", requests: 42 },
  { name: "Medeu Alpine Rooms", location: "Mountain route", status: "pending", views: "1 220", requests: 9 },
  { name: "Arbat Heritage Boutique", location: "Arbat", status: "draft", views: "0", requests: 0 },
  { name: "Airport Nomad Inn", location: "Airport corridor", status: "expired", views: "2 140", requests: 15 },
];

export const addPropertySteps = ["Basic info", "Address / location", "Amenities", "Photos / videos", "Rooms / prices", "Submit for moderation"];

export const ownerTopLocations = [
  { name: "Kok-Tobe", value: "34%" },
  { name: "Medeu", value: "27%" },
  { name: "Esentai", value: "21%" },
  { name: "Arbat", value: "18%" },
];

export const adminUsers: User[] = [
  { name: "Aigerim S.", role: "client", status: "active" },
  { name: "Timur K.", role: "owner", status: "active" },
  { name: "Admin Ops", role: "admin", status: "active" },
  { name: "Legacy Owner", role: "owner", status: "blocked" },
];

export const adminMetrics = [
  { label: "Total properties", value: "184", tone: "bg-[#e9f3ee]" },
  { label: "Active properties", value: "142", tone: "bg-[#e9f3ee]" },
  { label: "Pending moderation", value: "17", tone: "bg-[#fff3d8]" },
  { label: "Total users", value: "8 420", tone: "bg-[#eef2f7]" },
  { label: "Booking requests", value: "1 268", tone: "bg-[#f6eadc]" },
  { label: "Monthly revenue", value: "1.84M KZT", tone: "bg-[#f3ead8]" },
];

export const adminProperties = [
  { name: "Kok-Tobe Skyline Residence", owner: "Alem Hotels", city: "Almaty", status: "pending", date: "05 Jun 2026" },
  { name: "Medeu Alpine Rooms", owner: "Tau Group", city: "Almaty", status: "changes", date: "04 Jun 2026" },
  { name: "Esentai Urban Hotel", owner: "Urban Stay LLP", city: "Almaty", status: "approved", date: "03 Jun 2026" },
];

export const adminAdvertisements = [
  { name: "Homepage banner", status: "active", placement: "Hero / below fold" },
  { name: "Catalog banner", status: "draft", placement: "Hotels catalog" },
  { name: "Promoted properties", status: "active", placement: "Cards rail" },
  { name: "VIP listings", status: "active", placement: "Search priority" },
];

export const adminReviews = [
  { hotel: "Kok-Tobe Skyline Residence", author: "Aigerim", rating: "5.0", status: "pending" },
  { hotel: "Medeu Alpine Rooms", author: "Daniel", rating: "4.8", status: "visible" },
  { hotel: "Arbat Heritage Boutique", author: "Timur", rating: "4.1", status: "flagged" },
];

export const adminSearchedLocations = [
  { name: "Shymbulak", value: "42%" },
  { name: "Kok-Tobe", value: "31%" },
  { name: "Medeu", value: "24%" },
];

export const adminViewedHotels = [
  "Kok-Tobe Skyline Residence",
  "Esentai Urban Hotel",
  "Medeu Alpine Rooms",
];

export const adminTrendBars = ["42%", "56%", "48%", "72%", "64%", "88%", "79%"];
