import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function createBrowserClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (client) return client;

  client = createClient(supabaseUrl, supabaseAnonKey, {
    accessToken: () => {
      if (typeof window === "undefined") return Promise.resolve(null);
      return Promise.resolve(localStorage.getItem("stellarscope_token"));
    },
  });

  return client;
}

export function setWalletSession(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("stellarscope_token", token);
  }
}

export function clearWalletSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("stellarscope_token");
    localStorage.removeItem("stellarscope_wallet");
  }
}

export function getWalletToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("stellarscope_token");
}

export function getWalletAddress(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("stellarscope_wallet");
}