import { RejectCallRequestDTO } from "#/application/dto/CallDTO";

export interface IRejectCallUseCase {
  execute(dto: RejectCallRequestDTO): Promise<void>;
}
