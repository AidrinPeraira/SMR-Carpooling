import {
  CreateNewPricingRequestDTO,
  CreateNewVehicleRequestDTO,
  GetConfigurationsResultDTO,
  UpdatePricingRequestDTO,
  UpdateVehicleRequestDTO,
} from "#/application/dto/admin/ConfigurationDTO";
import {
  PricingRules,
  VehicleList,
} from "#/domain/entities/ConfigurationEntities";
import {
  CreatePricingSchemaType,
  CreateVehicleSchemaType,
  GetConfigurationsResult,
  PricingRuleResult,
  UpdatePricingSchemaType,
  UpdateVehicleSchemaType,
  VehicleListResult,
} from "@sharemyride/shared";

export function toCreatePricingRequestDTO(
  body: CreatePricingSchemaType,
): CreateNewPricingRequestDTO {
  return {
    vehicleType: body.vehicle_type,
    pricePerKm: body.price_per_km,
    basePrice: body.base_price,
  };
}

export function toUpdatePricingRequestDTO(
  id: string,
  body: UpdatePricingSchemaType,
): UpdatePricingRequestDTO {
  return {
    id,
    vehicleType: body.vehicle_type,
    pricePerKm: body.price_per_km,
    basePrice: body.base_price,
    isActive: body.is_active,
  };
}

export function toCreateVehicleRequestDTO(
  body: CreateVehicleSchemaType,
): CreateNewVehicleRequestDTO {
  return {
    vehicleType: body.vehicle_type,
    vehicleMake: body.vehicle_make,
    vehicleModel: body.vehicle_model,
    isActive: body.is_active,
  };
}

export function toUpdateVehicleRequestDTO(
  id: string,
  body: UpdateVehicleSchemaType,
): UpdateVehicleRequestDTO {
  return {
    id,
    vehicleType: body.vehicle_type,
    vehicleMake: body.vehicle_make,
    vehicleModel: body.vehicle_model,
    isActive: body.is_active,
  };
}

export function toPricingRuleResponse(
  entity: PricingRules,
): PricingRuleResult {
  return {
    id: entity.id,
    vehicle_type: entity.vehicleType,
    price_per_km: entity.pricePerKm,
    base_price: entity.basePrice,
    is_active: entity.isActive,
  };
}

export function toVehicleListResponse(
  entity: VehicleList,
): VehicleListResult {
  return {
    id: entity.id,
    vehicle_type: entity.vehicleType,
    vehicle_make: entity.vehicleMake,
    vehicle_model: entity.vehicleModel,
    is_active: entity.isActive,
  };
}

export function toGetConfigurationsResponse(
  result: GetConfigurationsResultDTO,
): GetConfigurationsResult {
  return {
    vehicles: result.vehicles.map(toVehicleListResponse),
    pricing_rules: result.pricingRules.map(toPricingRuleResponse),
  };
}
