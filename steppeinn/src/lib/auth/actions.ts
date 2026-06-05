"use server";

import { redirect } from "next/navigation";
import { normalizeRole, roleHome, type UserRole } from "./roles";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function getProfileRole(userId: string): Promise<UserRole> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return data?.role ?? "client";
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect(`/login?error=${encodeURIComponent(error?.message ?? "Unable to sign in")}`);
  }

  const role = await getProfileRole(data.user.id);
  redirect(roleHome[role]);
}

export async function signUpAction(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const role = normalizeRole(formData.get("role"));

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (error || !data.user) {
    redirect(
      `/register?error=${encodeURIComponent(error?.message ?? "Unable to create account")}`,
    );
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: data.user.id,
    role,
    full_name: fullName,
    preferred_language: "RU",
    country: "Kazakhstan",
  });

  if (profileError) {
    redirect(`/register?error=${encodeURIComponent(profileError.message)}`);
  }

  redirect(roleHome[role]);
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
