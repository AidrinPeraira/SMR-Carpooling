import type { InputHTMLAttributes } from "react";
import { cn } from "../../../utils";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...rest }: Props) {
  const baseStyles =
    "bg-surface-card border border-border-strong shadow-sm rounded rounded-sm px-3 py-1.5 focus:outline-none w-full text-xs text-content-primary";
  return <input className={cn(baseStyles, className)} {...rest} />;
}
