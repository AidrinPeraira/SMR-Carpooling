import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toast, ToastProvider, useToast } from "./index";

const meta = {
  component: Toast,
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "warn", "error"],
    },
    onClose: { action: "closed" },
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

//component to test working trigger
function ToastDemo() {
  const toast = useToast();

  return (
    <div className="flex flex-wrap gap-4 p-8 bg-gray-950 rounded-xl border border-gray-800">
      <button
        type="button"
        onClick={() =>
          toast("Success: Pipeline synchronization complete", {
            variant: "success",
            description: "12 nodes updated in 43ms",
          })
        }
        className="px-4 py-2 text-sm font-semibold rounded cursor-pointer transition-all hover:opacity-90 active:scale-95 bg-success-surface border border-success-border text-success-content"
      >
        Trigger Success Toast
      </button>

      <button
        type="button"
        onClick={() =>
          toast("Warning: High memory thread consumption", {
            variant: "warn",
            description: "Resource utilization is at 92%",
          })
        }
        className="px-4 py-2 text-sm font-semibold rounded cursor-pointer transition-all hover:opacity-90 active:scale-95 bg-warning-surface border border-warning-border text-warning-content"
      >
        Trigger Warning Toast
      </button>

      <button
        type="button"
        onClick={() =>
          toast("Error: Migration execution faulted", {
            variant: "error",
            description: "Connection pool timeout reached",
          })
        }
        className="px-4 py-2 text-sm font-semibold rounded cursor-pointer transition-all hover:opacity-90 active:scale-95 bg-error-surface border border-error-border text-error-content"
      >
        Trigger Error Toast
      </button>
    </div>
  );
}

export const Success: Story = {
  args: {
    id: "1",
    variant: "success",
    message: "Success: Synchronization pipeline complete",
    onClose: (id: string) => console.log("Close clicked for id:", id),
  },
};

export const Warning: Story = {
  args: {
    id: "2",
    variant: "warn",
    message: "Warning: High memory thread consumption",
    onClose: (id: string) => console.log("Close clicked for id:", id),
  },
};

export const Error: Story = {
  args: {
    id: "3",
    variant: "error",
    message: "Error: Migration execution faulted",
    onClose: (id: string) => console.log("Close clicked for id:", id),
  },
};

export const WithDescription: Story = {
  args: {
    id: "4",
    variant: "success",
    message: "Data extraction completed",
    description: "Successfully parsed 154 blocks in 12ms",
    onClose: (id: string) => console.log("Close clicked for id:", id),
  },
};

export const InteractiveProvider: StoryObj = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};
