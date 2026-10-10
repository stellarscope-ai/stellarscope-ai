"use client";

import { conversations } from "@/lib/mock-data/conversations";

import { ChatLayout } from "@/components/ai/chat/layout/chat-layout";
import { ChatHeader } from "@/components/ai/chat/layout/chat-header";
import { Conversation } from "@/components/ai/chat/conversation/conversation";
import { ChatInput } from "@/components/ai/chat/input/chat-input";

const conversation = conversations[0];

export default function ChatConversationPage() {
  return (
    <ChatLayout
      header={
        <ChatHeader
          model={conversation.model}
          onModelChange={() => {}}
        />
      }
      body={
        <Conversation
          messages={conversation.messages}
          isGenerating={false}
          onRegenerate={() => {}}
        />
      }
      footer={
        <ChatInput
          model={conversation.model}
          onModelChange={() => {}}
          value=""
          onValueChange={() => {}}
          onSend={async () => {}}
          isGenerating={false}
          onStop={() => {}}
        />
      }
    />
  );
}