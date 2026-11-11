import { CreateNewPassengerRequestDTO } from "#/application/dto/passenger/CreateNewPassengerRequestDTO";

/**
 * This use case creates a new passenger record
 * with new user data
 */
export interface ICreateNewPassengerUseCase {
  execute(data: CreateNewPassengerRequestDTO): Promise<void>;
}
