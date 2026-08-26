"use client";

import { Filter } from "@/components/UserInput/Filter";
import { Pagination } from "@/components/UserInput/Pagination";
import { Search } from "@/components/UserInput/Search";
import { Sort } from "@/components/UserInput/Sort";
import { getWalletTransactionsRequest } from "@/features/profile/api/requests/getWalletTransactionsRequest";
import { WalletTransactionsTable } from "@/features/profile/components/WalletTransactionsTable";
import {
  GetWalletTransactionsResult,
  QueryDTO,
  SortOrder,
  TransactionCategory,
  TransactionType,
} from "@sharemyride/shared";
import { Loader, useToast } from "@sharemyride/ui";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

export function WalletTransactionsView() {
  const existingParams = useSearchParams();
  const toast = useToast();

  const searchValue = existingParams.get("search") || "";
  const filterField = existingParams.get("filterField");
  const filterValue = existingParams.get("filterValue");
  const sortField = existingParams.get("sortField");
  const sortValue = existingParams.get("sortValue");

  const page = existingParams.get("page") || "1";
  const limit = existingParams.get("limit") || "10";

  const queryParams: Record<string, string> = useMemo(() => {
    const query: Partial<
      Record<keyof QueryDTO<GetWalletTransactionsResult>, string>
    > = {};

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
        query.sortValue = SortOrder.DESC;
      }
    }

    query.page = page;
    query.limit = limit;

    return query as Record<string, string>;
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
    queryKey: ["walletTransactions", queryParams],
    queryFn: async () => {
      return await getWalletTransactionsRequest(queryParams);
    },
    placeholderData: keepPreviousData,
    staleTime: process.env.NODE_ENV == "production" ? 60 * 10 : 0,
    gcTime: process.env.NODE_ENV == "production" ? 60 * 10 : 0,
  });

  useEffect(() => {
    if (error) {
      toast(`Failed to load transactions: ${String(error)}`, {
        variant: "error",
      });
    } else if (data && (!data.success || !data.payload)) {
      toast(data.message || "Failed to load transactions", {
        variant: "error",
      });
    }
  }, [error, data, toast]);

  if (isPending) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const filterFields = {
    transactionType: Object.values(TransactionType),
    transactionCategory: Object.values(TransactionCategory),
  };

  const sortFields = [
    "date",
    "amount",
    "transactionType",
    "transactionCategory",
  ];

  const transactions = data?.payload?.transactions?.data || [];
  const paginationMeta = data?.payload?.transactions?.paginationMeta || {
    currentPage: 1,
    totalPages: 1,
  };
  const walletBalance = data?.payload?.wallet_balance || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-content-surface border border-border-default rounded-xl">
        <div>
          <h2 className="text-sm font-medium text-content-secondary uppercase tracking-wider mb-1">
            Current Balance
          </h2>
          <div className="text-3xl font-bold text-content-primary">
            ₹ {walletBalance.toFixed(2)}
          </div>
        </div>
      </div>

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
        {transactions.length > 0 ? (
          <WalletTransactionsTable transactions={transactions} />
        ) : (
          <div className="w-full py-12 flex flex-col items-center justify-center bg-content-surface border border-border-default rounded-xl">
            <p className="text-content-secondary font-medium">
              No transactions available.
            </p>
          </div>
        )}
      </div>

      {transactions.length > 0 && (
        <Pagination
          currentPage={paginationMeta.currentPage}
          totalPages={paginationMeta.totalPages}
        />
      )}
    </div>
  );
}
