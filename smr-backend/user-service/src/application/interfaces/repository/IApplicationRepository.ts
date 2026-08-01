import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import {
  ApplicationEntity,
  BaseApplicationEntity,
} from "#/domain/entities/ApplicationEntity";

export interface IApplicationRepository extends IBaseRepository<BaseApplicationEntity> {
  findFullApplicationById(
    applicationId: string,
  ): Promise<ApplicationEntity | null>;
  findByUserId(userId: string): Promise<BaseApplicationEntity[]>;
  findPendingByUserId(userId: string): Promise<BaseApplicationEntity | null>;
}
