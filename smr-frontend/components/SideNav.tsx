"use client";

import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
} from "@sharemyride/ui";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  header?: ReactNode;
  children: ReactNode;
}

export function SideNav({ groups, items, onLogout, header, children }: SideNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  // Normalize groups
  const navGroups: SideNavGroup[] = [
    ...(items && items.length > 0 ? [{ items }] : []),
    ...(groups || []),
  ];

  // Get all hrefs to compute the best match for active state
  const allHrefs = navGroups.flatMap((group) => group.items.map((item) => item.href));

  return (
    <div className="flex h-full w-full overflow-hidden bg-surface-primary">
      <Sidebar
        isCollapsed={isCollapsed}
        className={cn(
          "shrink-0 bg-surface-primary border-r-0 transition-all duration-500 ease-out",
          !animateIn && "w-0 p-0 border-r-0 opacity-0 -translate-x-full overflow-hidden"
        )}
      >
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
                  <Link key={itemIdx} href={item.href} className="block w-full">
                    <SidebarItem
                      isCollapsed={isCollapsed}
                      icon={item.icon}
                      active={isActive}
                    >
                      {item.name}
                    </SidebarItem>
                  </Link>
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

      {/* Right Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {header}
        
        {/* Canvas Padding Wrapper */}
        <div className={`flex-1 min-h-0 w-full pr-4 pb-4 ${header ? "pt-0" : "pt-4"}`}>
          {/* Page Canvas (Card) */}
          <main 
            className="h-full w-full overflow-y-auto bg-surface-base rounded-2xl"
            style={{ 
              boxShadow: "inset 4px 4px 10px -2px rgba(0, 0, 0, 0.06), inset -4px -4px 10px -2px rgba(0, 0, 0, 0.04)" 
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
