import { BlockPassengerDTO } from "#/application/dto/passenger/BlockPassengerDTO";

/**
 * Interface for the use case to block a passenger
 */
export interface IBlockPassengerUseCase {
  execute(data: BlockPassengerDTO): Promise<void>;
}
