import type { HTMLAttributes } from "react";
import { cn } from "../../../utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Loader({ className }: Props) {
  return (
    <div
      className={cn(
        "w-4 h-4  border-3 border-accent border-t-content-secondary rounded-full animate-spin",
        className,
      )}
    />
  );
}
