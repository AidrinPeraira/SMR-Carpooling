import { Request, Response, NextFunction } from "express";
import { IGetDriverDetailsUseCase } from "#/application/interfaces/use-case/driver/IGetDriverDetailsUseCase";
import { IAdminDriverControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminDriverControllerV1";
import { DriverMapper } from "#/presentation/v1/mapper/DriverMapper";
import {
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
} from "@sharemyride/shared";
import { Trace } from "#/presentation/utils/decorators/traces-decorator";

export class AdminDriverControllerV1 implements IAdminDriverControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getDriverDetailsUseCase: IGetDriverDetailsUseCase,
  ) {}

  @Trace("admin-driver-module")
  async getDriverDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.params.driverId as string;

      this._logger.info("Admin fetching driver details for user:", {
        driverId,
      });

      const driverDTO = await this._getDriverDetailsUseCase.execute(driverId);
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
}
