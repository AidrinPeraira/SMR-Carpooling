import { Request, Response, NextFunction } from "express";
import { IDriverListTripsUseCase } from "#/application/interfaces/use-case/driver/IDriverListTripsUseCase";
import { IDriverGetTripDetailsUseCase } from "#/application/interfaces/use-case/driver/IDriverTripDetailsUseCase";
import { ICreateTripUseCase } from "#/application/interfaces/use-case/trip/ICreateTripUseCase";
import { IGetJourneyDetailsUseCase } from "#/application/interfaces/use-case/trip/IGetJourneyDetailsUseCase";
import { IListTripsUseCase } from "#/application/interfaces/use-case/trip/IListTripsUseCase";
import { ITripControllerV1 } from "#/presentation/v1/interfaces/ITripControllerV1";
import { TripMapper } from "#/presentation/v1/mapper/TripMapper";
import {
  CreateTripSchema,
  CreateTripSchemaType,
  DriverGetTripsQuerySchema,
  DriverGetTripsQuerySchemaType,
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
    private readonly _driverListTripsUseCase: IDriverListTripsUseCase,
    private readonly _driverGetTripDetailsUseCase: IDriverGetTripDetailsUseCase,
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

  async getDriverTrips(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.headers["x-user-id"] as string;

      const validatedQuery = zodParser<DriverGetTripsQuerySchemaType>(
        DriverGetTripsQuerySchema,
        req.query,
      );

      this._logger.info("Fetching driver trips:", {
        driverId,
        query: validatedQuery,
      });

      const queryDto = TripMapper.toDriverGetAllTripsQueryDTO(validatedQuery);
      const result = await this._driverListTripsUseCase.execute(
        driverId,
        queryDto,
      );
      const mapped = TripMapper.toDriverListTripsResponse(result);

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            "Driver trips fetched successfully",
            mapped,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  async getDriverTripDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.headers["x-user-id"] as string;
      const { tripId } = req.params;

      this._logger.info("Fetching driver trip details:", { driverId, tripId });

      const result = await this._driverGetTripDetailsUseCase.execute(
        tripId as string,
        driverId,
      );
      const mapped = TripMapper.toDriverGetTripDetailsResponse(result);
      mapped.trip_id = tripId as string;

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            "Driver trip details fetched successfully",
            mapped,
          ),
        );
    } catch (error) {
      next(error);
    }
  }
}
