"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserRequest } from "@/features/profile/api/requests/getUserRequest";
import { ChatMessageDTO } from "@sharemyride/shared";
import { SocketIOService } from "../services/SocketIOService";
import { ChatInput } from "../components/ChatInput";
import { ChatMessage } from "../components/ChatMessage";
import { Loader } from "@sharemyride/ui";

interface TripChatViewProps {
  chatId: string;
}

export function TripChatView({ chatId }: TripChatViewProps) {
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const socketServiceRef = useRef<SocketIOService | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserRequest,
  });

  useEffect(() => {
    if (!user?.user_id) return;

    // Use NEXT_PUBLIC_API_URL or fallback to gateway on localhost:4000
    const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    
    const service = new SocketIOService(url);
    service.connect(user.user_id);
    service.joinChat(chatId);
    service.syncHistory(chatId);
    
    service.onHistory((history) => {
      setMessages(history);
    });

    service.onMessage((msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketServiceRef.current = service;

    return () => {
      service.disconnect();
      socketServiceRef.current = null;
    };
  }, [user?.user_id, chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (body: string) => {
    if (socketServiceRef.current) {
      socketServiceRef.current.sendMessage(chatId, body);
    }
  };

  if (!user?.user_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        <Loader />
        <p className="text-content-secondary text-sm mt-4">Connecting to chat...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] w-full bg-surface-card rounded-lg overflow-hidden flex-1">
      <div className="p-4 border-b border-border-subtle bg-surface-secondary shadow-sm">
        <h2 className="text-lg font-bold text-content-primary">Trip Chat</h2>
        <p className="text-xs text-content-secondary">Connect with the passengers of this trip</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-surface-base" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="text-center text-content-secondary mt-10 text-sm">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              isOwnMessage={msg.sender_id === user.user_id} 
            />
          ))
        )}
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
