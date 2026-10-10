"use client";

import { useState } from "react";
import { MessageSquare, FileText, Mail, Database, Webhook } from "lucide-react";

import { WorkflowCard, type Workflow } from "@/components/ai/workflows/workflow-card";
import { CreateWorkflowDialog } from "@/components/ai/workflows/create-workflow-dialog";
import { WorkflowsEmptyState } from "@/components/ai/workflows/workflows-empty-state";
import { WorkflowsFilterBar } from "@/components/ai/workflows/workflows-filter-bar";
import type { WorkflowStep } from "@/components/ai/workflows/workflow-steps-preview";

const iconMap: Record<string, WorkflowStep["icon"]> = {
  chat: MessageSquare,
  document: FileText,
  email: Mail,
  database: Database,
  webhook: Webhook,
};

const initialWorkflows: Workflow[] = [
  {
    id: "1",
    name: "New lead enrichment",
    description: "Enrich incoming leads and draft a personalized outreach email.",
    status: "active",
    trigger: "Webhook",
    runCount: 342,
    lastRun: "2h ago",
    steps: [
      { id: "s1", label: "Query Database", icon: Database },
      { id: "s2", label: "AI Chat", icon: MessageSquare },
      { id: "s3", label: "Send Email", icon: Mail },
    ],
  },
  {
    id: "2",
    name: "Weekly report summary",
    description: "Analyze weekly metrics documents and summarize key insights.",
    status: "active",
    trigger: "Scheduled",
    runCount: 12,
    lastRun: "6d ago",
    steps: [
      { id: "s1", label: "Analyze Document", icon: FileText },
      { id: "s2", label: "AI Chat", icon: MessageSquare },
      { id: "s3", label: "Send Email", icon: Mail },
    ],
  },
  {
    id: "3",
    name: "Support ticket triage",
    description: "Categorize incoming support tickets and route to the right team.",
    status: "paused",
    trigger: "Webhook",
    runCount: 890,
    steps: [
      { id: "s1", label: "AI Chat", icon: MessageSquare },
      { id: "s2", label: "Call Webhook", icon: Webhook },
    ],
  },
  {
    id: "4",
    name: "Onboarding checklist",
    description: "Draft a welcome email sequence for new sign-ups.",
    status: "draft",
    trigger: "Manual",
    runCount: 0,
    steps: [{ id: "s1", label: "AI Chat", icon: MessageSquare }],
  },
];

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "paused" | "draft">(
    "all"
  );

  const filteredWorkflows = workflows.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || w.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCreate = (data: {
    name: string;
    description: string;
    trigger: string;
    steps: { id: string; label: string; iconId: string }[];
  }) => {
    const triggerLabel =
      data.trigger === "manual"
        ? "Manual"
        : data.trigger === "schedule"
        ? "Scheduled"
        : data.trigger === "webhook"
        ? "Webhook"
        : "On event";

    const newWorkflow: Workflow = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      status: "draft",
      trigger: triggerLabel,
      runCount: 0,
      steps: data.steps.map((s) => ({
        id: s.id,
        label: s.label,
        icon: iconMap[s.iconId] ?? MessageSquare,
      })),
    };

    setWorkflows((prev) => [newWorkflow, ...prev]);
  };

  const handleDelete = (id: string) => {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
  };

  const handleDuplicate = (id: string) => {
    const workflow = workflows.find((w) => w.id === id);
    if (!workflow) return;
    setWorkflows((prev) => [
      { ...workflow, id: crypto.randomUUID(), name: `${workflow.name} (copy)` },
      ...prev,
    ]);
  };

  const handleToggleStatus = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: w.status === "active" ? "paused" : "active" }
          : w
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Workflows</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Automate multi-step tasks by chaining AI actions together.
          </p>
        </div>

        {workflows.length > 0 && (
          <CreateWorkflowDialog onCreate={handleCreate} />
        )}
      </div>

      {workflows.length > 0 && (
        <WorkflowsFilterBar
          filter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
        />
      )}

      {workflows.length === 0 ? (
        <WorkflowsEmptyState onCreate={handleCreate} />
      ) : filteredWorkflows.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">
          No workflows match your search.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onToggleStatus={handleToggleStatus}
              onEdit={(id) => console.log("edit", id)}
              onRun={(id) => console.log("run", id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}