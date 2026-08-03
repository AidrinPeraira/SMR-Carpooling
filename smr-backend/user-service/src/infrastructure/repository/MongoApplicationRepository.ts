import {
  GetAllApplicationsQueryDTO,
  GetAllApplicationsResponseDTO,
} from "#/application/dto/admin/application/AdminApplicationsDTO";
import { GetApplicationDetailsResultDTO } from "#/application/dto/application/GetApplicationDetailsResultDTO";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { ApplicationEntity } from "#/domain/entities/ApplicationEntity";
import { ApplicationDoc } from "#/infrastructure/database/models/MongoApplicationModel";
import { DriverRecordModel } from "#/infrastructure/database/models/MongoDriverRecordModel";
import { MongoBaseRepository } from "#/infrastructure/repository/MongoBaseRepository";
import { UserModel } from "#/infrastructure/database/models/MongoUserModel";
import { VehicleRecordModel } from "#/infrastructure/database/models/MongoVehicleRecordModel";
import {
  ApplicationError,
  ApplicationErrorMessage,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
  PaginatedPayload,
  SortOrder,
} from "@sharemyride/shared";
import { Model, PipelineStage } from "mongoose";

export class MongoApplicationRepository
  extends MongoBaseRepository<ApplicationEntity, ApplicationDoc>
  implements IApplicationRepository
{
  private readonly _applicationModel: Model<ApplicationDoc>;

  constructor(applicationModel: Model<ApplicationDoc>) {
    super("applicationId", applicationModel);
    this._applicationModel = applicationModel;
  }

  protected toDomainEntityMapper(data: ApplicationDoc): ApplicationEntity {
    return {
      applicationId: data.applicationId,
      userId: data.userId,
      applicationType: data.applicationType,
      applicationStatus: data.applicationStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      adminComments: data.adminComments?.map((c) => ({
        comment: c.comment,
        adminId: c.adminId,
        time: c.time,
      })),
    };
  }

  async findApplications(
    query: GetAllApplicationsQueryDTO,
  ): Promise<PaginatedPayload<GetAllApplicationsResponseDTO[]>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const aggregatePipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "userId",
          as: "userInfo",
        },
      },
      {
        $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true },
      },
    ];

    if (query.search) {
      aggregatePipeline.push({
        $match: {
          $or: [
            { "userInfo.firstName": { $regex: query.search, $options: "i" } },
            { "userInfo.lastName": { $regex: query.search, $options: "i" } },
            { "userInfo.emailId": { $regex: query.search, $options: "i" } },
          ],
        },
      });
    }

    if (query.filterField && query.filterValue) {
      aggregatePipeline.push({
        $match: { [query.filterField]: query.filterValue },
      });
    }

    const countPipeline = [...aggregatePipeline, { $count: "total" }];
    const countResult = await this._applicationModel.aggregate(countPipeline);
    const totalItems = (countResult[0]?.total as number) || 0;

    const sortField = query.sortField ? `$${String(query.sortField)}` : "$createdAt";
    const sortOrder = query.sortValue === SortOrder.DESC ? -1 : 1;

    aggregatePipeline.push(
      { $sort: { [sortField.replace("$", "")]: sortOrder } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          applicationId: 1,
          userId: 1,
          firstName: "$userInfo.firstName",
          lastName: "$userInfo.lastName",
          emailId: "$userInfo.emailId",
          applicationType: 1,
          applicationStatus: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    );

    const docs: GetAllApplicationsResponseDTO[] =
      await this._applicationModel.aggregate(aggregatePipeline);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: docs,
      paginationMeta: {
        totalItems,
        currentPage: page,
        limit,
        totalPages,
      },
    };
  }

  async getFullApplicationDetails(
    applicationId: string,
  ): Promise<GetApplicationDetailsResultDTO> {
    const application = await this.findByCustomId(applicationId);
    if (!application) {
      throw new ApplicationError(
        ApplicationErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "MongoApplicationRepository - getFullApplicationDetails",
          description: "Application not found",
        },
      );
    }

    const user = await UserModel.findOne({ userId: application.userId });
    const driverRecordDoc = await DriverRecordModel.findOne({
      userId: application.userId,
    }).sort({ createdAt: -1 });
    const vehicleRecordDoc = await VehicleRecordModel.findOne({
      userId: application.userId,
    }).sort({ createdAt: -1 });

    return {
      applicationId: application.applicationId,
      userId: application.userId,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      emailId: user?.emailId || "",
      applicationType: application.applicationType,
      applicationStatus: application.applicationStatus,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      adminComments: application.adminComments,
      driverRecord: driverRecordDoc
        ? {
            recordId: driverRecordDoc.recordId,
            applicationId: driverRecordDoc.applicationId,
            licenseNumber: driverRecordDoc.licenseNumber,
            licenseExpiry: driverRecordDoc.licenseExpiry,
            licenseFile: driverRecordDoc.licenseFile,
            createdAt: driverRecordDoc.createdAt,
            updatedAt: driverRecordDoc.updatedAt,
          }
        : undefined,
      vehicleRecord: vehicleRecordDoc
        ? {
            recordId: vehicleRecordDoc.recordId,
            applicationId: vehicleRecordDoc.applicationId,
            vehicleType: vehicleRecordDoc.vehicleType,
            vehicleMake: vehicleRecordDoc.vehicleMake,
            vehicleModel: vehicleRecordDoc.vehicleModel,
            vehicleCapacity: vehicleRecordDoc.vehicleCapacity,
            registrationNumber: vehicleRecordDoc.registrationNumber,
            registrationExpiry: vehicleRecordDoc.registrationExpiry,
            registrationFile: vehicleRecordDoc.registrationFile,
            insuranceNumber: vehicleRecordDoc.insuranceNumber || "",
            insuranceExpiry: vehicleRecordDoc.insuranceExpiry,
            insuranceFile: vehicleRecordDoc.insuranceFile,
            vehicleImage: vehicleRecordDoc.vehicleImage,
            createdAt: vehicleRecordDoc.createdAt,
            updatedAt: vehicleRecordDoc.updatedAt,
          }
        : undefined,
    };
  }
}
