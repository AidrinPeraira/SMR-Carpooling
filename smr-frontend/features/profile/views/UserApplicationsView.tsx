"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ApplicationResult,
  ApplicationStatus,
  PaginatedPayload,
} from "@sharemyride/shared";
import { Button, Loader, Table, TableProps, Tag } from "@sharemyride/ui";
import { InlineError } from "@/components/InlineError";
import { getUserApplicationsRequest } from "../api/requests/getUserApplicationsRequest";
import { Search } from "@/components/UserInput/Search";

export function UserApplicationsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const { isPending, error, data } = useQuery({
    queryKey: ["userApplications", searchQuery],
    queryFn: async () => {
      const params = searchQuery ? { search: searchQuery } : undefined;
      return await getUserApplicationsRequest(params);
    },
  });

  if (isPending) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <InlineError message={`Failed to load applications: ${String(error)}`} />
    );
  }

  if (!data.success || !data.payload) {
    return <InlineError message={`Error: ${data.message}`} />;
  }

  // Handle both array response and paginated payload structure
  const applications: ApplicationResult[] = Array.isArray(data.payload)
    ? data.payload
    : ((data.payload as PaginatedPayload<ApplicationResult[]>).data ?? []);

  const getStatusTag = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPROVED:
        return <Tag variant="accent">{status.toUpperCase()}</Tag>;
      case ApplicationStatus.REJECTED:
        return (
          <Tag variant="muted" className="text-red-400 border-red-500/30">
            {status.toUpperCase()}
          </Tag>
        );
      case ApplicationStatus.RETURNED:
        return (
          <Tag variant="muted" className="text-amber-400 border-amber-500/30">
            {status.toUpperCase()}
          </Tag>
        );
      case ApplicationStatus.PENDING:
      default:
        return <Tag variant="muted">{status.toUpperCase()}</Tag>;
    }
  };

  const tableData: TableProps<ApplicationResult> = {
    data: applications,
    columnNames: [
      {
        headerName: "Application ID",
        fieldName: "application_id",
      },
      {
        headerName: "Application Type",
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
            onClick={() => router.push(`/applications/${row.application_id}`)}
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
    <div className="space-y-6 w-full max-w-6xl mx-auto p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-content-primary">
            My Applications
          </h1>
          <p className="text-xs text-content-secondary">
            Track the status of your driver and vehicle applications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Search />
          <Button
            onClick={() => router.push("/application/add-vehicle")}
            variant="secondary"
            className="text-xs"
          >
            Add Vehicle
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table columnNames={tableData.columnNames} data={tableData.data} />
      </div>
    </div>
  );
}
