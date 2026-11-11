import type { Meta, StoryObj } from "@storybook/react-vite";
import { ItemsPerPage } from "./ItemsPerPage";

const meta: Meta<typeof ItemsPerPage> = {
  component: ItemsPerPage,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 10,
    totalItems: 100,
    onChange: (value: number) => {
      console.log("Items per page: ", value);
    },
  },
};
