export interface ChatMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  toolCallId?: string;
  toolCalls?: ToolCall[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: string;
}

export interface ChatChunk {
  type: "text" | "tool_call" | "done";
  content?: string;
  toolCall?: ToolCall;
}

export interface AIProvider {
  name: string;
  chat(messages: ChatMessage[], tools?: ToolDefinition[]): AsyncIterable<ChatChunk>;
}

export type ToolHandler = (args: Record<string, unknown>) => Promise<string>;

export interface RegisteredTool {
  definition: ToolDefinition;
  handler: ToolHandler;
}
