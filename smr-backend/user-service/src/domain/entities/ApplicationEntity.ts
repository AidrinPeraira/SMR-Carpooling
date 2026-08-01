import { DriverRecordEntity } from "#/domain/entities/DriverRecordEntity";
import { VehicleRecordEntity } from "#/domain/entities/VehicleRecordEntity";
import { AdminComment } from "#/domain/ValueObjects/AdminComment";
import { ApplicationStatus, ApplicationType } from "@sharemyride/shared";

export interface BaseApplicationEntity {
  applicationId: string;
  userId: string;
  applicationType: ApplicationType;
  applicationStatus: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  adminComments?: AdminComment[];
}

export interface OnboardingApplicationEntity extends BaseApplicationEntity {
  driverRecord: DriverRecordEntity;
  vehicleRecord: VehicleRecordEntity;
}

export interface VehicleApplicationEntity extends BaseApplicationEntity {
  vehicleRecord: VehicleRecordEntity;
}

export interface DriverApplicationEntity extends BaseApplicationEntity {
  driverRecord: DriverRecordEntity;
}

export type ApplicationEntity =
  | OnboardingApplicationEntity
  | VehicleApplicationEntity
  | DriverApplicationEntity;
