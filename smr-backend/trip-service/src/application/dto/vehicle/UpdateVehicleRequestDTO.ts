import { VehicleStatus, VehicleTypes } from "@sharemyride/shared";

export interface UpdateVehicleRequestDTO {
  registrationNumber: string;
  vehicleId?: string;
  driverId?: string;
  recordId?: string;
  vehicleType?: VehicleTypes;
  vehicleModel?: string;
  vehicleMake?: string;
  vehicleCapacity?: number;
  vehicleImage?: string;
  vehicleStatus?: VehicleStatus;
}
