"use client";

import { ChatProvider } from "@/components/ai/chat/context/chat-provider";
import { ChatLayout } from "@/components/ai/chat/layout/chat-layout";
import { ChatHeader } from "@/components/ai/chat/layout/chat-header";
import { ChatEmptyState } from "@/components/ai/chat/empty/chat-empty-state";
import { ChatInput } from "@/components/ai/chat/input/chat-input";
import { Conversation } from "@/components/ai/chat/conversation/conversation";
import { useChat } from "@/components/ai/chat/hooks/use-chat";
import { useChatContext } from "@/components/ai/chat/context/use-chat-context";

function ChatPageContent() {
  const {
    messages,
    model,
    setModel,
    sendMessage,
    regenerate,
    stopGeneration,
    isGenerating,
  } = useChat();

  const { input, setInput } = useChatContext();

  const hasMessages = messages.length > 0;

  const handleSend = async (
    message: string,
    attachments: File[]
  ) => {
    await sendMessage(message, attachments);
  };

  return (
    <ChatLayout
      header={
        <ChatHeader
          model={model}
          onModelChange={setModel}
        />
      }
      body={
        hasMessages ? (
          <Conversation
            messages={messages}
            isGenerating={isGenerating}
            onRegenerate={regenerate}
          />
        ) : (
          <ChatEmptyState
            onSelectPrompt={setInput}
          />
        )
      }
      footer={
        <ChatInput
          model={model}
          onModelChange={setModel}
          value={input}
          onValueChange={setInput}
          onSend={handleSend}
          isGenerating={isGenerating}
          onStop={stopGeneration}
        />
      }
    />
  );
}

export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatPageContent />
    </ChatProvider>
  );
}