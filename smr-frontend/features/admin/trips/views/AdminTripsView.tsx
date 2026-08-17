"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  AdminTripItemDTO,
  QueryDTO,
  SortOrder,
  TripStatus,
} from "@sharemyride/shared";
import { Button, Loader, Table, TableProps, Tag } from "@sharemyride/ui";
import { InlineError } from "@/components/InlineError";
import { Filter } from "@/components/UserInput/Filter";
import { Pagination } from "@/components/UserInput/Pagination";
import { Search } from "@/components/UserInput/Search";
import { Sort } from "@/components/UserInput/Sort";
import { getAllAdminTripsRequest } from "../api/requests/getAllAdminTripsRequest";

export function AdminTripsView() {
  const existingParams = useSearchParams();
  const router = useRouter();

  const searchValue = existingParams.get("search") || "";
  const filterField = existingParams.get("filterField");
  const filterValue = existingParams.get("filterValue");
  const sortField = existingParams.get("sortField");
  const sortValue = existingParams.get("sortValue") || existingParams.get("sortOrder");

  const page = existingParams.get("page") || "1";
  const limit = existingParams.get("limit") || "10";

  const queryParams: Record<string, string> = useMemo(() => {
    const query: Partial<Record<keyof QueryDTO<AdminTripItemDTO>, string>> = {};

    if (searchValue) {
      query.search = searchValue;
    }

    if (
      filterField &&
      filterValue &&
      filterField !== "None" &&
      filterValue !== "None"
    ) {
      query.filterField = filterField as keyof AdminTripItemDTO;
      query.filterValue = filterValue;
    }

    if (sortField) {
      query.sortField = sortField as keyof AdminTripItemDTO;
      query.sortValue = (sortValue as SortOrder) || SortOrder.ASC;
    }

    query.page = page;
    query.limit = limit;

    return query as Record<string, string>;
  }, [searchValue, filterField, filterValue, sortField, sortValue, page, limit]);

  const { isPending, error, data } = useQuery({
    queryKey: ["adminTrips", queryParams],
    queryFn: async () => {
      return await getAllAdminTripsRequest(queryParams);
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
    return <InlineError message={`Error fetching trips: ${String(error)}`} />;
  }

  if (!data || !data.success || !data.payload) {
    return (
      <InlineError
        message={`Response error occurred: ${data?.message || "Failed to load trips"}`}
      />
    );
  }

  const getStatusTag = (status: TripStatus) => {
    switch (status) {
      case TripStatus.ONGOING:
        return <Tag variant="accent">{status.toUpperCase()}</Tag>;
      case TripStatus.COMPLETED:
        return <Tag variant="accent">{status.toUpperCase()}</Tag>;
      case TripStatus.CANCELLED:
        return <Tag variant="muted" className="text-red-400 border-red-500/30">{status.toUpperCase()}</Tag>;
      case TripStatus.FULLY_BOOKED:
        return <Tag variant="muted" className="text-amber-400 border-amber-500/30">{status.toUpperCase()}</Tag>;
      case TripStatus.SCHEDULED:
      default:
        return <Tag variant="muted">{status.toUpperCase()}</Tag>;
    }
  };

  const tableData: TableProps<AdminTripItemDTO> = {
    data: data.payload.data ?? [],
    columnNames: [
      {
        headerName: "Trip ID",
        fieldName: "trip_id",
      },
      {
        headerName: "Driver Name",
        fieldName: "driver_name",
      },
      {
        headerName: "Vehicle",
        fieldName: "vehicle_name",
      },
      {
        headerName: "Origin -> Destination",
        customRender: (_v, row) => (
          <div className="text-xs">
            <span className="font-medium text-content-primary">{row.trip_origin}</span>
            <span className="mx-1 text-content-secondary">→</span>
            <span className="font-medium text-content-primary">{row.trip_destination}</span>
          </div>
        ),
      },
      {
        headerName: "Seats (Vacant / Avail)",
        customRender: (_v, row) => (
          <span>{row.vacant_seats} / {row.available_seats}</span>
        ),
      },
      {
        headerName: "Status",
        fieldName: "trip_status",
        customRender: (value) => getStatusTag(value as TripStatus),
      },
      {
        headerName: "Start Time",
        fieldName: "start_time",
        customRender: (value) =>
          value ? new Date(String(value)).toLocaleString() : "-",
      },
      {
        headerName: "Action",
        customRender: (_v, row) => (
          <Button
            onClick={() => router.push(`/admin/trips/${row.trip_id}`)}
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

  const filterFields = {
    tripStatus: [
      TripStatus.SCHEDULED,
      TripStatus.ONGOING,
      TripStatus.COMPLETED,
      TripStatus.FULLY_BOOKED,
      TripStatus.CANCELLED,
    ],
  };

  const sortFields = ["driverName", "vehicleName", "startTime", "tripStatus", "availableSeats", "vacantSeats"];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-content-primary">
        Trips Management
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
