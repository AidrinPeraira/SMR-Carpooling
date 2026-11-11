"use client";

import { Button } from "@sharemyride/ui";
import { ArrowLeft, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export function ViewHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-2 w-full bg-surface-card border-b border-border-subtle shadow-sm h-14">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          className="p-2 rounded-full"
          onClick={() => router.back()}
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-content-primary" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-content-primary">
            En Route
          </span>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>
      </div>
      <Button
        variant="danger"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
      >
        <Phone className="w-3.5 h-3.5" />
        <span>SOS</span>
      </Button>
    </header>
  );
}
