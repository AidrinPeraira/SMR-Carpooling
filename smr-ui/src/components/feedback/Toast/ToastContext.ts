import { createContext, useContext } from "react";

export type ToastVariant = "success" | "warn" | "error";

type ToastContextType = (
  message: string,
  options?: { variant?: ToastVariant; description?: string; duration?: number },
) => void;

export const toastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const toast = useContext(toastContext);
  if (!toast) {
    throw new Error("useToast must be called inside ToastProvider");
  }
  return toast;
}
