import { DriverCompleteJourneyRequestDTO } from "#/application/dto/trip/ActiveJourneyDTO";

/**
 * This use case closes an ongoing journey, the trip it tracks
 * and the bookings of the passengers that were dropped off.
 */
export interface IDriverCompleteJourneyUseCase {
  execute(dto: DriverCompleteJourneyRequestDTO): Promise<void>;
}
