import { DriverRecordEntity } from "#/domain/entities/DriverRecordEntity";
import { VehicleRecordEntity } from "#/domain/entities/VehicleRecordEntity";
import { AdminComment } from "#/domain/ValueObjects/AdminComment";
import { ApplicationStatus, ApplicationType } from "@sharemyride/shared";

export interface GetApplicationDetailsResultDTO {
  applicationId: string;
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  applicationType: ApplicationType;
  applicationStatus: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  adminComments: AdminComment[];
  driverRecord?: Omit<DriverRecordEntity, "applicationId">;
  vehicleRecord?: Omit<VehicleRecordEntity, "applicationId">;
}
