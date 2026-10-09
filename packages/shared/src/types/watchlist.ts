export interface Watchlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  isPublic: boolean;
  items: WatchlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WatchlistItem {
  id: string;
  watchlistId: string;
  type: "account" | "asset";
  target: string;
  label?: string;
  addedAt: string;
}
