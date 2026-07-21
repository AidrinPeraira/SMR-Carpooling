import type { ReactNode } from "react";
import { cn } from "../../../utils/tailwind-merge";

interface SidebarProps {
  isCollapsed?: boolean;
  children?: ReactNode;
  className?: string;
}

export function Sidebar({ isCollapsed = true, children, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "h-screen border-r border-border-strong p-3 flex flex-col gap-3.5 bg-surface-sidebar text-content-primary transition-all duration-200 select-none",
        isCollapsed ? "w-14" : "w-56",
        className
      )}
    >
      {children}
    </aside>
  );
}

interface SidebarHeaderProps {
  isCollapsed?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

export function SidebarHeader({
  isCollapsed = true,
  icon,
  onClick,
  children,
  className,
}: SidebarHeaderProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 text-xs font-bold pb-2 border-b border-border-subtle text-content-primary w-full text-left cursor-pointer focus:outline-none hover:opacity-85 transition-opacity",
        isCollapsed && "justify-center",
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {!isCollapsed && <span className="truncate">{children}</span>}
    </button>
  );
}

interface SidebarBodyProps {
  children?: ReactNode;
  className?: string;
}

export function SidebarBody({ children, className }: SidebarBodyProps) {
  return (
    <nav className={cn("flex-1 overflow-y-auto space-y-3", className)}>
      {children}
    </nav>
  );
}

interface SidebarGroupProps {
  isCollapsed?: boolean;
  label?: string;
  children?: ReactNode;
  className?: string;
}

export function SidebarGroup({
  isCollapsed = true,
  label,
  children,
  className,
}: SidebarGroupProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && !isCollapsed && (
        <span className="px-2.5 text-[9px] font-bold uppercase tracking-wider block mb-1 text-content-tertiary truncate">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

interface SidebarItemProps {
  isCollapsed?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SidebarItem({
  isCollapsed = true,
  icon,
  children,
  active = false,
  onClick,
  className,
}: SidebarItemProps) {
  const styles = cn(
    "flex items-center gap-2 px-2.5 py-1.5 text-xs rounded transition-colors w-full text-left",
    active
      ? "bg-accent text-accent-fg font-semibold cursor-default shadow-sm"
      : "text-content-secondary hover:bg-surface-muted font-medium cursor-pointer",
    isCollapsed && "justify-center px-0",
    className
  );

  const renderedIcon = icon ? (
    <span className={cn("shrink-0", !active && "opacity-70")}>{icon}</span>
  ) : isCollapsed ? (
    <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-[10px] shrink-0 uppercase">
      {typeof children === "string" ? children.charAt(0) : "?"}
    </span>
  ) : null;

  const tooltipText = isCollapsed && typeof children === "string" ? children : undefined;

  return (
    <button onClick={onClick} className={styles} title={tooltipText}>
      {renderedIcon}
      {!isCollapsed && <span className="truncate">{children}</span>}
    </button>
  );
}

interface SidebarFooterProps {
  isCollapsed?: boolean;
  children?: ReactNode;
  className?: string;
}

export function SidebarFooter({
  isCollapsed = true,
  children,
  className,
}: SidebarFooterProps) {
  return (
    <div
      className={cn(
        "pt-2 border-t border-border-subtle mt-auto",
        isCollapsed && "flex justify-center",
        className
      )}
    >
      {children}
    </div>
  );
}
