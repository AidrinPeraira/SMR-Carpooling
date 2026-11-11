import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateNewPricingUseCase } from "#/application/use-case/admin/configurations/CreateNewPricingUseCase";
import { mockPricingRulesRepository } from "&#/mocks/MockPricingRulesRepository";
import { mockConfigurationStore } from "&#/mocks/MockConfigurationStore";
import {
  createMockPricingRules,
  createPricingRequestDTO,
} from "&#/fixtures/dto/ConfigurationData";
import {
  ApplicationError,
  ErrorCode,
  HttpStatusCodes,
  PricingConfigMessages,
  VehicleTypes,
} from "@sharemyride/shared";

describe("CreateNewPricingUseCase", () => {
  const useCase = new CreateNewPricingUseCase(
    mockPricingRulesRepository,
    mockConfigurationStore,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new pricing configuration and update config store cache", async () => {
    // Arrange
    const request = createPricingRequestDTO({
      vehicleType: VehicleTypes.SEDAN,
      pricePerKm: 20,
      basePrice: 60,
    });

    const savedPricing = createMockPricingRules({
      vehicleType: VehicleTypes.SEDAN,
      pricePerKm: 20,
      basePrice: 60,
    });

    const allPricing = [savedPricing];

    vi.mocked(mockPricingRulesRepository.findByVehicleType).mockResolvedValue(null);
    vi.mocked(mockPricingRulesRepository.save).mockResolvedValue(savedPricing);
    vi.mocked(mockPricingRulesRepository.findAll).mockResolvedValue(allPricing);

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(mockPricingRulesRepository.findByVehicleType).toHaveBeenCalledWith(
      VehicleTypes.SEDAN,
    );
    expect(mockPricingRulesRepository.save).toHaveBeenCalledWith({
      vehicleType: VehicleTypes.SEDAN,
      pricePerKm: 20,
      basePrice: 60,
      isActive: true,
    });
    expect(mockPricingRulesRepository.findAll).toHaveBeenCalled();
    expect(mockConfigurationStore.setPricingRules).toHaveBeenCalledWith(allPricing);
    expect(result).toEqual({ pricingRule: savedPricing });
  });

  it("should throw ApplicationError when pricePerKm is <= 0", async () => {
    // Arrange
    const request = createPricingRequestDTO({
      pricePerKm: 0,
      basePrice: 50,
    });

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(ApplicationError);
    await expect(useCase.execute(request)).rejects.toMatchObject({
      message: PricingConfigMessages.INVALID_PRICING_VALUES,
      statusCode: HttpStatusCodes.BadRequest,
      errorCode: ErrorCode.INPUT_VALIDATION_ERROR,
    });

    expect(mockPricingRulesRepository.findByVehicleType).not.toHaveBeenCalled();
    expect(mockPricingRulesRepository.save).not.toHaveBeenCalled();
  });

  it("should throw ApplicationError when basePrice is <= 0", async () => {
    // Arrange
    const request = createPricingRequestDTO({
      pricePerKm: 15,
      basePrice: -5,
    });

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(ApplicationError);
    await expect(useCase.execute(request)).rejects.toMatchObject({
      message: PricingConfigMessages.INVALID_PRICING_VALUES,
      statusCode: HttpStatusCodes.BadRequest,
      errorCode: ErrorCode.INPUT_VALIDATION_ERROR,
    });

    expect(mockPricingRulesRepository.findByVehicleType).not.toHaveBeenCalled();
  });

  it("should throw ApplicationError when pricing configuration already exists for vehicle type", async () => {
    // Arrange
    const request = createPricingRequestDTO({
      vehicleType: VehicleTypes.SEDAN,
    });

    const existingPricing = createMockPricingRules({
      vehicleType: VehicleTypes.SEDAN,
    });

    vi.mocked(mockPricingRulesRepository.findByVehicleType).mockResolvedValue(
      existingPricing,
    );

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(ApplicationError);
    await expect(useCase.execute(request)).rejects.toMatchObject({
      message: PricingConfigMessages.PRICING_EXISTS,
      statusCode: HttpStatusCodes.Conflict,
      errorCode: ErrorCode.DOMAIN_ALREADY_EXISTS,
    });

    expect(mockPricingRulesRepository.save).not.toHaveBeenCalled();
    expect(mockConfigurationStore.setPricingRules).not.toHaveBeenCalled();
  });

  it("should handle null response from pricingRepository.findAll cleanly", async () => {
    // Arrange
    const request = createPricingRequestDTO();
    const savedPricing = createMockPricingRules();

    vi.mocked(mockPricingRulesRepository.findByVehicleType).mockResolvedValue(null);
    vi.mocked(mockPricingRulesRepository.save).mockResolvedValue(savedPricing);
    vi.mocked(mockPricingRulesRepository.findAll).mockResolvedValue(null);

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(mockConfigurationStore.setPricingRules).toHaveBeenCalledWith([]);
    expect(result).toEqual({ pricingRule: savedPricing });
  });
});
