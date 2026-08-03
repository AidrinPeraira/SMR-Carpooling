"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DropDown, Input, Label, Loader } from "@sharemyride/ui";
import { VehicleListResult, VehicleTypes, FileNames } from "@sharemyride/shared";
import { Controller, FieldErrors, UseFormRegister, useWatch } from "react-hook-form";
import { getVehicleListRequest } from "../../api/requests/getVehicleListRequest";
import { FileUploadComponent } from "../FileUploadComponent";

interface Props {
  register: UseFormRegister<any>;
  control: any;
  errors: FieldErrors<any>;
}

export function VehicleFieldsSection({ register, control, errors }: Props) {
  // Fetch predefined vehicles from Trip Service with 1-day (24h) cache
  const { data, isPending } = useQuery({
    queryKey: ["predefinedVehiclesList"],
    queryFn: async () => {
      return await getVehicleListRequest();
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (1 day)
    gcTime: 1000 * 60 * 60 * 24,
  });

  const vehicles: VehicleListResult[] = useMemo(() => {
    if (data && "payload" in data && data.payload?.vehicles) {
      return data.payload.vehicles;
    }
    return [];
  }, [data]);

  // Watch current selections for cascading dropdown options
  const selectedVehicleType: string = useWatch({ control, name: "vehicle_type" }) || Object.values(VehicleTypes)[0];
  const selectedVehicleMake: string = useWatch({ control, name: "vehicle_make" }) || "";

  // Vehicle Type Options
  const vehicleTypeOptions = useMemo(() => {
    if (vehicles.length === 0) {
      return Object.values(VehicleTypes).map((type) => ({
        label: type.toUpperCase(),
        value: type as string,
      }));
    }
    const typesSet = new Set<string>(vehicles.map((v: VehicleListResult) => v.vehicle_type));
    return Array.from(typesSet).map((type: string) => ({
      label: type.toUpperCase(),
      value: type,
    }));
  }, [vehicles]);

  // Vehicle Make Options (filtered by selected vehicle_type)
  const rawMakeOptions = useMemo(() => {
    const filtered = vehicles.filter((v: VehicleListResult) => v.vehicle_type === selectedVehicleType);
    const makesSet = new Set<string>(filtered.map((v: VehicleListResult) => v.vehicle_make));
    return Array.from(makesSet).map((make: string) => ({
      label: make,
      value: make,
    }));
  }, [vehicles, selectedVehicleType]);

  const vehicleMakeOptions = useMemo(() => {
    if (isPending) {
      return [{ label: "Loading makes...", value: "" }];
    }
    return [{ label: "-- Select Make --", value: "" }, ...rawMakeOptions];
  }, [isPending, rawMakeOptions]);

  // Vehicle Model Options (filtered by selected vehicle_type & vehicle_make)
  const rawModelOptions = useMemo(() => {
    if (!selectedVehicleMake) return [];
    const filtered = vehicles.filter(
      (v: VehicleListResult) => v.vehicle_type === selectedVehicleType && v.vehicle_make === selectedVehicleMake
    );
    const modelsSet = new Set<string>(filtered.map((v: VehicleListResult) => v.vehicle_model));
    return Array.from(modelsSet).map((model: string) => ({
      label: model,
      value: model,
    }));
  }, [vehicles, selectedVehicleType, selectedVehicleMake]);

  const vehicleModelOptions = useMemo(() => {
    if (!selectedVehicleMake) {
      return [{ label: "-- Select Make First --", value: "" }];
    }
    return [{ label: "-- Select Model --", value: "" }, ...rawModelOptions];
  }, [selectedVehicleMake, rawModelOptions]);

  return (
    <div className="flex flex-col gap-4 rounded-md border border-border-strong bg-surface-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-content-primary">Vehicle Information</h2>
        {isPending && (
          <div className="flex items-center gap-1 text-xs text-content-secondary">
            <Loader className="w-3 h-3" />
            <span>Loading vehicles...</span>
          </div>
        )}
      </div>

      {/* Vehicle Type Dropdown */}
      <div className="flex flex-col gap-1 relative group">
        <Label>Vehicle Type</Label>
        <Controller
          name="vehicle_type"
          control={control}
          defaultValue={vehicleTypeOptions[0]?.value || Object.values(VehicleTypes)[0]}
          render={({ field }) => (
            <DropDown
              defaultValue={field.value || vehicleTypeOptions[0]?.value || Object.values(VehicleTypes)[0]}
              options={vehicleTypeOptions}
              onChange={(val) => {
                field.onChange(val);
              }}
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
        {/* Vehicle Make Dropdown */}
        <div className="flex flex-col gap-1 relative group">
          <Label>Vehicle Make</Label>
          <Controller
            name="vehicle_make"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <DropDown
                value={field.value || ""}
                placeholder="-- Select Make --"
                options={vehicleMakeOptions}
                onChange={(val) => {
                  field.onChange(val);
                }}
              />
            )}
          />
          {errors.vehicle_make && (
            <p className="text-xs font-semibold pl-1 text-fg-danger">
              {String(errors.vehicle_make.message || "Vehicle make required")}
            </p>
          )}
        </div>

        {/* Vehicle Model Dropdown */}
        <div className="flex flex-col gap-1 relative group">
          <Label>Vehicle Model</Label>
          <Controller
            name="vehicle_model"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <DropDown
                value={field.value || ""}
                placeholder="-- Select Model --"
                disabled={!selectedVehicleMake}
                options={vehicleModelOptions}
                onChange={(val) => {
                  field.onChange(val);
                }}
              />
            )}
          />
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

      {/* Registration File Upload */}
      {control ? (
        <Controller
          name="registration_file"
          control={control}
          render={({ field }) => (
            <FileUploadComponent
              fileName={FileNames.VEHICLE_REGISTRATION}
              label="Registration Document"
              value={field.value}
              onChange={(path) => field.onChange(path)}
              error={errors.registration_file?.message as string}
            />
          )}
        />
      ) : (
        <div className="flex flex-col gap-1 relative group">
          <Label>Registration Document (Upload)</Label>
          <Input placeholder="Document file path or URL" {...register("registration_file")} />
          {errors.registration_file && (
            <p className="text-xs font-semibold pl-1 text-fg-danger">
              {String(errors.registration_file.message || "Registration file required")}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Insurance Number */}
        <div className="flex flex-col gap-1 relative group">
          <Label>Insurance Policy Number</Label>
          <Input placeholder="e.g. INS-987654321" {...register("insurance_number")} />
          {errors.insurance_number && (
            <p className="text-xs font-semibold pl-1 text-fg-danger">
              {String(errors.insurance_number.message || "Insurance policy number required")}
            </p>
          )}
        </div>

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
      </div>

      {/* Insurance File Upload */}
      {control ? (
        <Controller
          name="insurance_file"
          control={control}
          render={({ field }) => (
            <FileUploadComponent
              fileName={FileNames.VEHICLE_INSURANCE}
              label="Insurance Document"
              value={field.value}
              onChange={(path) => field.onChange(path)}
              error={errors.insurance_file?.message as string}
            />
          )}
        />
      ) : (
        <div className="flex flex-col gap-1 relative group">
          <Label>Insurance Document (Upload)</Label>
          <Input placeholder="Document file path or URL" {...register("insurance_file")} />
          {errors.insurance_file && (
            <p className="text-xs font-semibold pl-1 text-fg-danger">
              {String(errors.insurance_file.message || "Insurance file required")}
            </p>
          )}
        </div>
      )}

      {/* Vehicle Image Upload */}
      {control ? (
        <Controller
          name="vehicle_image"
          control={control}
          render={({ field }) => (
            <FileUploadComponent
              fileName={FileNames.VEHICLE_IMAGE}
              label="Vehicle Image"
              value={field.value}
              onChange={(path) => field.onChange(path)}
              error={errors.vehicle_image?.message as string}
            />
          )}
        />
      ) : (
        <div className="flex flex-col gap-1 relative group">
          <Label>Vehicle Image (Upload)</Label>
          <Input placeholder="Vehicle photo URL or file path" {...register("vehicle_image")} />
          {errors.vehicle_image && (
            <p className="text-xs font-semibold pl-1 text-fg-danger">
              {String(errors.vehicle_image.message || "Vehicle image required")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
