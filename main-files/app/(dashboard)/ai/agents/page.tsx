"use client";

import { useState } from "react";

import { AgentCard, type Agent } from "@/components/ai/agents/agent-card";
import { CreateAgentDialog } from "@/components/ai/agents/create-agent-dialog";
import { AgentsEmptyState } from "@/components/ai/agents/agents-empty-state";
import { AgentsFilterBar } from "@/components/ai/agents/agents-filter-bar";

const initialAgents: Agent[] = [
  {
    id: "1",
    name: "Customer Support Bot",
    description: "Handles common support queries and escalates complex issues to the team.",
    icon: "💬",
    model: "Sonnet 5",
    status: "active",
    usageCount: 1284,
  },
  {
    id: "2",
    name: "Code Reviewer",
    description: "Reviews pull requests for bugs, style issues, and best practices.",
    icon: "🔍",
    model: "Opus 4.8",
    status: "active",
    usageCount: 342,
  },
  {
    id: "3",
    name: "Content Summarizer",
    description: "Condenses long documents and articles into key takeaways.",
    icon: "📝",
    model: "Haiku 4.5",
    status: "draft",
    usageCount: 0,
  },
  {
    id: "4",
    name: "Data Analyst",
    description: "Analyzes spreadsheets and generates insights with charts.",
    icon: "📊",
    model: "Sonnet 5",
    status: "active",
    usageCount: 567,
  },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "draft">("all");

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch = agent.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "all" || agent.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCreate = (data: {
    name: string;
    description: string;
    icon: string;
    model: string;
    instructions: string;
    enabledTools: string[];
  }) => {
    const modelLabel =
      data.model === "sonnet-5"
        ? "Sonnet 5"
        : data.model === "opus-4-8"
        ? "Opus 4.8"
        : "Haiku 4.5";

    const newAgent: Agent = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      icon: data.icon,
      model: modelLabel,
      status: "draft",
      usageCount: 0,
    };

    setAgents((prev) => [newAgent, ...prev]);
  };

  const handleDelete = (id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDuplicate = (id: string) => {
    const agent = agents.find((a) => a.id === id);
    if (!agent) return;

    setAgents((prev) => [
      { ...agent, id: crypto.randomUUID(), name: `${agent.name} (copy)` },
      ...prev,
    ]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Agents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build and manage specialized AI agents for your workflows.
          </p>
        </div>

        {agents.length > 0 && <CreateAgentDialog onCreate={handleCreate} />}
      </div>

      {agents.length > 0 && (
        <AgentsFilterBar
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
        />
      )}

      {agents.length === 0 ? (
        <AgentsEmptyState onCreate={handleCreate} />
      ) : filteredAgents.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No agents match your search.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onEdit={(id) => console.log("edit", id)}
              onRun={(id) => console.log("run", id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}