import type { AIProvider, ChatMessage, ToolDefinition, ChatChunk } from "../types";

export class GoogleAIProvider implements AIProvider {
  name = "google";
  private model: unknown;

  constructor(apiKey?: string) {
    const key = apiKey ?? (typeof process !== "undefined" ? process.env.GOOGLE_AI_API_KEY : undefined);
    if (!key) {
      throw new Error("GOOGLE_AI_API_KEY is required");
    }

    this.initModel(key);
  }

  private initModel(apiKey: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch {
      throw new Error("@google/generative-ai is not installed. Run: pnpm add @google/generative-ai");
    }
  }

  async *chat(messages: ChatMessage[], tools?: ToolDefinition[]): AsyncIterable<ChatChunk> {
    // Implementation will be added in Phase 4
    yield { type: "text", content: "Google AI provider not yet implemented." };
    yield { type: "done" };
  }
}
