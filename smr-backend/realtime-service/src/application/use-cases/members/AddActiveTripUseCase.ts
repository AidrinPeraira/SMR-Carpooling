import { AddActiveTripRequestDTO } from "#/application/dto/MemberDTO";
import { IMemberRepository } from "#/application/interfaces/repository/IMemberRepository";
import { IAddActiveTripUseCase } from "#/application/interfaces/use-cases/members/IAddActiveTripUseCase";

/**
 * This class implements the use case that
 * adds a trip id to the activ trip ids field
 * for members. It pushes the new tripId into the existing array
 */
export class AddActiveTripUseCase implements IAddActiveTripUseCase {
  constructor(private readonly _memberRepository: IMemberRepository) {}

  /**
   * This method adds the new trip id to the given member
   * in member repository that matches the given user id
   * It pushes the value into active trips list.
   *
   * @param dto: user id and trip id
   */
  async execute(dto: AddActiveTripRequestDTO): Promise<void> {
    await this._memberRepository.addActiveTrip(dto.userId, dto.tripId);
  }
}
