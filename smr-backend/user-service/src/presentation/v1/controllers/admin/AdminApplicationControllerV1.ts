import { IGetAllApplicationsUseCase } from "#/application/interfaces/use-case/admin/application/IGetAllApplicationsUseCase";
import { IPocessApplicationUseCase } from "#/application/interfaces/use-case/admin/application/IProcessApplicationUseCase";
import { IGetApplicationDetailsUseCase } from "#/application/interfaces/use-case/application/IGetApplicationDetailsUseCase";
import { IAdminApplicationControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminApplicationControllerV1";
import {
  toAdminApplicationListResult,
  toProcessApplicationRequestDTO,
} from "#/presentation/v1/mapper/admin/AdminApplicationMapper";
import { toApplicationDetailsResult } from "#/presentation/v1/mapper/ApplicationMapper";
import { toGetAllApplicationsRequestQuery } from "#/presentation/v1/mapper/QueryMapper";
import {
  ApplicationDetailsResult,
  ApplicationIdParamSchema,
  ApplicationIdParamSchemaType,
  ApplicationSuccessMessage,
  GenericSuccessMessage,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  ProcessApplicationSchema,
  ProcessApplicationSchemaType,
  zodParser,
} from "@sharemyride/shared";
import { Request, Response } from "express";

export class AdminApplicationControllerV1 implements IAdminApplicationControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getAllApplicationsUseCase: IGetAllApplicationsUseCase,
    private readonly _getApplicationDetailsUseCase: IGetApplicationDetailsUseCase,
    private readonly _processApplicationUseCase: IPocessApplicationUseCase,
  ) {}

  async getAllApplications(req: Request, res: Response): Promise<void> {
    const adminId = req.headers["x-user-id"] as string;
    this._logger.info("Admin fetching all applications: ", { adminId });

    const query = toGetAllApplicationsRequestQuery(req.query);
    const result = await this._getAllApplicationsUseCase.execute(query);

    res.status(HttpStatusCodes.Ok).json(
      makeSuccessResponse(GenericSuccessMessage.OPERATION_SUCCESSFUL, {
        data: result.data.map(toAdminApplicationListResult),
        paginationMeta: result.paginationMeta,
      }),
    );
  }

  async getApplicationDetails(req: Request, res: Response): Promise<void> {
    const { applicationId } = zodParser<ApplicationIdParamSchemaType>(
      ApplicationIdParamSchema,
      req.params,
    );
    const adminId = req.headers["x-user-id"] as string;
    this._logger.info("Admin fetching application details: ", {
      adminId,
      applicationId,
    });

    const result = await this._getApplicationDetailsUseCase.execute(applicationId);

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse<ApplicationDetailsResult>(
          GenericSuccessMessage.OPERATION_SUCCESSFUL,
          toApplicationDetailsResult(result),
        ),
      );
  }

  async processApplication(req: Request, res: Response): Promise<void> {
    const adminId = req.headers["x-user-id"] as string;

    const body = zodParser<ProcessApplicationSchemaType>(
      ProcessApplicationSchema,
      req.body,
    );
    this._logger.info("Admin processing application: ", {
      adminId,
      applicationId: body.application_id,
      status: body.application_status,
    });

    const dto = toProcessApplicationRequestDTO(body, adminId);
    await this._processApplicationUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Ok)
      .json(makeSuccessResponse(ApplicationSuccessMessage.APPLICATION_PROCESSED));
  }
}
