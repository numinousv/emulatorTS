import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cached client only — pass (url, anonKey) explicitly from either
// c.env (Workers) or process.env (Node) so this module stays
// runtime-agnostic and never touches process.env itself.
let cachedClient: SupabaseClient | null = null;
let cachedKey = "";

export function getSupabase(url: string, anonKey: string): SupabaseClient {
  const key = `${url}|${anonKey}`;
  if (!cachedClient || cachedKey !== key) {
    cachedClient = createClient(url, anonKey);
    cachedKey = key;
  }
  return cachedClient;
}
