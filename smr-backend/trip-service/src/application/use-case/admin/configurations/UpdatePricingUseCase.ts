import {
  UpdatePricingRequestDTO,
  UpdatePricingResultDTO,
} from "#/application/dto/admin/ConfigurationDTO";
import { IPricingRulesRepository } from "#/application/interfaces/repository/IPricingRulesRepository";
import { IConfigurationStore } from "#/application/interfaces/store/IConfigurationsStore";
import { IUpdatePricingUseCase } from "#/application/interfaces/use-case/admin/configurations/IUpdatePricingUseCase";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  PricingConfigMessages,
} from "@sharemyride/shared";

/**
 * This class implements the use case to update the pricing
 * for each vehicle type and also update status
 * It updates pricing cache in store with latest data when updated
 */
export class UpdatePricingUseCase implements IUpdatePricingUseCase {
  constructor(
    private readonly _pricingRepository: IPricingRulesRepository,
    private readonly _configStore: IConfigurationStore,
  ) {}

  /**
   * This method takes the dto with updated pricing data and
   * updates the config table with new rates.
   * It also updates the cached data in config store with latest pricing rules.
   *
   * @param data : Pricing details for change
   * @returns Updated pricing details
   */
  async execute(
    data: UpdatePricingRequestDTO,
  ): Promise<UpdatePricingResultDTO> {
    if (data.basePrice !== undefined && data.basePrice <= 0) {
      throw new ApplicationError(
        PricingConfigMessages.INVALID_PRICING_VALUES,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        ErrorDetails.INPUT_VALIDATION_ERROR,
        {
          location: "UpdatePricingUseCase",
          description: "Price per km and base price must be greater than zero.",
        },
      );
    }

    if (data.pricePerKm !== undefined && data.pricePerKm <= 0) {
      throw new ApplicationError(
        PricingConfigMessages.INVALID_PRICING_VALUES,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        ErrorDetails.INPUT_VALIDATION_ERROR,
        {
          location: "UpdatePricingUseCase",
          description: "Price per km and base price must be greater than zero.",
        },
      );
    }

    const newPricing = await this._pricingRepository.updateById(data.id, data);

    if (!newPricing) {
      throw new ApplicationError(
        PricingConfigMessages.PRICING_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "UpdatePricingUseCase",
          description: "Pricing configuration rule not found for the given ID.",
        },
      );
    }

    const updatedList = await this._pricingRepository.findAll();
    await this._configStore.setPricingRules(updatedList || []);

    return {
      pricingRule: newPricing,
    };
  }
}
