import type { Booking } from "@/types";

export const clientBookings: Booking[] = [
  { hotel: "Kok-Tobe Skyline Residence", dates: "12 Jun - 15 Jun", guests: "2 adults", room: "Panorama King Room", status: "pending" },
  { hotel: "Medeu Alpine Rooms", dates: "21 Jun - 24 Jun", guests: "2 adults, 1 child", room: "Mountain Family Suite", status: "confirmed" },
  { hotel: "Esentai Urban Hotel", dates: "02 Jul - 03 Jul", guests: "1 adult", room: "City Business Studio", status: "declined" },
  { hotel: "Arbat Heritage Boutique", dates: "10 May - 12 May", guests: "2 adults", room: "Classic Boutique Room", status: "completed" },
  { hotel: "Airport Nomad Inn", dates: "04 Apr - 05 Apr", guests: "1 adult", room: "Transfer Room", status: "cancelled" },
];

export const ownerBookingRequests = [
  { guest: "Aigerim S.", dates: "12 Jun - 15 Jun", guests: "2 adults", room: "Panorama King Room", status: "new" },
  { guest: "Daniel R.", dates: "18 Jun - 20 Jun", guests: "1 adult", room: "City Business Studio", status: "confirmed" },
  { guest: "Timur K.", dates: "21 Jun - 24 Jun", guests: "2 adults, 1 child", room: "Mountain Family Suite", status: "needs reply" },
];
