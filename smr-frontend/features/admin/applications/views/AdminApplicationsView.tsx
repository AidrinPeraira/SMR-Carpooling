"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  AdminApplicationListResult,
  ApplicationStatus,
  ApplicationType,
  QueryDTO,
  SortOrder,
} from "@sharemyride/shared";
import { Button, Loader, Table, TableProps, Tag } from "@sharemyride/ui";
import { Filter } from "@/components/UserInput/Filter";
import { InlineError } from "@/components/InlineError";
import { Pagination } from "@/components/UserInput/Pagination";
import { Search } from "@/components/UserInput/Search";
import { Sort } from "@/components/UserInput/Sort";
import { getAllAdminApplicationsRequest } from "../api/requests/getAllAdminApplicationsRequest";

export function AdminApplicationsView() {
  const existingParams = useSearchParams();
  const router = useRouter();

  const searchValue = existingParams.get("search") || "";
  const filterField = existingParams.get("filterField");
  const filterValue = existingParams.get("filterValue");
  const sortField = existingParams.get("sortField");
  const sortValue = existingParams.get("sortValue");

  const page = existingParams.get("page") || "1";
  const limit = existingParams.get("limit") || "10";

  const queryParams: Record<string, string> = useMemo(() => {
    const query: Partial<Record<keyof QueryDTO<AdminApplicationListResult>, string>> = {};

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
    queryKey: ["adminApplications", queryParams],
    queryFn: async () => {
      return await getAllAdminApplicationsRequest(queryParams);
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
      <InlineError message={`Some error occurred: ${String(error)}`} />
    );
  }

  if (!data.success || !data.payload) {
    return (
      <InlineError
        message={`Response error occurred: ${data.message}`}
      />
    );
  }

  const getStatusTag = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPROVED:
        return <Tag variant="accent">{status.toUpperCase()}</Tag>;
      case ApplicationStatus.REJECTED:
        return <Tag variant="muted" className="text-red-400 border-red-500/30">{status.toUpperCase()}</Tag>;
      case ApplicationStatus.RETURNED:
        return <Tag variant="muted" className="text-amber-400 border-amber-500/30">{status.toUpperCase()}</Tag>;
      case ApplicationStatus.PENDING:
      default:
        return <Tag variant="muted">{status.toUpperCase()}</Tag>;
    }
  };

  const tableData: TableProps<AdminApplicationListResult> = {
    data: data.payload.data ?? [],
    columnNames: [
      {
        headerName: "Application ID",
        fieldName: "application_id",
      },
      {
        headerName: "Applicant",
        customRender: (_v, row) => (
          <div>
            <div className="font-semibold text-content-primary">
              {row.first_name} {row.last_name}
            </div>
            <div className="text-xs text-content-secondary">{row.email_id}</div>
          </div>
        ),
      },
      {
        headerName: "Type",
        fieldName: "application_type",
        customRender: (value) => (
          <Tag>{String(value).replace(/_/g, " ").toUpperCase()}</Tag>
        ),
      },
      {
        headerName: "Status",
        fieldName: "application_status",
        customRender: (value) => getStatusTag(value as ApplicationStatus),
      },
      {
        headerName: "Submitted Date",
        fieldName: "created_at",
        customRender: (value) =>
          value ? new Date(String(value)).toLocaleDateString() : "-",
      },
      {
        headerName: "Action",
        customRender: (_v, row) => (
          <Button
            onClick={() => router.push(`/admin/applications/${row.application_id}`)}
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
    applicationStatus: [
      ApplicationStatus.PENDING,
      ApplicationStatus.APPROVED,
      ApplicationStatus.REJECTED,
      ApplicationStatus.RETURNED,
    ],
    applicationType: [
      ApplicationType.ONBOARDING,
      ApplicationType.NEW_VEHICLE,
      ApplicationType.RENEW_DRIVER,
      ApplicationType.RENEW_VEHICLE,
    ],
  };

  const sortFields = ["applicationType", "applicationStatus", "createdAt"];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-content-primary">
        Applications Management
      </h1>
      <div className="flex flex-wrap gap-4 items-center w-full justify-between">
        <div>
          <Search />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
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
