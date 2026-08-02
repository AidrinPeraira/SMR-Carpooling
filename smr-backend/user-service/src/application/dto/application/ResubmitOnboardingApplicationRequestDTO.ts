import { VehicleTypes } from "@sharemyride/shared";

export interface ResubmitOnboardingApplicationRequestDTO {
  applicationId: string;

  licenseNumber?: string;
  licenseExpiry?: Date;
  licenseFile?: string;

  vehicleType?: VehicleTypes;
  vehicleModel?: string;
  vehicleMake?: string;
  vehicleImage?: string;

  registrationNumber?: string;
  registrationExpiry?: Date;
  registrationFile?: string;

  insuranceNumber?: string;
  insuranceExpiry?: Date;
  insuranceFile?: string;
}
