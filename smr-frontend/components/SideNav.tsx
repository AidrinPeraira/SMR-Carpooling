"use client";

import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
} from "@smr/ui";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";

export interface SideNavItem {
  name: string;
  href: string;
  icon: ReactNode;
}

export interface SideNavGroup {
  label?: string;
  items: SideNavItem[];
}

interface SideNavProps {
  groups?: SideNavGroup[];
  items?: SideNavItem[];
  onLogout?: () => void;
  children: ReactNode;
}

export function SideNav({ groups, items, onLogout, children }: SideNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();

  // Normalize groups
  const navGroups: SideNavGroup[] = [
    ...(items && items.length > 0 ? [{ items }] : []),
    ...(groups || []),
  ];

  // Get all hrefs to compute the best match for active state
  const allHrefs = navGroups.flatMap((group) => group.items.map((item) => item.href));

  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} className="shrink-0 bg-surface-primary border-r-0">
        <SidebarHeader
          isCollapsed={isCollapsed}
          onClick={() => setIsCollapsed(!isCollapsed)}
          icon={isCollapsed ? <ChevronRight className="w-5 h-5" /> : undefined}
          className="h-10 flex items-center border-b border-border-subtle mb-2"
        >
          <div className="flex items-center justify-between w-full pr-1">
            <span className="text-xs font-semibold text-content-secondary">Collapse</span>
            <ChevronLeft className="w-5 h-5 text-content-secondary" />
          </div>
        </SidebarHeader>

        <SidebarBody>
          {navGroups.map((group, groupIdx) => (
            <SidebarGroup
              key={groupIdx}
              isCollapsed={isCollapsed}
              label={group.label}
            >
              {group.items.map((item, itemIdx) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : (pathname === item.href || pathname.startsWith(item.href + "/")) &&
                      !allHrefs.some(
                        (otherHref) =>
                          otherHref !== item.href &&
                          otherHref !== "/" &&
                          otherHref.length > item.href.length &&
                          (pathname === otherHref || pathname.startsWith(otherHref + "/"))
                      );
                return (
                  <SidebarItem
                    key={itemIdx}
                    isCollapsed={isCollapsed}
                    icon={item.icon}
                    href={item.href}
                    active={isActive}
                  >
                    {item.name}
                  </SidebarItem>
                );
              })}
            </SidebarGroup>
          ))}
        </SidebarBody>

        <SidebarFooter isCollapsed={isCollapsed}>
          <SidebarItem
            isCollapsed={isCollapsed}
            icon={<LogOut className="w-4 h-4 text-fg-danger" />}
            onClick={onLogout}
            className="text-fg-danger hover:bg-error-surface hover:text-error-content"
          >
            Logout
          </SidebarItem>
        </SidebarFooter>
      </Sidebar>

      <main 
        className="flex-1 min-w-0 overflow-y-auto bg-surface-base"
        style={{ boxShadow: "inset 4px 4px 8px -2px rgba(0, 0, 0, 0.06)" }}
      >
        {children}
      </main>
    </div>
  );
}
