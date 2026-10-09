import { createBrowserClient } from "./supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export async function signInWithEmail(email: string) {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  const supabase = createBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getSession(): Promise<Session | null> {
  const supabase = createBrowserClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser(): Promise<User | null> {
  const supabase = createBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  const supabase = createBrowserClient();
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}