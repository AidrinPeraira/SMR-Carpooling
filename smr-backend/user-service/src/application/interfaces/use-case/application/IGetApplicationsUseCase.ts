import { GetApplicationsResultDTO } from "#/application/dto/application/GetApplicationsResultDTO";

/**
 * This user case gets all applications belongin to a user, using user id
 */
export interface IGetApplicationsUseCase {
  execute(userId: string, search?: string): Promise<GetApplicationsResultDTO[]>;
}
