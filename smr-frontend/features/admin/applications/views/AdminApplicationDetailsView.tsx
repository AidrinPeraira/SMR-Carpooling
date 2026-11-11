"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ApplicationStatus } from "@sharemyride/shared";
import { Button, Card, Input, Loader, Tag, useToast } from "@sharemyride/ui";
import { InlineError } from "@/components/InlineError";
import { FilePreviewModal } from "@/features/application";
import { getAdminApplicationDetailsRequest } from "../api/requests/getAdminApplicationDetailsRequest";
import { processApplicationAction } from "../api/actions/processApplicationAction";

interface Props {
  applicationId: string;
}

interface PreviewState {
  title: string;
  fileUrl?: string;
  details?: { label: string; value: string }[];
}

export function AdminApplicationDetailsView({ applicationId }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const { isPending: isLoading, error, data, refetch } = useQuery({
    queryKey: ["adminApplicationDetails", applicationId],
    queryFn: async () => {
      return await getAdminApplicationDetailsRequest(applicationId);
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <InlineError message={`Error fetching application: ${String(error)}`} />;
  }

  if (!data.success || !data.payload) {
    return <InlineError message={`Error: ${data.message}`} />;
  }

  const app = data.payload;
  const isPendingStatus = app.application_status === ApplicationStatus.PENDING;

  function handleProcess(status: ApplicationStatus) {
    if (!isPendingStatus) {
      toast("This application has already been processed and cannot be modified.", {
        variant: "error",
      });
      return;
    }

    if (!comment.trim()) {
      toast("Please provide an admin comment before processing.", {
        variant: "error",
      });
      return;
    }

    startTransition(async () => {
      const res = await processApplicationAction({
        application_id: app.application_id,
        application_status: status,
        comment: comment.trim(),
      });

      if (res.success) {
        toast(res.message || "Application Processed", {
          variant: "success",
          description: res.description,
        });
        setComment("");
        refetch();
      } else {
        toast(res.errorMessage || "Processing Error", {
          variant: "error",
          description: res.description,
        });
      }
    });
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

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="text-xs">
          &larr; Back to Applications
        </Button>
        <div>{getStatusTag(app.application_status)}</div>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-content-primary">
          Application Details ({app.application_id})
        </h1>
        <p className="text-xs text-content-secondary">
          Type: <span className="font-medium text-content-primary">{app.application_type.replace(/_/g, " ").toUpperCase()}</span> | Submitted: {new Date(app.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Applicant Profile */}
      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-content-primary border-b border-border-subtle pb-2">
          Applicant Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-content-secondary block">Name</span>
            <span className="font-medium text-content-primary">
              {app.first_name || "-"} {app.last_name || ""}
            </span>
          </div>
          <div>
            <span className="text-content-secondary block">Email</span>
            <span className="font-medium text-content-primary">
              {app.email_id || "-"}
            </span>
          </div>
          <div>
            <span className="text-content-secondary block">User ID</span>
            <span className="font-medium text-content-primary font-mono">
              {app.user_id}
            </span>
          </div>
        </div>
      </Card>

      {/* Driver Record */}
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
              Driver Details {driverRecords.length > 1 ? `#${idx + 1}` : ""}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-content-secondary block">License Number</span>
                <span className="font-medium text-content-primary">
                  {driver.license_number}
                </span>
              </div>
              <div>
                <span className="text-content-secondary block">License Expiry</span>
                <span className="font-medium text-content-primary">
                  {new Date(driver.license_expiry).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-content-secondary block mb-1">License Document</span>
                {driver.license_file ? (
                  <button
                    type="button"
                    onClick={() =>
                      setPreview({
                        title: "Driver License Document",
                        fileUrl: driver.license_file,
                        details: [
                          { label: "Applicant Name", value: `${app.first_name || ""} ${app.last_name || ""}`.trim() },
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
                    View Document
                  </button>
                ) : (
                  <span className="text-content-secondary">No file uploaded</span>
                )}
              </div>
            </div>
          </Card>
        ));
      })()}

      {/* Vehicle Record */}
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
              Vehicle Details {vehicleRecords.length > 1 ? `#${idx + 1}` : ""}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-content-secondary block">Make & Model</span>
                <span className="font-medium text-content-primary">
                  {vehicle.vehicle_make} {vehicle.vehicle_model}
                </span>
              </div>
              <div>
                <span className="text-content-secondary block">Type & Capacity</span>
                <span className="font-medium text-content-primary">
                  {vehicle.vehicle_type} ({vehicle.vehicle_capacity} seats)
                </span>
              </div>
              <div>
                <span className="text-content-secondary block">Registration Number</span>
                <span className="font-medium text-content-primary">
                  {vehicle.registration_number}
                </span>
              </div>
              <div>
                <span className="text-content-secondary block">Registration Expiry</span>
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
                          { label: "Registration Expiry", value: new Date(vehicle.registration_expiry).toLocaleDateString() },
                          { label: "Vehicle Make/Model", value: `${vehicle.vehicle_make} ${vehicle.vehicle_model}` },
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
                          { label: "Insurance Expiry", value: new Date(vehicle.insurance_expiry).toLocaleDateString() },
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
                        title: "Vehicle Image Preview",
                        fileUrl: vehicle.vehicle_image,
                        details: [
                          { label: "Vehicle", value: `${vehicle.vehicle_make} ${vehicle.vehicle_model}` },
                          { label: "Type", value: vehicle.vehicle_type },
                          { label: "Seating Capacity", value: `${vehicle.vehicle_capacity} seats` },
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

      {/* Admin Comments History */}
      {app.admin_comments && app.admin_comments.length > 0 && (
        <Card className="p-6 space-y-3">
          <h3 className="text-lg font-semibold text-content-primary border-b border-border-subtle pb-2">
            Previous Admin Comments
          </h3>
          <div className="space-y-2">
            {app.admin_comments.map((c, index) => (
              <div
                key={index}
                className="p-3 rounded bg-surface-muted border border-border-strong text-xs text-content-primary space-y-1"
              >
                <div className="flex justify-between text-content-secondary font-semibold">
                  <span>Admin ID: {c.admin_id}</span>
                  <span>{new Date(c.time).toLocaleString()}</span>
                </div>
                <p className="text-content-primary">{c.comment}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action / Status Section */}
      <Card className="p-6 space-y-4 border-2 border-border-strong">
        {!isPendingStatus ? (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-content-primary">
              Application Status
            </h3>
            <div className="p-4 rounded bg-surface-muted border border-border-strong text-xs flex items-center justify-between">
              <span className="text-content-secondary font-medium">
                This application is <strong className="text-content-primary uppercase font-bold">{app.application_status}</strong>. No further admin action can be taken.
              </span>
              <div>{getStatusTag(app.application_status)}</div>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-content-primary">
              Take Admin Action
            </h3>
            <p className="text-xs text-content-secondary">
              Provide notes/comments and approve or reject this application.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-content-primary block">
                Admin Comment / Feedback <span className="text-red-500">*</span>
              </label>
              <Input
                value={comment}
                disabled={isPending}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter reason or approval note..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                disabled={isPending}
                onClick={() => handleProcess(ApplicationStatus.APPROVED)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Approve Application
              </Button>

              <Button
                variant="danger"
                disabled={isPending}
                onClick={() => handleProcess(ApplicationStatus.REJECTED)}
                className="flex-1"
              >
                Reject Application
              </Button>

              {/* RETURN ACTION (Kept hidden as per requirements) */}
              {/* 
              <Button
                variant="secondary"
                disabled={isPending}
                onClick={() => handleProcess(ApplicationStatus.RETURNED)}
                className="flex-1"
              >
                Return Application
              </Button>
              */}
            </div>
          </>
        )}
      </Card>

      {/* File Preview Dialog Modal */}
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
