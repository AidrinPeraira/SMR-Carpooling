import { CreateJourneyRequestDTO } from "#/application/dto/JourneyDTO";
import { ICreateJourneyUseCase } from "#/application/interfaces/use-cases/journey/ICreateJourneyUseCase";
import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepsoitory";

export class CreateJourneyUseCase implements ICreateJourneyUseCase {
  constructor(private readonly _journeyRepository: IJourneyRepository) {}

  async execute(dto: CreateJourneyRequestDTO): Promise<void> {
    await this._journeyRepository.save({
      journeyId: dto.journeyId,
      driverId: dto.driverId,
      members: dto.membersIDs.map((memberId) => ({ memberId })),
      isActive: true,
    });
  }
}
