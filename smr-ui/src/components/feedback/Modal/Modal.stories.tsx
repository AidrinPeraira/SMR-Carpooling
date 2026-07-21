import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "./Modal";

const meta = {
  component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: (
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold mb-1">Dummy Modal Title</h3>
          <p className="text-xs text-content-secondary">
            This is a dummy body rendering inside the simplified Modal
            container.
          </p>
        </div>
        <div className="pt-2 border-t border-border-subtle flex justify-end gap-2">
          <button className="px-3 py-1 text-xs rounded border border-border-strong hover:bg-surface-muted transition-colors cursor-pointer">
            Cancel
          </button>
          <button className="px-3 py-1 text-xs rounded bg-accent text-accent-fg hover:opacity-90 transition-colors cursor-pointer">
            Confirm
          </button>
        </div>
      </div>
    ),
  },
};
