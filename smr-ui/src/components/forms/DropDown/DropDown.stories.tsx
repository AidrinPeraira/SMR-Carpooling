import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropDown } from "./DropDown";

const meta = {
  component: DropDown,
} satisfies Meta<typeof DropDown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "Option 1",
    options: [
      { label: "Option 1", value: "Option 1" },
      { label: "Option 2", value: "Option 2" },
      { label: "Option 3", value: "Option 3" },
    ],
  },
};
