import type { Meta, StoryObj } from "@storybook/react-vite";

import { CardBody } from "./Card";

const meta = {
  component: CardBody,
} satisfies Meta<typeof CardBody>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultCardBody: Story = {
  args: {
    children: (
      <>
        <p className="text-xs leading-relaxed text-content-secondary">
          Encapsulates bounded data context elements smoothly without
          architectural leaking thresholds.
        </p>
      </>
    ),
  },
};
