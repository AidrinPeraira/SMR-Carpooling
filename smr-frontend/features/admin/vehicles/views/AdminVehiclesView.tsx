"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { VehicleListResult } from "@sharemyride/shared";
import { Button, Loader, Table, TableProps, Tag } from "@sharemyride/ui";
import { InlineError } from "@/components/InlineError";
import { Search } from "@/components/UserInput/Search";
import { getAdminVehiclesRequest } from "../api/requests/getAdminVehiclesRequest";

export function AdminVehiclesView() {
  const existingParams = useSearchParams();
  const router = useRouter();

  const searchValue = (existingParams.get("search") || "").toLowerCase();

  const { isPending, error, data } = useQuery({
    queryKey: ["adminVehicles"],
    queryFn: async () => {
      return await getAdminVehiclesRequest();
    },
    placeholderData: keepPreviousData,
    staleTime: process.env.NODE_ENV === "production" ? 60 * 10 : 0,
    gcTime: process.env.NODE_ENV === "production" ? 60 * 10 : 0,
  });

  const filteredVehicles = useMemo(() => {
    const vehicles =
      data && data.success && data.payload?.vehicles
        ? data.payload.vehicles
        : [];
    if (!vehicles.length) return [];
    if (!searchValue) return vehicles;

    return vehicles.filter(
      (v: VehicleListResult) =>
        v.vehicle_make.toLowerCase().includes(searchValue) ||
        v.vehicle_model.toLowerCase().includes(searchValue) ||
        v.vehicle_type.toLowerCase().includes(searchValue),
    );
  }, [data, searchValue]);

  if (isPending) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <InlineError message={`Error fetching vehicles: ${String(error)}`} />;
  }

  if (!data || !data.success || !data.payload) {
    return (
      <InlineError
        message={`Response error occurred: ${data?.message || "Failed to load vehicles"}`}
      />
    );
  }

  const tableData: TableProps<VehicleListResult> = {
    data: filteredVehicles,
    columnNames: [
      {
        headerName: "Vehicle ID",
        fieldName: "id",
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
        headerName: "Status",
        fieldName: "is_active",
        customRender: (value) =>
          value ? (
            <Tag variant="accent">ACTIVE</Tag>
          ) : (
            <Tag variant="muted">INACTIVE</Tag>
          ),
      },
      {
        headerName: "Action",
        customRender: (_v, row) => (
          <Button
            onClick={() => router.push(`/admin/vehicles/${row.id}`)}
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

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-content-primary">
        Vehicles Management
      </h1>
      <div className="flex flex-wrap gap-4 items-center w-full justify-between">
        <div>
          <Search />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table columnNames={tableData.columnNames} data={tableData.data} />
      </div>
    </div>
  );
}
