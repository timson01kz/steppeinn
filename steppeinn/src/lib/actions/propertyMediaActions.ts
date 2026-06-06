"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

const bucketName = "property-images";
const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

type PropertyMediaInsert =
  Database["public"]["Tables"]["property_media"]["Insert"];

export async function uploadPropertyPhotosAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const user = await requireCurrentUser(supabase);
  const propertyId = String(formData.get("property_id") ?? "");
  const altText = String(formData.get("alt_text") ?? "").trim() || null;
  const files = formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (!propertyId || files.length === 0) {
    redirect("/dashboard/owner/properties?media_error=Choose at least one photo.");
  }

  await assertOwnsProperty(supabase, propertyId, user.id);

  const { count } = await supabase
    .from("property_media")
    .select("id", { count: "exact", head: true })
    .eq("property_id", propertyId)
    .eq("media_type", "image");

  const existingCount = count ?? 0;

  for (const [index, file] of files.entries()) {
    validateImageFile(file);

    const path = `${user.id}/${propertyId}/${Date.now()}-${index}-${safeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      redirect(`/dashboard/owner/properties?media_error=${encodeURIComponent(uploadError.message)}`);
    }

    const { data: publicUrl } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);

    const payload: PropertyMediaInsert = {
      property_id: propertyId,
      url: publicUrl.publicUrl,
      media_type: "image",
      alt_text: altText,
      sort_order: existingCount + index,
      is_primary: existingCount === 0 && index === 0,
    };

    const { error: insertError } = await supabase
      .from("property_media")
      .insert(payload);

    if (insertError) {
      await supabase.storage.from(bucketName).remove([path]);
      redirect(`/dashboard/owner/properties?media_error=${encodeURIComponent(insertError.message)}`);
    }
  }

  refreshMediaPaths();
  redirect("/dashboard/owner/properties?media_success=Photos uploaded.");
}

export async function markPrimaryPhotoAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const user = await requireCurrentUser(supabase);
  const propertyId = String(formData.get("property_id") ?? "");
  const photoId = String(formData.get("photo_id") ?? "");

  await assertOwnsProperty(supabase, propertyId, user.id);

  const { error: clearError } = await supabase
    .from("property_media")
    .update({ is_primary: false })
    .eq("property_id", propertyId)
    .eq("media_type", "image");

  if (clearError) {
    redirect(`/dashboard/owner/properties?media_error=${encodeURIComponent(clearError.message)}`);
  }

  const { error } = await supabase
    .from("property_media")
    .update({ is_primary: true })
    .eq("id", photoId)
    .eq("property_id", propertyId);

  if (error) {
    redirect(`/dashboard/owner/properties?media_error=${encodeURIComponent(error.message)}`);
  }

  refreshMediaPaths();
  redirect("/dashboard/owner/properties?media_success=Primary photo updated.");
}

export async function deletePropertyPhotoAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const user = await requireCurrentUser(supabase);
  const propertyId = String(formData.get("property_id") ?? "");
  const photoId = String(formData.get("photo_id") ?? "");

  await assertOwnsProperty(supabase, propertyId, user.id);

  const { data: photo, error: photoError } = await supabase
    .from("property_media")
    .select("id,url,is_primary")
    .eq("id", photoId)
    .eq("property_id", propertyId)
    .maybeSingle();

  if (photoError || !photo) {
    redirect(`/dashboard/owner/properties?media_error=${encodeURIComponent(photoError?.message ?? "Photo not found.")}`);
  }

  const { error } = await supabase
    .from("property_media")
    .delete()
    .eq("id", photoId)
    .eq("property_id", propertyId);

  if (error) {
    redirect(`/dashboard/owner/properties?media_error=${encodeURIComponent(error.message)}`);
  }

  const storagePath = storagePathFromPublicUrl(photo.url);

  if (storagePath) {
    await supabase.storage.from(bucketName).remove([storagePath]);
  }

  if (photo.is_primary) {
    const { data: nextPhoto } = await supabase
      .from("property_media")
      .select("id")
      .eq("property_id", propertyId)
      .eq("media_type", "image")
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextPhoto) {
      await supabase
        .from("property_media")
        .update({ is_primary: true })
        .eq("id", nextPhoto.id);
    }
  }

  refreshMediaPaths();
  redirect("/dashboard/owner/properties?media_success=Photo deleted.");
}

export async function reorderPropertyPhotoAction(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const user = await requireCurrentUser(supabase);
  const propertyId = String(formData.get("property_id") ?? "");
  const photoId = String(formData.get("photo_id") ?? "");
  const direction = String(formData.get("direction") ?? "");

  await assertOwnsProperty(supabase, propertyId, user.id);

  const { data: photos, error } = await supabase
    .from("property_media")
    .select("id,sort_order")
    .eq("property_id", propertyId)
    .eq("media_type", "image")
    .order("sort_order", { ascending: true });

  if (error) {
    redirect(`/dashboard/owner/properties?media_error=${encodeURIComponent(error.message)}`);
  }

  const index = (photos ?? []).findIndex((photo) => photo.id === photoId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;

  if (index < 0 || swapIndex < 0 || swapIndex >= (photos ?? []).length) {
    redirect("/dashboard/owner/properties");
  }

  const current = photos![index];
  const swap = photos![swapIndex];

  await Promise.all([
    supabase
      .from("property_media")
      .update({ sort_order: swap.sort_order })
      .eq("id", current.id),
    supabase
      .from("property_media")
      .update({ sort_order: current.sort_order })
      .eq("id", swap.id),
  ]);

  refreshMediaPaths();
  redirect("/dashboard/owner/properties?media_success=Photo order updated.");
}

async function requireCurrentUser(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?error=Please sign in as an owner to manage photos.");
  }

  return user;
}

async function assertOwnsProperty(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  propertyId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("properties")
    .select("id")
    .eq("id", propertyId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (error || !data) {
    redirect("/dashboard/owner/properties?media_error=Property access denied.");
  }
}

function validateImageFile(file: File) {
  if (!allowedImageTypes.includes(file.type)) {
    redirect("/dashboard/owner/properties?media_error=Only JPG, JPEG, PNG, and WEBP images are allowed.");
  }

  if (file.size > maxImageSize) {
    redirect("/dashboard/owner/properties?media_error=Each image must be 5MB or smaller.");
  }
}

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
}

function storagePathFromPublicUrl(url: string) {
  const marker = `/storage/v1/object/public/${bucketName}/`;
  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return decodeURIComponent(url.slice(index + marker.length));
}

function refreshMediaPaths() {
  revalidatePath("/dashboard/owner");
  revalidatePath("/dashboard/owner/properties");
  revalidatePath("/hotels");
  revalidatePath("/map");
  revalidatePath("/ai-search");
}
