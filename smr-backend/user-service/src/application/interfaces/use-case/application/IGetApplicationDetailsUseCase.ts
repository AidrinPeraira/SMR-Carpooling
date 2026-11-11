import { GetApplicationDetailsResultDTO } from "#/application/dto/application/GetApplicationDetailsResultDTO";

/**
 * This use case fethes complete appliaction details including the related records.
 */
export interface IGetApplicationDetailsUseCase {
  execute(applicationId: string): Promise<GetApplicationDetailsResultDTO>;
}
