import type React from "react";
import { useEffect } from "react";
import { cn } from "../../../utils";
import type { ToastVariant } from "./ToastContext";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  message: string;
  description?: string;
  onClose: (id: string) => void;
  variant?: ToastVariant;
  duration?: number;
}

const variantStyles = {
  success: {
    container: "bg-success-surface border-success-border",
    content: "text-success-content",
    dot: "bg-success-content",
  },
  warn: {
    container: "bg-warning-surface border-warning-border",
    content: "text-warning-content",
    dot: "bg-warning-content",
  },
  error: {
    container: "bg-error-surface border-error-border",
    content: "text-error-content",
    dot: "bg-error-content",
  },
};

export function Toast({
  id,
  message,
  onClose,
  variant = "success",
  description,
  duration = 5,
  className,
  ...props
}: ToastProps): React.ReactNode {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration * 1000);
    return () => clearTimeout(timer);
  }, [onClose, id, duration]);

  const styles = variantStyles[variant];

  return (
    <div
      id={id}
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-between p-3 rounded border shadow-sm transition-all duration-200 w-full max-w-sm",
        styles.container,
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-2.5">
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", styles.dot)} />
        <div className="flex flex-col">
          <span className={cn("text-xs font-semibold", styles.content)}>
            {message}
          </span>
          {description && (
            <span
              className={cn("text-[11px] opacity-80 mt-0.5", styles.content)}
            >
              {description}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onClose(id)}
        className={cn(
          "text-[10px] uppercase font-bold opacity-60 hover:opacity-100 transition-opacity cursor-pointer ml-4 shrink-0 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-current rounded px-1",
          styles.content,
        )}
      >
        Dismiss
      </button>
    </div>
  );
}
