import { AddDriverRequestDTO } from "#/application/dto/driver/AddDriverRequestDTO";

/**
 * THis methos creates a new driver with driver records data
 * from application approval events
 */
export interface IAddDriverUseCase {
  execute(data: AddDriverRequestDTO): Promise<void>;
}
