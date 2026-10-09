"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

interface Message {
  role: "user" | "assistant";
  content: string;
  toolCalls?: string[];
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (content: string) => {
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const assistantMessage: Message = { role: "assistant", content: "", toolCalls: [] };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === "text" && data.content) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  last.content += data.content;
                }
                return updated;
              });
            } else if (data.type === "tool_call") {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant" && last.toolCalls) {
                  last.toolCalls.push(data.name);
                }
                return updated;
              });
            } else if (data.type === "error") {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === "assistant") {
                  last.content = `Error: ${data.content}`;
                }
                return updated;
              });
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant") {
          last.content = `Failed to get response: ${(err as Error).message}`;
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">Ask about Stellar activity</p>
              <p className="mt-1 text-sm">
                Try: &quot;What is the balance of account GBX...&quot;
              </p>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-800 p-4">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}