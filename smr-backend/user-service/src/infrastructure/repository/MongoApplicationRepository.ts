import {
  GetAllApplicationsQueryDTO,
  GetAllApplicationsResponseDTO,
} from "#/application/dto/admin/application/AdminApplicationsDTO";
import { GetApplicationDetailsResultDTO } from "#/application/dto/application/GetApplicationDetailsResultDTO";
import { IApplicationRepository } from "#/application/interfaces/repository/IApplicationRepository";
import { ApplicationEntity } from "#/domain/entities/ApplicationEntity";
import { ApplicationDoc } from "#/infrastructure/database/models/MongoApplicationModel";
import { MongoBaseRepository } from "#/infrastructure/repository/MongoBaseRepository";
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

    const sortField = query.sortField
      ? `$${String(query.sortField)}`
      : "$createdAt";
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
  ): Promise<GetApplicationDetailsResultDTO | null> {
    const aggregatePipeline: PipelineStage[] = [
      {
        $match: { applicationId },
      },
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
      {
        $lookup: {
          from: "driverrecords",
          localField: "applicationId",
          foreignField: "applicationId",
          as: "driverRecord",
        },
      },
      {
        $lookup: {
          from: "vehiclerecords",
          localField: "applicationId",
          foreignField: "applicationId",
          as: "vehicleRecord",
        },
      },
    ];

    const results = await this._applicationModel.aggregate(aggregatePipeline);
    if (!results || results.length === 0) {
      return null;
    }

    const doc = results[0];

    return {
      applicationId: doc.applicationId,
      userId: doc.userId,
      firstName: doc.userInfo?.firstName || "",
      lastName: doc.userInfo?.lastName || "",
      emailId: doc.userInfo?.emailId || "",
      applicationType: doc.applicationType,
      applicationStatus: doc.applicationStatus,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      adminComments: doc.adminComments?.map((c: any) => ({
        comment: c.comment,
        adminId: c.adminId,
        time: c.time,
      })),
      driverRecord: (doc.driverRecord || []).map((d: any) => ({
        recordId: d.recordId,
        applicationId: d.applicationId,
        licenseNumber: d.licenseNumber,
        licenseExpiry: d.licenseExpiry,
        licenseFile: d.licenseFile,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })),
      vehicleRecord: (doc.vehicleRecord || []).map((v: any) => ({
        recordId: v.recordId,
        applicationId: v.applicationId,
        vehicleType: v.vehicleType,
        vehicleMake: v.vehicleMake,
        vehicleModel: v.vehicleModel,
        vehicleCapacity: v.vehicleCapacity,
        registrationNumber: v.registrationNumber,
        registrationExpiry: v.registrationExpiry,
        registrationFile: v.registrationFile,
        insuranceNumber: v.insuranceNumber || "",
        insuranceExpiry: v.insuranceExpiry,
        insuranceFile: v.insuranceFile,
        vehicleImage: v.vehicleImage,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
      })),
    };
  }
}
