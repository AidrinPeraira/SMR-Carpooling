"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ApplicationStatus } from "@sharemyride/shared";
import { Button, Card, Loader, Tag } from "@sharemyride/ui";
import { InlineError } from "@/components/InlineError";
import { FilePreviewModal } from "@/features/application";
import { AdminReturnBanner } from "../components/AdminReturnBanner";
import { getUserApplicationDetailsRequest } from "../api/requests/getUserApplicationDetailsRequest";

interface Props {
  applicationId: string;
}

interface PreviewState {
  title: string;
  fileUrl?: string;
  details?: { label: string; value: string }[];
}

export function UserApplicationDetailsView({ applicationId }: Props) {
  const router = useRouter();
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const { isPending, error, data } = useQuery({
    queryKey: ["userApplicationDetails", applicationId],
    queryFn: async () => {
      return await getUserApplicationDetailsRequest(applicationId);
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
    return <InlineError message={`Error loading details: ${String(error)}`} />;
  }

  if (!data.success || !data.payload) {
    return <InlineError message={`Error: ${data.message}`} />;
  }

  const app = data.payload;

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

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="text-xs">
          &larr; Back to My Applications
        </Button>
        <div>{getStatusTag(app.application_status)}</div>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-content-primary">
          Application Details
        </h1>
        <p className="text-xs text-content-secondary">
          ID: <span className="font-mono font-medium text-content-primary">{app.application_id}</span> | Type: <span className="font-medium text-content-primary">{app.application_type.replace(/_/g, " ").toUpperCase()}</span>
        </p>
      </div>

      {app.application_status === ApplicationStatus.RETURNED && (
        <AdminReturnBanner comments={app.admin_comments} />
      )}

      {/* Driver Info */}
      {(() => {
        const driverRecords = Array.isArray(app.driver_record)
          ? app.driver_record
          : app.driver_record
            ? [app.driver_record]
            : [];
        if (driverRecords.length === 0) return null;
        return driverRecords.map((driver, idx) => (
          <Card key={idx} className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-content-primary border-b border-border-subtle pb-2">
              Driver Record {driverRecords.length > 1 ? `#${idx + 1}` : ""}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-content-secondary block">License Number</span>
                <span className="font-medium text-content-primary">
                  {driver.license_number}
                </span>
              </div>
              <div>
                <span className="text-content-secondary block">Expiry Date</span>
                <span className="font-medium text-content-primary">
                  {new Date(driver.license_expiry).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-content-secondary block">Document</span>
                {driver.license_file ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPreview({
                        title: "Driver License Document",
                        fileUrl: driver.license_file,
                        details: [
                          { label: "License Number", value: driver.license_number },
                          {
                            label: "Expiry Date",
                            value: new Date(driver.license_expiry).toLocaleDateString(),
                          },
                        ],
                      })
                    }
                    className="text-accent underline font-medium cursor-pointer hover:text-accent/80 transition-colors"
                  >
                    View License File
                  </button>
                ) : (
                  <span className="text-content-secondary">No file uploaded</span>
                )}
              </div>
            </div>
          </Card>
        ));
      })()}

      {/* Vehicle Info */}
      {(() => {
        const vehicleRecords = Array.isArray(app.vehicle_record)
          ? app.vehicle_record
          : app.vehicle_record
            ? [app.vehicle_record]
            : [];
        if (vehicleRecords.length === 0) return null;
        return vehicleRecords.map((vehicle, idx) => (
          <Card key={idx} className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-content-primary border-b border-border-subtle pb-2">
              Vehicle Record {vehicleRecords.length > 1 ? `#${idx + 1}` : ""}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-content-secondary block">Vehicle</span>
                <span className="font-medium text-content-primary">
                  {vehicle.vehicle_make} {vehicle.vehicle_model}
                </span>
              </div>
              <div>
                <span className="text-content-secondary block">Type / Seats</span>
                <span className="font-medium text-content-primary">
                  {vehicle.vehicle_type} ({vehicle.vehicle_capacity} seats)
                </span>
              </div>
              <div>
                <span className="text-content-secondary block">Registration</span>
                <span className="font-medium text-content-primary">
                  {vehicle.registration_number}
                </span>
              </div>
              <div>
                <span className="text-content-secondary block">Reg. Expiry</span>
                <span className="font-medium text-content-primary">
                  {new Date(vehicle.registration_expiry).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-content-secondary block">Insurance Number</span>
                <span className="font-medium text-content-primary">
                  {vehicle.insurance_number}
                </span>
              </div>
              <div>
                <span className="text-content-secondary block">Insurance Expiry</span>
                <span className="font-medium text-content-primary">
                  {new Date(vehicle.insurance_expiry).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-3 border-t border-border-subtle">
              <div>
                <span className="text-content-secondary block mb-1">Registration File</span>
                {vehicle.registration_file ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPreview({
                        title: "Vehicle Registration Document",
                        fileUrl: vehicle.registration_file,
                        details: [
                          { label: "Registration Number", value: vehicle.registration_number },
                          { label: "Expiry Date", value: new Date(vehicle.registration_expiry).toLocaleDateString() },
                          { label: "Vehicle", value: `${vehicle.vehicle_make} ${vehicle.vehicle_model}` },
                        ],
                      })
                    }
                    className="text-accent underline font-medium cursor-pointer hover:text-accent/80 transition-colors"
                  >
                    View Registration
                  </button>
                ) : (
                  <span className="text-content-secondary">No file</span>
                )}
              </div>
              <div>
                <span className="text-content-secondary block mb-1">Insurance File</span>
                {vehicle.insurance_file ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPreview({
                        title: "Vehicle Insurance Document",
                        fileUrl: vehicle.insurance_file,
                        details: [
                          { label: "Insurance Policy #", value: vehicle.insurance_number },
                          { label: "Expiry Date", value: new Date(vehicle.insurance_expiry).toLocaleDateString() },
                        ],
                      })
                    }
                    className="text-accent underline font-medium cursor-pointer hover:text-accent/80 transition-colors"
                  >
                    View Insurance
                  </button>
                ) : (
                  <span className="text-content-secondary">No file</span>
                )}
              </div>
              <div>
                <span className="text-content-secondary block mb-1">Vehicle Image</span>
                {vehicle.vehicle_image ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPreview({
                        title: "Vehicle Image",
                        fileUrl: vehicle.vehicle_image,
                        details: [
                          { label: "Vehicle", value: `${vehicle.vehicle_make} ${vehicle.vehicle_model}` },
                          { label: "Type", value: vehicle.vehicle_type },
                        ],
                      })
                    }
                    className="text-accent underline font-medium cursor-pointer hover:text-accent/80 transition-colors"
                  >
                    View Image
                  </button>
                ) : (
                  <span className="text-content-secondary">No image</span>
                )}
              </div>
            </div>
          </Card>
        ));
      })()}

      {/* Admin Notes History */}
      {app.admin_comments && app.admin_comments.length > 0 && (
        <Card className="p-6 space-y-3">
          <h3 className="text-lg font-semibold text-content-primary border-b border-border-subtle pb-2">
            Admin Feedback Notes
          </h3>
          <div className="space-y-2">
            {app.admin_comments.map((c, index) => (
              <div
                key={index}
                className="p-3 rounded bg-surface-muted border border-border-strong text-xs text-content-primary space-y-1"
              >
                <div className="flex justify-between text-content-secondary font-semibold">
                  <span>Feedback #{index + 1}</span>
                  <span>{new Date(c.time).toLocaleString()}</span>
                </div>
                <p className="text-content-primary">{c.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Preview Dialog Modal */}
      {preview && (
        <FilePreviewModal
          isOpen={!!preview}
          onClose={() => setPreview(null)}
          title={preview.title}
          fileUrl={preview.fileUrl}
          details={preview.details}
        />
      )}
    </div>
  );
}
