import { ProcessApplicationRequestDTO } from "#/application/dto/admin/application/AdminApplicationsDTO";

/**
 * THis use case process driver appliation and updates the application status
 * it also adds an admin comment to track the application lifecycle.
 *
 * This use case also publishes an event on approval for trip service to update its DB.
 */
export interface IPocessApplicationUseCase {
  execute(data: ProcessApplicationRequestDTO): Promise<void>;
}
