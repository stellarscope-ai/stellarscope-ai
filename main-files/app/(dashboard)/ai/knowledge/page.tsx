"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { KnowledgeBaseCard, type KnowledgeBase } from "@/components/ai/knowledge/knowledge-base-card";
import { CreateKnowledgeBaseDialog } from "@/components/ai/knowledge/create-knowledge-base-dialog";
import { KnowledgeEmptyState } from "@/components/ai/knowledge/knowledge-empty-state";
import { KnowledgeFilterBar } from "@/components/ai/knowledge/knowledge-filter-bar";

const initialBases: KnowledgeBase[] = [
  {
    id: "1",
    name: "Product documentation",
    description: "All docs, API references, and guides for the Orbit platform.",
    sourceTypes: ["file", "url"],
    documentCount: 128,
    sizeLabel: "45 MB",
    status: "ready",
    lastSynced: "2h ago",
  },
  {
    id: "2",
    name: "Customer support tickets",
    description: "Historical support conversations for training the support agent.",
    sourceTypes: ["database"],
    documentCount: 3420,
    sizeLabel: "210 MB",
    status: "ready",
    lastSynced: "1d ago",
  },
  {
    id: "3",
    name: "Company wiki",
    description: "Internal Notion workspace synced for team-wide context.",
    sourceTypes: ["integration"],
    documentCount: 89,
    sizeLabel: "12 MB",
    status: "indexing",
    lastSynced: "Syncing...",
  },
  {
    id: "4",
    name: "Legal contracts",
    description: "Uploaded contract templates and signed agreements.",
    sourceTypes: ["file"],
    documentCount: 24,
    sizeLabel: "8 MB",
    status: "error",
    lastSynced: "3d ago",
  },
];

export default function KnowledgePage() {
  const router = useRouter();
  const [bases, setBases] = useState<KnowledgeBase[]>(initialBases);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "ready" | "indexing" | "error">("all");

  const filteredBases = bases.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCreate = (data: { name: string; description: string; sourceType: string }) => {
    const newBase: KnowledgeBase = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      sourceTypes: [data.sourceType as KnowledgeBase["sourceTypes"][number]],
      documentCount: 0,
      sizeLabel: "0 MB",
      status: "indexing",
      lastSynced: "Just now",
    };
    setBases((prev) => [newBase, ...prev]);
  };

  const handleDelete = (id: string) => {
    setBases((prev) => prev.filter((b) => b.id !== id));
  };

  const handleResync = (id: string) => {
    setBases((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "indexing", lastSynced: "Syncing..." } : b))
    );

    // simulate sync completing
    setTimeout(() => {
      setBases((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "ready", lastSynced: "Just now" } : b))
      );
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Knowledge</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Give your agents and chats context from your own data.
          </p>
        </div>

        {bases.length > 0 && <CreateKnowledgeBaseDialog onCreate={handleCreate} />}
      </div>

      {bases.length > 0 && (
        <KnowledgeFilterBar
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
        />
      )}

      {bases.length === 0 ? (
        <KnowledgeEmptyState onCreate={handleCreate} />
      ) : filteredBases.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No knowledge bases match your search.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBases.map((base) => (
            <KnowledgeBaseCard
              key={base.id}
              base={base}
              onOpen={() => router.push("/ai/knowledge/details")}
              onEdit={(id) => console.log("edit", id)}
              onResync={handleResync}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}