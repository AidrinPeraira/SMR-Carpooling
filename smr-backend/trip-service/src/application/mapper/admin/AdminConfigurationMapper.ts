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
  CreatePricingRequest,
  CreateVehicleRequest,
  GetConfigurationsResult,
  PricingRuleResult,
  UpdatePricingRequest,
  UpdateVehicleRequest,
  VehicleListResult,
} from "@sharemyride/shared";

export class AdminConfigurationMapper {
  static toCreatePricingRequestDTO(
    body: CreatePricingRequest,
  ): CreateNewPricingRequestDTO {
    return {
      vehicleType: body.vehicle_type,
      pricePerKm: body.price_per_km,
      basePrice: body.base_price,
    };
  }

  static toUpdatePricingRequestDTO(
    id: string,
    body: UpdatePricingRequest,
  ): UpdatePricingRequestDTO {
    return {
      id,
      vehicleType: body.vehicle_type,
      pricePerKm: body.price_per_km,
      basePrice: body.base_price,
      isActive: body.is_active,
    };
  }

  static toCreateVehicleRequestDTO(
    body: CreateVehicleRequest,
  ): CreateNewVehicleRequestDTO {
    return {
      vehicleType: body.vehicle_type,
      vehicleMake: body.vehicle_make,
      vehicleModel: body.vehicle_model,
      isActive: body.is_active,
    };
  }

  static toUpdateVehicleRequestDTO(
    id: string,
    body: UpdateVehicleRequest,
  ): UpdateVehicleRequestDTO {
    return {
      id,
      vehicleType: body.vehicle_type,
      vehicleMake: body.vehicle_make,
      vehicleModel: body.vehicle_model,
      isActive: body.is_active,
    };
  }

  static toPricingRuleResponse(
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

  static toVehicleListResponse(
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

  static toGetConfigurationsResponse(
    result: GetConfigurationsResultDTO,
  ): GetConfigurationsResult {
    return {
      vehicles: result.vehicles.map((v) => this.toVehicleListResponse(v)),
      pricing_rules: result.pricingRules.map((p) =>
        this.toPricingRuleResponse(p),
      ),
    };
  }
}
