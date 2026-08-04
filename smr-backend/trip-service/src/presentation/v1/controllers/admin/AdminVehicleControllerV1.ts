import { Request, Response, NextFunction } from "express";
import { IGetDriverVehiclesUseCase } from "#/application/interfaces/use-case/vehicle/IGetDriverVehiclesUseCase";
import { IAdminVehicleControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminVehicleControllerV1";
import { VehicleMapper } from "#/presentation/v1/mapper/VehicleMapper";
import {
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
} from "@sharemyride/shared";

export class AdminVehicleControllerV1 implements IAdminVehicleControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getDriverVehiclesUseCase: IGetDriverVehiclesUseCase,
  ) {}

  async getDriverVehicles(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.params.driverId as string;

      this._logger.info("Admin fetching driver vehicles for user:", { driverId });

      const vehiclesDTO = await this._getDriverVehiclesUseCase.execute(driverId);
      const mapped = VehicleMapper.toDriverVehiclesResponse(vehiclesDTO);

      res
        .status(HttpStatusCodes.Ok)
        .json(makeSuccessResponse("Driver vehicles retrieved successfully", mapped));
    } catch (error) {
      next(error);
    }
  }
}
