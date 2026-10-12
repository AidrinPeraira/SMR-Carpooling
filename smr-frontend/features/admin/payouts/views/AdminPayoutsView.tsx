"use client";

import { Filter } from "@/components/UserInput/Filter";
import { InlineError } from "@/components/InlineError";
import { Pagination } from "@/components/UserInput/Pagination";
import { Search } from "@/components/UserInput/Search";
import { Sort } from "@/components/UserInput/Sort";
import { getAllPayoutsRequest } from "@/features/admin/payouts/api/requests/getAllPayoutsRequest";
import { approvePayoutRequest } from "@/features/admin/payouts/api/requests/approvePayoutRequest";
import {
  GetPayoutsResult,
  PayoutItemDTO,
  PayoutStatus,
  QueryDTO,
  SortOrder,
} from "@sharemyride/shared";
import {
  Button,
  Dialog,
  Loader,
  Table,
  TableProps,
  Tag,
  useToast,
} from "@sharemyride/ui";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function AdminPayoutsView() {
  const existingParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    header: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    header: "",
    description: "",
    onConfirm: () => {},
  });

  const searchValue = existingParams.get("search") || "";
  const filterField = existingParams.get("filterField");
  const filterValue = existingParams.get("filterValue");
  const sortField = existingParams.get("sortField");
  const sortValue = existingParams.get("sortOrder");

  const page = existingParams.get("page") || "1";
  const limit = existingParams.get("limit") || "10";

  const queryParams: Record<string, string> = useMemo(() => {
    const query: Partial<Record<keyof QueryDTO<GetPayoutsResult>, string>> = {};

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
        query.sortValue = SortOrder.ASC;
      }
    }

    query.page = page;
    query.limit = limit;

    return query;
  }, [searchValue, filterField, filterValue, sortField, sortValue, page, limit]);

  const { isPending, error, data } = useQuery({
    queryKey: ["allPayouts", queryParams],
    queryFn: async () => {
      return await getAllPayoutsRequest(
        queryParams,
        searchValue ? ["payoutId", "tripId"] : undefined,
      );
    },
    placeholderData: keepPreviousData,
    staleTime: process.env.NODE_ENV == "production" ? 60 * 10 : 0,
    gcTime: process.env.NODE_ENV == "production" ? 60 * 10 : 0,
  });

  const approveMutation = useMutation({
    mutationFn: approvePayoutRequest,
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["allPayouts"] });
        toast("Payout completed and credited to wallet", {
          variant: "success",
        });
      } else {
        toast(res.message || "Failed to process payout", { variant: "error" });
      }
    },
    onError: (err) => {
      toast(err?.message || "Failed to process payout", { variant: "error" });
    },
  });

  const handleApproveClick = (payout: PayoutItemDTO) => {
    setDialogState({
      isOpen: true,
      header: "Process Payout",
      description: `Are you sure you want to process this payout of ₹${payout.payable.toFixed(2)} for driver ${payout.driver_id}? This will credit the amount to the driver's wallet.`,
      onConfirm: () => {
        approveMutation.mutate(payout.payout_id);
        setDialogState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

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

  const getStatusTag = (status: PayoutStatus) => {
    switch (status) {
      case PayoutStatus.PENDING:
        return (
          <Tag
            variant="muted"
            className="bg-warning-surface text-warning-content border border-warning-border uppercase tracking-wider"
          >
            Pending
          </Tag>
        );
      case PayoutStatus.COMPLETED:
        return (
          <Tag variant="accent" className="uppercase tracking-wider">
            Completed
          </Tag>
        );
      default:
        return (
          <Tag variant="muted" className="uppercase tracking-wider">
            {status}
          </Tag>
        );
    }
  };

  const tableData: TableProps<PayoutItemDTO> = {
    data: data.payload.payouts.data ?? [],
    columnNames: [
      {
        headerName: "Payout ID",
        fieldName: "payout_id",
      },
      {
        headerName: "Trip ID",
        fieldName: "trip_id",
      },
      {
        headerName: "Amount",
        fieldName: "amount",
        customRender: (value) => `₹${Number(value).toFixed(2)}`,
        align: "right",
      },
      {
        headerName: "Commission",
        fieldName: "commision",
        customRender: (value) => `₹${Number(value).toFixed(2)}`,
        align: "right",
      },
      {
        headerName: "Payable",
        fieldName: "payable",
        customRender: (value) => `₹${Number(value).toFixed(2)}`,
        align: "right",
      },
      {
        headerName: "Status",
        fieldName: "status",
        customRender: (value) => getStatusTag(value as PayoutStatus),
      },
      {
        headerName: "Created At",
        fieldName: "created_at",
        customRender: (value) => {
          const d = new Date(value as string);
          return d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          });
        },
      },
      {
        headerName: "Action",
        customRender: (_v, row) => {
          return (
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => router.push(`/admin/payouts/${row.payout_id}`)}
                variant="ghost"
                className="text-xs"
              >
                View Details
              </Button>
              {row.status === PayoutStatus.PENDING && (
                <Button
                  onClick={() => handleApproveClick(row)}
                  variant="primary"
                  className="text-xs"
                  disabled={approveMutation.isPending}
                >
                  {approveMutation.isPending ? (
                    <Loader className="w-3.5 h-3.5 border-t-white" />
                  ) : (
                    "Process"
                  )}
                </Button>
              )}
            </div>
          );
        },
        align: "right",
      },
    ],
  };

  const filterFields = {
    status: [PayoutStatus.PENDING, PayoutStatus.COMPLETED],
  };

  const sortFields = ["createdAt", "amount", "payable"];

  return (
    <>
      <div className="p-8 space-y-6">
        <h1 className="text-2xl font-bold text-content-primary">
          Payout Management
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
          currentPage={data.payload.payouts.paginationMeta.currentPage}
          totalPages={data.payload.payouts.paginationMeta.totalPages}
        />
      </div>

      <Dialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        header={dialogState.header}
        description={dialogState.description}
        confirmAction={dialogState.onConfirm}
        rejectAction={() =>
          setDialogState((prev) => ({ ...prev, isOpen: false }))
        }
      />
    </>
  );
}
