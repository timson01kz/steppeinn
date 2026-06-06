"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];

export async function createOwnerPropertyAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?error=Please sign in as an owner to add a property.");
  }

  const title = getRequiredText(formData, "title");
  const propertyType = getRequiredText(formData, "property_type");
  const city = getRequiredText(formData, "city");
  const address = getRequiredText(formData, "address");
  const shortDescription = getRequiredText(formData, "short_description");
  const fullDescription = getRequiredText(formData, "description");
  const priceFrom = Number(formData.get("price_from"));

  if (!Number.isFinite(priceFrom) || priceFrom <= 0) {
    redirect("/dashboard/owner/properties/new?error=Starting price must be greater than zero.");
  }

  const latitude = parseOptionalNumber(formData.get("latitude"));
  const longitude = parseOptionalNumber(formData.get("longitude"));
  const amenities = String(formData.get("amenities") ?? "")
    .split(",")
    .map((amenity) => amenity.trim())
    .filter(Boolean);

  const payload: PropertyInsert = {
    owner_id: user.id,
    name: title,
    slug: createPropertySlug(title),
    property_type: propertyType,
    city,
    address,
    latitude,
    longitude,
    short_description: shortDescription,
    description: fullDescription,
    amenities,
    price_from: priceFrom,
    status: "pending",
    submitted_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("properties").insert(payload);

  if (error) {
    redirect(`/dashboard/owner/properties/new?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard/owner/properties/new?success=1");
}

function getRequiredText(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();

  if (!value) {
    redirect(`/dashboard/owner/properties/new?error=${encodeURIComponent(`${name} is required.`)}`);
  }

  return value;
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();

  if (!text) {
    return null;
  }

  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function createPropertySlug(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${base || "property"}-${Date.now()}`;
}
