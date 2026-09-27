import { DriverGetActiveJourneyResponseDTO } from "#/application/dto/trip/ActiveJourneyDTO";

/**
 * THis use case finds details of the active journey
 * and also the journey particiapants and aggrates it for
 * the driver side view.
 */
export interface IDriverGetActiveJourneyUseCase {
  execute(driverId: string): Promise<DriverGetActiveJourneyResponseDTO>;
}
