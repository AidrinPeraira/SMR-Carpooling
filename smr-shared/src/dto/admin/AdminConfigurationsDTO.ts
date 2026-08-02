import { VehicleTypes } from "../../enums";

export interface CreatePricingRequest {
  vehicle_type: VehicleTypes;
  price_per_km: number;
  base_price: number;
}

export interface UpdatePricingRequest {
  vehicle_type?: VehicleTypes;
  price_per_km?: number;
  base_price?: number;
  is_active?: boolean;
}

export interface CreateVehicleRequest {
  vehicle_type: VehicleTypes;
  vehicle_make: string;
  vehicle_model: string;
  is_active?: boolean;
}

export interface UpdateVehicleRequest {
  vehicle_type?: VehicleTypes;
  vehicle_make?: string;
  vehicle_model?: string;
  is_active?: boolean;
}

export interface PricingRuleResult {
  id: string;
  vehicle_type: VehicleTypes;
  price_per_km: number;
  base_price: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface VehicleListResult {
  id: string;
  vehicle_type: VehicleTypes;
  vehicle_make: string;
  vehicle_model: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface GetConfigurationsResult {
  vehicles: VehicleListResult[];
  pricing_rules: PricingRuleResult[];
}
