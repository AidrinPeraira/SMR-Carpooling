import { DriverMarkDropOffRequestDTO } from "#/application/dto/trip/ActiveJourneyDTO";

/**
 * This use case marks a passenger as dropped off once the driver
 * is at their drop off stop.
 */
export interface IDriverMarkDropOffUseCase {
  execute(dto: DriverMarkDropOffRequestDTO): Promise<void>;
}
