import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

export function requireSupabaseEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function createServiceSupabaseClient() {
  const supabaseUrl = requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
  });
}

export async function createServerSupabaseClient() {
  const supabaseUrl = requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = requireSupabaseEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Components cannot set cookies. Middleware refreshes sessions.
        }
      },
    },
  });
}
