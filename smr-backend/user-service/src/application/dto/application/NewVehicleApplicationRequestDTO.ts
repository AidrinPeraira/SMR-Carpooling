import { VehicleTypes } from "@sharemyride/shared";

export interface NewVehicleApplicationRequestDTO {
  userId: string;

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
