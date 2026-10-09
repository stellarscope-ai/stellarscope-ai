"use client";

import { useState, type KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about Stellar activity..."
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none rounded-xl border border-gray-700 bg-[#0b0f1a] px-4 py-3 text-sm text-[#f8fafc] placeholder-gray-500 focus:border-[#6366f1] focus:outline-none focus:ring-1 focus:ring-[#6366f1] disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="rounded-xl bg-[#6366f1] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5558e6] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  );
}