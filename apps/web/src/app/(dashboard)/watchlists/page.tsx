"use client";

import { useState, useEffect, useCallback } from "react";
import { WatchlistCard } from "@/components/watchlist/WatchlistCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface Watchlist {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
}

export default function WatchlistsPage() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchWatchlists = useCallback(async () => {
    try {
      const res = await fetch("/api/watchlists");
      if (res.ok) {
        setWatchlists(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchlists();
  }, [fetchWatchlists]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/watchlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc || undefined }),
      });
      if (res.ok) {
        const created = await res.json();
        setWatchlists((prev) => [created, ...prev]);
        setNewName("");
        setNewDesc("");
        setShowCreate(false);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/watchlists/${id}`, { method: "DELETE" });
    if (res.ok) {
      setWatchlists((prev) => prev.filter((w) => w.id !== id));
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Watchlists</h1>
        <Button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancel" : "New Watchlist"}
        </Button>
      </div>

      {showCreate && (
        <Card className="p-6">
          <h3 className="mb-3 text-sm font-medium">Create Watchlist</h3>
          <div className="flex flex-col gap-3">
            <Input
              placeholder="Watchlist name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Input
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <Button onClick={handleCreate} disabled={creating || !newName.trim()}>
              {creating ? "Creating..." : "Create"}
            </Button>
          </div>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : watchlists.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            No watchlists yet. Create one to start monitoring Stellar accounts and assets.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {watchlists.map((w) => (
            <WatchlistCard
              key={w.id}
              id={w.id}
              name={w.name}
              description={w.description}
              itemCount={0}
              isPublic={w.is_public}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
