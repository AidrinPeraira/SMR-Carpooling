import type { Meta, StoryObj } from "@storybook/react-vite";

import { CardFooter } from "./Card";

const meta = {
  component: CardFooter,
} satisfies Meta<typeof CardFooter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultCardFooter: Story = {
  args: {
    children: (
      <div className="w-full h-1.5 rounded-full overflow-hidden bg-surface-muted">
        <div className="h-full w-2/3 bg-accent" />
      </div>
    ),
  },
};
