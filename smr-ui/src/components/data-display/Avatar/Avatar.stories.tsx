import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta = {
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InitialsAvatar: Story = {
  args: {
    src: "",
    size: "sm",
    initials: "AP",
    status: "online",
  },
};

export const ImageAvatar: Story = {
  args: {
    src: "https://picsum.photos/200",
    size: "md",
    alt: "Random picture from  lorem picsum",
    initials: "",
    status: "offline",
  },
};
