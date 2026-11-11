import { Request, Response, NextFunction } from "express";
import { IStartTripJourneyUseCase } from "#/application/interfaces/use-case/journey/IStartTripJourneyUseCase";
import { IGetDriverJourneyDetailsUseCase } from "#/application/interfaces/use-case/journey/IGetDriverJourneyDetailsUseCase";
import { IGetPassengerJourneyDetailsUseCase } from "#/application/interfaces/use-case/journey/IGetPassengerJourneyDetailsUseCase";
import { IDriverArrivedUseCase } from "#/application/interfaces/use-case/journey/IDriverArrivedUseCase";
import { IDriverVerifyPickupUseCase } from "#/application/interfaces/use-case/journey/IDriverVerifyPickupUseCase";
import { IPassengerConfirmPickupUseCase } from "#/application/interfaces/use-case/journey/IPassengerConfirmPickupUseCase";
import { IDriverVerifyPassengerDropOffUseCase } from "#/application/interfaces/use-case/journey/IDriverDropOffPassengerUseCase";
import { IPassengerConfirmDropOffUseCase } from "#/application/interfaces/use-case/journey/IPassengerConfirmDropOffUseCase";
import { IPassengerNoShowUseCase } from "#/application/interfaces/use-case/journey/IPassengerNoShowUseCase";
import { IDriverCompleteJourneyUseCase } from "#/application/interfaces/use-case/journey/IDriverCompleteJourneyUseCase";
import { IJourneyControllerV1 } from "#/presentation/v1/interfaces/IJourneyControllerV1";
import { JourneyMapper } from "#/application/mapper/JourneyMapper";
import { Trace } from "#/presentation/utils/decorators/traces-decorator";
import {
  DriverArrivedRequest,
  DriverArrivedSchema,
  DriverDropOffPassengerRequest,
  DriverDropOffPassengerSchema,
  DriverVerifyPickupRequest,
  DriverVerifyPickupSchema,
  HttpStatusCodes,
  ILogger,
  JourneySuccessMessage,
  makeSuccessResponse,
  PassengerConfirmDropOffRequest,
  PassengerConfirmDropOffSchema,
  PassengerConfirmPickupRequest,
  PassengerConfirmPickupSchema,
  PassengerNoShowRequest,
  PassengerNoShowSchema,
  zodParser,
} from "@sharemyride/shared";

