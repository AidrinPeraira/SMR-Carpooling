import type { ReactNode } from "react";
import { Button } from "../../actions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Drawer({ isOpen = false, onClose, children }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      <div
        className="relative bg-surface-sidebar flex flex-col h-full min-w-xs md:w-xs w-full border-l border-border-subtle shadow-2xl z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          className="absolute right-3.5 top-3 p-1 rounded hover:bg-surface-muted text-content-secondary cursor-pointer"
          onClick={onClose}
          aria-label="Close drawer"
        >
          &times;
        </Button>
        {children}
      </div>
    </div>
  );
}

export function DrawerHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex bg-surface-sidebar justify-between items-center w-full pt-4 pb-3 pr-12 px-4 border-b border-border-subtle">
      <h2 className="text-sm font-bold text-content-primary">{children}</h2>
    </div>
  );
}

export function DrawerBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col bg-surface-sidebar w-full py-4 px-4 gap-3 flex-1 overflow-y-auto">
      {children}
    </div>
  );
}

export function DrawerFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col w-full mt-auto pt-3 pb-3 px-4 border-t border-border-subtle bg-surface-sidebar">
      {children}
    </div>
  );
}
