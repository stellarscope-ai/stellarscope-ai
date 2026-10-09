import { ChatPanel } from "@/components/chat/ChatPanel";
import Link from "next/link";

export default function ChatPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-gray-800 px-6 py-3">
        <Link href="/" className="text-lg font-bold">
          <span className="bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">
            StellarScope AI
          </span>
        </Link>
        <span className="text-xs text-gray-500">Ask. Explore. Understand.</span>
      </header>
      <main className="flex-1 overflow-hidden">
        <ChatPanel />
      </main>
    </div>
  );
}