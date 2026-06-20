import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../../utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  inactive?: boolean;
}

export function Button({
  children,
  variant = "primary",
  className,
  inactive,
  disabled,
  ...rest
}: Props) {
  const isInactive = inactive || disabled;

  const commonStyles =
    "px-4 py-2 rounded h-fit text-sm font-semibold transition-all hover:enabled:opacity-80 enabled:cursor-pointer";

  let variantStyles = "bg-accent text-accent-fg";

  if (variant === "primary") {
    variantStyles = "bg-accent shadow-lg text-accent-fg";
  } else if (variant === "secondary") {
    variantStyles =
      "bg-surface-muted transition-all shadow-lg border border-border-strong text-content-primary";
  } else if (variant === "ghost") {
    variantStyles = "bg-surface-seconday text-content-secondary";
  } else if (variant === "danger") {
    variantStyles =
      "bg-error-surface text-error-content border border-error-border";
  }

  className = cn(
    commonStyles,
    variantStyles,
    isInactive && "btn-inactive",
    className,
  );

  return (
    <button className={className} disabled={isInactive} {...rest}>
      {children}
    </button>
  );
}
