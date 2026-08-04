import { ResubmitOnboardingApplicationRequestDTO } from "#/application/dto/application/ResubmitOnboardingApplicationRequestDTO";

/**
 * This use case resubmits a returned onboarding application and updates the records
 */
export interface IResubmitOnboardingApplicationUseCase {
  execute(data: ResubmitOnboardingApplicationRequestDTO): Promise<void>;
}
