"use client";

import { useRef, useEffect, useState } from "react";
import { X, Send, Trash2 } from "lucide-react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";

interface ChatPanelProps {
  chat: UseChatHelpers<UIMessage>;
  onClose: () => void;
  onClear: () => void;
}

export default function ChatPanel({ chat, onClose, onClear }: ChatPanelProps) {
  const { messages, sendMessage, status } = chat;
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status === "ready") {
      sendMessage({ text: input });
      setInput("");
    }
  };

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
        {messages.length === 0 && (
          <p className="text-sm text-content-tertiary text-center mt-8">
            Ask me about trips, bookings, or anything else.
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                message.role === "user"
                  ? "bg-accent text-accent-fg"
                  : "bg-surface-muted text-content-primary"
              }`}
            >
              {message.parts.map((part, i) =>
                part.type === "text" ? (
                  message.role === "user" ? (
                    <span key={i}>{part.text}</span>
                  ) : (
                    <ReactMarkdown
                      key={i}
                      components={{
                        a: ({ children, href }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-accent"
                          >
                            {children}
                          </a>
                        ),
                        p: ({ children }) => (
                          <p className="mb-1 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc ml-4 mb-1">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal ml-4 mb-1">{children}</ol>
                        ),
                        code: ({ children }) => (
                          <code className="bg-surface-base px-1 rounded text-xs">
                            {children}
                          </code>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold">{children}</strong>
                        ),
                      }}
                    >
                      {part.text}
                    </ReactMarkdown>
                  )
                ) : null,
              )}
            </div>
          </div>
        ))}
        {status !== "ready" && messages.length > 0 && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-xl text-sm bg-surface-muted text-content-tertiary">
              Thinking…
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t border-border-subtle"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something…"
          className="flex-1 text-sm bg-surface-muted rounded-xl px-3 py-2 outline-none text-content-primary placeholder:text-content-tertiary"
        />
        <button
          type="submit"
          disabled={status !== "ready" || !input.trim()}
          className="p-2 rounded-xl bg-accent text-accent-fg disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
