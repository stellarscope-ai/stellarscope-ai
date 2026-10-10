"use client";

import { useState } from "react";

import { ProviderSection } from "@/components/ai/models/provider-section";
import type { Model } from "@/components/ai/models/model-card";

const anthropicModels: Model[] = [
  {
    id: "sonnet-5",
    name: "Claude Sonnet 5",
    description: "Balanced intelligence and speed for everyday tasks",
    contextWindow: "200K",
    inputPrice: "$3",
    outputPrice: "$15",
    speed: "balanced",
    capabilities: ["vision", "tools", "thinking"],
  },
  {
    id: "opus-4-8",
    name: "Claude Opus 4.8",
    description: "Most capable model for complex reasoning",
    contextWindow: "200K",
    inputPrice: "$15",
    outputPrice: "$75",
    speed: "powerful",
    capabilities: ["vision", "tools", "thinking"],
  },
  {
    id: "haiku-4-5",
    name: "Claude Haiku 4.5",
    description: "Fastest model for lightweight tasks",
    contextWindow: "200K",
    inputPrice: "$0.80",
    outputPrice: "$4",
    speed: "fast",
    capabilities: ["vision", "tools"],
  },
];

const openaiModels: Model[] = [
  {
    id: "gpt-5",
    name: "GPT-5",
    description: "OpenAI's flagship reasoning model",
    contextWindow: "128K",
    inputPrice: "$5",
    outputPrice: "$20",
    speed: "powerful",
    capabilities: ["vision", "tools"],
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 Mini",
    description: "Lightweight and cost-efficient",
    contextWindow: "128K",
    inputPrice: "$0.50",
    outputPrice: "$2",
    speed: "fast",
    capabilities: ["tools"],
  },
];

export default function ModelsPage() {
  const [defaultModelId, setDefaultModelId] = useState("sonnet-5");
  const [anthropicConnected] = useState(true);
  const [openaiConnected, setOpenaiConnected] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Models</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose which AI models power your workspace and set your default.
        </p>
      </div>

      <ProviderSection
        providerName="Anthropic"
        connected={anthropicConnected}
        models={anthropicModels}
        defaultModelId={defaultModelId}
        onSetDefault={setDefaultModelId}
        onConnect={() => {}}
      />

      <ProviderSection
        providerName="OpenAI"
        connected={openaiConnected}
        models={openaiModels}
        defaultModelId={defaultModelId}
        onSetDefault={setDefaultModelId}
        onConnect={(key) => {
          console.log("connecting with key:", key);
          setOpenaiConnected(true);
        }}
      />
    </div>
  );
}