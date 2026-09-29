import { CreateNewMemberRequestDTO } from "#/application/dto/MemberDTO";
import { IMemberRepository } from "#/application/interfaces/repository/IMemberRepository";
import { ICreateMemberUseCase } from "#/application/interfaces/use-cases/members/ICreateMemberUseCase";

/**
 * This class implements the use case that creates
 * a new meber document in the member collection
 * for the communication service use
 */
export class CreateMemberUseCase implements ICreateMemberUseCase {
  constructor(private readonly _memberRespository: IMemberRepository) {}

  async execute(dto: CreateNewMemberRequestDTO): Promise<void> {
    const now = new Date();

    await this._memberRespository.save({
      firstName: dto.firstName,
      lastName: dto.lastName,
      memberId: dto.userId,
      activeTrips: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
