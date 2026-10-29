"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ChatPanel from "@/features/ai-chat/components/ChatPanel";

export default function ChatWidget() {
  const [open, setOpen] = useState(true);
  const chat = useChat({
    transport: new DefaultChatTransport({
      api: "/api/assistant",
    }),
  });

  return (
    <>
      {open && (
        <ChatPanel
          chat={chat}
          onClose={() => setOpen(false)}
          onClear={() => chat.setMessages([])}
        />
      )}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-accent shadow-lg hover:opacity-90 transition-opacity"
        >
          <MessageCircle size={24} className="text-accent-fg" />
        </button>
      )}
    </>
  );
}
