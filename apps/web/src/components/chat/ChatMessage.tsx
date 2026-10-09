"use client";

interface ChatMessageProps {
  message: {
    role: "user" | "assistant";
    content: string;
    toolCalls?: string[];
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-[#6366f1] text-white"
            : "bg-[#1e1b4b] text-gray-200 border border-gray-800"
        }`}
      >
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {message.toolCalls.map((tool, i) => (
              <span
                key={i}
                className="inline-block rounded-full bg-[#06b6d4]/20 px-2 py-0.5 text-xs text-[#06b6d4]"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content || (
            <span className="animate-pulse text-gray-400">Thinking...</span>
          )}
        </div>
      </div>
    </div>
  );
}