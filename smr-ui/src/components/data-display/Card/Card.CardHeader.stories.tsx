import type { Meta, StoryObj } from "@storybook/react-vite";

import { CardHeader } from "./Card";

const meta = {
  component: CardHeader,
} satisfies Meta<typeof CardHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultCardHeader: Story = {
  args: {
    children: (
      <>
        <span className="text-[10px] uppercase font-bold tracking-wider text-content-secondary">
          DOMAIN LAYOUT LAYER
        </span>
        <h5 className="text-sm font-bold mt-1 text-content-primary">
          Modular Monolith Matrix
        </h5>
      </>
    ),
  },
};
