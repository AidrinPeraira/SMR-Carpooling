"use client";

import { Button, Card, Table, Tag, type Column } from "@sharemyride/ui";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AdminTransactionItemDTO, TransactionType } from "@sharemyride/shared";
import { getLatestTransactionsRequest } from "@/features/admin/dashboard/api/requests/getLatestTransactionsRequest";

const columns: Column<AdminTransactionItemDTO>[] = [
  {
    headerName: "Creditor",
    fieldName: "creditor_name",
  },
  {
    headerName: "Debitor",
    fieldName: "debitor_name",
  },
  {
    headerName: "Amount",
    fieldName: "transaction_amount",
    customRender: (value) => {
      const amount = Number(value);
      return <span className="font-medium">₹{amount.toLocaleString()}</span>;
    },
  },
  {
    headerName: "Type",
    fieldName: "transaction_type",
    customRender: (value) => {
      const type = value as TransactionType;
      const isCredit = type === TransactionType.CREDIT;
      return (
        <Tag
          variant={isCredit ? "accent" : "muted"}
          className={isCredit ? "" : "text-error-content border-error-border"}
        >
          {type.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    headerName: "Category",
    fieldName: "transaction_category",
    customRender: (value) => (
      <Tag variant="muted">
        {String(value).replace(/_/g, " ").toUpperCase()}
      </Tag>
    ),
  },
  {
    headerName: "Date",
    fieldName: "transaction_date",
    customRender: (value) =>
      value ? new Date(String(value)).toLocaleDateString() : "-",
  },
];

export function LatestTransactionsTable() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["adminLatestTransactions"],
    queryFn: getLatestTransactionsRequest,
  });

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-content-primary">
          Latest Transactions
        </h3>
        <Button
          variant="ghost"
          className="text-xs"
          onClick={() => router.push("/admin/transactions")}
        >
          View All
        </Button>
      </div>
      {isLoading ? (
        <div className="h-48 bg-surface-muted rounded-lg animate-pulse" />
      ) : (
        <Table columnNames={columns} data={data ?? []} />
      )}
    </Card>
  );
}
