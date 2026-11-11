import { UIMessage, UseChatHelpers } from "@ai-sdk/react";
import { X, Send, Trash2 } from "lucide-react";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import AiMessage from "./AiMessage";

interface ChatPanelProps {
  chat: UseChatHelpers<UIMessage>;
  onClose: () => void;
  onClear: () => void;
}

export default function ChatPanel({ chat, onClose, onClear }: ChatPanelProps) {
  const [userInput, setUserInput] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [chat.messages]);

  useEffect(() => {
    console.log(chat.messages);
  }, [chat.messages]);

  function handleUserInputSubmit(e: SyntheticEvent) {
    e.preventDefault();

    if (!userInput.trim()) return;

    chat.sendMessage({ text: userInput });

    setUserInput("");
  }

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[400px] md:h-[600px] z-50 flex flex-col bg-surface-base md:rounded-2xl md:shadow-xl border border-border-subtle">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <h2 className="text-sm font-semibold text-content-primary">
          Trip Assistant
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={onClear}
            className="p-1 rounded-lg hover:bg-surface-muted text-content-secondary"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-muted text-content-secondary"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {chat.messages.length === 0 && (
          <p className="text-sm text-content-tertiary text-center mt-8">
            Ask me about trips, bookings, or anything else.
          </p>
        )}
        {chat.messages.map((message) =>
          message.role === "user" ? (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[80%] px-3 py-2 rounded-xl text-sm bg-accent text-accent-fg">
                {message.parts.map((part, i) =>
                  part.type === "text" ? (
                    <span key={i}>{part.text}</span>
                  ) : null,
                )}
              </div>
            </div>
          ) : (
            <div key={message.id} className="space-y-2">
              {message.parts
                .filter((p) => p.type === "dynamic-tool")
                .map((p) => {
                  const tool = p as {
                    type: "dynamic-tool";
                    toolName: string;
                    toolCallId: string;
                    state: string;
                    title?: string;
                  };
                  return (
                    <div
                      key={tool.toolCallId}
                      className="flex justify-start"
                    >
                      <div className="max-w-[80%] px-3 py-1.5 rounded-xl text-xs bg-surface-muted text-content-tertiary italic flex items-center gap-1.5">
                        <span>
                          {tool.state === "output-available"
                            ? "✓"
                            : "⏳"}
                        </span>
                        <span>{tool.title ?? tool.toolName}</span>
                      </div>
                    </div>
                  );
                })}
              {message.parts.some((p) => p.type === "text") && (
                <AiMessage
                  text={message.parts
                    .filter((p) => p.type === "text")
                    .map((p) => (p as { type: "text"; text: string }).text)
                    .join("")}
                />
              )}
            </div>
          ),
        )}
        {chat.status !== "ready" && !chat.error && chat.messages.length > 0 && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-xl text-sm bg-surface-muted text-content-tertiary">
              Thinking…
            </div>
          </div>
        )}
        {chat.error && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-3 py-2 rounded-xl text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              Something went wrong. Please try again.
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleUserInputSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t border-border-subtle"
      >
        <input
          placeholder="Ask something…"
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
          className="flex-1 text-sm bg-surface-muted rounded-xl px-3 py-2 outline-none text-content-primary placeholder:text-content-tertiary"
        />
        <button
          disabled={userInput == ""}
          className="p-2 rounded-xl bg-accent text-accent-fg disabled:opacity-40"
          type="submit"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
