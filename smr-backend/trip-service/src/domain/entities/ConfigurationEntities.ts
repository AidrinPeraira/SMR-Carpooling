import { VehicleTypes } from "@sharemyride/shared";

export interface VehicleList {
  id: string;
  vehicleType: VehicleTypes;
  vehicleMake: string;
  vehicleModel: string;
  isActive: boolean;
}

export interface PricingRules {
  id: string;
  vehicleType: VehicleTypes;
  pricePerKm: number;
  basePrice: number;
  isActive: boolean;
}
