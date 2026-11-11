import { VehicleTypes } from "@sharemyride/shared";

export interface VehicleListEntity {
  id: string;
  vehicleId: string; //this is going to be the id set in the trip service
  vehicleType: VehicleTypes;
  vehicleMake: string;
  vehicleModel: string;
  isActive: boolean;
}
