import ReactMarkdown from "react-markdown";

interface AiMessageProps {
  text: string;
}

export default function AiMessage({ text }: AiMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[80%] px-3 py-2 rounded-xl text-sm bg-surface-muted text-content-primary">
        <ReactMarkdown
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
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
