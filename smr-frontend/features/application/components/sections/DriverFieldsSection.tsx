"use client";

import { Input, Label } from "@sharemyride/ui";
import { FileNames } from "@sharemyride/shared";
import { Control, Controller, FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import { FileUploadComponent } from "@/features/application/components/FileUploadComponent";

interface Props<TFieldValues extends FieldValues = FieldValues> {
  register: UseFormRegister<TFieldValues>;
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
}

export function DriverFieldsSection<TFieldValues extends FieldValues = FieldValues>({
  register,
  control,
  errors,
}: Props<TFieldValues>) {
  const licenseNumberPath = "license_number" as Path<TFieldValues>;
  const licenseExpiryPath = "license_expiry" as Path<TFieldValues>;
  const licenseFilePath = "license_file" as Path<TFieldValues>;

  return (
    <div className="flex flex-col gap-4 rounded-md border border-border-strong bg-surface-card p-5 shadow-sm">
      <h2 className="text-lg font-bold text-content-primary">
        Driver Information
      </h2>

      {/* License Number */}
      <div className="flex flex-col gap-1 relative group">
        <Label>License Number</Label>
        <Input
          placeholder="e.g. DL-1420110012345"
          {...register(licenseNumberPath)}
        />
        {errors.license_number && (
          <>
            <p className="text-xs font-semibold pl-1 text-fg-danger">
              Invalid Entry
            </p>
            <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 top-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
              {String(
                errors.license_number.message || "License number is required",
              )}
            </p>
          </>
        )}
      </div>

      {/* License Expiry */}
      <div className="flex flex-col gap-1 relative group">
        <Label>License Expiry Date</Label>
        <Input type="date" {...register(licenseExpiryPath)} />
        {errors.license_expiry && (
          <>
            <p className="text-xs font-semibold pl-1 text-fg-danger">
              Invalid Entry
            </p>
            <p className="hidden absolute text-xs bg-surface-secondary group-hover:block border border-border-subtle max-w-3/4 right-0 top-3/4 rounded p-1 shadow text-fg-secondary font-semibold z-10">
              {String(
                errors.license_expiry.message ||
                  "Valid license expiry date required",
              )}
            </p>
          </>
        )}
      </div>

      {/* Driver License Document Upload */}
      <Controller
        name={licenseFilePath}
        control={control}
        render={({ field }) => (
          <FileUploadComponent
            fileName={FileNames.DRIVER_LICENSE}
            label="Driver License Document"
            value={field.value}
            onChange={(path, localUrl) => {
              field.onChange(path);
              const formControl = control as unknown as { _formValues?: Record<string, string> };
              if (formControl._formValues) {
                formControl._formValues.license_file_preview = localUrl || "";
              }
            }}
            error={errors.license_file?.message as string}
          />
        )}
      />
    </div>
  );
}
