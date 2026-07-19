import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentPage: 5,
    totalPages: 6,
    onSelect: (page: number) => {
      console.log("Setting page: ", page);
    },
  },
};
