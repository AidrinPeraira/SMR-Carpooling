import { cn } from "@smr/ui";
import Link from "next/link";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "py-12 bg-surface-secondary flex flex-col items-center justify-center text-center gap-2",
        className
      )}
    >
      <h2 className="text-lg font-bold text-fg-primary">Share My Ride</h2>
      <p className="text-fg-secondary text-sm">
        Portfolio project by{" "}
        <Link
          className="font-bold hover:text-fg-primary transition-colors"
          href="https://www.aidrinperaira.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Aidrin Peraira
        </Link>
      </p>
    </footer>
  );
}
