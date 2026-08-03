import { VehicleTypes } from "@sharemyride/shared";

export interface ResubmitNewVehicleApplicationRequestDTO {
  applicationId: string;

  vehicleType?: VehicleTypes;
  vehicleModel?: string;
  vehicleMake?: string;
  vehicleCapacity?: number;
  vehicleImage?: string;

  registrationNumber?: string;
  registrationExpiry?: Date;
  registrationFile?: string;

  insuranceNumber?: string;
  insuranceExpiry?: Date;
  insuranceFile?: string;
}
