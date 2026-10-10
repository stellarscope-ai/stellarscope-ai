"use client";

import { useRef } from "react";

import { useChatContext } from "../context/use-chat-context";
import type { ChatMessage } from "../types";

export function useChat() {
  const {
    messages,
    setMessages,
    addMessage,
    clearMessages,

    model,
    setModel,

    isGenerating,
    setIsGenerating,
  } = useChatContext();

  const abortRef = useRef<AbortController | null>(null);

  const streamAssistant = async (history: ChatMessage[]) => {
    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      createdAt: new Date(),
      model,
      isStreaming: true,
    };

    addMessage(assistantMessage);
    setIsGenerating(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const payload = await res.json().catch(() => null);
        throw new Error(
          (payload as { error?: string } | null)?.error ??
            `Request failed with status ${res.status}`
        );
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          for (const line of event.split("\n")) {
            if (!line.startsWith("data:")) continue;

            let payload: { type?: string; content?: string };
            try {
              payload = JSON.parse(line.slice(5).trim());
            } catch {
              continue;
            }

            if (payload.type === "text" && payload.content) {
              const chunk = payload.content;
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === assistantMessage.id
                    ? { ...message, content: message.content + chunk }
                    : message
                )
              );
            } else if (payload.type === "error") {
              throw new Error(payload.content ?? "Stream error");
            }
          }
        }
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        const message = (error as Error).message || "Something went wrong";
        setMessages((prev) =>
          prev.map((entry) =>
            entry.id === assistantMessage.id
              ? {
                  ...entry,
                  content: entry.content || message,
                  error: !entry.content,
                }
              : entry
          )
        );
      }
    } finally {
      setMessages((prev) =>
        prev.map((entry) =>
          entry.id === assistantMessage.id
            ? { ...entry, isStreaming: false }
            : entry
        )
      );
      setIsGenerating(false);
      abortRef.current = null;
    }
  };

  const sendMessage = async (
    content: string,
    files: File[] = []
  ) => {
    if (!content.trim() && files.length === 0) return;
    if (isGenerating) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date(),

      attachments: files.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      })),
    };

    addMessage(userMessage);

    await streamAssistant([...messages, userMessage]);
  };

  const regenerate = async (messageId: string) => {
    if (isGenerating) return;

    const index = messages.findIndex((message) => message.id === messageId);
    if (index === -1) return;

    const history = messages
      .slice(0, index)
      .filter((message) => !message.error);

    await streamAssistant(history);
  };

  const stopGeneration = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsGenerating(false);
  };

  return {
    messages,

    model,
    setModel,

    isGenerating,

    sendMessage,

    regenerate,

    stopGeneration,

    clearConversation: clearMessages,
  };
}
