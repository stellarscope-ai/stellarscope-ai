"use client";

import {
  KnowledgeDocuments,
  KnowledgeHeader,
  KnowledgeOverview,
  KnowledgeSettings,
  type KnowledgeDocument,
} from "@/components/ai/knowledge/detail";

const knowledge = {
  name: "Product Documentation",
  description:
    "All docs, API references and user guides for the Orbit platform.",
  status: "ready" as const,
  documentCount: 128,
  storage: "45 MB",
  sourceCount: 2,
  lastSynced: "2 hours ago",
};

const documents: KnowledgeDocument[] = [
  {
    id: "1",
    name: "API Reference.pdf",
    type: "PDF",
    size: "8 MB",
    status: "ready",
    updatedAt: "Today",
  },
  {
    id: "2",
    name: "Getting Started.md",
    type: "MD",
    size: "1.2 MB",
    status: "ready",
    updatedAt: "Yesterday",
  },
  {
    id: "3",
    name: "Authentication Guide.pdf",
    type: "PDF",
    size: "5 MB",
    status: "ready",
    updatedAt: "2 days ago",
  },
  {
    id: "4",
    name: "Pricing.docx",
    type: "DOCX",
    size: "450 KB",
    status: "indexing",
    updatedAt: "5 mins ago",
  },
  {
    id: "5",
    name: "Release Notes.pdf",
    type: "PDF",
    size: "2 MB",
    status: "error",
    updatedAt: "1 week ago",
  },
];

export default function KnowledgeDetailPage() {
  return (
    <div className="space-y-6">
      <KnowledgeHeader
        title={knowledge.name}
        description={knowledge.description}
        status={knowledge.status}
        onUpload={() => console.log("Upload")}
        onSync={() => console.log("Sync")}
      />

      <KnowledgeOverview
        documentCount={knowledge.documentCount}
        storage={knowledge.storage}
        sourceCount={knowledge.sourceCount}
        lastSynced={knowledge.lastSynced}
      />

      <KnowledgeDocuments
        documents={documents}
        onUpload={() => console.log("Upload Document")}
      />

      <KnowledgeSettings
        name={knowledge.name}
        description={knowledge.description}
        autoSync
        isPublic={false}
        onSave={(data) => console.log(data)}
        onDelete={() => console.log("Delete Knowledge Base")}
      />
    </div>
  );
}