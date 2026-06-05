import type { Database } from "@/lib/supabase/types";

export type UserRole = Database["public"]["Enums"]["user_role"];

export const roleHome: Record<UserRole, string> = {
  client: "/dashboard/client",
  owner: "/dashboard/owner",
  admin: "/admin",
};

export function normalizeRole(value: FormDataEntryValue | null): UserRole {
  if (value === "owner" || value === "admin") {
    return value;
  }

  return "client";
}
