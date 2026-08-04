"use client";

import { Button, Card, CardBody, CardHeader } from "@sharemyride/ui";

interface Props {
  data: {
    license_number?: string;
    license_expiry?: string | Date;
    license_file?: string;
    license_file_preview?: string;
  };
  onEdit?: () => void;
}

function formatDate(value?: string | Date): string {
  if (!value) return "—";
  const date = new Date(value);
  return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
}

function isRenderableImageSrc(src?: string): boolean {
  if (!src) return false;
  return (
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:")
  );
}

export function DriverOverviewCard({ data, onEdit }: Props) {
  const expiryFormatted = formatDate(data.license_expiry);
  const previewSrc = data.license_file_preview || data.license_file;
  const canRenderImage = isRenderableImageSrc(previewSrc);

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between border-b border-border-strong pb-2">
        <h3 className="text-md font-bold text-content-primary">
          Driver Overview
        </h3>
        {onEdit && (
          <Button
            variant="secondary"
            className="px-2 py-1 text-xs"
            type="button"
            onClick={onEdit}
          >
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
          <span className="text-xs uppercase font-bold text-content-secondary block mb-1">
            License Document
          </span>
          {canRenderImage ? (
            <div className="mt-1 border border-border-strong rounded p-2 bg-surface-muted max-w-sm">
              <img
                src={previewSrc}
                alt="License Document Preview"
                className="max-h-48 w-auto object-contain rounded"
              />
            </div>
          ) : (
            <p className="text-sm font-medium text-content-secondary truncate font-mono">
              {data.license_file || "—"}
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
