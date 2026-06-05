import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export function createBrowserSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
