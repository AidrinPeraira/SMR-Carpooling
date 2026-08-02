import { VehicleTypes } from "@sharemyride/shared";

export interface OnboardingApplicationRequestDTO {
  userId: string;

  licenseNumber: string;
  licenseExpiry: string;
  licenseFile: string;

  vehicleType: VehicleTypes;
  vehicleModel: string;
  vehicleMake: string;
  vehicleImage: string;
  vehicleCapacity: number;
  registrationNumber: string;
  registrationExpiry: string;
  registrationFile: string;

  insuranceNumber: string;
  insuranceExpiry: string;
  insuranceFile: string;
}
