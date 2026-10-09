"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WatchlistItem {
  id: string;
  item_type: "account" | "asset";
  target: string;
  label: string | null;
  added_at: string;
}

interface WatchlistDetailProps {
  watchlist: {
    id: string;
    name: string;
    description: string | null;
    is_public: boolean;
  };
  items: WatchlistItem[];
  onAddItem: (itemType: "account" | "asset", target: string, label?: string) => Promise<void>;
  onRemoveItem: (itemId: string) => Promise<void>;
}

export function WatchlistDetail({ watchlist, items, onAddItem, onRemoveItem }: WatchlistDetailProps) {
  const [itemType, setItemType] = useState<"account" | "asset">("account");
  const [target, setTarget] = useState("");
  const [label, setLabel] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!target.trim()) return;
    setAdding(true);
    try {
      await onAddItem(itemType, target.trim(), label.trim() || undefined);
      setTarget("");
      setLabel("");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#f8fafc]">{watchlist.name}</h2>
        {watchlist.description && (
          <p className="mt-1 text-gray-400">{watchlist.description}</p>
        )}
      </div>

      <Card>
        <h3 className="mb-3 text-sm font-medium text-gray-300">Add Item</h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value as "account" | "asset")}
            className="rounded-lg border border-gray-700 bg-[#0b0f1a] px-3 py-2 text-sm text-[#f8fafc]"
          >
            <option value="account">Account</option>
            <option value="asset">Asset</option>
          </select>
          <Input
            placeholder={itemType === "account" ? "G... address" : "CODE:ISSUER"}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <Input
            placeholder="Label (optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={adding || !target.trim()}>
            {adding ? "Adding..." : "Add"}
          </Button>
        </div>
      </Card>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-300">
          Items ({items.length})
        </h3>
        {items.length === 0 ? (
          <p className="text-sm text-gray-500">No items yet. Add an account or asset above.</p>
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#8b5cf6]/20 px-2 py-0.5 text-xs text-[#8b5cf6]">
                      {item.item_type}
                    </span>
                    <span className="font-mono text-sm text-[#f8fafc]">
                      {item.target}
                    </span>
                  </div>
                  {item.label && (
                    <p className="mt-1 text-xs text-gray-400">{item.label}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                >
                  Remove
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}