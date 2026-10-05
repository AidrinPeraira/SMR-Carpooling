import { ChatMessageDTO } from "@sharemyride/shared";

interface ChatMessageProps {
  message: Pick<ChatMessageDTO, "id" | "body" | "sender_name">;
  isOwnMessage: boolean;
}

export function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  return (
    <div
      className={`flex flex-col max-w-[85%] sm:max-w-[75%] mb-4 ${
        isOwnMessage
          ? "self-end items-end ml-auto"
          : "self-start items-start mr-auto"
      }`}
    >
      <div className="text-xs text-content-tertiary mb-1 px-1 font-medium">
        {isOwnMessage ? "You" : message.sender_name}
      </div>
      <div
        className={`px-4 py-2.5 rounded-2xl shadow-sm ${
          isOwnMessage
            ? "bg-accent text-surface-base rounded-br-sm"
            : "bg-surface-card text-content-primary border border-border-subtle rounded-bl-sm"
        }`}
      >
        <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">
          {message.body}
        </p>
      </div>
    </div>
  );
}
