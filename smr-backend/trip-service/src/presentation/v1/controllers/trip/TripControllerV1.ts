import { Request, Response, NextFunction } from "express";
import { ICreateTripUseCase } from "#/application/interfaces/use-case/trip/ICreateTripUseCase";
import { IGetJourneyDetailsUseCase } from "#/application/interfaces/use-case/trip/IGetJourneyDetailsUseCase";
import { IListTripsUseCase } from "#/application/interfaces/use-case/trip/IListTripsUseCase";
import { ITripControllerV1 } from "#/presentation/v1/interfaces/ITripControllerV1";
import { TripMapper } from "#/presentation/v1/mapper/TripMapper";
import {
  CreateTripSchema,
  CreateTripSchemaType,
  GenericSuccessMessage,
  GetJourneyDetailsSchema,
  GetJourneyDetailsSchemaType,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  SearchTripSchema,
  SearchTripSchemaType,
  zodParser,
} from "@sharemyride/shared";

export class TripControllerV1 implements ITripControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _createTripUseCase: ICreateTripUseCase,
    private readonly _listTripsUseCase: IListTripsUseCase,
    private readonly _getJourneyDetailsUseCase: IGetJourneyDetailsUseCase,
  ) {}

  async createTrip(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.headers["x-user-id"] as string;

      const validatedBody = zodParser<CreateTripSchemaType>(
        CreateTripSchema,
        req.body,
      );

      this._logger.info("Creating trip for driver:", { driverId });

      const dto = TripMapper.toCreateTripRequestDTO(driverId, validatedBody);
      await this._createTripUseCase.execute(dto);

      res
        .status(HttpStatusCodes.Created)
        .json(
          makeSuccessResponse(
            GenericSuccessMessage.OPERATION_SUCCESSFUL,
            null,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  async listMatchingTrips(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const passengerUserId = req.headers["x-user-id"] as string;

      const validatedBody = zodParser<SearchTripSchemaType>(
        SearchTripSchema,
        req.body,
      );

      this._logger.info("Searching matching trips for passenger:", {
        passengerUserId,
      });

      const dto = TripMapper.toListTripsRequestDTO(validatedBody);
      const result = await this._listTripsUseCase.execute(dto);
      const mappedResponse = TripMapper.toListTripsResponse(result);

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            GenericSuccessMessage.OPERATION_SUCCESSFUL,
            mappedResponse,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  async getJourneyDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const passengerUserId = req.headers["x-user-id"] as string;

      const validatedBody = zodParser<GetJourneyDetailsSchemaType>(
        GetJourneyDetailsSchema,
        req.body,
      );

      this._logger.info("Getting journey details for trip:", {
        passengerUserId,
        tripId: validatedBody.trip_id,
      });

      const result = await this._getJourneyDetailsUseCase.execute(
        validatedBody.trip_id,
      );
      const mappedResponse = TripMapper.toGetJourneyDetailsResponse(result);

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            GenericSuccessMessage.OPERATION_SUCCESSFUL,
            mappedResponse,
          ),
        );
    } catch (error) {
      next(error);
    }
  }
}

