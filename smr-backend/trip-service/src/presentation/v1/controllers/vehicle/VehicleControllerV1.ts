import { Request, Response, NextFunction } from "express";
import { IGetDriverVehiclesUseCase } from "#/application/interfaces/use-case/vehicle/IGetDriverVehiclesUseCase";
import { IVehicleControllerV1 } from "#/presentation/v1/interfaces/IVehicleControllerV1";
import { VehicleMapper } from "#/presentation/v1/mapper/VehicleMapper";
import {
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
} from "@sharemyride/shared";

export class VehicleControllerV1 implements IVehicleControllerV1 {
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
      const userId = req.headers["x-user-id"] as string;

      this._logger.info("Fetching driver vehicles for user:", { userId });

      const vehiclesDTO = await this._getDriverVehiclesUseCase.execute(userId);
      const mapped = VehicleMapper.toDriverVehiclesResponse(vehiclesDTO);

      res
        .status(HttpStatusCodes.Ok)
        .json(makeSuccessResponse("Driver vehicles retrieved successfully", mapped));
    } catch (error) {
      next(error);
    }
  }
}
