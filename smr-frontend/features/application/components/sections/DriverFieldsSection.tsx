"use client";

import { Input, Label } from "@sharemyride/ui";
import { FileNames } from "@sharemyride/shared";
import { Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { FileUploadComponent } from "../FileUploadComponent";

interface Props {
  register: UseFormRegister<any>;
  control: any;
  errors: FieldErrors<any>;
}

export function DriverFieldsSection({ register, control, errors }: Props) {
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

      {/* Driver License Document Upload */}
      <Controller
        name="license_file"
        control={control}
        render={({ field }) => (
          <FileUploadComponent
            fileName={FileNames.DRIVER_LICENSE}
            label="Driver License Document"
            value={field.value}
            onChange={(path) => field.onChange(path)}
            error={errors.license_file?.message as string}
          />
        )}
      />
    </div>
  );
}
