import { CreateNewMemberRequestDTO } from "#/application/dto/MemberDTO";

/**
 * This use case handles creating a new mebmber
 * to create a redundant data copy of users
 * for the communication service
 */
export interface ICreateMemberUseCase {
  execute(dto: CreateNewMemberRequestDTO): Promise<void>;
}
