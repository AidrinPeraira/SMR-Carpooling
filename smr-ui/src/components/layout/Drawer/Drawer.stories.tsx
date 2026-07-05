import type { Meta, StoryObj } from "@storybook/react-vite";
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader } from "./Drawer";
import { useState } from "react";
import { Button } from "../../actions";

const meta = {
  component: Drawer,
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: (
      <>
        <DrawerHeader>System Configuration</DrawerHeader>
        <DrawerBody>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-content-primary mb-1">
                Instance Profile
              </h4>
              <p className="text-xs text-content-secondary leading-relaxed">
                Configure primary nodes and encapsulation pathways within the
                current active workspace.
              </p>
            </div>
            <div className="h-32 bg-surface-muted rounded border border-border-subtle p-3 flex flex-col justify-center items-center text-center text-xs text-content-tertiary">
              <svg
                className="w-8 h-8 mb-2 opacity-60"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
              <span>Scrollable sandbox canvas</span>
            </div>
          </div>
        </DrawerBody>
        <DrawerFooter>
          <div className="flex justify-end gap-2.5">
            <Button variant="secondary" onClick={() => {}}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => {}}>
              Save Changes
            </Button>
          </div>
        </DrawerFooter>
      </>
    ),
  },
};

function DrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Drawer Demo</Button>
      <Drawer
        isOpen={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DrawerHeader>Interactive Session</DrawerHeader>
        <DrawerBody>
          <div className="space-y-4">
            <p className="text-xs text-content-secondary leading-relaxed">
              This interactive instance demonstrates sticky headers/footers. If
              you add multiple blocks of content, this body area will scroll
              independently.
            </p>
            <div className="space-y-2">
              <div className="h-20 bg-surface-muted border border-border-subtle rounded p-3 text-xs text-content-secondary">
                Data Node A
              </div>
              <div className="h-20 bg-surface-muted border border-border-subtle rounded p-3 text-xs text-content-secondary">
                Data Node B
              </div>
              <div className="h-20 bg-surface-muted border border-border-subtle rounded p-3 text-xs text-content-secondary">
                Data Node C
              </div>
            </div>
          </div>
        </DrawerBody>
        <DrawerFooter>
          <div className="flex justify-end gap-2.5">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Proceed
            </Button>
          </div>
        </DrawerFooter>
      </Drawer>
    </div>
  );
}

export const Interactive: StoryObj = {
  render: () => <DrawerDemo />,
};
