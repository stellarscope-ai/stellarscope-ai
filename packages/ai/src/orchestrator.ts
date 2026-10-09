import type { AIProvider, ChatMessage, ChatChunk, RegisteredTool } from "./types";

interface OrchestratorOptions {
  provider: AIProvider;
  systemPrompt?: string;
}

const DEFAULT_SYSTEM_PROMPT = `You are StellarScope AI, an assistant that helps users explore Stellar blockchain activity.

Rules:
- Only make claims supported by data returned from your tools.
- Always include source links (transaction hashes, account addresses) in your answers.
- If data is insufficient, say so clearly.
- Never invent balances, transaction hashes, or volume statistics.
- Define your metrics when answering analytical questions.`;

export function createOrchestrator(options: OrchestratorOptions) {
  const { provider, systemPrompt = DEFAULT_SYSTEM_PROMPT } = options;
  const tools: RegisteredTool[] = [];

  return {
    registerTool(tool: RegisteredTool) {
      tools.push(tool);
    },

    async *chat(userMessages: ChatMessage[]): AsyncIterable<ChatChunk> {
      const messages: ChatMessage[] = [
        { role: "system", content: systemPrompt },
        ...userMessages,
      ];

      const toolDefs = tools.map((t) => t.definition);

      for await (const chunk of provider.chat(messages, toolDefs)) {
        if (chunk.type === "tool_call" && chunk.toolCall) {
          const tool = tools.find((t) => t.definition.name === chunk.toolCall!.name);
          if (tool) {
            const args = JSON.parse(chunk.toolCall.arguments);
            const result = await tool.handler(args);
            messages.push({
              role: "assistant",
              content: "",
              toolCalls: [chunk.toolCall],
            });
            messages.push({
              role: "tool",
              content: result,
              toolCallId: chunk.toolCall.id,
            });

            yield* provider.chat(messages, toolDefs);
            return;
          }
        }

        yield chunk;
      }
    },
  };
}
