import { BaseApplicationEntity } from "#/domain/entities/ApplicationEntity";
import { AdminComment } from "#/domain/ValueObjects/AdminComment";
import {
  ApplicationStatus,
  ApplicationType,
  QueryDTO,
} from "@sharemyride/shared";

export type GetAllApplicationsQueryDTO = QueryDTO<BaseApplicationEntity>;

export interface GetAllApplicationsResponseDTO {
  applicationId: string;
  userId: string;
  applicationType: ApplicationType;
  applicationStatus: ApplicationStatus;
  createdAt: Date;
}

export interface ProcessApplicationRequestDTO {
  applicationId: string;
  adminComment: AdminComment;
  applicationStatus: ApplicationStatus;
}
