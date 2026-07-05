import {
  GetUserResultDTO,
  UpdateUserRequestDTO,
} from "#/application/dto/profile/UserProfileDTO";

export interface IUpdateUserUseCase {
  execute(data: UpdateUserRequestDTO): Promise<GetUserResultDTO>;
}
