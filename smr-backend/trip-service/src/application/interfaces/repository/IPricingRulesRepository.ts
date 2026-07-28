import { PricingRules } from "#/domain/entities/ConfigurationEntities";
import { VehicleTypes } from "@sharemyride/shared";

/**
 * This is the repository interface for vehicle pricing data
 */
export interface IPricingRulesRepository {
  save(data: Omit<PricingRules, "id">): Promise<PricingRules>;

  findAll(): Promise<PricingRules[] | null>;

  findByVehicleType(type: VehicleTypes): Promise<PricingRules | null>;

  updateById(id: string, data: Partial<PricingRules>): Promise<PricingRules>;
}
