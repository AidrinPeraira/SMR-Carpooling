"use client";

import { Button, Card, CardBody, CardHeader, Tag } from "@sharemyride/ui";

interface Props {
  data: {
    vehicle_type?: string;
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_capacity?: number;
    registration_number?: string;
    registration_expiry?: string | Date;
    registration_file?: string;
    registration_file_preview?: string;
    insurance_number?: string;
    insurance_expiry?: string | Date;
    insurance_file?: string;
    insurance_file_preview?: string;
    vehicle_image?: string;
    vehicle_image_preview?: string;
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

export function VehicleOverviewCard({ data, onEdit }: Props) {
  const regExpiry = formatDate(data.registration_expiry);
  const insExpiry = formatDate(data.insurance_expiry);

  const regPreviewSrc = data.registration_file_preview || data.registration_file;
  const insPreviewSrc = data.insurance_file_preview || data.insurance_file;
  const imgPreviewSrc = data.vehicle_image_preview || data.vehicle_image;

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between border-b border-border-strong pb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-md font-bold text-content-primary">Vehicle Overview</h3>
          {data.vehicle_type && <Tag variant="accent">{data.vehicle_type.toUpperCase()}</Tag>}
        </div>
        {onEdit && (
          <Button variant="secondary" className="px-2 py-1 text-xs" type="button" onClick={onEdit}>
            Edit
          </Button>
        )}
      </CardHeader>
      <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
        <div>
          <span className="text-xs uppercase font-bold text-content-secondary block">
            Make & Model
          </span>
          <p className="text-sm font-semibold text-content-primary">
            {data.vehicle_make && data.vehicle_model
              ? `${data.vehicle_make} ${data.vehicle_model}`
              : "—"}
          </p>
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-content-secondary block">
            Capacity
          </span>
          <p className="text-sm font-semibold text-content-primary">
            {data.vehicle_capacity ? `${data.vehicle_capacity} Seats` : "—"}
          </p>
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-content-secondary block">
            Registration Number
          </span>
          <p className="text-sm font-semibold text-content-primary">
            {data.registration_number || "—"}
          </p>
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-content-secondary block">
            Registration Expiry
          </span>
          <p className="text-sm font-semibold text-content-primary">
            {regExpiry}
          </p>
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-content-secondary block">
            Insurance Policy Number
          </span>
          <p className="text-sm font-semibold text-content-primary">
            {data.insurance_number || "—"}
          </p>
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-content-secondary block">
            Insurance Expiry
          </span>
          <p className="text-sm font-semibold text-content-primary">
            {insExpiry}
          </p>
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-content-secondary block mb-1">
            Registration Document
          </span>
          {isRenderableImageSrc(regPreviewSrc) ? (
            <div className="mt-1 border border-border-strong rounded p-2 bg-surface-muted">
              <img
                src={regPreviewSrc}
                alt="Registration Preview"
                className="max-h-36 w-auto object-contain rounded"
              />
            </div>
          ) : (
            <p className="text-sm font-medium text-content-secondary truncate font-mono">
              {data.registration_file || "—"}
            </p>
          )}
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-content-secondary block mb-1">
            Insurance Document
          </span>
          {isRenderableImageSrc(insPreviewSrc) ? (
            <div className="mt-1 border border-border-strong rounded p-2 bg-surface-muted">
              <img
                src={insPreviewSrc}
                alt="Insurance Preview"
                className="max-h-36 w-auto object-contain rounded"
              />
            </div>
          ) : (
            <p className="text-sm font-medium text-content-secondary truncate font-mono">
              {data.insurance_file || "—"}
            </p>
          )}
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-content-secondary block mb-1">
            Vehicle Image
          </span>
          {isRenderableImageSrc(imgPreviewSrc) ? (
            <div className="mt-1 border border-border-strong rounded p-2 bg-surface-muted">
              <img
                src={imgPreviewSrc}
                alt="Vehicle Preview"
                className="max-h-36 w-auto object-contain rounded"
              />
            </div>
          ) : (
            <p className="text-sm font-medium text-content-secondary truncate font-mono">
              {data.vehicle_image || "—"}
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
