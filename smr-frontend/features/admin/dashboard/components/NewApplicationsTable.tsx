"use client";

import { Button, Card, Table, Tag, type Column } from "@sharemyride/ui";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  AdminApplicationListResult,
  ApplicationStatus,
} from "@sharemyride/shared";
import { getLatestApplicationsRequest } from "../api/requests/getLatestApplicationsRequest";

const statusVariant: Record<ApplicationStatus, "accent" | "muted"> = {
  [ApplicationStatus.APPROVED]: "accent",
  [ApplicationStatus.PENDING]: "muted",
  [ApplicationStatus.RETURNED]: "muted",
  [ApplicationStatus.REJECTED]: "muted",
};

const statusClassName: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPROVED]: "",
  [ApplicationStatus.PENDING]: "text-warning-content border-warning-border",
  [ApplicationStatus.RETURNED]: "text-accent border-accent/30",
  [ApplicationStatus.REJECTED]: "text-error-content border-error-border",
};

const columns: Column<AdminApplicationListResult>[] = [
  { headerName: "Name", fieldName: "first_name" },
  {
    headerName: "Type",
    fieldName: "application_type",
    customRender: (value) => (
      <Tag variant="muted">{String(value).replace(/_/g, " ").toUpperCase()}</Tag>
    ),
  },
  {
    headerName: "Status",
    fieldName: "application_status",
    customRender: (value) => {
      const status = value as ApplicationStatus;
      return (
        <Tag
          variant={statusVariant[status]}
          className={statusClassName[status]}
        >
          {status.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    headerName: "Date",
    fieldName: "created_at",
    customRender: (value) =>
      value ? new Date(String(value)).toLocaleDateString() : "-",
  },
];

export function NewApplicationsTable() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["adminLatestApplications"],
    queryFn: getLatestApplicationsRequest,
  });

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-content-primary">
          Latest Applications
        </h3>
        <Button
          variant="ghost"
          className="text-xs"
          onClick={() => router.push("/admin/applications")}
        >
          View All
        </Button>
      </div>
      {isLoading ? (
        <div className="h-48 bg-surface-muted rounded-lg animate-pulse" />
      ) : (
        <Table columnNames={columns} data={data ?? []} />
      )}
    </Card>
  );
}
