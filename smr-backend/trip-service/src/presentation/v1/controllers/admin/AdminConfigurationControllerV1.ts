import { Request, Response } from "express";
import { IGetConfigurationsUseCase } from "#/application/interfaces/use-case/admin/configurations/IGetConfigurationsUseCase";
import { ICreateNewPricingUseCase } from "#/application/interfaces/use-case/admin/configurations/ICreateNewPricingUseCase";
import { IUpdatePricingUseCase } from "#/application/interfaces/use-case/admin/configurations/IUpdatePricingUseCase";
import { ICreateNewVehicleUseCase } from "#/application/interfaces/use-case/admin/configurations/ICreateNewVehicleUseCase";
import { IUpdateVehicleUseCase } from "#/application/interfaces/use-case/admin/configurations/IUpdateVehicleUseCase";
import { IAdminConfigurationControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminConfigurationControllerV1";
import { AdminConfigurationMapper } from "#/presentation/v1/mapper/admin/AdminConfigurationMapper";
import {
  ApplicationError,
  CreatePricingRequest,
  CreatePricingSchema,
  CreateVehicleRequest,
  CreateVehicleSchema,
  ErrorCode,
  GenericErrorMessage,
  GenericSuccessMessage,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  UpdatePricingRequest,
  UpdatePricingSchema,
  UpdateVehicleRequest,
  UpdateVehicleSchema,
  zodParser,
} from "@sharemyride/shared";

export class AdminConfigurationControllerV1 implements IAdminConfigurationControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getConfigurationsUseCase: IGetConfigurationsUseCase,
    private readonly _createNewPricingUseCase: ICreateNewPricingUseCase,
    private readonly _updatePricingUseCase: IUpdatePricingUseCase,
    private readonly _createNewVehicleUseCase: ICreateNewVehicleUseCase,
    private readonly _updateVehicleUseCase: IUpdateVehicleUseCase,
  ) {}

  /**
   * Fetches system configuration settings including pricing rules and vehicles list.
   */
  async getConfigurations(req: Request, res: Response): Promise<void> {
    this._logger.info("Fetching admin configurations", {
      adminUserId: req.headers["x-user-id"],
    });

    const search = req.query.search ? (req.query.search as string) : undefined;
    const filterField = req.query.filterField ? (req.query.filterField as any) : undefined;
    const filterValue = req.query.filterValue ? (req.query.filterValue as any) : undefined;
    const sortField = req.query.sortField ? (req.query.sortField as any) : undefined;
    const sortValue = req.query.sortValue ? (req.query.sortValue as any) : undefined;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const result = await this._getConfigurationsUseCase.execute({
      page,
      limit,
      search,
      filterField,
      filterValue,
      sortField,
      sortValue,
    });

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse(
          GenericSuccessMessage.OPERATION_SUCCESSFUL,
          AdminConfigurationMapper.toGetConfigurationsResponse(result),
        ),
      );
  }

  /**
   * Creates a new pricing rule configuration.
   */
  async createPricing(req: Request, res: Response): Promise<void> {
    const validatedBody = zodParser<CreatePricingRequest>(
      CreatePricingSchema,
      req.body,
    );

    this._logger.info("Creating new pricing rule", {
      adminUserId: req.headers["x-user-id"],
      vehicleType: validatedBody.vehicle_type,
    });

    const dto = AdminConfigurationMapper.toCreatePricingRequestDTO(validatedBody);
    const result = await this._createNewPricingUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Created)
      .json(
        makeSuccessResponse(
          GenericSuccessMessage.OPERATION_SUCCESSFUL,
          AdminConfigurationMapper.toPricingRuleResponse(result.pricingRule),
        ),
      );
  }

  /**
   * Updates an existing pricing rule configuration.
   */
  async updatePricing(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    if (!id) {
      throw new ApplicationError(
        GenericErrorMessage.BAD_REQUEST,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        {
          location: "AdminConfigurationControllerV1 updatePricing",
          description: "Missing configuration ID in path parameters",
        },
      );
    }

    const validatedBody = zodParser<UpdatePricingRequest>(
      UpdatePricingSchema,
      req.body,
    );

    this._logger.info("Updating pricing rule", {
      adminUserId: req.headers["x-user-id"],
      pricingId: id,
    });

    const dto = AdminConfigurationMapper.toUpdatePricingRequestDTO(id, validatedBody);
    const result = await this._updatePricingUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse(
          GenericSuccessMessage.OPERATION_SUCCESSFUL,
          AdminConfigurationMapper.toPricingRuleResponse(result.pricingRule),
        ),
      );
  }

  /**
   * Creates a new vehicle in the vehicle configurations list.
   */
  async createVehicle(req: Request, res: Response): Promise<void> {
    const validatedBody = zodParser<CreateVehicleRequest>(
      CreateVehicleSchema,
      req.body,
    );

    this._logger.info("Creating new vehicle configuration", {
      adminUserId: req.headers["x-user-id"],
      vehicleMake: validatedBody.vehicle_make,
      vehicleModel: validatedBody.vehicle_model,
    });

    const dto = AdminConfigurationMapper.toCreateVehicleRequestDTO(validatedBody);
    const result = await this._createNewVehicleUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Created)
      .json(
        makeSuccessResponse(
          GenericSuccessMessage.OPERATION_SUCCESSFUL,
          AdminConfigurationMapper.toVehicleListResponse(result.vehicle),
        ),
      );
  }

  /**
   * Updates an existing vehicle configuration.
   */
  async updateVehicle(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    if (!id) {
      throw new ApplicationError(
        GenericErrorMessage.BAD_REQUEST,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        {
          location: "AdminConfigurationControllerV1 updateVehicle",
          description: "Missing configuration ID in path parameters",
        },
      );
    }

    const validatedBody = zodParser<UpdateVehicleRequest>(
      UpdateVehicleSchema,
      req.body,
    );

    this._logger.info("Updating vehicle configuration", {
      adminUserId: req.headers["x-user-id"],
      vehicleId: id,
    });

    const dto = AdminConfigurationMapper.toUpdateVehicleRequestDTO(id, validatedBody);
    const result = await this._updateVehicleUseCase.execute(dto);

    res
      .status(HttpStatusCodes.Ok)
      .json(
        makeSuccessResponse(
          GenericSuccessMessage.OPERATION_SUCCESSFUL,
          AdminConfigurationMapper.toVehicleListResponse(result.vehicle),
        ),
      );
  }
}
