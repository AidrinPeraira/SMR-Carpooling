"use client";

import { DropDown, Input, Label } from "@sharemyride/ui";
import { VehicleTypes } from "@sharemyride/shared";
import { Controller, FieldErrors, UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  control: any;
  errors: FieldErrors<any>;
}

const vehicleTypeOptions = Object.values(VehicleTypes).map((type) => ({
  label: type.toUpperCase(),
  value: type,
}));

export function VehicleFieldsSection({ register, control, errors }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-border-strong bg-surface-card p-5 shadow-sm">
      <h2 className="text-lg font-bold text-content-primary">Vehicle Information</h2>

      {/* Vehicle Type */}
      <div className="flex flex-col gap-1 relative group">
        <Label>Vehicle Type</Label>
        <Controller
          name="vehicle_type"
          control={control}
          defaultValue={vehicleTypeOptions[0].value}
          render={({ field }) => (
            <DropDown
              defaultValue={field.value || vehicleTypeOptions[0].value}
              options={vehicleTypeOptions}
              onChange={field.onChange}
            />
          )}
        />
        {errors.vehicle_type && (
          <p className="text-xs font-semibold pl-1 text-fg-danger">
            {String(errors.vehicle_type.message || "Select vehicle type")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Vehicle Make */}
        <div className="flex flex-col gap-1 relative group">
          <Label>Vehicle Make</Label>
          <Input placeholder="e.g. Toyota" {...register("vehicle_make")} />
          {errors.vehicle_make && (
            <p className="text-xs font-semibold pl-1 text-fg-danger">
              {String(errors.vehicle_make.message || "Vehicle make required")}
            </p>
          )}
        </div>

        {/* Vehicle Model */}
        <div className="flex flex-col gap-1 relative group">
          <Label>Vehicle Model</Label>
          <Input placeholder="e.g. Innova" {...register("vehicle_model")} />
          {errors.vehicle_model && (
            <p className="text-xs font-semibold pl-1 text-fg-danger">
              {String(errors.vehicle_model.message || "Vehicle model required")}
            </p>
          )}
        </div>
      </div>

      {/* Vehicle Capacity */}
      <div className="flex flex-col gap-1 relative group">
        <Label>Vehicle Capacity (Seats)</Label>
        <Input
          type="number"
          min={1}
          max={10}
          placeholder="4"
          {...register("vehicle_capacity", { valueAsNumber: true })}
        />
        {errors.vehicle_capacity && (
          <p className="text-xs font-semibold pl-1 text-fg-danger">
            {String(errors.vehicle_capacity.message || "Capacity between 1 and 10 required")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Registration Number */}
        <div className="flex flex-col gap-1 relative group">
          <Label>Registration Number</Label>
          <Input placeholder="e.g. KA01AB1234" {...register("registration_number")} />
          {errors.registration_number && (
            <p className="text-xs font-semibold pl-1 text-fg-danger">
              {String(errors.registration_number.message || "Registration number required")}
            </p>
          )}
        </div>

        {/* Registration Expiry */}
        <div className="flex flex-col gap-1 relative group">
          <Label>Registration Expiry</Label>
          <Input type="date" {...register("registration_expiry")} />
          {errors.registration_expiry && (
            <p className="text-xs font-semibold pl-1 text-fg-danger">
              {String(errors.registration_expiry.message || "Valid date required")}
            </p>
          )}
        </div>
      </div>

      {/* Registration File Placeholder */}
      <div className="flex flex-col gap-1 relative group">
        <Label>Registration Document (Upload)</Label>
        <Input placeholder="Document file path or URL" {...register("registration_file")} />
        {errors.registration_file && (
          <p className="text-xs font-semibold pl-1 text-fg-danger">
            {String(errors.registration_file.message || "Registration file required")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Insurance Expiry */}
        <div className="flex flex-col gap-1 relative group">
          <Label>Insurance Expiry</Label>
          <Input type="date" {...register("insurance_expiry")} />
          {errors.insurance_expiry && (
            <p className="text-xs font-semibold pl-1 text-fg-danger">
              {String(errors.insurance_expiry.message || "Valid date required")}
            </p>
          )}
        </div>

        {/* Insurance File Placeholder */}
        <div className="flex flex-col gap-1 relative group">
          <Label>Insurance Document (Upload)</Label>
          <Input placeholder="Document file path or URL" {...register("insurance_file")} />
          {errors.insurance_file && (
            <p className="text-xs font-semibold pl-1 text-fg-danger">
              {String(errors.insurance_file.message || "Insurance file required")}
            </p>
          )}
        </div>
      </div>

      {/* Vehicle Image Placeholder */}
      <div className="flex flex-col gap-1 relative group">
        <Label>Vehicle Image (Upload)</Label>
        <Input placeholder="Vehicle photo URL or file path" {...register("vehicle_image")} />
        {errors.vehicle_image && (
          <p className="text-xs font-semibold pl-1 text-fg-danger">
            {String(errors.vehicle_image.message || "Vehicle image required")}
          </p>
        )}
      </div>
    </div>
  );
}
