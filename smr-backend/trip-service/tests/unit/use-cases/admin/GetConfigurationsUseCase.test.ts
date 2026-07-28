import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetConfigurationUseCase } from "#/application/use-case/admin/configurations/GetConfigurationsUseCase";
import { mockVehicleListRepository } from "&#/mocks/MockVehicleListRepository";
import { mockPricingRulesRepository } from "&#/mocks/MockPricingRulesRepository";
import { mockConfigurationStore } from "&#/mocks/MockConfigurationStore";
import {
  createMockPricingRules,
  createMockVehicleList,
} from "&#/fixtures/dto/ConfigurationData";

describe("GetConfigurationUseCase", () => {
  const useCase = new GetConfigurationUseCase(
    mockVehicleListRepository,
    mockPricingRulesRepository,
    mockConfigurationStore,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return configurations directly from cache when available", async () => {
    // Arrange
    const cachedPricing = [createMockPricingRules()];
    const cachedVehicles = [createMockVehicleList()];

    vi.mocked(mockConfigurationStore.getPricingRules).mockResolvedValue(cachedPricing);
    vi.mocked(mockConfigurationStore.getVehicleList).mockResolvedValue(cachedVehicles);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockConfigurationStore.getPricingRules).toHaveBeenCalled();
    expect(mockPricingRulesRepository.findAll).not.toHaveBeenCalled();
    expect(mockConfigurationStore.getVehicleList).toHaveBeenCalled();
    expect(mockVehicleListRepository.findAll).not.toHaveBeenCalled();

    expect(result).toEqual({
      pricingRules: cachedPricing,
      vehicles: cachedVehicles,
    });
  });

  it("should fetch from repositories and update store cache when cache misses", async () => {
    // Arrange
    const dbPricing = [createMockPricingRules()];
    const dbVehicles = [createMockVehicleList()];

    vi.mocked(mockConfigurationStore.getPricingRules).mockResolvedValue(null);
    vi.mocked(mockPricingRulesRepository.findAll).mockResolvedValue(dbPricing);

    vi.mocked(mockConfigurationStore.getVehicleList).mockResolvedValue(null);
    vi.mocked(mockVehicleListRepository.findAll).mockResolvedValue(dbVehicles);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockConfigurationStore.getPricingRules).toHaveBeenCalled();
    expect(mockPricingRulesRepository.findAll).toHaveBeenCalled();
    expect(mockConfigurationStore.setPricingRules).toHaveBeenCalledWith(dbPricing);

    expect(mockConfigurationStore.getVehicleList).toHaveBeenCalled();
    expect(mockVehicleListRepository.findAll).toHaveBeenCalled();
    expect(mockConfigurationStore.setVehicleList).toHaveBeenCalledWith(dbVehicles);

    expect(result).toEqual({
      pricingRules: dbPricing,
      vehicles: dbVehicles,
    });
  });

  it("should return empty arrays when cache and repositories return null", async () => {
    // Arrange
    vi.mocked(mockConfigurationStore.getPricingRules).mockResolvedValue(null);
    vi.mocked(mockPricingRulesRepository.findAll).mockResolvedValue(null);

    vi.mocked(mockConfigurationStore.getVehicleList).mockResolvedValue(null);
    vi.mocked(mockVehicleListRepository.findAll).mockResolvedValue(null);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockConfigurationStore.setPricingRules).not.toHaveBeenCalled();
    expect(mockConfigurationStore.setVehicleList).not.toHaveBeenCalled();

    expect(result).toEqual({
      pricingRules: [],
      vehicles: [],
    });
  });
});
