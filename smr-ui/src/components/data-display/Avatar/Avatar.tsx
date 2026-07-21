import { cn } from "../../../utils";

interface Props {
  src?: string;
  alt?: string;
  initials?: string;
  status?: "online" | "offline" | "none";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({
  src,
  alt,
  initials,
  status = "none",
  className,
  size = "md",
}: Props) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-16 h-16 text-base",
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <div
        className={cn(
          "rounded-full border border-border-strong font-bold overflow-hidden bg-surface-muted text-content-primary flex items-center justify-center",
          sizes[size],
        )}
      >
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </div>

      {status !== "none" && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-surface-card",
            size === "lg" ? "h-4 w-4" : "h-3 w-3",
            status === "online" ? "bg-accent" : "bg-content-primary",
          )}
        />
      )}
    </div>
  );
}
