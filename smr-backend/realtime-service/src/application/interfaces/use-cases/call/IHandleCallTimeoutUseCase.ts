import { HandleCallTimeoutRequestDTO } from "#/application/dto/CallDTO";

export interface IHandleCallTimeoutUseCase {
  execute(dto: HandleCallTimeoutRequestDTO): Promise<void>;
}
