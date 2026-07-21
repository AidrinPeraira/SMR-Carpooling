"use client";

import { SideNav } from "@/components/SideNav";
import { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Car,
  Compass,
  Settings,
} from "lucide-react";
import { logoutUserAction } from "@/features/auth/api/actions/LogoutUserAction";
import { useToast } from "@sharemyride/ui";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
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

  const adminItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
  ];

  const adminGroups = [
    {
      label: "Management",
      items: [
        {
          name: "Users",
          href: "/admin/users",
          icon: <Users className="w-4 h-4" />,
        },
        {
          name: "Applications",
          href: "/admin/applications",
          icon: <ClipboardList className="w-4 h-4" />,
        },
        {
          name: "Vehicles",
          href: "/admin/vehicles",
          icon: <Car className="w-4 h-4" />,
        },
        {
          name: "Trips",
          href: "/admin/trips",
          icon: <Compass className="w-4 h-4" />,
        },
      ],
    },
    {
      label: "System",
      items: [
        {
          name: "Settings",
          href: "/admin/settings",
          icon: <Settings className="w-4 h-4" />,
        },
      ],
    },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden">
      <SideNav items={adminItems} groups={adminGroups} onLogout={handleLogout}>
        {children}
      </SideNav>
    </div>
  );
}
