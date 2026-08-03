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
import { IApplicationControllerV1 } from "#/presentation/v1/interfaces/IApplicationControllerV1";
import {
  toApplicationDetailsResult,
  toGetApplicationsSummaryResult,
  toNewVehicleApplicationRequestDTO,
  toOnboardingApplicationRequestDTO,
  toRenewDriverApplicationRequestDTO,
  toRenewVehicleApplicationRequestDTO,
  toResubmitNewVehicleApplicationRequestDTO,
  toResubmitOnboardingApplicationRequestDTO,
  toResubmitRenewDriverApplicationRequestDTO,
  toResubmitRenewVehicleApplicationRequestDTO,
} from "#/presentation/v1/mapper/ApplicationMapper";
import {
  ApplicationDetailsResult,
  ApplicationIdParamSchema,
  ApplicationIdParamSchemaType,
  ApplicationSuccessMessage,
  GenericSuccessMessage,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  NewVehicleApplicationSchema,
  NewVehicleApplicationSchemaType,
  OnboardingApplicationSchema,
  OnboardingApplicationSchemaType,
  RenewDriverApplicationSchema,
  RenewDriverApplicationSchemaType,
  RenewVehicleApplicationSchema,
  RenewVehicleApplicationSchemaType,
  ResubmitNewVehicleApplicationSchema,
  ResubmitNewVehicleApplicationSchemaType,
  ResubmitOnboardingApplicationSchema,
  ResubmitOnboardingApplicationSchemaType,
  ResubmitRenewDriverApplicationSchema,
  ResubmitRenewDriverApplicationSchemaType,
  ResubmitRenewVehicleApplicationSchema,
  ResubmitRenewVehicleApplicationSchemaType,
  zodParser,
} from "@sharemyride/shared";
import { Request, Response } from "express";

export class ApplicationControllerV1 implements IApplicationControllerV1 {
  constructor(
    private readonly _logger: ILogger,
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

  async onboardingApplication(req: Request, res: Response): Promise<void> {
    const userId = req.headers["x-user-id"] as string;
    this._logger.info("Submitting onboarding application for userId: ", userId);

    const body = zodParser<OnboardingApplicationSchemaType>(
      OnboardingApplicationSchema,
      req.body,
    );
    const dto = toOnboardingApplicationRequestDTO(body, userId);
    await this._onboardingApplicationUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Created)
      .json(makeSuccessResponse(ApplicationSuccessMessage.APPLICATION_SUBMITTED));
  }

  async newVehicleApplication(req: Request, res: Response): Promise<void> {
    const userId = req.headers["x-user-id"] as string;
    this._logger.info("Submitting new vehicle application for userId: ", userId);

    const body = zodParser<NewVehicleApplicationSchemaType>(
      NewVehicleApplicationSchema,
      req.body,
    );
    const dto = toNewVehicleApplicationRequestDTO(body, userId);
    await this._newVehicleApplicationUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Created)
      .json(makeSuccessResponse(ApplicationSuccessMessage.APPLICATION_SUBMITTED));
  }

  async renewDriverApplication(req: Request, res: Response): Promise<void> {
    const userId = req.headers["x-user-id"] as string;
    this._logger.info("Submitting renew driver application for userId: ", userId);

    const body = zodParser<RenewDriverApplicationSchemaType>(
      RenewDriverApplicationSchema,
      req.body,
    );
    const dto = toRenewDriverApplicationRequestDTO(body, userId);
    await this._renewDriverApplicationUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Created)
      .json(makeSuccessResponse(ApplicationSuccessMessage.APPLICATION_SUBMITTED));
  }

  async renewVehicleApplication(req: Request, res: Response): Promise<void> {
    const userId = req.headers["x-user-id"] as string;
    this._logger.info("Submitting renew vehicle application for userId: ", userId);

    const body = zodParser<RenewVehicleApplicationSchemaType>(
      RenewVehicleApplicationSchema,
      req.body,
    );
    const dto = toRenewVehicleApplicationRequestDTO(body, userId);
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

    const body = zodParser<ResubmitOnboardingApplicationSchemaType>(
      ResubmitOnboardingApplicationSchema,
      req.body,
    );
    const dto = toResubmitOnboardingApplicationRequestDTO(body, applicationId);
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

    const body = zodParser<ResubmitNewVehicleApplicationSchemaType>(
      ResubmitNewVehicleApplicationSchema,
      req.body,
    );
    const dto = toResubmitNewVehicleApplicationRequestDTO(body, applicationId);
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

    const body = zodParser<ResubmitRenewDriverApplicationSchemaType>(
      ResubmitRenewDriverApplicationSchema,
      req.body,
    );
    const dto = toResubmitRenewDriverApplicationRequestDTO(body, applicationId);
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

    const body = zodParser<ResubmitRenewVehicleApplicationSchemaType>(
      ResubmitRenewVehicleApplicationSchema,
      req.body,
    );
    const dto = toResubmitRenewVehicleApplicationRequestDTO(body, applicationId);
    await this._resubmitRenewVehicleApplicationUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Ok)
      .json(makeSuccessResponse(ApplicationSuccessMessage.APPLICATION_SUBMITTED));
  }

  async getApplications(req: Request, res: Response): Promise<void> {
    const userId = req.headers["x-user-id"] as string;
    this._logger.info("Fetching applications for user: ", userId);

    const results = await this._getApplicationsUseCase.execute(userId);

    res.status(HttpStatusCodes.Ok).json(
      makeSuccessResponse(
        GenericSuccessMessage.OPERATION_SUCCESSFUL,
        results.map((app) => toGetApplicationsSummaryResult(app, userId)),
      ),
    );
  }

  async getApplicationDetails(req: Request, res: Response): Promise<void> {
    const { applicationId } = zodParser<ApplicationIdParamSchemaType>(
      ApplicationIdParamSchema,
      req.params,
    );
    this._logger.info("Fetching details for application: ", applicationId);

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
}
