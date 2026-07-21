import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  component: Breadcrumb,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    path: "/rides/smr-102",
  },
};
