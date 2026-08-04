import { ChangeDriverStatusDTO } from "#/application/dto/driver/ChangeDriverStatusDTO";

export interface IChangeDriverStatusUseCase {
  execute(data: ChangeDriverStatusDTO): Promise<void>;
}
