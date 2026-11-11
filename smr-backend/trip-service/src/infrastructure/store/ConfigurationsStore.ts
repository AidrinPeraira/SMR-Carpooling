import { IConfigurationStore } from "#/application/interfaces/store/IConfigurationsStore";
import {
  PricingRules,
  VehicleList,
} from "#/domain/entities/ConfigurationEntities";
import { VehicleListNames } from "@sharemyride/shared";
import { RedisClientType } from "redis";

/**
 * Implementation for configuration store caching layer using Redis.
 * Caches vehicle list and pricing rules for the service.
 */
export class ConfigurationStore implements IConfigurationStore {
  constructor(private readonly _redisClient: RedisClientType) {}

  /**
   * Retrieves cached vehicle list array from Redis store
   *
   * @returns Array of vehicle list items or null if cache miss
   */
  async getVehicleList(): Promise<VehicleList[] | null> {
    const data = await this._redisClient.get(
      VehicleListNames.VEHICLE_LIST_STORE,
    );
    if (!data) return null;
    return JSON.parse(data) as VehicleList[];
  }

  /**
   * Caches vehicle list array in Redis store
   *
   * @param vehicles Array of vehicle list items to cache
   */
  async setVehicleList(vehicles: VehicleList[]): Promise<void> {
    await this._redisClient.set(
      VehicleListNames.VEHICLE_LIST_STORE,
      JSON.stringify(vehicles),
    );
  }

  /**
   * Retrieves cached pricing rules array from Redis store
   *
   * @returns Array of pricing rules or null if cache miss
   */
  async getPricingRules(): Promise<PricingRules[] | null> {
    const data = await this._redisClient.get(
      VehicleListNames.PRICING_LIST_STORE,
    );
    if (!data) return null;
    return JSON.parse(data) as PricingRules[];
  }

  /**
   * Caches pricing rules array in Redis store
   *
   * @param pricingRules Array of pricing rules to cache
   */
  async setPricingRules(pricingRules: PricingRules[]): Promise<void> {
    await this._redisClient.set(
      VehicleListNames.PRICING_LIST_STORE,
      JSON.stringify(pricingRules),
    );
  }

  /**
   * Invalidates specific cache key in Redis store
   *
   * @param key Redis cache key to delete
   */
  async invalidateCache(key: string): Promise<void> {
    await this._redisClient.del(key);
  }
}
