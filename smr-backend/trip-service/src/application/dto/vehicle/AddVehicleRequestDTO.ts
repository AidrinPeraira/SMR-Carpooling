import { VehicleTypes } from "@sharemyride/shared";

export interface AddVehicleRequestDTO {
  driverId: string;
  vehicleId: string;
  recordId: string;

  vehicleType: VehicleTypes;
  vehicleModel: string;
  vehicleMake: string;
  vehicleCapacity: number;

  registrationNumber: string;

  vehicleImage: string;
}
