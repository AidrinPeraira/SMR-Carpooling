import { RemoveActiveTripRequestDTO } from "#/application/dto/MemberDTO";

/**
 * This use case removes a trip id from
 * the list of active trips in member entity
 */
export interface IRemoveActiveTripUseCase {
  execute(dto: RemoveActiveTripRequestDTO): Promise<void>;
}
