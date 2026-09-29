import { AddActiveTripRequestDTO } from "#/application/dto/MemberDTO";

/**
 * This use case handles adding a new tripId
 * to the active trips in Member Entity
 */
export interface IAddActiveTripUseCase {
  execute(dto: AddActiveTripRequestDTO): Promise<void>;
}
