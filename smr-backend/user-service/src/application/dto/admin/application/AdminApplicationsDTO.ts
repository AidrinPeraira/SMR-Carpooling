import { AdminComment } from "#/domain/ValueObjects/AdminComment";
import {
  ApplicationStatus,
  ApplicationType,
  QueryDTO,
} from "@sharemyride/shared";

export type GetAllApplicationsQueryDTO =
  QueryDTO<GetAllApplicationsResponseDTO>;

export interface GetAllApplicationsResponseDTO {
  applicationId: string;
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  applicationType: ApplicationType;
  applicationStatus: ApplicationStatus;
  createdAt: Date;
}

export interface ProcessApplicationRequestDTO {
  applicationId: string;
  adminComment: AdminComment;
  applicationStatus: ApplicationStatus;
}
