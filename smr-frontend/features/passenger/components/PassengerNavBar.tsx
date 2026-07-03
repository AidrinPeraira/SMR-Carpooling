"use client";

import { cn } from "@/lib/utils";
import { UserRole } from "@smr/shared";
import {
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
} from "@smr/ui";
import { Menu, PowerCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function PassengerNavBar() {
  const [sidebarOpen, setSideBarOpen] = useState<boolean>(false);

  const pathname = usePathname();

  const user = {
    user_id: "123",
    first_name: "John",
    last_name: "Doe",
    user_role: UserRole.PASSENGER,
    profile_image: "https://i.pravatar.cc/300",
  };

  const activeStyles = "text-accent font-bold border-b border-accent ";

  if (sidebarOpen) {
    return (
      <div>
        <Drawer isOpen={sidebarOpen} onClose={() => setSideBarOpen(false)}>
          <DrawerHeader>
            <Link href="/passenger">
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
          </DrawerHeader>

          <DrawerBody>
            <div className="flex flex-col gap-2 text-bold text-fg-secondary">
              <Link
                href={"/passenger"}
                className={cn(
                  "px-1",
                  pathname == "/passenger" ? activeStyles : "",
                )}
              >
                Home
              </Link>
              <Link
                href={"/passenger/trips"}
                className={cn(
                  "px-1",
                  pathname == "/passenger/trips" ? activeStyles : "",
                )}
              >
                Trips
              </Link>
              <Link
                href={"/passenger/requests"}
                className={cn(
                  "px-1",
                  pathname == "/passenger/requests" ? activeStyles : "",
                )}
              >
                Requests
              </Link>
              <Link
                href={"/profile"}
                className={cn(
                  "px-1",
                  pathname == "/profile" ? activeStyles : "",
                )}
              >
                Profile
              </Link>
            </div>
          </DrawerBody>

          <DrawerFooter>
            <div className="flex gap-2 m-2 justify-between items-center text-fg-secondary gap-3">
              <Avatar
                size="sm"
                src={user.profile_image}
                initials={user.first_name[0] + user.last_name[0]}
              />

              <Button variant="ghost" className="p-0">
                <PowerCircle />{" "}
              </Button>
            </div>
          </DrawerFooter>
        </Drawer>
      </div>
    );
  }

  return (
    <>
      <div className="text-fg-secondary flex felx-row items-center justify-between md:hidden p-2 px-4">
        <Link href="/passenger">
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
        <Menu
          onClick={() => {
            setSideBarOpen(true);
          }}
        />
      </div>
      <div
        className="
    md:flex hidden w-full bg-surface-primary p-1 text-sm flex flex-row justify-between items-center"
      >
        <Link href="/passenger">
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
        <div className="flex flex-row gap-2 text-bold text-fg-secondary">
          <Link
            href={"/passenger"}
            className={cn("px-1", pathname == "/passenger" ? activeStyles : "")}
          >
            Home
          </Link>
          <Link
            href={"/passenger/trips"}
            className={cn(
              "px-1",
              pathname == "/passenger/trips" ? activeStyles : "",
            )}
          >
            Trips
          </Link>
          <Link
            href={"/passenger/requests"}
            className={cn(
              "px-1",
              pathname == "/passenger/requests" ? activeStyles : "",
            )}
          >
            Requests
          </Link>
          <Link
            href={"/profile"}
            className={cn("px-1", pathname == "/profile" ? activeStyles : "")}
          >
            Profile
          </Link>
        </div>
        <div className="flex gap-1 m-2 justify-center items-center text-fg-secondary gap-3">
          <Avatar
            size="sm"
            src={user.profile_image}
            initials={user.first_name[0] + user.last_name[0]}
          />
          <Button variant="ghost" className="p-0">
            <PowerCircle />{" "}
          </Button>
        </div>
      </div>
    </>
  );
}
