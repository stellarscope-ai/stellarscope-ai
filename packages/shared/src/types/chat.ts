export interface ChatMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  toolCallId?: string;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: string;
}

export interface ChatResponse {
  message: ChatMessage;
  sources?: SourceLink[];
}

export interface SourceLink {
  label: string;
  url: string;
  type: "transaction" | "account" | "asset";
}
