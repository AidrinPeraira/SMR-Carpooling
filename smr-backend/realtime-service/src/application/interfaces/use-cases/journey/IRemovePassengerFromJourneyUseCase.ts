import { RemovePassengerFromJourneyRequestDTO } from "#/application/dto/JourneyDTO";

export interface IRemovePassengerFromJourneyUseCase {
  execute(dto: RemovePassengerFromJourneyRequestDTO): Promise<void>;
}
