import { IGetApplicationDetailsUseCase } from "#/application/interfaces/use-case/application/IGetApplicationDetailsUseCase";
import { IGetApplicationsUseCase } from "#/application/interfaces/use-case/application/IGetApplicationsUseCase";
import { INewVehicleApplicationUseCase } from "#/application/interfaces/use-case/application/INewVehicleApplicationUseCase";
import { IOnboardingApplicationUseCase } from "#/application/interfaces/use-case/application/IOnboardinApplicationUseCase";
import { IRenewDriverApplicationUseCase } from "#/application/interfaces/use-case/application/IRenewDriverApplicationUseCase";
import { IRenewVehicleApplicationUseCase } from "#/application/interfaces/use-case/application/IRenewVehicleApplicationUseCase";
import { IResubmitNewVehicleApplicationUseCase } from "#/application/interfaces/use-case/application/IResubmitNewVehicleApplicationUseCase";
import { IResubmitOnboardingApplicationUseCase } from "#/application/interfaces/use-case/application/IResubmitOnboardingApplicationUseCase";
import { IResubmitRenewDriverApplicationUseCase } from "#/application/interfaces/use-case/application/IResubmitRenewDriverApplicationUseCase";
import { IResubmitRenewVehicleApplicationUseCase } from "#/application/interfaces/use-case/application/IResubmitRenewVehicleApplicationUseCase";
import { IGetFileUploadUrlUseCase } from "#/application/interfaces/use-case/IGetFileUploadUrlUseCase";
import { IApplicationControllerV1 } from "#/presentation/v1/interfaces/IApplicationControllerV1";
import { ApplicationMapper } from "#/presentation/v1/mapper/ApplicationMapper";
import {
  ApplicationDetailsResult,
  ApplicationIdParamSchema,
  ApplicationIdParamSchemaType,
  ApplicationSuccessMessage,
  GenericSuccessMessage,
  GetFileUploadUrlRequest,
  GetFileUploadUrlResult,
  GetFileUploadUrlSchema,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  NewVehicleApplicationRequest,
  NewVehicleApplicationSchema,
  OnboardingApplicationRequest,
  OnboardingApplicationSchema,
  RenewDriverApplicationRequest,
  RenewDriverApplicationSchema,
  RenewVehicleApplicationRequest,
  RenewVehicleApplicationSchema,
  ResubmitNewVehicleApplicationRequest,
  ResubmitNewVehicleApplicationSchema,
  ResubmitOnboardingApplicationRequest,
  ResubmitOnboardingApplicationSchema,
  ResubmitRenewDriverApplicationRequest,
  ResubmitRenewDriverApplicationSchema,
  ResubmitRenewVehicleApplicationRequest,
  ResubmitRenewVehicleApplicationSchema,
  zodParser,
} from "@sharemyride/shared";
import { Request, Response } from "express";

