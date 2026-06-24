import { createClient } from '@supabase/supabase-js';

// Credentials come from environment variables (Vite exposes vars prefixed with VITE_).
// Copy .env.example to .env and fill these in with your own Supabase project values.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;

// Only build a client when both values are present. If they're missing the app
// still runs in a local-only preview mode (see the auth gate in App.jsx).
if (url && anonKey) {
  client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}

export function getSupabase() {
  return client;
}

export function isSupabaseConfigured() {
  return Boolean(client);
}
