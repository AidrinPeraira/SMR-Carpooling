"use client";

import { SideNav, SideNavItem } from "@/components/SideNav";
import PortalNavbar from "@/components/PortalNavbar";
import { ReactNode } from "react";
import { User, ClipboardList, Star, Wallet } from "lucide-react";
import { logoutUserAction } from "@/features/auth/api/actions/LogoutUserAction";
import { useToast } from "@sharemyride/ui";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUserRequest } from "@/features/profile/api/requests/getUserRequest";
import { UserRole } from "@sharemyride/shared";

interface Props {
  children: ReactNode;
}

import { VoiceCallProvider } from "@/features/voice-call/context/VoiceCallContext";
import { CallModals } from "@/features/voice-call/components/CallModals";

export default function ProfileLayout({ children }: Props) {
  const toast = useToast();
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserRequest,
  });

  const activeRole: "passenger" | "driver" | undefined =
    user?.user_role === UserRole.DRIVER
      ? "driver"
      : user?.user_role === UserRole.PASSENGER
      ? "passenger"
      : undefined;

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
    <VoiceCallProvider>
      <div className="h-screen w-screen overflow-hidden">
        <SideNav
          items={profileNavItems}
          header={<PortalNavbar userRole={activeRole} />}
          onLogout={handleLogout}
        >
          {children}
        </SideNav>
      </div>
      <CallModals />
    </VoiceCallProvider>
  );
}


