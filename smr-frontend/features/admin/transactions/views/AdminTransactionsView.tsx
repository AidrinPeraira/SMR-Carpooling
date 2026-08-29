"use client";

import { Filter } from "@/components/UserInput/Filter";
import { InlineError } from "@/components/InlineError";
import { Pagination } from "@/components/UserInput/Pagination";
import { Search } from "@/components/UserInput/Search";
import { Sort } from "@/components/UserInput/Sort";
import { getTransactionsRequest } from "@/features/admin/transactions/api/requests/getTransactionsRequest";
import {
  AdminTransactionItemDTO,
  PaymentMethod,
  QueryDTO,
  SortOrder,
  TransactionCategory,
  TransactionType,
} from "@sharemyride/shared";
import { Loader, Table, TableProps, Tag } from "@sharemyride/ui";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function AdminTransactionsView() {
  const existingParams = useSearchParams();

  const searchValue = existingParams.get("search") || "";
  const filterField = existingParams.get("filterField");
  const filterValue = existingParams.get("filterValue");
  const sortField = existingParams.get("sortField");
  const sortValue = existingParams.get("sortValue");

  const page = existingParams.get("page") || "1";
  const limit = existingParams.get("limit") || "10";

  const queryParams: Record<string, string> = useMemo(() => {
    const query: Partial<Record<keyof QueryDTO<AdminTransactionItemDTO>, string>> =
      {};

    if (searchValue) {
      query.search = searchValue;
    }

    if (
      filterField &&
      filterValue &&
      filterField !== "None" &&
      filterValue !== "None"
    ) {
      query.filterField = filterField;
      query.filterValue = filterValue;
    }

    if (sortField) {
      query.sortField = sortField;

      if (sortValue) {
        query.sortValue = sortValue;
      } else {
        query.sortValue = SortOrder.DESC; // transactions are usually best viewed latest first
      }
    }

    query.page = page;
    query.limit = limit;

    return query;
  }, [
    searchValue,
    filterField,
    filterValue,
    sortField,
    sortValue,
    page,
    limit,
  ]);

  const { isPending, error, data } = useQuery({
    queryKey: ["adminTransactions", queryParams],
    queryFn: async () => {
      return await getTransactionsRequest(queryParams);
    },
    placeholderData: keepPreviousData,
    staleTime: process.env.NODE_ENV == "production" ? 60 * 10 : 0,
    gcTime: process.env.NODE_ENV == "production" ? 60 * 10 : 0,
  });

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <InlineError message={`Some error occured : ${error}`}></InlineError>
    );
  }

  if (!data.success || !data.payload) {
    return (
      <InlineError
        message={`Some response error occured : ${data.message}`}
      ></InlineError>
    );
  }

  const tableData: TableProps<AdminTransactionItemDTO> = {
    data: data.payload.data ?? [],
    columnNames: [
      {
        headerName: "Transaction ID",
        fieldName: "transaction_id",
        customRender: (value) => {
          // Truncate if it's too long to save space, but it's typically fine.
          const valStr = String(value);
          return <span>{valStr.length > 15 ? valStr.substring(0, 15) + "..." : valStr}</span>;
        }
      },
      {
        headerName: "Date",
        fieldName: "transaction_date",
        customRender: (value) => {
          return <span>{new Date(String(value)).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
          })}</span>;
        },
      },
      {
        headerName: "Amount",
        fieldName: "transaction_amount",
        customRender: (value, row) => {
          const formatted = Number(value).toFixed(2);
          const isCredit = row.transaction_type === TransactionType.CREDIT;
          return <span className={isCredit ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
            {isCredit ? "+" : "-"}${formatted}
          </span>;
        },
      },
      {
        headerName: "Creditor",
        fieldName: "creditor_name",
        customRender: (value) => {
          const valStr = String(value);
          return valStr === "SYSTEM" ? <Tag variant="accent">SYSTEM</Tag> : <span>{valStr.substring(0, 15)}</span>;
        },
      },
      {
        headerName: "Debitor",
        fieldName: "debitor_name",
        customRender: (value) => {
          const valStr = String(value);
          return valStr === "SYSTEM" ? <Tag variant="accent">SYSTEM</Tag> : <span>{valStr.substring(0, 15)}</span>;
        },
      },
      {
        headerName: "Type",
        fieldName: "transaction_type",
        customRender: (value) => {
          return <Tag>{String(value).toUpperCase()}</Tag>;
        },
      },
      {
        headerName: "Category",
        fieldName: "transaction_category",
        customRender: (value) => {
          return <Tag>{String(value).replace(/_/g, " ").toUpperCase()}</Tag>;
        },
      },
      {
        headerName: "Method",
        fieldName: "payment_method",
        customRender: (value) => {
          return <Tag>{String(value).replace(/_/g, " ").toUpperCase()}</Tag>;
        },
      },
    ],
  };

  const filterFields = {
    paymentMethod: Object.values(PaymentMethod),
    transactionType: Object.values(TransactionType),
    transactionCategory: Object.values(TransactionCategory),
  };

  const sortFields = [
    "transactionId",
    "createdAt",
    "amount",
    "paymentMethod",
    "transactionType",
    "transactionCategory",
  ];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-content-primary">
        Platform Transactions
      </h1>
      <div className="flex flex-wrap gap-4 items-center w-full justify-between">
        <div>
          <Search />
        </div>
        <div className="flex flex-col md:flex-row">
          <Filter filters={filterFields} />
          <Sort sortFields={sortFields} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table columnNames={tableData.columnNames} data={tableData.data} />
      </div>
      <Pagination
        currentPage={data.payload.paginationMeta.currentPage}
        totalPages={data.payload.paginationMeta.totalPages}
      />
    </div>
  );
}
