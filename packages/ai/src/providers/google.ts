import type { AIProvider, ChatMessage, ToolDefinition, ChatChunk } from "../types";

type GeminiModel = {
  generateContentStream: (params: unknown) => AsyncIterable<unknown>;
};

export class GoogleAIProvider implements AIProvider {
  name = "google";
  private model: GeminiModel | null = null;
  private apiKey: string;

  constructor(apiKey?: string) {
    const key = apiKey ?? (typeof process !== "undefined" ? process.env.GOOGLE_AI_API_KEY : undefined);
    if (!key) {
      throw new Error("GOOGLE_AI_API_KEY is required");
    }
    this.apiKey = key;
  }

  private getModel(): GeminiModel {
    if (this.model) return this.model;

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) as GeminiModel;
      return this.model;
    } catch {
      throw new Error("@google/generative-ai is not installed. Run: pnpm add @google/generative-ai");
    }
  }

  async *chat(messages: ChatMessage[], tools?: ToolDefinition[]): AsyncIterable<ChatChunk> {
    const model = this.getModel();

    const geminiMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const systemInstruction = messages.find((m) => m.role === "system")?.content;

    const toolConfig = tools && tools.length > 0
      ? {
          functionDeclarations: tools.map((t) => ({
            name: t.name,
            description: t.description,
            parameters: t.parameters,
          })),
        }
      : undefined;

    const request: Record<string, unknown> = {
      contents: geminiMessages,
      ...(systemInstruction && { systemInstruction: { parts: [{ text: systemInstruction }] } }),
      ...(toolConfig && { tools: [toolConfig] }),
    };

    try {
      const result = await model.generateContentStream(request);

      for await (const chunk of result) {
        const c = chunk as Record<string, unknown>;
        const candidates = c.candidates as Array<Record<string, unknown>> | undefined;
        if (!candidates || candidates.length === 0) continue;

        const content = candidates[0].content as Record<string, unknown> | undefined;
        if (!content) continue;

        const parts = content.parts as Array<Record<string, unknown>> | undefined;
        if (!parts) continue;

        for (const part of parts) {
          if (part.text) {
            yield { type: "text", content: part.text as string };
          }

          if (part.functionCall) {
            const fc = part.functionCall as Record<string, unknown>;
            yield {
              type: "tool_call",
              toolCall: {
                id: `call_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                name: fc.name as string,
                arguments: JSON.stringify(fc.args ?? {}),
              },
            };
          }
        }
      }

      yield { type: "done" };
    } catch (err) {
      const error = err as { message?: string };
      yield { type: "text", content: `Error: ${error.message ?? "Failed to get response from AI"}` };
      yield { type: "done" };
    }
  }
}