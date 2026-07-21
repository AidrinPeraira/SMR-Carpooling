import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarGroup,
  SidebarItem,
  SidebarFooter,
} from "./Sidebar";

const meta = {
  component: Sidebar,
  subcomponents: {
    SidebarHeader,
    SidebarBody,
    SidebarGroup,
    SidebarItem,
    SidebarFooter,
  },
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

function SidebarStory() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Sidebar isCollapsed={isCollapsed}>
      <SidebarHeader
        isCollapsed={isCollapsed}
        onClick={() => setIsCollapsed(!isCollapsed)}
        icon={
          <div className="w-2.5 h-2.5 rounded-full bg-accent shrink-0" />
        }
      >
        smr-ui Pipeline
      </SidebarHeader>
      <SidebarBody>
        {/* Ungrouped Item */}
        <SidebarGroup isCollapsed={isCollapsed}>
          <SidebarItem
            isCollapsed={isCollapsed}
            icon={
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
          >
            Dashboard
          </SidebarItem>
        </SidebarGroup>

        {/* Group 1 */}
        <SidebarGroup isCollapsed={isCollapsed} label="Bounded Contexts">
          <SidebarItem
            isCollapsed={isCollapsed}
            active
            icon={
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          >
            Domain Models
          </SidebarItem>
          <SidebarItem
            isCollapsed={isCollapsed}
            icon={
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          >
            Infrastructure
          </SidebarItem>
        </SidebarGroup>

        {/* Group 2 */}
        <SidebarGroup isCollapsed={isCollapsed} label="Engine">
          <SidebarItem
            isCollapsed={isCollapsed}
            icon={
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2 0 0 24 24"
                viewBox="0 0 24 24"
              >
                <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          >
            Presentation
          </SidebarItem>
        </SidebarGroup>
      </SidebarBody>
      <SidebarFooter isCollapsed={isCollapsed}>
        <span className="text-[10px] text-content-secondary">v1.0.0 Stable</span>
      </SidebarFooter>
    </Sidebar>
  );
}

export const Default: Story = {
  render: () => <SidebarStory />,
};
