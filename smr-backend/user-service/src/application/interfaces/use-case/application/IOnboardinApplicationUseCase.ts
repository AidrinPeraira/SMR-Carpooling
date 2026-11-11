import { OnboardingApplicationRequestDTO } from "#/application/dto/application/OnboardingApplicationRequestDTO";

/**
 * THis use case creates a new onboarding application and creates the record documents
 */
export interface IOnboardingApplicationUseCase {
  execute(data: OnboardingApplicationRequestDTO): Promise<void>;
}
