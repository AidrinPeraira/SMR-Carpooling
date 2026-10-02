import { EndCallRequestDTO } from "#/application/dto/CallDTO";

export interface IEndCallUseCase {
  execute(dto: EndCallRequestDTO): Promise<void>;
}
