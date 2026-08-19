import { UnblockPassengerDTO } from "#/application/dto/passenger/UnblockPassengerDTO";

/**
 * Interface for the use case to unblock a passenger
 */
export interface IUnblockPassengerUseCase {
  execute(data: UnblockPassengerDTO): Promise<void>;
}
