import React from "react";
import { cn } from "../../../utils";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "muted" | "accent";
}

export function Tag({
  children,
  variant = "muted",
  className,
  ...rest
}: TagProps) {
  const baseStyles =
    "px-2 py-0.5 rounded text-[10px] font-medium inline-block h-fit w-fit";

  const variants = {
    muted: "border border-border-strong bg-surface-muted text-content-primary",
    accent: "bg-accent text-accent-fg",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...rest}>
      {children}
    </span>
  );
}
