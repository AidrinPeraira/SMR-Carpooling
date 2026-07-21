import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./Button";

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Action",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Action",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Link",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Danger Action",
  },
};
