import { DriverArrivedAtStopRequestDTO } from "#/application/dto/trip/ActiveJourneyDTO";

/**
 * This use case validates the driver arriving at a stop
 * by verifiying agians passengerId , stopType and journeyStop
 * It updates arrived time for in journey entity only if the driver sent location is within a a range of 200m
 */
export interface IDriverArrivedAtStopUseCase {
  execute(dto: DriverArrivedAtStopRequestDTO): Promise<void>;
}
