import { ConfigurationStore } from "#/infrastructure/store/ConfigurationsStore";
import { PricingRules, VehicleList } from "#/domain/entities/ConfigurationEntities";
import { VehicleListNames, VehicleTypes } from "@sharemyride/shared";
import { describe, expect, it, vi, beforeEach } from "vitest";

describe("ConfigurationStore", () => {
  let store: ConfigurationStore;
  let mockRedisClient: any;

  beforeEach(() => {
    mockRedisClient = {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
    };
    store = new ConfigurationStore(mockRedisClient);
  });

  describe("getVehicleList", () => {
    it("should return parsed vehicle list when data exists in Redis", async () => {
      const mockVehicles: VehicleList[] = [
        {
          id: "v1",
          vehicleMake: "Toyota",
          vehicleModel: "Camry",
          vehicleType: VehicleTypes.SEDAN,
          isActive: true,
        },
      ];
      mockRedisClient.get.mockResolvedValue(JSON.stringify(mockVehicles));

      const result = await store.getVehicleList();

      expect(mockRedisClient.get).toHaveBeenCalledWith(
        VehicleListNames.VEHICLE_LIST_STORE,
      );
      expect(result).toEqual(mockVehicles);
    });

    it("should return null when Redis returns null", async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await store.getVehicleList();

      expect(mockRedisClient.get).toHaveBeenCalledWith(
        VehicleListNames.VEHICLE_LIST_STORE,
      );
      expect(result).toBeNull();
    });
  });

  describe("setVehicleList", () => {
    it("should serialize and store vehicle list in Redis", async () => {
      const mockVehicles: VehicleList[] = [
        {
          id: "v1",
          vehicleMake: "Toyota",
          vehicleModel: "Camry",
          vehicleType: VehicleTypes.SEDAN,
          isActive: true,
        },
      ];

      await store.setVehicleList(mockVehicles);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        VehicleListNames.VEHICLE_LIST_STORE,
        JSON.stringify(mockVehicles),
      );
    });
  });

  describe("getPricingRules", () => {
    it("should return parsed pricing rules when data exists in Redis", async () => {
      const mockRules: PricingRules[] = [
        {
          id: "p1",
          vehicleType: VehicleTypes.SEDAN,
          pricePerKm: 1.5,
          basePrice: 5.0,
          isActive: true,
        },
      ];
      mockRedisClient.get.mockResolvedValue(JSON.stringify(mockRules));

      const result = await store.getPricingRules();

      expect(mockRedisClient.get).toHaveBeenCalledWith(
        VehicleListNames.PRICING_LIST_STORE,
      );
      expect(result).toEqual(mockRules);
    });

    it("should return null when Redis returns null", async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await store.getPricingRules();

      expect(mockRedisClient.get).toHaveBeenCalledWith(
        VehicleListNames.PRICING_LIST_STORE,
      );
      expect(result).toBeNull();
    });
  });

  describe("setPricingRules", () => {
    it("should serialize and store pricing rules in Redis", async () => {
      const mockRules: PricingRules[] = [
        {
          id: "p1",
          vehicleType: VehicleTypes.SEDAN,
          pricePerKm: 1.5,
          basePrice: 5.0,
          isActive: true,
        },
      ];

      await store.setPricingRules(mockRules);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        VehicleListNames.PRICING_LIST_STORE,
        JSON.stringify(mockRules),
      );
    });
  });

  describe("invalidateCache", () => {
    it("should delete specified cache key from Redis", async () => {
      const cacheKey = "custom-key";

      await store.invalidateCache(cacheKey);

      expect(mockRedisClient.del).toHaveBeenCalledWith(cacheKey);
    });
  });
});
