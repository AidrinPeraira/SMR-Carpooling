import { AdminComment } from "#/domain/ValueObjects/AdminComment";
import { ApplicationStatus, ApplicationType } from "@sharemyride/shared";

export interface ApplicationEntity {
  applicationId: string;
  userId: string;
  applicationType: ApplicationType;
  applicationStatus: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  adminComments?: AdminComment[];
}
