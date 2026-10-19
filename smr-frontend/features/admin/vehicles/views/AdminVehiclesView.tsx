"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  AdminVehicleRecordResult,
  QueryDTO,
  SortOrder,
  VehicleTypes,
} from "@sharemyride/shared";
import { Button, Loader, Table, TableProps, Tag } from "@sharemyride/ui";
import { InlineError } from "@/components/InlineError";
import { Filter } from "@/components/UserInput/Filter";
import { ItemsPerPage } from "@/components/UserInput/ItemsPerPage";
import { Pagination } from "@/components/UserInput/Pagination";
import { Search } from "@/components/UserInput/Search";
import { Sort } from "@/components/UserInput/Sort";
import { getAdminVehicleRecordsRequest } from "../api/requests/getAdminVehicleRecordsRequest";

export function AdminVehiclesView() {
  const existingParams = useSearchParams();
  const router = useRouter();

  const searchValue = existingParams.get("search") || "";
  const filterField = existingParams.get("filterField");
  const filterValue = existingParams.get("filterValue");
  const sortField = existingParams.get("sortField");
  const sortValue =
    existingParams.get("sortValue") || existingParams.get("sortOrder");

  const page = existingParams.get("page") || "1";
  const limit = existingParams.get("limit") || "10";

  const queryParams: Record<string, string> = useMemo(() => {
    const query: Partial<
      Record<keyof QueryDTO<AdminVehicleRecordResult>, string>
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
      query.filterField = filterField as keyof AdminVehicleRecordResult;
      query.filterValue = filterValue;
    }

    if (sortField) {
      query.sortField = sortField as keyof AdminVehicleRecordResult;
      query.sortValue = (sortValue as SortOrder) || SortOrder.ASC;
    }

    query.page = page;
    query.limit = limit;

    return query as Record<string, string>;
  }, [searchValue, filterField, filterValue, sortField, sortValue, page, limit]);

  const { isPending, error, data } = useQuery({
    queryKey: ["adminVehicleRecords", queryParams],
    queryFn: async () => {
      return await getAdminVehicleRecordsRequest(queryParams);
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
    return (
      <InlineError message={`Error fetching vehicles: ${String(error)}`} />
    );
  }

  if (!data || !data.success || !data.payload) {
    return (
      <InlineError
        message={`Response error occurred: ${data?.message || "Failed to load vehicles"}`}
      />
    );
  }

  const tableData: TableProps<AdminVehicleRecordResult> = {
    data: data.payload.data ?? [],
    columnNames: [
      {
        headerName: "Registration No.",
        fieldName: "registration_number",
      },
      {
        headerName: "Make & Model",
        customRender: (_v, row) => (
          <span className="font-medium text-content-primary">
            {row.vehicle_make} {row.vehicle_model}
          </span>
        ),
      },
      {
        headerName: "Vehicle Type",
        fieldName: "vehicle_type",
        customRender: (value) => (
          <Tag>{String(value).replace(/_/g, " ").toUpperCase()}</Tag>
        ),
      },
      {
        headerName: "Capacity",
        fieldName: "vehicle_capacity",
      },
      {
        headerName: "Reg. Expiry",
        fieldName: "registration_expiry",
        customRender: (value) =>
          value ? new Date(String(value)).toLocaleDateString() : "-",
      },
      {
        headerName: "Insurance Expiry",
        fieldName: "insurance_expiry",
        customRender: (value) =>
          value ? new Date(String(value)).toLocaleDateString() : "-",
      },
      {
        headerName: "Action",
        customRender: (_v, row) => (
          <Button
            onClick={() => router.push(`/admin/vehicles/${row.record_id}`)}
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
    vehicleType: [VehicleTypes.SEDAN, VehicleTypes.SUV, VehicleTypes.HATCHBACK],
  };

  const sortFields = [
    "vehicleMake",
    "vehicleModel",
    "vehicleType",
    "registrationExpiry",
    "insuranceExpiry",
  ];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-content-primary">
        Vehicles Management
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
      <div className="flex items-center justify-between">
        <ItemsPerPage totalItems={data.payload.paginationMeta.totalItems} />
        <Pagination
          currentPage={data.payload.paginationMeta.currentPage}
          totalPages={data.payload.paginationMeta.totalPages}
        />
      </div>
    </div>
  );
}
