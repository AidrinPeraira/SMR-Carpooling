"use client";

import { cn } from "@/lib/utils";
import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  useToast,
} from "@sharemyride/ui";
import { Menu, LogOut, User as UserIcon, Sun, Moon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { logoutUserAction } from "@/features/auth/api/actions/LogoutUserAction";
import { useQuery } from "@tanstack/react-query";
import { getUserRequest } from "@/features/profile/api/requests/getUserRequest";
import { useTheme } from "@/lib/useTheme";

interface PortalNavbarProps {
  showLogo?: boolean;
  userRole?: "passenger" | "driver";
}

export default function PortalNavbar({
  showLogo = true,
  userRole,
}: PortalNavbarProps) {
  const [sidebarOpen, setSideBarOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();

  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserRequest,
  });

  // Detect role from route or prop
  const detectedRole =
    userRole || (pathname.startsWith("/driver") ? "driver" : "passenger");

  const activeStyles = "text-accent font-bold border-b border-accent ";

  const navLinks = [
    { name: "Home", href: `/${detectedRole}` },
    { name: "Trips", href: `/${detectedRole}/trips` },
    { name: "Bookings", href: `/${detectedRole}/bookings` },
  ];

  const handleLogout = async () => {
    const res = await logoutUserAction();
    if (res.success) {
      toast("Successfully logged out!", { variant: "success" });
      router.push("/");
    } else {
      toast("Failed to log out", { variant: "error" });
    }
  };

  // Helper to determine active state
  const isLinkActive = (href: string) => {
    if (href === "/profile") {
      return pathname.startsWith("/profile");
    }
    if (href === `/${detectedRole}/trips`) {
      return pathname.startsWith(`/${detectedRole}/trips`);
    }

    if (href === `/${detectedRole}/bookings`) {
      return pathname.startsWith(`/${detectedRole}/bookings`);
    }

    return pathname === href;
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="text-fg-secondary flex flex-row items-center justify-between md:hidden p-2 px-4 bg-surface-primary z-20">
        {showLogo ? (
          <Link href={`/${detectedRole}`}>
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
          </Link>
        ) : (
          <div className="w-10" /> // Spacer
        )}
        <Menu
          onClick={() => {
            setSideBarOpen(true);
          }}
          className="cursor-pointer"
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer isOpen={sidebarOpen} onClose={() => setSideBarOpen(false)}>
        <DrawerHeader>
          {showLogo ? (
            <Link href={`/${detectedRole}`}>
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
            </Link>
          ) : (
            <span className="m-2 font-bold text-content-primary">Menu</span>
          )}
        </DrawerHeader>

        <DrawerBody>
          <div className="flex flex-col gap-2 text-bold text-fg-secondary">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-1",
                  isLinkActive(link.href) ? activeStyles : "",
                )}
                onClick={() => setSideBarOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </DrawerBody>

        <DrawerFooter>
          <div className="flex flex-col gap-2 m-2 text-fg-secondary">
            <div className="flex gap-2 items-center">
              <Avatar
                size="sm"
                src={user?.profile_image}
                initials={user ? user.first_name[0] + user.last_name[0] : ""}
              />
            </div>
            <Link
              href="/profile"
              className="flex items-center gap-2 px-1 py-1 text-sm hover:text-accent"
              onClick={() => setSideBarOpen(false)}
            >
              <UserIcon className="w-4 h-4" />
              Profile
            </Link>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-1 py-1 text-sm hover:text-accent text-left"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={() => {
                setSideBarOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-2 px-1 py-1 text-sm hover:text-accent text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </DrawerFooter>
      </Drawer>

      {/* Desktop Header */}
      <div className="md:flex hidden w-full bg-surface-primary p-1 text-sm flex flex-row justify-between items-center z-20">
        {showLogo ? (
          <Link href={`/${detectedRole}`}>
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
          </Link>
        ) : (
          /* Placeholder matching logo size and margin to ensure perfect alignment */
          <div className="w-[120px] m-2 shrink-0" />
        )}

        <div className="flex flex-row gap-2 text-bold text-fg-secondary">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "px-1",
                isLinkActive(link.href) ? activeStyles : "",
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="relative group flex gap-1 m-2 justify-center items-center text-fg-secondary">
          <Avatar
            size="sm"
            src={user?.profile_image}
            initials={user ? user.first_name[0] + user.last_name[0] : ""}
            className="cursor-pointer"
          />
          <div className="absolute right-0 top-full pt-1 hidden group-hover:block z-50">
            <div className="bg-surface-primary rounded-lg shadow-lg py-1 min-w-[160px]">
              <Link href="/profile">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-hover w-full text-left"
                >
                  <UserIcon className="w-4 h-4" />
                  Profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-hover w-full text-left"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-hover w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
