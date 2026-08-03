import { VehicleTypes } from "@sharemyride/shared";

export interface OnboardingApplicationRequestDTO {
  userId: string;

  licenseNumber: string;
  licenseExpiry: Date;
  licenseFile: string;

  vehicleType: VehicleTypes;
  vehicleModel: string;
  vehicleMake: string;
  vehicleImage: string;
  vehicleCapacity: number;

  registrationNumber: string;
  registrationExpiry: Date;
  registrationFile: string;

  insuranceNumber: string;
  insuranceExpiry: Date;
  insuranceFile: string;
}
