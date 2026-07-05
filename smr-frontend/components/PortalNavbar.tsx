"use client";

import { cn } from "@/lib/utils";
import {
  Avatar,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
} from "@smr/ui";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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

  // Detect role from route or prop
  const detectedRole =
    userRole || (pathname.startsWith("/driver") ? "driver" : "passenger");

  const user = {
    user_id: "123",
    first_name: "John",
    last_name: "Doe",
    user_role: detectedRole,
    profile_image: "https://i.pravatar.cc/300",
  };

  const activeStyles = "text-accent font-bold border-b border-accent ";

  const navLinks = [
    { name: "Home", href: `/${detectedRole}` },
    { name: "Trips", href: `/${detectedRole}/trips` },
    { name: "Requests", href: `/${detectedRole}/requests` },
    { name: "Profile", href: "/profile" },
  ];

  // Helper to determine active state
  const isLinkActive = (href: string) => {
    if (href === "/profile") {
      return pathname.startsWith("/profile");
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
          <div className="flex gap-2 m-2 justify-between items-center text-fg-secondary">
            <Avatar
              size="sm"
              src={user.profile_image}
              initials={user.first_name[0] + user.last_name[0]}
            />
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

        <div className="flex gap-1 m-2 justify-center items-center text-fg-secondary">
          <Avatar
            size="sm"
            src={user.profile_image}
            initials={user.first_name[0] + user.last_name[0]}
          />
        </div>
      </div>
    </>
  );
}