export class ApplicationControllerV1 implements IApplicationControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getFileUploadUrlUseCase: IGetFileUploadUrlUseCase,
    private readonly _onboardingApplicationUseCase: IOnboardingApplicationUseCase,
    private readonly _newVehicleApplicationUseCase: INewVehicleApplicationUseCase,
    private readonly _renewDriverApplicationUseCase: IRenewDriverApplicationUseCase,
    private readonly _renewVehicleApplicationUseCase: IRenewVehicleApplicationUseCase,
    private readonly _resubmitOnboardingApplicationUseCase: IResubmitOnboardingApplicationUseCase,
    private readonly _resubmitNewVehicleApplicationUseCase: IResubmitNewVehicleApplicationUseCase,
    private readonly _resubmitRenewDriverApplicationUseCase: IResubmitRenewDriverApplicationUseCase,
    private readonly _resubmitRenewVehicleApplicationUseCase: IResubmitRenewVehicleApplicationUseCase,
    private readonly _getApplicationsUseCase: IGetApplicationsUseCase,
    private readonly _getApplicationDetailsUseCase: IGetApplicationDetailsUseCase,
  ) {}

  async getFileUploadUrl(req: Request, res: Response): Promise<void> {
    const userId = req.headers["x-user-id"] as string;
    this._logger.info("Getting file upload URL for userId: ", userId);

    const body = zodParser<GetFileUploadUrlRequest>(
      GetFileUploadUrlSchema,
      req.body,
    );
    const dto = ApplicationMapper.toGetFileUploadUrlRequestDTO(body, userId);
    const result = await this._getFileUploadUrlUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse<GetFileUploadUrlResult>(
          GenericSuccessMessage.OPERATION_SUCCESSFUL,
          ApplicationMapper.toGetFileUploadUrlResult(result),
        ),
      );
  }

  async onboardingApplication(req: Request, res: Response): Promise<void> {
    const userId = req.headers["x-user-id"] as string;
    this._logger.info("Submitting onboarding application for userId: ", userId);

    const body = zodParser<OnboardingApplicationRequest>(
      OnboardingApplicationSchema,
      req.body,
    );
    const dto = ApplicationMapper.toOnboardingApplicationRequestDTO(body, userId);
    await this._onboardingApplicationUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Created)
      .json(makeSuccessResponse(ApplicationSuccessMessage.APPLICATION_SUBMITTED));
  }

  async newVehicleApplication(req: Request, res: Response): Promise<void> {
    const userId = req.headers["x-user-id"] as string;
    this._logger.info("Submitting new vehicle application for userId: ", userId);

    const body = zodParser<NewVehicleApplicationRequest>(
      NewVehicleApplicationSchema,
      req.body,
    );
    const dto = ApplicationMapper.toNewVehicleApplicationRequestDTO(body, userId);
    await this._newVehicleApplicationUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Created)
      .json(makeSuccessResponse(ApplicationSuccessMessage.APPLICATION_SUBMITTED));
  }

  async renewDriverApplication(req: Request, res: Response): Promise<void> {
    const userId = req.headers["x-user-id"] as string;
    this._logger.info("Submitting renew driver application for userId: ", userId);

    const body = zodParser<RenewDriverApplicationRequest>(
      RenewDriverApplicationSchema,
      req.body,
    );
    const dto = ApplicationMapper.toRenewDriverApplicationRequestDTO(body, userId);
    await this._renewDriverApplicationUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Created)
      .json(makeSuccessResponse(ApplicationSuccessMessage.APPLICATION_SUBMITTED));
  }

  async renewVehicleApplication(req: Request, res: Response): Promise<void> {
    const userId = req.headers["x-user-id"] as string;
    this._logger.info("Submitting renew vehicle application for userId: ", userId);

    const body = zodParser<RenewVehicleApplicationRequest>(
      RenewVehicleApplicationSchema,
      req.body,
    );
    const dto = ApplicationMapper.toRenewVehicleApplicationRequestDTO(body, userId);
    await this._renewVehicleApplicationUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Created)
      .json(makeSuccessResponse(ApplicationSuccessMessage.APPLICATION_SUBMITTED));
  }

  async resubmitOnboardingApplication(req: Request, res: Response): Promise<void> {
    const { applicationId } = zodParser<ApplicationIdParamSchemaType>(
      ApplicationIdParamSchema,
      req.params,
    );

    this._logger.info("Resubmitting onboarding application: ", applicationId);

    const body = zodParser<ResubmitOnboardingApplicationRequest>(
      ResubmitOnboardingApplicationSchema,
      req.body,
    );
    const dto = ApplicationMapper.toResubmitOnboardingApplicationRequestDTO(
      body,
      applicationId,
    );
    await this._resubmitOnboardingApplicationUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Ok)
      .json(makeSuccessResponse(ApplicationSuccessMessage.APPLICATION_SUBMITTED));
  }

  async resubmitNewVehicleApplication(req: Request, res: Response): Promise<void> {
    const { applicationId } = zodParser<ApplicationIdParamSchemaType>(
      ApplicationIdParamSchema,
      req.params,
    );

    this._logger.info("Resubmitting new vehicle application: ", applicationId);

    const body = zodParser<ResubmitNewVehicleApplicationRequest>(
      ResubmitNewVehicleApplicationSchema,
      req.body,
    );
    const dto = ApplicationMapper.toResubmitNewVehicleApplicationRequestDTO(
      body,
      applicationId,
    );
    await this._resubmitNewVehicleApplicationUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Ok)
      .json(makeSuccessResponse(ApplicationSuccessMessage.APPLICATION_SUBMITTED));
  }

  async resubmitRenewDriverApplication(req: Request, res: Response): Promise<void> {
    const { applicationId } = zodParser<ApplicationIdParamSchemaType>(
      ApplicationIdParamSchema,
      req.params,
    );

    this._logger.info("Resubmitting renew driver application: ", applicationId);

    const body = zodParser<ResubmitRenewDriverApplicationRequest>(
      ResubmitRenewDriverApplicationSchema,
      req.body,
    );
    const dto = ApplicationMapper.toResubmitRenewDriverApplicationRequestDTO(
      body,
      applicationId,
    );
    await this._resubmitRenewDriverApplicationUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Ok)
      .json(makeSuccessResponse(ApplicationSuccessMessage.APPLICATION_SUBMITTED));
  }

  async resubmitRenewVehicleApplication(req: Request, res: Response): Promise<void> {
    const { applicationId } = zodParser<ApplicationIdParamSchemaType>(
      ApplicationIdParamSchema,
      req.params,
    );

    this._logger.info("Resubmitting renew vehicle application: ", applicationId);

    const body = zodParser<ResubmitRenewVehicleApplicationRequest>(
      ResubmitRenewVehicleApplicationSchema,
      req.body,
    );
    const dto = ApplicationMapper.toResubmitRenewVehicleApplicationRequestDTO(
      body,
      applicationId,
    );
    await this._resubmitRenewVehicleApplicationUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Ok)
      .json(makeSuccessResponse(ApplicationSuccessMessage.APPLICATION_SUBMITTED));
  }

  async getApplications(req: Request, res: Response): Promise<void> {
    const userId = req.headers["x-user-id"] as string;
    const search = req.query.search as string;
    this._logger.info("Getting applications for userId: ", userId);

    const list = await this._getApplicationsUseCase.execute(userId, search);
    const result = list.map((item) =>
      ApplicationMapper.toGetApplicationsSummaryResult(item, userId),
    );

    res
      .status(HttpStatusCodes.Ok)
      .json(makeSuccessResponse(GenericSuccessMessage.OPERATION_SUCCESSFUL, result));
  }

  async getApplicationDetails(req: Request, res: Response): Promise<void> {
    const { applicationId } = zodParser<ApplicationIdParamSchemaType>(
      ApplicationIdParamSchema,
      req.params,
    );

    this._logger.info(
      "Getting application details for applicationId: ",
      applicationId,
    );

    const details = await this._getApplicationDetailsUseCase.execute(
      applicationId,
    );
    const result = ApplicationMapper.toApplicationDetailsResult(details);

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse<ApplicationDetailsResult>(
          GenericSuccessMessage.OPERATION_SUCCESSFUL,
          result,
        ),
      );
  }
}
