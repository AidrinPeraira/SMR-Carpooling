import {
  PricingRules,
  VehicleList,
} from "#/domain/entities/ConfigurationEntities";

/**
 * Interface for configration store operations. This acts as a caching layer.
 * It caches service wide configurtations for all instances of a service to fetch
 */
export interface IConfigurationStore {
  getVehicleList(): Promise<VehicleList[] | null>;
  setVehicleList(vehicles: VehicleList[]): Promise<void>;
  getPricingRules(): Promise<PricingRules[] | null>;
  setPricingRules(pricingRules: PricingRules[]): Promise<void>;
  invalidateCache(key: string): Promise<void>;
}
