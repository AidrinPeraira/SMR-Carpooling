import {
  UpdatePricingRequestDTO,
  UpdatePricingResultDTO,
} from "#/application/dto/admin/ConfigurationDTO";

/**
 * This use case handles modifying existing pricings
 * It also updates the in memory store on change
 */
export interface IUpdatePricingUseCase {
  execute(data: UpdatePricingRequestDTO): Promise<UpdatePricingResultDTO>;
}
