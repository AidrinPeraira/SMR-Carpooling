import {
  PricingRules,
  VehicleList,
} from "#/domain/entities/ConfigurationEntities";
import {
  CreateNewPricingRequestDTO,
  CreateNewVehicleRequestDTO,
} from "#/application/dto/admin/ConfigurationDTO";
import { VehicleTypes } from "@sharemyride/shared";

export function createMockPricingRules(
  override: Partial<PricingRules> = {},
): PricingRules {
  const defaultPricing: PricingRules = {
    id: "pricing-rule-1",
    vehicleType: VehicleTypes.SEDAN,
    pricePerKm: 15,
    basePrice: 50,
    isActive: true,
  };

  return {
    ...defaultPricing,
    ...override,
  };
}

export function createMockVehicleList(
  override: Partial<VehicleList> = {},
): VehicleList {
  const defaultVehicle: VehicleList = {
    id: "vehicle-1",
    vehicleType: VehicleTypes.SEDAN,
    vehicleMake: "Toyota",
    vehicleModel: "Camry",
    isActive: true,
  };

  return {
    ...defaultVehicle,
    ...override,
  };
}

export function createPricingRequestDTO(
  override: Partial<CreateNewPricingRequestDTO> = {},
): CreateNewPricingRequestDTO {
  const defaultDTO: CreateNewPricingRequestDTO = {
    vehicleType: VehicleTypes.SEDAN,
    pricePerKm: 15,
    basePrice: 50,
  };

  return {
    ...defaultDTO,
    ...override,
  };
}

export function createVehicleRequestDTO(
  override: Partial<CreateNewVehicleRequestDTO> = {},
): CreateNewVehicleRequestDTO {
  const defaultDTO: CreateNewVehicleRequestDTO = {
    vehicleType: VehicleTypes.SEDAN,
    vehicleMake: "Toyota",
    vehicleModel: "Camry",
  };

  return {
    ...defaultDTO,
    ...override,
  };
}
