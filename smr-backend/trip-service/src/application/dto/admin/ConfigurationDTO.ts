import {
  PricingRules,
  VehicleList,
} from "#/domain/entities/ConfigurationEntities";
import { VehicleTypes } from "@sharemyride/shared";

export interface CreateNewVehicleRequestDTO {
  vehicleType: VehicleTypes;
  vehicleMake: string;
  vehicleModel: string;
  isActive?: boolean;
}

export interface CreateNewVehicleResultDTO {
  vehicle: VehicleList;
}

export interface UpdateVehicleRequestDTO {
  id: string;
  vehicleType?: VehicleTypes;
  vehicleMake?: string;
  vehicleModel?: string;
  isActive?: boolean;
}

export interface UpdateVehicleResultDTO {
  vehicle: VehicleList;
}

export interface CreateNewPricingRequestDTO {
  vehicleType: VehicleTypes;
  pricePerKm: number;
  basePrice: number;
}

export interface CreateNewPricingResultDTO {
  pricingRule: PricingRules;
}

export interface UpdatePricingRequestDTO {
  id: string;
  vehicleType?: VehicleTypes;
  pricePerKm?: number;
  basePrice?: number;
  isActive?: boolean;
}

export interface UpdatePricingResultDTO {
  pricingRule: PricingRules;
}

export interface GetConfigurationsResultDTO {
  vehicles: VehicleList[];
  pricingRules: PricingRules[];
}
