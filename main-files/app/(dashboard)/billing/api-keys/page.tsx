"use client";

import { useState } from "react";

import { ApiKeyRow, type ApiKey } from "@/components/billing/api-keys/api-key-row";
import { CreateApiKeyDialog } from "@/components/billing/api-keys/create-api-key-dialog";
import { NewKeyRevealDialog } from "@/components/billing/api-keys/new-key-reveal-dialog";
import { ApiKeysEmptyState } from "@/components/billing/api-keys/api-keys-empty-state";
import { ApiUsageNote } from "@/components/billing/api-keys/api-usage-note";

function generateFakeKey() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "sk-orbit-";
  for (let i = 0; i < 40; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

const initialKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production server",
    maskedKey: "sk-orbit-abc123...................xyz9",
    createdAt: "Jun 12, 2026",
    lastUsed: "2h ago",
    scope: "full",
  },
  {
    id: "2",
    name: "Staging environment",
    maskedKey: "sk-orbit-def456...................uvw8",
    createdAt: "May 3, 2026",
    lastUsed: "3d ago",
    scope: "read-only",
  },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [revealOpen, setRevealOpen] = useState(false);

  const handleCreate = (data: { name: string; scope: "full" | "read-only" }) => {
    const fullKey = generateFakeKey();
    const masked = fullKey.slice(0, 14) + "..." + fullKey.slice(-4);

    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name: data.name,
      maskedKey: masked,
      createdAt: "Just now",
      lastUsed: null,
      scope: data.scope,
    };

    setKeys((prev) => [newKey, ...prev]);
    setNewKeyValue(fullKey);
    setRevealOpen(true);
  };

  const handleRevoke = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  const handleRegenerate = (id: string) => {
    const fullKey = generateFakeKey();
    const masked = fullKey.slice(0, 14) + "..." + fullKey.slice(-4);

    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, maskedKey: masked, createdAt: "Just now" } : k))
    );
    setNewKeyValue(fullKey);
    setRevealOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">API Keys</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage keys for programmatic access to Orbit.
          </p>
        </div>

        {keys.length > 0 && <CreateApiKeyDialog onCreate={handleCreate} />}
      </div>

      <ApiUsageNote />

      {keys.length === 0 ? (
        <ApiKeysEmptyState onCreate={handleCreate} />
      ) : (
        <div className="rounded-xl border divide-y">
          {keys.map((key) => (
            <ApiKeyRow
              key={key.id}
              apiKey={key}
              onRegenerate={handleRegenerate}
              onRevoke={handleRevoke}
              onRename={(id) => console.log("rename", id)}
            />
          ))}
        </div>
      )}

      <NewKeyRevealDialog
        apiKey={newKeyValue}
        open={revealOpen}
        onOpenChange={setRevealOpen}
      />
    </div>
  );
}