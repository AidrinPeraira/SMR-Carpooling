import { ApplicationStatus, ApplicationType } from "@sharemyride/shared";

export interface GetApplicationsResultDTO {
  applicationId: string;
  applicationType: ApplicationType;
  applicationStatus: ApplicationStatus;
  createdAt: Date;
}
