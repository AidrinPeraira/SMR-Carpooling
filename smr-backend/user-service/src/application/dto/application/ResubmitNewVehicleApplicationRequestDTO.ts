import { VehicleTypes } from "@sharemyride/shared";

export interface ResubmitNewVehicleApplicationRequestDTO {
  applicationId: string;

  vehicleType?: VehicleTypes;
  vehicleModel?: string;
  vehicleMake?: string;
  vehicleImage?: string;

  registrationNumber?: string;
  registrationExpiry?: string;
  registrationFile?: string;

  insuranceNumber?: string;
  insuranceExpiry?: string;
  insuranceFile?: string;
}
