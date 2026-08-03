"use client";

import { Button, Card, CardBody, CardHeader } from "@sharemyride/ui";

interface Props {
  data: {
    license_number?: string;
    license_expiry?: string | Date;
    license_file?: string;
  };
  onEdit?: () => void;
}

export function DriverOverviewCard({ data, onEdit }: Props) {
  const expiryFormatted = data.license_expiry
    ? typeof data.license_expiry === "string"
      ? data.license_expiry
      : new Date(data.license_expiry).toISOString().split("T")[0]
    : "—";

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between border-b border-border-strong pb-2">
        <h3 className="text-md font-bold text-content-primary">Driver Overview</h3>
        {onEdit && (
          <Button variant="secondary" className="px-2 py-1 text-xs" type="button" onClick={onEdit}>
            Edit
          </Button>
        )}
      </CardHeader>
      <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
        <div>
          <span className="text-xs uppercase font-bold text-content-secondary block">
            License Number
          </span>
          <p className="text-sm font-semibold text-content-primary">
            {data.license_number || "—"}
          </p>
        </div>
        <div>
          <span className="text-xs uppercase font-bold text-content-secondary block">
            License Expiry
          </span>
          <p className="text-sm font-semibold text-content-primary">
            {expiryFormatted}
          </p>
        </div>
        <div className="md:col-span-2">
          <span className="text-xs uppercase font-bold text-content-secondary block">
            License File
          </span>
          <p className="text-sm font-medium text-content-secondary truncate">
            {data.license_file || "—"}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
