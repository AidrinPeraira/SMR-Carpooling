import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Dialog } from "./Dialog";
import { Button } from "../../actions";

const meta = {
  component: Dialog,
  argTypes: {
    confirmAction: { action: "confirmed" },
    rejectAction: { action: "rejected" },
    onClose: { action: "closed" },
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    header: "Do you wish to proceed?",
    description: "Submitting this action will cause the following action.",
  },
};

function DialogDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        header="Confirm Action"
        description="Are you sure you want to proceed with this operation? This action cannot be undone."
        confirmAction={() => {
          console.log("Confirmed!");
          setIsOpen(false);
        }}
        rejectAction={() => {
          console.log("Rejected!");
          setIsOpen(false);
        }}
      />
    </div>
  );
}

export const Interactive: StoryObj = {
  render: () => <DialogDemo />,
};
