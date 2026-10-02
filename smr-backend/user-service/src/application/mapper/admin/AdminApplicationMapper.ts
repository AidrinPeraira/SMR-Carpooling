import {
  GetAllApplicationsQueryDTO,
  GetAllApplicationsResponseDTO,
  ProcessApplicationRequestDTO,
} from "#/application/dto/admin/application/AdminApplicationsDTO";
import {
  AdminApplicationListResult,
  ProcessApplicationRequest,
  QueryRequest,
} from "@sharemyride/shared";

export class AdminApplicationMapper {
  static toGetAllApplicationsRequestQuery(
    query: QueryRequest,
  ): GetAllApplicationsQueryDTO {
    return query as unknown as GetAllApplicationsQueryDTO;
  }

  static toProcessApplicationRequestDTO(
    body: ProcessApplicationRequest,
    adminId: string,
  ): ProcessApplicationRequestDTO {
    return {
      applicationId: body.application_id,
      applicationStatus: body.application_status,
      adminComment: {
        comment: body.admin_comment.comment,
        adminId,
        time: new Date(),
      },
    };
  }

  static toAdminApplicationListResult(
    dto: GetAllApplicationsResponseDTO,
  ): AdminApplicationListResult {
    return {
      application_id: dto.applicationId,
      user_id: dto.userId,
      first_name: dto.firstName,
      last_name: dto.lastName,
      email_id: dto.emailId,
      application_type: dto.applicationType,
      application_status: dto.applicationStatus,
      created_at: dto.createdAt,
      updated_at: dto.updatedAt,
    };
  }
}
