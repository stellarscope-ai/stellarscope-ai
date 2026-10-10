"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PromptCard, type Prompt } from "@/components/ai/prompts/prompt-card";
import { CreatePromptDialog } from "@/components/ai/prompts/create-prompt-dialog";
import { UsePromptDialog } from "@/components/ai/prompts/use-prompt-dialog";
import { PromptsEmptyState } from "@/components/ai/prompts/prompts-empty-state";
import { PromptsFilterBar } from "@/components/ai/prompts/prompts-filter-bar";
import type { PromptCategory } from "@/components/ai/prompts/prompt-category-badge";

const initialPrompts: Prompt[] = [
  {
    id: "1",
    title: "Blog post outline",
    template: "Write a {{tone}} blog post outline about {{topic}} with 5 sections.",
    category: "writing",
    favorite: true,
    usageCount: 42,
  },
  {
    id: "2",
    title: "Code review checklist",
    template: "Review this {{language}} code for bugs, performance, and best practices:\n\n{{code}}",
    category: "coding",
    favorite: false,
    usageCount: 128,
  },
  {
    id: "3",
    title: "Ad copy generator",
    template: "Write 3 variations of ad copy for {{product}} targeting {{audience}}.",
    category: "marketing",
    favorite: true,
    usageCount: 67,
  },
  {
    id: "4",
    title: "Meeting summary",
    template: "Summarize the key decisions and action items from this meeting transcript:\n\n{{transcript}}",
    category: "productivity",
    favorite: false,
    usageCount: 19,
  },
];

export default function PromptsPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "favorites" | "writing" | "coding" | "marketing" | "productivity"
  >("all");
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
  const [useDialogOpen, setUseDialogOpen] = useState(false);

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "favorites" ? p.favorite : p.category === filter);
    return matchesSearch && matchesFilter;
  });

  const handleCreate = (data: {
    title: string;
    template: string;
    category: PromptCategory;
  }) => {
    const newPrompt: Prompt = {
      id: crypto.randomUUID(),
      title: data.title,
      template: data.template,
      category: data.category,
      favorite: false,
      usageCount: 0,
    };
    setPrompts((prev) => [newPrompt, ...prev]);
  };

  const handleDelete = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDuplicate = (id: string) => {
    const prompt = prompts.find((p) => p.id === id);
    if (!prompt) return;
    setPrompts((prev) => [
      { ...prompt, id: crypto.randomUUID(), title: `${prompt.title} (copy)` },
      ...prev,
    ]);
  };

  const handleToggleFavorite = (id: string) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
  };

  const handleUse = (id: string) => {
    const prompt = prompts.find((p) => p.id === id);
    if (!prompt) return;
    setActivePrompt(prompt);
    setUseDialogOpen(true);
  };

  const handleRun = (filledPrompt: string) => {
    // Bump usage count
    if (activePrompt) {
      setPrompts((prev) =>
        prev.map((p) =>
          p.id === activePrompt.id ? { ...p, usageCount: p.usageCount + 1 } : p
        )
      );
    }

    // Send to chat with the filled prompt pre-loaded
    sessionStorage.setItem("pending_prompt", filledPrompt);
    router.push("/ai/chat/new");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Prompts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Save and reuse prompt templates across your team.
          </p>
        </div>

        {prompts.length > 0 && <CreatePromptDialog onCreate={handleCreate} />}
      </div>

      {prompts.length > 0 && (
        <PromptsFilterBar
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
        />
      )}

      {prompts.length === 0 ? (
        <PromptsEmptyState onCreate={handleCreate} />
      ) : filteredPrompts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No prompts match your search.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onUse={handleUse}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onToggleFavorite={handleToggleFavorite}
              onEdit={(id) => console.log("edit", id)}
            />
          ))}
        </div>
      )}

      <UsePromptDialog
        prompt={activePrompt}
        open={useDialogOpen}
        onOpenChange={setUseDialogOpen}
        onRun={handleRun}
      />
    </div>
  );
}