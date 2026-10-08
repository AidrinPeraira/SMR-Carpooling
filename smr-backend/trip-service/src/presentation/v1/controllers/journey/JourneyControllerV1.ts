import { Request, Response, NextFunction } from "express";
import { IStartTripJourneyUseCase } from "#/application/interfaces/use-case/journey/IStartTripJourneyUseCase";
import { IGetDriverJourneyDetailsUseCase } from "#/application/interfaces/use-case/journey/IGetDriverJourneyDetailsUseCase";
import { IGetPassengerJourneyDetailsUseCase } from "#/application/interfaces/use-case/journey/IGetPassengerJourneyDetailsUseCase";
import { IJourneyControllerV1 } from "#/presentation/v1/interfaces/IJourneyControllerV1";
import { JourneyMapper } from "#/application/mapper/JourneyMapper";
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
    private readonly _getDriverJourneyDetailsUseCase: IGetDriverJourneyDetailsUseCase,
    private readonly _getPassengerJourneyDetailsUseCase: IGetPassengerJourneyDetailsUseCase,
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

  @Trace("journey-module")
  async getDriverJourneyDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.headers["x-user-id"] as string;
      const journeyId = req.params.journeyId as string;

      this._logger.info("Fetching driver journey details:", { driverId, journeyId });

      const result = await this._getDriverJourneyDetailsUseCase.execute(
        journeyId,
        driverId,
      );

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            JourneySuccessMessage.DRIVER_DETAILS_FETCHED,
            JourneyMapper.toGetDriverJourneyDetailsResult(result),
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  @Trace("journey-module")
  async getPassengerJourneyDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const passengerId = req.headers["x-user-id"] as string;
      const journeyId = req.params.journeyId as string;

      this._logger.info("Fetching passenger journey details:", { passengerId, journeyId });

      const result = await this._getPassengerJourneyDetailsUseCase.execute(
        journeyId,
        passengerId,
      );

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            JourneySuccessMessage.PASSENGER_DETAILS_FETCHED,
            JourneyMapper.toGetPassengerJourneyDetailsResult(result),
          ),
        );
    } catch (error) {
      next(error);
    }
  }
}
