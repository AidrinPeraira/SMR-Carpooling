"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  AdminBookingItemDTO,
  BookingStatus,
  QueryDTO,
  SortOrder,
} from "@sharemyride/shared";
import { Button, Loader, Table, TableProps, Tag } from "@sharemyride/ui";
import { InlineError } from "@/components/InlineError";
import { Pagination } from "@/components/UserInput/Pagination";
import { Search } from "@/components/UserInput/Search";
import { Sort } from "@/components/UserInput/Sort";
import { getAllAdminBookingsRequest } from "../api/requests/getAllAdminBookingsRequest";

export function AdminBookingsView() {
  const existingParams = useSearchParams();
  const router = useRouter();

  const searchValue = existingParams.get("search") || "";
  const sortField = existingParams.get("sortField");
  const sortValue = existingParams.get("sortValue");

  const page = existingParams.get("page") || "1";
  const limit = existingParams.get("limit") || "10";

  const queryParams: Record<string, string> = useMemo(() => {
    const query: Partial<Record<keyof QueryDTO<AdminBookingItemDTO>, string>> = {};

    if (searchValue) {
      query.search = searchValue;
    }

    if (sortField) {
      query.sortField = sortField;
      query.sortValue = (sortValue as SortOrder) || SortOrder.ASC;
    }

    query.page = page;
    query.limit = limit;

    return query as Record<string, string>;
  }, [searchValue, sortField, sortValue, page, limit]);

  const { isPending, error, data } = useQuery({
    queryKey: ["adminBookings", queryParams],
    queryFn: async () => {
      return await getAllAdminBookingsRequest(queryParams);
    },
    placeholderData: keepPreviousData,
    staleTime: process.env.NODE_ENV === "production" ? 60 * 10 : 0,
    gcTime: process.env.NODE_ENV === "production" ? 60 * 10 : 0,
  });

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <InlineError message={`Error fetching bookings: ${String(error)}`} />;
  }

  if (!data || !data.success || !data.payload) {
    return (
      <InlineError
        message={`Response error occurred: ${data?.message || "Failed to load bookings"}`}
      />
    );
  }

  const getStatusTag = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return <Tag variant="accent">{status.toUpperCase()}</Tag>;
      case BookingStatus.REJECTED:
      case BookingStatus.CANCELLED:
        return <Tag variant="muted" className="text-red-400 border-red-500/30">{status.toUpperCase()}</Tag>;
      case BookingStatus.PAYMENT_PENDING:
      case BookingStatus.REQUESTED:
        return <Tag variant="muted" className="text-amber-400 border-amber-500/30">{status.toUpperCase()}</Tag>;
      case BookingStatus.WITHDRAWN:
      default:
        return <Tag variant="muted">{status.toUpperCase()}</Tag>;
    }
  };

  const tableData: TableProps<AdminBookingItemDTO> = {
    data: data.payload.data ?? [],
    columnNames: [
      {
        headerName: "Booking ID",
        fieldName: "booking_id",
      },
      {
        headerName: "Passenger",
        fieldName: "passenger_name",
      },
      {
        headerName: "Pickup -> DropOff",
        customRender: (_v, row) => (
          <div className="text-xs">
            <span className="font-medium text-content-primary">{row.booking_origin}</span>
            <span className="mx-1 text-content-secondary">→</span>
            <span className="font-medium text-content-primary">{row.booking_destination}</span>
          </div>
        ),
      },
      {
        headerName: "Status",
        fieldName: "status",
        customRender: (value) => getStatusTag(value as BookingStatus),
      },
      {
        headerName: "Trip Date",
        fieldName: "trip_date",
        customRender: (value) =>
          value ? new Date(String(value)).toLocaleString() : "-",
      },
      {
        headerName: "Action",
        customRender: (_v, row) => (
          <Button
            onClick={() => router.push(`/admin/bookings/${row.booking_id}`)}
            variant="ghost"
            className="text-xs"
          >
            View Details
          </Button>
        ),
        align: "right",
      },
    ],
  };

  const sortFields = ["passengerName", "tripDate", "status"];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-content-primary">
        Bookings Management
      </h1>
      <div className="flex flex-wrap gap-4 items-center w-full justify-between">
        <div>
          <Search />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
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
