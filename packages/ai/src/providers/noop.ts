import type { AIProvider, ChatMessage, ToolDefinition, ChatChunk } from "../types";

export class NoopProvider implements AIProvider {
  name = "noop";

  async *chat(messages: ChatMessage[], _tools?: ToolDefinition[]): AsyncIterable<ChatChunk> {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const response = lastUser
      ? `Echo: ${lastUser.content}`
      : "No user message found.";

    yield { type: "text", content: response };
    yield { type: "done" };
  }
}
