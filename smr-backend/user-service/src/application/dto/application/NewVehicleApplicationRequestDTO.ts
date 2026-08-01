import { VehicleTypes } from "@sharemyride/shared";

export interface NewVehicleApplicationRequestDTO {
  userId: string;

  vehicleType: VehicleTypes;
  vehicleModel: string;
  vehicleMake: string;
  vehicleImage: string;

  registrationNumber: string;
  registrationExpiry: string;
  registrationFile: string;

  insuranceNumber: string;
  insuranceExpiry: string;
  insuranceFile: string;
}
