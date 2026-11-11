import { AlertCircle } from "lucide-react";
import { Button } from "@sharemyride/ui";

/**
 * Reusable inline error element to show error messages when requests fail.
 */
export function InlineError({
  message,
  title = "Failed to load content",
  onRetry,
  className = "",
}: {
  message: string;
  title?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`w-full min-h-[350px] flex items-center justify-center p-6 ${className}`}
    >
      <div className="max-w-md w-full bg-surface-card border border-error-border rounded-xl p-6 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-error-surface text-error-content flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-content-primary">
            {title}
          </h3>
          <p className="text-xs text-content-secondary leading-relaxed">
            {message}
          </p>
        </div>
        {onRetry && (
          <div className="pt-2">
            <Button
              variant="secondary"
              onClick={onRetry}
              className="text-xs py-1.5 px-4 inline-flex items-center gap-1.5"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
