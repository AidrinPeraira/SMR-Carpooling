"use client";

import { Card, CardBody, Table, Tag } from "@sharemyride/ui";

interface Transaction {
  date: string;
  description: string;
  amount: string;
  status: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [];
// const MOCK_TRANSACTIONS: Transaction[] = [
//   {
//     date: "Oct 24, 2023",
//     description: "Trip Earning - #TRP-102",
//     amount: "+$14.20",
//     status: "Success",
//   },
//   {
//     date: "Oct 22, 2023",
//     description: "Trip Payment - #TRP-101",
//     amount: "-$12.50",
//     status: "Success",
//   },
// ];

export function TransactionDetailsCard() {
  const columns = [
    { headerName: "Date", fieldName: "date" as keyof Transaction },
    {
      headerName: "Description",
      fieldName: "description" as keyof Transaction,
    },
    {
      headerName: "Amount",
      fieldName: "amount" as keyof Transaction,
      customRender: (val: unknown) => {
        const amt = String(val);
        const isPositive = amt.startsWith("+");
        return (
          <span
            className={
              isPositive
                ? "text-accent font-bold"
                : "text-content-primary font-bold"
            }
          >
            {amt}
          </span>
        );
      },
    },
    {
      headerName: "Status",
      fieldName: "status" as keyof Transaction,
      customRender: (val: unknown) => (
        <Tag variant="accent" className="uppercase tracking-wider">
          {String(val)}
        </Tag>
      ),
    },
  ];

  return (
    <Card className="p-6">
      <CardBody className="mb-0">
        <h3 className="text-lg font-bold text-content-primary mb-6">
          User Transactions
        </h3>
        <Table columnNames={columns} data={MOCK_TRANSACTIONS} />
      </CardBody>
    </Card>
  );
}
