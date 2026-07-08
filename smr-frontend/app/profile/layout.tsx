"use client";

import { SideNav, SideNavItem } from "@/components/SideNav";
import PortalNavbar from "@/components/PortalNavbar";
import { ReactNode } from "react";
import { User, ClipboardList, Star, Wallet } from "lucide-react";
import { logoutUserAction } from "@/features/auth/api/actions/LogoutUserAction";
import { useToast } from "@smr/ui";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default function ProfileLayout({ children }: Props) {
  const toast = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    const res = await logoutUserAction();
    if (res.success) {
      toast("Successfully logged out!", {
        variant: "success",
      });
      router.push("/");
    } else {
      toast("Failed to log out", {
        variant: "error",
      });
    }
  };

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
    <div className="h-screen w-screen overflow-hidden">
      <SideNav items={profileNavItems} header={<PortalNavbar />} onLogout={handleLogout}>
        {children}
      </SideNav>
    </div>
  );
}
