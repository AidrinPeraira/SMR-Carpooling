import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./Input";

const meta = {
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  args: {
    type: "text",
    placeholder: "Input goes here...",
  },
};

export const EmailInput: Story = {
  args: {
    type: "email",
    placeholder: "Enter email id here",
  },
};

export const PasswordInput: Story = {
  args: {
    type: "password",
    placeholder: "Enter your password",
  },
};
