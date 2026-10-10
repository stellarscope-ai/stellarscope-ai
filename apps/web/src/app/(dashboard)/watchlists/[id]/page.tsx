"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { WatchlistDetail } from "@/components/watchlist/WatchlistDetail";
import { Button } from "@/components/ui/button";
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
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!watchlist) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-muted-foreground">Watchlist not found</p>
        <Button variant="outline" asChild>
          <Link href="/watchlists">Back to watchlists</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <WatchlistDetail
        watchlist={watchlist}
        items={watchlist.watchlist_items}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}
