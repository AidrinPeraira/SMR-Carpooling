import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import { PricingRules } from "#/domain/entities/ConfigurationEntities";
import { VehicleTypes } from "@sharemyride/shared";

/**
 * This is the repository interface for vehicle pricing data
 */
export interface IPricingRulesRepository extends IBaseRepository<PricingRules> {
  findByVehicleType(type: VehicleTypes): Promise<PricingRules | null>;
}
