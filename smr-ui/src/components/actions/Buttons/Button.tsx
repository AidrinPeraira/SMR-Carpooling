import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../../utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({
  children,
  variant = "primary",
  className,
  ...rest
}: Props) {
  const commonStyles =
    "px-4 py-2 rounded h-fit text-sm font-semibold hover:opacity-80 cursor-pointer transition-all";

  let varaintStyles = "bg-accent text-accent-fg";

  if (variant == "primary") {
    varaintStyles = "bg-accent shadow-lg text-accent-fg";
  } else if (variant === "secondary") {
    varaintStyles =
      "bg-surface-muted hover:opacity-80 transition-all shadow-lg border border-border-strong text-content-primary";
  } else if (variant == "ghost") {
    varaintStyles = " bg-surface-seconday text-content-secondary ";
  } else if (variant == "danger") {
    varaintStyles =
      "bg-error-surface text-error-content border border-error-border";
  }

  className = cn(commonStyles, varaintStyles, className);

  return (
    <>
      <button className={className} {...rest}>
        {children}
      </button>
    </>
  );
}
