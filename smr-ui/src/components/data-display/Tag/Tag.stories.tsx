import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag } from "./Tag";

const meta = {
  component: Tag,
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Muted: Story = {
  args: {
    variant: "muted",
    children: "TypeScript Node",
  },
};

export const Accent: Story = {
  args: {
    variant: "accent",
    children: "Clean Architecture",
  },
};
