import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let warnedAboutMissingEnv = false;

function readPublicSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    return { supabaseUrl, supabaseAnonKey };
  }

  if (process.env.NODE_ENV !== "production" && !warnedAboutMissingEnv) {
    warnedAboutMissingEnv = true;
    console.warn(
      "[supabase] Browser auth client unavailable: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.",
    );
  }

  return null;
}

export function createBrowserSupabaseClient(): SupabaseClient<Database> | null {
  const env = readPublicSupabaseEnv();

  if (!env) {
    return null;
  }

  return createBrowserClient<Database>(env.supabaseUrl, env.supabaseAnonKey);
}
