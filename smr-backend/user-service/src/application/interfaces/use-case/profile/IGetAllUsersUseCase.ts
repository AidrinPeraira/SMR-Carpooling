import {
  GetAllUsersRequestQueryDTO,
  GetUserResultDTO,
} from "#/application/dto/profile/UserProfileDTO";

export interface IGetAllUsersUseCase {
  execute(query: GetAllUsersRequestQueryDTO): Promise<GetUserResultDTO[]>;
}
