"use client";

import { SideNav, SideNavItem } from "@/components/SideNav";
import PortalNavbar from "@/components/PortalNavbar";
import { ReactNode } from "react";
import { User, ClipboardList, Star, Wallet } from "lucide-react";

interface Props {
  children: ReactNode;
}

export default function ProfileLayout({ children }: Props) {
  const profileNavItems: SideNavItem[] = [
    {
      name: "Profile Info",
      href: "/profile",
      icon: <User className="w-4 h-4" />,
    },
    {
      name: "Applications",
      href: "/profile/applications",
      icon: <ClipboardList className="w-4 h-4" />,
    },
    {
      name: "Ratings & Reviews",
      href: "/profile/ratings",
      icon: <Star className="w-4 h-4" />,
    },
    {
      name: "Wallet & Transactions",
      href: "/profile/wallet",
      icon: <Wallet className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-surface-base">
      <PortalNavbar />
      <div className="flex-1 min-h-0">
        <SideNav items={profileNavItems}>
          {children}
        </SideNav>
      </div>
    </div>
  );
}
