import { AddPlacesRequestDTO } from "#/application/dto/admin/AddPlacesRequestDTO";

/**
 * This use case adds a list of predefined places to
 * the places repository. (The repository internaly adds any indexing as needed)
 */
export interface IAddPlacesUseCase {
  execute(data: AddPlacesRequestDTO[]): Promise<void>;
}
