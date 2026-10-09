import { describe, it, expect } from "vitest";
import { createOrchestrator } from "../orchestrator";
import { NoopProvider } from "../providers/noop";

describe("orchestrator", () => {
  it("creates an orchestrator with noop provider", () => {
    const orchestrator = createOrchestrator({ provider: new NoopProvider() });
    expect(orchestrator).toBeDefined();
    expect(orchestrator.chat).toBeTypeOf("function");
  });

  it("streams chat responses", async () => {
    const orchestrator = createOrchestrator({ provider: new NoopProvider() });
    const chunks: string[] = [];

    for await (const chunk of orchestrator.chat([
      { role: "user", content: "Hello" },
    ])) {
      if (chunk.content) chunks.push(chunk.content);
    }

    expect(chunks.join("")).toContain("Hello");
  });
});
