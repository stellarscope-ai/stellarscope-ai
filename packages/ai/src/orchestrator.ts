import type { AIProvider, ChatMessage, ChatChunk, RegisteredTool } from "./types";

interface OrchestratorOptions {
  provider: AIProvider;
  systemPrompt?: string;
  maxToolRounds?: number;
}

const DEFAULT_SYSTEM_PROMPT = `You are StellarScope AI, an assistant that helps users explore Stellar blockchain activity.

Rules:
- Only make claims supported by data returned from your tools.
- Always include source links (transaction hashes, account addresses) in your answers.
- If data is insufficient, say so clearly.
- Never invent balances, transaction hashes, or volume statistics.
- Define your metrics when answering analytical questions.
- Format your answers clearly with markdown when appropriate.
- When showing transaction links, use the explorerUrl from the tool response.`;

export function createOrchestrator(options: OrchestratorOptions) {
  const { provider, systemPrompt = DEFAULT_SYSTEM_PROMPT, maxToolRounds = 5 } = options;
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
      let rounds = 0;

      while (rounds < maxToolRounds) {
        rounds++;
        let hasToolCall = false;
        const newMessages: ChatMessage[] = [];

        for await (const chunk of provider.chat(messages, toolDefs)) {
          if (chunk.type === "tool_call" && chunk.toolCall) {
            hasToolCall = true;
            const tool = tools.find((t) => t.definition.name === chunk.toolCall!.name);

            if (tool) {
              const args = JSON.parse(chunk.toolCall.arguments);
              const result = await tool.handler(args);

              newMessages.push({
                role: "assistant",
                content: "",
                toolCalls: [chunk.toolCall],
              });
              newMessages.push({
                role: "tool",
                content: result,
                toolCallId: chunk.toolCall.id,
              });

              yield { type: "text", content: `\n\n[Fetching data for ${chunk.toolCall.name}...]\n\n` };
            } else {
              yield { type: "text", content: `[Unknown tool: ${chunk.toolCall.name}]` };
            }
          } else if (chunk.type === "text") {
            yield chunk;
          } else if (chunk.type === "done") {
            break;
          }
        }

        if (!hasToolCall) break;

        messages.push(...newMessages);
      }

      yield { type: "done" };
    },
  };
}