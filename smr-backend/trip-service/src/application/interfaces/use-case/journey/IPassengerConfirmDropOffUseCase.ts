import { DropOffRequestDTO } from "#/application/dto/journey/DropOffDTO";

/**
 * This use case confirms passenger drop off
 * via passenger request (for different drop off location)
 * or skips action if already completed by driver. It publishes
 * event to remove passenger from live tracking if needed
 */
export interface IPassengerConfirmDropOffUseCase {
  execute(dto: DropOffRequestDTO, passengerId: string): Promise<void>;
}
