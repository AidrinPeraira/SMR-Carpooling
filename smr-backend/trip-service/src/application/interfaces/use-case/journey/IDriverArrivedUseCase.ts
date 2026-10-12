import { DriverArrivedRequestDTO } from "#/application/dto/journey/DriverArrivedDTO";

/**
 * This use case validates that the driver has arrived
 * within the designated range of given location. It
 * throws an error otherwise
 */
export interface IDriverArrivedUseCase {
  execute(dto: DriverArrivedRequestDTO, driverId: string): Promise<void>;
}
