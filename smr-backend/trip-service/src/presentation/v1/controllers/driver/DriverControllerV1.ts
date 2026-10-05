import { Request, Response, NextFunction } from "express";
import { IGetDriverDetailsUseCase } from "#/application/interfaces/use-case/driver/IGetDriverDetailsUseCase";
import { IGetDriverTripStatsUseCase } from "#/application/interfaces/use-case/driver/IGetDriverTripStatsUseCase";
import { IDriverControllerV1 } from "#/presentation/v1/interfaces/IDriverControllerV1";
import { DriverMapper } from "#/application/mapper/DriverMapper";
import {
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
} from "@sharemyride/shared";
import { Trace } from "#/presentation/utils/decorators/traces-decorator";

export class DriverControllerV1 implements IDriverControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getDriverDetailsUseCase: IGetDriverDetailsUseCase,
    private readonly _getDriverTripStatsUseCase: IGetDriverTripStatsUseCase,
  ) {}

  @Trace("driver-module")
  async getDriverDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;

      this._logger.info("Fetching driver details for user:", { userId });

      const driverDTO = await this._getDriverDetailsUseCase.execute(userId);
      const mapped = DriverMapper.toDriverDetailsResponse(driverDTO);

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse("Driver details retrieved successfully", mapped),
        );
    } catch (error) {
      next(error);
    }
  }

  @Trace("driver-module")
  async getDriverTripStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.headers["x-user-id"] as string;

      this._logger.info("Fetching driver trip stats:", { userId });

      const statsDTO = await this._getDriverTripStatsUseCase.execute(userId);
      const mapped = DriverMapper.toDriverTripStatsResponse(statsDTO);

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse("Driver trip stats retrieved successfully", mapped),
        );
    } catch (error) {
      next(error);
    }
  }
}
