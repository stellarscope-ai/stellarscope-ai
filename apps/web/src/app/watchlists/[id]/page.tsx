"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { WatchlistDetail } from "@/components/watchlist/WatchlistDetail";
import Link from "next/link";

interface WatchlistData {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  watchlist_items: Array<{
    id: string;
    item_type: "account" | "asset";
    target: string;
    label: string | null;
    added_at: string;
  }>;
}

export default function WatchlistDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [watchlist, setWatchlist] = useState<WatchlistData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = useCallback(async () => {
    try {
      const res = await fetch(`/api/watchlists/${id}`);
      if (res.ok) {
        setWatchlist(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const handleAddItem = async (itemType: "account" | "asset", target: string, label?: string) => {
    const res = await fetch(`/api/watchlists/${id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_type: itemType, target, label }),
    });
    if (res.ok) {
      fetchWatchlist();
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const res = await fetch(`/api/watchlists/${id}/items?itemId=${itemId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchWatchlist();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!watchlist) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Watchlist not found</p>
        <Link href="/watchlists" className="text-[#6366f1] hover:underline">
          Back to watchlists
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-gray-800 px-6 py-3">
        <Link href="/" className="text-lg font-bold">
          <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">
            StellarScope AI
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/watchlists" className="text-sm text-gray-400 hover:text-white">
            Watchlists
          </Link>
          <Link href="/chat" className="text-sm text-gray-400 hover:text-white">
            Chat
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <WatchlistDetail
          watchlist={watchlist}
          items={watchlist.watchlist_items}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
        />
      </main>
    </div>
  );
}