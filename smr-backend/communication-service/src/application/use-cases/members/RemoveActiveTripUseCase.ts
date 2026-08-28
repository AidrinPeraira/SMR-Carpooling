import { IRemoveActiveTripUseCase } from "#/application/interfaces/use-cases/IRemoveActiveTripUseCase";
import { IMemberRepository } from "#/application/interfaces/repository/IMemberRepository";
import { RemoveActiveTripRequestDTO } from "#/application/dto/MemberDTO";

export class RemoveActiveTripUseCase implements IRemoveActiveTripUseCase {
  constructor(private readonly _memberRepository: IMemberRepository) {}

  async execute(dto: RemoveActiveTripRequestDTO): Promise<void> {
    await this._memberRepository.removeActiveTrip(dto.userId, dto.tripId);
  }
}
