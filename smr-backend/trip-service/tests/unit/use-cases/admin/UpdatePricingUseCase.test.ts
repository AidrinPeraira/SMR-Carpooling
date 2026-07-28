import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdatePricingUseCase } from "#/application/use-case/admin/configurations/UpdatePricingUseCase";
import { mockPricingRulesRepository } from "&#/mocks/MockPricingRulesRepository";
import { mockConfigurationStore } from "&#/mocks/MockConfigurationStore";
import { createMockPricingRules } from "&#/fixtures/dto/ConfigurationData";
import {
  ApplicationError,
  ErrorCode,
  HttpStatusCodes,
  PricingConfigMessages,
} from "@sharemyride/shared";

describe("UpdatePricingUseCase", () => {
  const useCase = new UpdatePricingUseCase(
    mockPricingRulesRepository,
    mockConfigurationStore,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update pricing configuration and refresh config store cache", async () => {
    // Arrange
    const request = {
      id: "pricing-123",
      pricePerKm: 25,
      basePrice: 70,
    };

    const updatedPricing = createMockPricingRules({
      id: "pricing-123",
      pricePerKm: 25,
      basePrice: 70,
    });

    const allPricing = [updatedPricing];

    vi.mocked(mockPricingRulesRepository.updateById).mockResolvedValue(
      updatedPricing,
    );
    vi.mocked(mockPricingRulesRepository.findAll).mockResolvedValue(allPricing);

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(mockPricingRulesRepository.updateById).toHaveBeenCalledWith(
      "pricing-123",
      request,
    );
    expect(mockPricingRulesRepository.findAll).toHaveBeenCalled();
    expect(mockConfigurationStore.setPricingRules).toHaveBeenCalledWith(allPricing);
    expect(result).toEqual({ pricingRule: updatedPricing });
  });

  it("should throw ApplicationError when basePrice is <= 0", async () => {
    // Arrange
    const request = {
      id: "pricing-123",
      basePrice: 0,
    };

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(ApplicationError);
    await expect(useCase.execute(request)).rejects.toMatchObject({
      message: PricingConfigMessages.INVALID_PRICING_VALUES,
      statusCode: HttpStatusCodes.BadRequest,
      errorCode: ErrorCode.INPUT_VALIDATION_ERROR,
    });

    expect(mockPricingRulesRepository.updateById).not.toHaveBeenCalled();
  });

  it("should throw ApplicationError when pricePerKm is <= 0", async () => {
    // Arrange
    const request = {
      id: "pricing-123",
      pricePerKm: -10,
    };

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(ApplicationError);
    await expect(useCase.execute(request)).rejects.toMatchObject({
      message: PricingConfigMessages.INVALID_PRICING_VALUES,
      statusCode: HttpStatusCodes.BadRequest,
      errorCode: ErrorCode.INPUT_VALIDATION_ERROR,
    });

    expect(mockPricingRulesRepository.updateById).not.toHaveBeenCalled();
  });

  it("should throw ApplicationError when pricing rule is not found", async () => {
    // Arrange
    const request = {
      id: "non-existent-id",
      pricePerKm: 30,
    };

    vi.mocked(mockPricingRulesRepository.updateById).mockResolvedValue(null as any);

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(ApplicationError);
    await expect(useCase.execute(request)).rejects.toMatchObject({
      message: PricingConfigMessages.PRICING_NOT_FOUND,
      statusCode: HttpStatusCodes.NotFound,
      errorCode: ErrorCode.DOMAIN_NOT_FOUND,
    });

    expect(mockConfigurationStore.setPricingRules).not.toHaveBeenCalled();
  });

  it("should handle null response from pricingRepository.findAll cleanly", async () => {
    // Arrange
    const request = { id: "pricing-123", pricePerKm: 25 };
    const updatedPricing = createMockPricingRules({ id: "pricing-123" });

    vi.mocked(mockPricingRulesRepository.updateById).mockResolvedValue(
      updatedPricing,
    );
    vi.mocked(mockPricingRulesRepository.findAll).mockResolvedValue(null);

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(mockConfigurationStore.setPricingRules).toHaveBeenCalledWith([]);
    expect(result).toEqual({ pricingRule: updatedPricing });
  });
});
