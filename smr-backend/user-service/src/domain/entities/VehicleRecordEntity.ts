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
  registrationExpiry: Date;
  registrationFile: string;

  insuranceNumber: string;
  insuranceExpiry: Date;
  insuranceFile: string;

  createdAt: Date;
  updatedAt: Date;
}
