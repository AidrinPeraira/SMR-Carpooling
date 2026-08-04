import { Request, Response, NextFunction } from "express";
import { IGetDriverDetailsUseCase } from "#/application/interfaces/use-case/driver/IGetDriverDetailsUseCase";
import { IDriverControllerV1 } from "#/presentation/v1/interfaces/IDriverControllerV1";
import { DriverMapper } from "#/presentation/v1/mapper/DriverMapper";
import {
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
} from "@sharemyride/shared";

export class DriverControllerV1 implements IDriverControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _getDriverDetailsUseCase: IGetDriverDetailsUseCase,
  ) {}

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
        .json(makeSuccessResponse("Driver details retrieved successfully", mapped));
    } catch (error) {
      next(error);
    }
  }
}
