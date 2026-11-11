import { CreatePayoutRequestDTO } from "#/application/dto/payout/CreatePayoutDTO";

/**
 * This use case creates a pending payout record
 * when a passenger is dropped off during a journey.
 */
export interface ICreatePayoutUseCase {
  execute(dto: CreatePayoutRequestDTO): Promise<void>;
}
