import * as z from "zod";
import { VehicleTypes } from "../../../enums";

export const CreatePricingSchema = z.object({
  vehicle_type: z.enum(VehicleTypes, {
    error: "Invalid vehicle type",
  }),
  price_per_km: z
    .number({ error: "Price per km must be a number" })
    .gt(0, "Price per km must be greater than zero"),
  base_price: z
    .number({ error: "Base price must be a number" })
    .gt(0, "Base price must be greater than zero"),
});

export const UpdatePricingSchema = z.object({
  vehicle_type: z.enum(VehicleTypes).optional(),
  price_per_km: z.number().gt(0).optional(),
  base_price: z.number().gt(0).optional(),
  is_active: z.boolean().optional(),
});

export const CreateVehicleSchema = z.object({
  vehicle_type: z.enum(VehicleTypes, {
    error: "Invalid vehicle type",
  }),
  vehicle_make: z.string().trim().min(1, "Vehicle make is required"),
  vehicle_model: z.string().trim().min(1, "Vehicle model is required"),
  is_active: z.boolean().optional(),
});

export const UpdateVehicleSchema = z.object({
  vehicle_type: z.enum(VehicleTypes).optional(),
  vehicle_make: z.string().trim().min(1).optional(),
  vehicle_model: z.string().trim().min(1).optional(),
  is_active: z.boolean().optional(),
});

export type CreatePricingSchemaType = z.infer<typeof CreatePricingSchema>;
export type UpdatePricingSchemaType = z.infer<typeof UpdatePricingSchema>;
export type CreateVehicleSchemaType = z.infer<typeof CreateVehicleSchema>;
export type UpdateVehicleSchemaType = z.infer<typeof UpdateVehicleSchema>;
