import { Request, Response, NextFunction } from "express";
import { IStartTripJourneyUseCase } from "#/application/interfaces/use-case/journey/IStartTripJourneyUseCase";
import { IJourneyControllerV1 } from "#/presentation/v1/interfaces/IJourneyControllerV1";
import { Trace } from "#/presentation/utils/decorators/traces-decorator";
import {
  HttpStatusCodes,
  ILogger,
  JourneySuccessMessage,
  makeSuccessResponse,
} from "@sharemyride/shared";

export class JourneyControllerV1 implements IJourneyControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _startTripJourneyUseCase: IStartTripJourneyUseCase,
  ) {}

  @Trace("journey-module")
  async startJourney(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.headers["x-user-id"] as string;
      const { tripId } = req.params;

      this._logger.info("Starting journey for trip:", { driverId, tripId });

      await this._startTripJourneyUseCase.execute(tripId as string, driverId);

      res
        .status(HttpStatusCodes.Created)
        .json(
          makeSuccessResponse(JourneySuccessMessage.STARTED, null),
        );
    } catch (error) {
      next(error);
    }
  }
}
