import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../../utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export function Button({
  children,
  variant = "primary",
  className,
  ...rest
}: Props) {
  let styles = "px-4 py-2 rounded-lg text-xs font-medium shadow-lg";
  let theme = "bg-primary";

  className = cn(styles, theme, className);

  return (
    <>
      <button className={className} {...rest}>
        {children}
      </button>
    </>
  );
}
