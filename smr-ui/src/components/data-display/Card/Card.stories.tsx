import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardBody, CardFooter, CardHeader } from "./Card";
import { DefaultCardHeader } from "./Card.CardHeader.stories";
import { DefaultCardBody } from "./Card.CardBody.stories";
import { DefaultCardFooter } from "./Card.CardFooter.stories";

const meta = {
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultCard: Story = {
  args: {
    className: "max-w-sm",
    children: (
      <>
        <CardHeader {...DefaultCardHeader.args} />
        <CardBody {...DefaultCardBody.args} />
        <CardFooter {...DefaultCardFooter.args} />
      </>
    ),
  },
};
