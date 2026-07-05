import { type ReactNode } from "react";
import { cn } from "../../../utils";
import { Button } from "../../actions";

export interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({
  isOpen = true,
  onClose,
  children,
  className,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      {/* Backgouind blur*/}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* container for children */}
      <div
        className={cn(
          "relative z-10 w-[calc(100%-2rem)] max-w-md h-auto max-h-[calc(100vh-4rem)] bg-surface-card border border-border-strong text-content-primary p-6 flex flex-col rounded-lg shadow-xl overflow-y-auto mx-4",
          className,
        )}
      >
        {/* Close button */}
        {onClose ? (
          <Button
            variant="ghost"
            onClick={onClose}
            className="absolute top-4 right-4 "
          >
            &times;
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={() => {
              window.history.back();
            }}
            className="absolute top-4 right-4 "
          >
            &times;
          </Button>
        )}

        {children}
      </div>
    </div>
  );
}
