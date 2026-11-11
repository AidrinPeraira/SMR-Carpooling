import {
  CreateNewPricingRequestDTO,
  CreateNewPricingResultDTO,
} from "#/application/dto/admin/ConfigurationDTO";
import { IPricingRulesRepository } from "#/application/interfaces/repository/IPricingRulesRepository";
import { IConfigurationStore } from "#/application/interfaces/store/IConfigurationsStore";
import { ICreateNewPricingUseCase } from "#/application/interfaces/use-case/admin/configurations/ICreateNewPricingUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  PricingConfigMessages,
} from "@sharemyride/shared";

/**
 * This is the implementation for the use case to create a new pricing configuration
 * It takes the vehicle type, rate per km and base price and creates a new pricing entry
 * It ensures that there is no active pricing for the same vehicle type.
 * It also updates configurations store with latest data to prevent stale cache.
 */
export class CreateNewPricingUseCase implements ICreateNewPricingUseCase {
  constructor(
    private readonly _pricingRepository: IPricingRulesRepository,
    private readonly _configStore: IConfigurationStore,
  ) {}

  /**
   * Creates a new pricing in pricing repository and updates config store
   *
   * @param data: Vehicle type, base price and rate per km
   * @returns CreateNewPricingResultDTO
   */
  async execute(
    data: CreateNewPricingRequestDTO,
  ): Promise<CreateNewPricingResultDTO> {
    if (data.pricePerKm <= 0 || data.basePrice <= 0) {
      throw new ApplicationError(
        PricingConfigMessages.INVALID_PRICING_VALUES,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        ErrorDetails.INPUT_VALIDATION_ERROR,
        {
          location: "CreateNewPricingUseCase",
          description: "Price per km and base price must be greater than zero.",
        },
      );
    }
    const existingPricing = await this._pricingRepository.findByVehicleType(
      data.vehicleType,
    );

    if (existingPricing) {
      throw new ApplicationError(
        PricingConfigMessages.PRICING_EXISTS,
        HttpStatusCodes.Conflict,
        ErrorCode.DOMAIN_ALREADY_EXISTS,
        ErrorDetails.DOMAIN_ALREADY_EXISTS,
        {
          location: "CreateNewPricingUseCase",
          description: `Pricing configuration already exists for vehicle type`,
        },
      );
    }

    const pricingRule = await this._pricingRepository.save({
      vehicleType: data.vehicleType,
      pricePerKm: data.pricePerKm,
      basePrice: data.basePrice,
      isActive: true,
    });

    const updatedList = await this._pricingRepository.findAll();
    await this._configStore.setPricingRules(updatedList || []);

    return { pricingRule };
  }
}
