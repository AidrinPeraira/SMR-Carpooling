import { VehicleStatus, VehicleTypes } from "@sharemyride/shared";

export interface VehicleDetailsDTO {
  vehicleId: string;
  driverId: string;
  recordId: string;
  vehicleType: VehicleTypes;
  vehicleModel: string;
  vehicleMake: string;
  vehicleCapacity: number;
  registrationNumber: string;
  vehicleImage: string;
  vehicleStatus: VehicleStatus;
  createdAt: Date;
  updatedAt: Date;
}
