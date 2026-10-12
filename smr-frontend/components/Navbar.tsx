"use client";

import { Button } from "@sharemyride/ui";
import Image from "next/image";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/useTheme";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-full bg-surface-primary p-1 text-sm flex flex-row justify-between items-center">
      <div>
        <Image
          className="m-2 dark:hidden"
          src="/SMRFullTextLogoBlack.png"
          alt="Share My Ride logo"
          height={40}
          width={120}
        />
        <Image
          className="m-2 hidden dark:block"
          src="/SMRFullTextLogoWhite.png"
          alt="Share My Ride logo"
          height={40}
          width={120}
        />
      </div>
      <div className="flex gap-2 m-2 items-center">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-fg-secondary hover:bg-surface-secondary"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        <Link href="/auth/login">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href="/auth/signup">
          <Button variant="primary">Sign Up</Button>
        </Link>
      </div>
    </div>
  );
}
