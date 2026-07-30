import { VehicleTypes } from "../../enums";

export interface CreatePricingRequestAPI {
  vehicle_type: VehicleTypes;
  price_per_km: number;
  base_price: number;
}

export interface UpdatePricingRequestAPI {
  vehicle_type?: VehicleTypes;
  price_per_km?: number;
  base_price?: number;
  is_active?: boolean;
}

export interface CreateVehicleRequestAPI {
  vehicle_type: VehicleTypes;
  vehicle_make: string;
  vehicle_model: string;
  is_active?: boolean;
}

export interface UpdateVehicleRequestAPI {
  vehicle_type?: VehicleTypes;
  vehicle_make?: string;
  vehicle_model?: string;
  is_active?: boolean;
}

export interface PricingRuleResponseAPI {
  id: string;
  vehicle_type: VehicleTypes;
  price_per_km: number;
  base_price: number;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface VehicleListResponseAPI {
  id: string;
  vehicle_type: VehicleTypes;
  vehicle_make: string;
  vehicle_model: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface GetConfigurationsResponseAPI {
  vehicles: VehicleListResponseAPI[];
  pricing_rules: PricingRuleResponseAPI[];
}
