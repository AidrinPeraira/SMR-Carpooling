import { Request, Response, NextFunction } from "express";
import { ICreateTripUseCase } from "#/application/interfaces/use-case/trip/ICreateTripUseCase";
import { IListTripsUseCase } from "#/application/interfaces/use-case/trip/IListTripsUseCase";
import { ITripControllerV1 } from "#/presentation/v1/interfaces/ITripControllerV1";
import { TripMapper } from "#/presentation/v1/mapper/TripMapper";
import {
  CreateTripSchema,
  CreateTripSchemaType,
  GenericSuccessMessage,
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
}
