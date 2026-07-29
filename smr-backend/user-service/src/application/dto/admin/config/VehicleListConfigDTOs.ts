import { VehicleTypes } from "@sharemyride/shared";

export interface NewVehicleConfigRequestDTO {
  id: string;
  vehicleType: VehicleTypes;
  vehicleModel: string;
  vehicleMake: string;
  isActive: boolean;
}

export interface UpdateVehicleConfigRequestDTO {
  id: string;
  vehicleType?: VehicleTypes;
  vehicleModel?: string;
  vehicleMake?: string;
  isActive?: boolean;
}
