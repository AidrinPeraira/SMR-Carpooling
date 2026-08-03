"use client";

import { Input, Label } from "@sharemyride/ui";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function DriverFieldsSection({ register, errors }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-border-strong bg-surface-card p-5 shadow-sm">
      <h2 className="text-lg font-bold text-content-primary">Driver Information</h2>

      {/* License Number */}
      <div className="flex flex-col gap-1 relative group">
        <Label>License Number</Label>
        <Input placeholder="e.g. DL-1420110012345" {...register("license_number")} />
        {errors.license_number && (
          <>
            <p className="text-xs font-semibold pl-1 text-fg-danger">Invalid Entry</p>
            <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 top-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
              {String(errors.license_number.message || "License number is required")}
            </p>
          </>
        )}
      </div>

      {/* License Expiry */}
      <div className="flex flex-col gap-1 relative group">
        <Label>License Expiry Date</Label>
        <Input type="date" {...register("license_expiry")} />
        {errors.license_expiry && (
          <>
            <p className="text-xs font-semibold pl-1 text-fg-danger">Invalid Entry</p>
            <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 top-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
              {String(errors.license_expiry.message || "Valid license expiry date required")}
            </p>
          </>
        )}
      </div>

      {/* License File Placeholder */}
      <div className="flex flex-col gap-1 relative group">
        <Label>Driver License Document (Upload)</Label>
        <Input placeholder="Document file path or URL" {...register("license_file")} />
        {errors.license_file && (
          <>
            <p className="text-xs font-semibold pl-1 text-fg-danger">Invalid Entry</p>
            <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 top-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
              {String(errors.license_file.message || "License file document is required")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
