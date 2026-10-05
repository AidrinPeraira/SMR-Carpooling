"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader } from "@sharemyride/ui";
import {
  ChatMessageDTO,
  SendChatMessageDTO,
  SocketEvents,
  SyncChatMessagesResponse,
} from "@sharemyride/shared";
import { ChatMessage } from "@/features/chat/components/ChatMessage";
import { ChatInput } from "@/features/chat/components/ChatInput";
import { getUserRequest } from "@/features/profile/api/requests/getUserRequest";
import { useQuery } from "@tanstack/react-query";
import { getChatHistory } from "@/features/chat/api/getChatHistory";
import { useChatSocket } from "@/features/realtime/hooks/useChatSocket";

export function TripChatView() {
  const { tripId: tripIdParam } = useParams<{ tripId: string }>();
  const searchParams = useSearchParams();
  const tripId = tripIdParam ?? searchParams.get("tripId")!;

  const [chatData, setChatData] = useState<SyncChatMessagesResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserRequest,
  });

  const chatSocket = useChatSocket();
  const chatDataRef = useRef(chatData);
  chatDataRef.current = chatData;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchChatHistory() {
      try {
        const data = await getChatHistory(tripId);
        if (!cancelled) setChatData(data);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchChatHistory();
    return () => {
      cancelled = true;
    };
  }, [tripId]);

  useEffect(() => {
    chatSocket.emit(SocketEvents.JOIN_CHAT, { trip_id: tripId });

    const onNewMessage = (data: ChatMessageDTO) => {
      const current = chatDataRef.current;
      if (!current) return;
      setChatData({ ...current, messages: [...current.messages, data] });
    };

    chatSocket.on(SocketEvents.NEW_MESSAGE, onNewMessage);

    return () => {
      chatSocket.off(SocketEvents.NEW_MESSAGE, onNewMessage);
      if (chatDataRef.current) {
        chatSocket.emit(SocketEvents.LEAVE_CHAT, {
          chat_id: chatDataRef.current.chat_id,
        });
      }
    };
  }, [chatSocket, tripId]);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.messages]);

  const handleSendMessage = useCallback(
    (message: string) => {
      if (!chatData) return;

      const newMessage: SendChatMessageDTO = {
        chat_id: chatData.chat_id,
        body: message,
      };

      chatSocket.emit(SocketEvents.SEND_MESSAGE, newMessage);
    },
    [chatSocket, chatData],
  );

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        <Loader />
        <p className="text-content-secondary text-sm mt-4">
          Connecting to chat...
        </p>
      </div>
    );
  }

  if (!chatData) {
    return <div>No chat data available</div>;
  }

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] w-full bg-surface-card rounded-lg overflow-hidden flex-1">
      <div className="p-4 border-b border-border-subtle bg-surface-secondary shadow-sm">
        <h2 className="text-lg font-bold text-content-primary">Trip Chat</h2>
        <p className="text-xs text-content-secondary">
          Connect with the passengers of this trip
        </p>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-surface-base"
      >
        {chatData.messages.length === 0 ? (
          <div className="text-center text-content-secondary mt-10 text-sm">
            No messages yet. Say hello!
          </div>
        ) : (
          chatData.messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isOwnMessage={
                msg.sender_name === user.first_name + " " + user.last_name
              }
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}
