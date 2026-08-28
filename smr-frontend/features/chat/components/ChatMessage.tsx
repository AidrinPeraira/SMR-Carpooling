import { ChatMessageDTO } from "@sharemyride/shared";

interface ChatMessageProps {
  message: ChatMessageDTO;
  isOwnMessage: boolean;
}

export function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  const formattedTime = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex flex-col max-w-[85%] sm:max-w-[75%] mb-4 ${
        isOwnMessage ? "self-end items-end ml-auto" : "self-start items-start mr-auto"
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
        <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{message.body}</p>
      </div>
      <div className="text-[10px] text-content-tertiary mt-1.5 px-1">
        {formattedTime}
      </div>
    </div>
  );
}
