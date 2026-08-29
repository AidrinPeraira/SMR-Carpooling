"use client";

import { useState } from "react";
import { Button, Input } from "@sharemyride/ui";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="flex gap-3 items-center p-4 border-t border-border-subtle bg-surface-secondary">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
        placeholder="Type a message..."
        className="flex-1 bg-surface-base rounded-full px-4 border-border-subtle focus-visible:ring-1 focus-visible:ring-accent"
      />
      <Button 
        onClick={handleSend} 
        disabled={!message.trim()}
        className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-accent text-surface-base hover:opacity-90 transition-opacity"
      >
        <SendHorizontal className="w-5 h-5" />
      </Button>
    </div>
  );
}
