import { DropOffRequestDTO } from "#/application/dto/journey/DropOffDTO";

/**
 * This use case verifies that the driver
 * is within range of drop off and has succesfully
 * completed passenger dropoff. It publishes event
 * to remove passenger from journey live tracking
 */
export interface IDriverVerifyPassengerDropOffUseCase {
  execute(dto: DropOffRequestDTO, driverId: string): Promise<void>;
}