export class JourneyControllerV1 implements IJourneyControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _startTripJourneyUseCase: IStartTripJourneyUseCase,
    private readonly _getDriverJourneyDetailsUseCase: IGetDriverJourneyDetailsUseCase,
    private readonly _getPassengerJourneyDetailsUseCase: IGetPassengerJourneyDetailsUseCase,
    private readonly _driverArrivedUseCase: IDriverArrivedUseCase,
    private readonly _driverVerifyPickupUseCase: IDriverVerifyPickupUseCase,
    private readonly _passengerConfirmPickupUseCase: IPassengerConfirmPickupUseCase,
    private readonly _driverDropOffPassengerUseCase: IDriverVerifyPassengerDropOffUseCase,
    private readonly _passengerConfirmDropOffUseCase: IPassengerConfirmDropOffUseCase,
    private readonly _passengerNoShowUseCase: IPassengerNoShowUseCase,
    private readonly _driverCompleteJourneyUseCase: IDriverCompleteJourneyUseCase,
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

  @Trace("journey-module")
  async driverArrived(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.headers["x-user-id"] as string;

      const validatedBody = zodParser<DriverArrivedRequest>(
        DriverArrivedSchema,
        req.body,
      );

      this._logger.info("Driver arrived at stop:", { driverId, journeyId: validatedBody.journey_id });

      const dto = JourneyMapper.toDriverArrivedDTO(validatedBody);
      await this._driverArrivedUseCase.execute(dto, driverId);

      res
        .status(HttpStatusCodes.Ok)
        .json(makeSuccessResponse(JourneySuccessMessage.DRIVER_ARRIVED, null));
    } catch (error) {
      next(error);
    }
  }

  @Trace("journey-module")
  async driverVerifyPickup(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.headers["x-user-id"] as string;

      const validatedBody = zodParser<DriverVerifyPickupRequest>(
        DriverVerifyPickupSchema,
        req.body,
      );

      this._logger.info("Driver verifying pickup OTP:", { driverId, journeyId: validatedBody.journey_id });

      const dto = JourneyMapper.toDriverVerifyPickupDTO(validatedBody);
      await this._driverVerifyPickupUseCase.execute(dto, driverId);

      res
        .status(HttpStatusCodes.Ok)
        .json(makeSuccessResponse(JourneySuccessMessage.PICKUP_VERIFIED, null));
    } catch (error) {
      next(error);
    }
  }

  @Trace("journey-module")
  async passengerConfirmPickup(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const passengerId = req.headers["x-user-id"] as string;

      const validatedBody = zodParser<PassengerConfirmPickupRequest>(
        PassengerConfirmPickupSchema,
        req.body,
      );

      this._logger.info("Passenger confirming pickup:", { passengerId, journeyId: validatedBody.journey_id });

      const dto = JourneyMapper.toPassengerConfirmPickupDTO(validatedBody);
      await this._passengerConfirmPickupUseCase.execute(dto, passengerId);

      res
        .status(HttpStatusCodes.Ok)
        .json(makeSuccessResponse(JourneySuccessMessage.PICKUP_CONFIRMED, null));
    } catch (error) {
      next(error);
    }
  }

  @Trace("journey-module")
  async driverDropOffPassenger(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.headers["x-user-id"] as string;

      const validatedBody = zodParser<DriverDropOffPassengerRequest>(
        DriverDropOffPassengerSchema,
        req.body,
      );

      this._logger.info("Driver dropping off passenger:", { driverId, journeyId: validatedBody.journey_id });

      const dto = JourneyMapper.toDriverDropOffDTO(validatedBody);
      await this._driverDropOffPassengerUseCase.execute(dto, driverId);

      res
        .status(HttpStatusCodes.Ok)
        .json(makeSuccessResponse(JourneySuccessMessage.DROP_OFF_CONFIRMED, null));
    } catch (error) {
      next(error);
    }
  }

  @Trace("journey-module")
  async passengerConfirmDropOff(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const passengerId = req.headers["x-user-id"] as string;

      const validatedBody = zodParser<PassengerConfirmDropOffRequest>(
        PassengerConfirmDropOffSchema,
        req.body,
      );

      this._logger.info("Passenger confirming drop off:", { passengerId, journeyId: validatedBody.journey_id });

      const dto = JourneyMapper.toPassengerConfirmDropOffDTO(validatedBody, passengerId);
      await this._passengerConfirmDropOffUseCase.execute(dto, passengerId);

      res
        .status(HttpStatusCodes.Ok)
        .json(makeSuccessResponse(JourneySuccessMessage.DROP_OFF_CONFIRMED, null));
    } catch (error) {
      next(error);
    }
  }

  @Trace("journey-module")
  async passengerNoShow(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.headers["x-user-id"] as string;

      const validatedBody = zodParser<PassengerNoShowRequest>(
        PassengerNoShowSchema,
        req.body,
      );

      this._logger.info("Marking passenger no-show:", { driverId, journeyId: validatedBody.journey_id });

      const dto = JourneyMapper.toPassengerNoShowDTO(validatedBody);
      await this._passengerNoShowUseCase.execute(dto);

      res
        .status(HttpStatusCodes.Ok)
        .json(makeSuccessResponse(JourneySuccessMessage.NO_SHOW_MARKED, null));
    } catch (error) {
      next(error);
    }
  }

  @Trace("journey-module")
  async driverCompleteJourney(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.headers["x-user-id"] as string;
      const journeyId = req.params.journeyId as string;

      this._logger.info("Driver completing journey:", { driverId, journeyId });

      await this._driverCompleteJourneyUseCase.execute(journeyId, driverId);

      res
        .status(HttpStatusCodes.Ok)
        .json(makeSuccessResponse(JourneySuccessMessage.JOURNEY_COMPLETED, null));
    } catch (error) {
      next(error);
    }
  }
}
