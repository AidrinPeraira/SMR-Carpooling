import { VehicleTypes } from "@sharemyride/shared";

export interface VehicleRecordEntity {
  recordId: string;
  applicationId: string;

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

  createdAt: Date;
  updatedAt: Date;
}
