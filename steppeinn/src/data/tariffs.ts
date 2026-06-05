import type { Tariff } from "@/types";

export const ownerBillingPlans: Tariff[] = [
  { name: "First month", price: "Free", note: "Trial for every new owner" },
  { name: "Basic listing", price: "1000 KZT/month", note: "Standard catalog placement" },
  { name: "Premium", price: "1000 KZT/month", note: "Boosted search placement" },
  { name: "VIP", price: "1000 KZT/month", note: "Top placement and concierge support" },
  { name: "Banner", price: "1000 KZT", note: "Homepage campaign banner" },
];

export const adminTariffs: Tariff[] = [
  { name: "First month free", price: "0 KZT", period: "trial" },
  { name: "Basic", price: "1000 KZT", period: "month" },
  { name: "Premium", price: "1000 KZT", period: "month" },
  { name: "VIP", price: "1000 KZT", period: "month" },
  { name: "Banners", price: "1000 KZT", period: "campaign" },
];
