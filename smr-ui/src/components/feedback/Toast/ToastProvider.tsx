import { useRef, useState, type ReactNode } from "react";
import { toastContext, type ToastVariant } from "./ToastContext";
import { Toast } from "./Toast";

interface ToastMessage {
  id: string;
  message: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const count = useRef(0);

  function onClose(id: string) {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  function toast(
    message: string,
    options?: {
      variant?: ToastVariant;
      description?: string;
      duration?: number;
    },
  ) {
    count.current += 1;
    const id = String(count.current);
    const newMessage: ToastMessage = {
      id,
      message,
      description: options?.description,
      variant: options?.variant || "success",
      duration: options?.duration,
    };

    setToasts((p) => [...p, newMessage]);
  }

  return (
    <toastContext.Provider value={toast}>
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          return (
            <div key={toast.id} className="pointer-events-auto">
              <Toast
                id={toast.id}
                message={toast.message}
                description={toast.description}
                onClose={onClose}
                variant={toast.variant}
                duration={toast.duration}
              />
            </div>
          );
        })}
      </div>
      {children}
    </toastContext.Provider>
  );
}
