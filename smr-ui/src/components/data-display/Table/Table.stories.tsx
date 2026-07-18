import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, type TableProps } from "./Table";
import { Button } from "../../actions";

interface SampleRow {
  domainContext: string;
  compilation: string;
}

const meta: Meta<TableProps<SampleRow>> = {
  component: Table,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultTable: Story = {
  args: {
    columnNames: [
      {
        headerName: "Domain Context",
        fieldName: "domainContext",
      },
      {
        headerName: "Compilation",
        fieldName: "compilation",
        customRender: (value) => (
          <span className="block font-semibold text-content-secondary">
            {String(value)}
          </span>
        ),
      },
      {
        headerName: "Action",
        align: "right",
        customRender: () => <Button>Click Me</Button>,
      },
    ],
    data: [
      {
        domainContext: "Nexus Application Pipeline",
        compilation: "Bound",
      },
      {
        domainContext: "CoReader Sandbox Asset",
        compilation: "Staged",
      },
    ],
  },
};
