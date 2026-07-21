import type { LabelHTMLAttributes } from "react";
import { cn } from "../../../utils";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

export function Label({ className, children, ...rest }: Props) {
  const baseStyles = "block text-xs uppercase font-bold text-content-secondary";

  return (
    <label className={cn(baseStyles, className)} {...rest}>
      {children}
    </label>
  );
}
