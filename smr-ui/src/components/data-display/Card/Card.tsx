import React from "react";
import { cn } from "../../../utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}
export function Card({ children, className }: Props) {
  const styles =
    "border border-border-strong rounded-lg bg-surface-card p-5 shadow-sm overflow-hidden";
  return <div className={cn(styles, className)}>{children}</div>;
}

export function CardHeader({ children, className }: Props) {
  return <div className={cn("mb-1.5", className)}>{children}</div>;
}

export function CardBody({ children, className }: Props) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardFooter({ children, className }: Props) {
  return <div className={className}>{children}</div>;
}
