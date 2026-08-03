import * as z from "zod";
import { VehicleTypes } from "../../enums";

export const OnboardingApplicationSchema = z.object({
  license_number: z.string().trim().min(1, "License number is required"),
  license_expiry: z.coerce.date(),
  license_file: z.string().trim().min(1, "License file is required"),
  vehicle_type: z.enum(VehicleTypes),
  vehicle_make: z.string().trim().min(1, "Vehicle make is required"),
  vehicle_model: z.string().trim().min(1, "Vehicle model is required"),
  vehicle_capacity: z.coerce.number().int().min(1).max(10),
  registration_number: z.string().trim().min(1, "Registration number is required"),
  registration_expiry: z.coerce.date(),
  registration_file: z.string().trim().min(1, "Registration file is required"),
  insurance_expiry: z.coerce.date(),
  insurance_file: z.string().trim().min(1, "Insurance file is required"),
  vehicle_image: z.string().trim().min(1, "Vehicle image is required"),
});

export const NewVehicleApplicationSchema = z.object({
  vehicle_type: z.enum(VehicleTypes),
  vehicle_make: z.string().trim().min(1, "Vehicle make is required"),
  vehicle_model: z.string().trim().min(1, "Vehicle model is required"),
  vehicle_capacity: z.coerce.number().int().min(1).max(10),
  registration_number: z.string().trim().min(1, "Registration number is required"),
  registration_expiry: z.coerce.date(),
  registration_file: z.string().trim().min(1, "Registration file is required"),
  insurance_expiry: z.coerce.date(),
  insurance_file: z.string().trim().min(1, "Insurance file is required"),
  vehicle_image: z.string().trim().min(1, "Vehicle image is required"),
});

export const RenewDriverApplicationSchema = z.object({
  license_number: z.string().trim().min(1, "License number is required"),
  license_expiry: z.coerce.date(),
  license_file: z.string().trim().min(1, "License file is required"),
});

export const RenewVehicleApplicationSchema = z.object({
  registration_number: z.string().trim().min(1, "Registration number is required"),
  registration_expiry: z.coerce.date(),
  registration_file: z.string().trim().min(1, "Registration file is required"),
  insurance_expiry: z.coerce.date(),
  insurance_file: z.string().trim().min(1, "Insurance file is required"),
});

export const ResubmitOnboardingApplicationSchema = OnboardingApplicationSchema.partial();
export const ResubmitNewVehicleApplicationSchema = NewVehicleApplicationSchema.partial();
export const ResubmitRenewDriverApplicationSchema = RenewDriverApplicationSchema.partial();
export const ResubmitRenewVehicleApplicationSchema = RenewVehicleApplicationSchema.partial();

export const ApplicationIdParamSchema = z.object({
  applicationId: z.string().trim().min(1, "Application ID is required"),
});

export type OnboardingApplicationSchemaType = z.infer<typeof OnboardingApplicationSchema>;
export type NewVehicleApplicationSchemaType = z.infer<typeof NewVehicleApplicationSchema>;
export type RenewDriverApplicationSchemaType = z.infer<typeof RenewDriverApplicationSchema>;
export type RenewVehicleApplicationSchemaType = z.infer<typeof RenewVehicleApplicationSchema>;
export type ResubmitOnboardingApplicationSchemaType = z.infer<typeof ResubmitOnboardingApplicationSchema>;
export type ResubmitNewVehicleApplicationSchemaType = z.infer<typeof ResubmitNewVehicleApplicationSchema>;
export type ResubmitRenewDriverApplicationSchemaType = z.infer<typeof ResubmitRenewDriverApplicationSchema>;
export type ResubmitRenewVehicleApplicationSchemaType = z.infer<typeof ResubmitRenewVehicleApplicationSchema>;
export type ApplicationIdParamSchemaType = z.infer<typeof ApplicationIdParamSchema>;
