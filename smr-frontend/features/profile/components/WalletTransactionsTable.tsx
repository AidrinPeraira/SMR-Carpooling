import { TransactionType, WalletTransactionItemDTO } from "@sharemyride/shared";
import { Table, TableProps, Tag } from "@sharemyride/ui";

interface WalletTransactionsTableProps {
  transactions: WalletTransactionItemDTO[];
}

export function WalletTransactionsTable({
  transactions,
}: WalletTransactionsTableProps) {
  const tableData: TableProps<WalletTransactionItemDTO> = {
    data: transactions,
    columnNames: [
      {
        headerName: "Transaction ID",
        fieldName: "transaction_id",
      },
      {
        headerName: "Amount (₹)",
        fieldName: "amount",
        customRender: (value) => {
          return <div className="font-medium">{Number(value).toFixed(2)}</div>;
        },
      },
      {
        headerName: "Type",
        fieldName: "transaction_type",
        customRender: (value) => {
          const type = String(value);
          return (
            <Tag
              variant={
                type === TransactionType.CREDIT ? "success" : "danger"
              }
            >
              {type}
            </Tag>
          );
        },
      },
      {
        headerName: "Category",
        fieldName: "transaction_category",
        customRender: (value) => {
          return <Tag>{String(value).replace("_", " ")}</Tag>;
        },
      },
      {
        headerName: "Date",
        fieldName: "date",
        customRender: (value) => {
          return new Date(String(value)).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
    ],
  };

  return <Table columnNames={tableData.columnNames} data={tableData.data} />;
}
