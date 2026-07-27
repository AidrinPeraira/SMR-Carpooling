import {
  CreateNewPricingRequestDTO,
  CreateNewPricingResultDTO,
} from "#/application/dto/admin/ConfigurationDTO";

/**
 * This use case creates a new pricing. It prevents duplicates.
 * It updates the in memory store config data on change
 */
export interface ICreateNewPricingUseCase {
  execute(data: CreateNewPricingRequestDTO): Promise<CreateNewPricingResultDTO>;
}
