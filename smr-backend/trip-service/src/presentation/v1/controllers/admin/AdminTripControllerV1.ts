import { Request, Response, NextFunction } from "express";
import { IAdminListAllTripsUseCase } from "#/application/interfaces/use-case/admin/trip/IAdminListAllTripsUseCase";
import { IAdminGetTripDetailsUseCase } from "#/application/interfaces/use-case/admin/trip/IAdminGetTripDetailsUseCase";
import { IAdminTripControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminTripControllerV1";
import { AdminTripMapper } from "#/presentation/v1/mapper/admin/AdminTripMapper";
import {
  GenericSuccessMessage,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  SortOrder,
} from "@sharemyride/shared";

export class AdminTripControllerV1 implements IAdminTripControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _adminListAllTripsUseCase: IAdminListAllTripsUseCase,
    private readonly _adminGetTripDetailsUseCase: IAdminGetTripDetailsUseCase,
  ) {}

  async listAllTrips(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search ? (req.query.search as string) : undefined;
      const filterField = req.query.filterField
        ? (req.query.filterField as any)
        : undefined;
      const filterValue = req.query.filterValue
        ? (req.query.filterValue as any)
        : undefined;
      const sortField = req.query.sortField
        ? (req.query.sortField as any)
        : undefined;
      const sortValue = req.query.sortValue
        ? (req.query.sortValue as SortOrder)
        : undefined;

      this._logger.info("Admin fetching all trips list", { page, limit, search });

      const result = await this._adminListAllTripsUseCase.execute({
        page,
        limit,
        search,
        filterField,
        filterValue,
        sortField,
        sortValue,
      });

      const response = AdminTripMapper.toAdminTripListResponse(result);

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            GenericSuccessMessage.OPERATION_SUCCESSFUL,
            response,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  async getTripDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const tripId = req.params.tripId as string;

      this._logger.info("Admin fetching trip details for tripId:", { tripId });

      const details = await this._adminGetTripDetailsUseCase.execute(tripId);
      const response = AdminTripMapper.toAdminTripDetailsResponse(details);

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            GenericSuccessMessage.OPERATION_SUCCESSFUL,
            response,
          ),
        );
    } catch (error) {
      next(error);
    }
  }
}
