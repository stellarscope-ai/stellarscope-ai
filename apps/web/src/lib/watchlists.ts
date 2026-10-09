import { createBrowserClient } from "./supabase/client";

export type WatchlistRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type WatchlistItemRow = {
  id: string;
  watchlist_id: string;
  item_type: "account" | "asset";
  target: string;
  label: string | null;
  metadata: Record<string, unknown>;
  added_at: string;
};

export async function getUserWatchlists(userId: string): Promise<WatchlistRow[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("watchlists")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getWatchlist(watchlistId: string): Promise<WatchlistRow | null> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("watchlists")
    .select("*")
    .eq("id", watchlistId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }
  return data;
}

export async function createWatchlist(
  userId: string,
  name: string,
  description?: string
): Promise<WatchlistRow> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("watchlists")
    .insert({ user_id: userId, name, description: description ?? null })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateWatchlist(
  watchlistId: string,
  updates: { name?: string; description?: string; is_public?: boolean }
): Promise<WatchlistRow> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("watchlists")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", watchlistId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteWatchlist(watchlistId: string): Promise<void> {
  const supabase = createBrowserClient();
  const { error } = await supabase
    .from("watchlists")
    .delete()
    .eq("id", watchlistId);

  if (error) throw new Error(error.message);
}

export async function getWatchlistItems(watchlistId: string): Promise<WatchlistItemRow[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("watchlist_items")
    .select("*")
    .eq("watchlist_id", watchlistId)
    .order("added_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addWatchlistItem(
  watchlistId: string,
  itemType: "account" | "asset",
  target: string,
  label?: string
): Promise<WatchlistItemRow> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("watchlist_items")
    .insert({
      watchlist_id: watchlistId,
      item_type: itemType,
      target,
      label: label ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function removeWatchlistItem(itemId: string): Promise<void> {
  const supabase = createBrowserClient();
  const { error } = await supabase
    .from("watchlist_items")
    .delete()
    .eq("id", itemId);

  if (error) throw new Error(error.message);
}