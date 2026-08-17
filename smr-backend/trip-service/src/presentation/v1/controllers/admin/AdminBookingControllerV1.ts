import { Request, Response, NextFunction } from "express";
import { IAdminListAllBookingsUseCase } from "#/application/interfaces/use-case/admin/booking/IAdminListAllBookingsUseCase";
import { IAdminGetBookingDetailsUseCase } from "#/application/interfaces/use-case/admin/booking/IAdminGetBookingDetailsUseCase";
import { IAdminBookingControllerV1 } from "#/presentation/v1/interfaces/admin/IAdminBookingControllerV1";
import { AdminBookingMapper } from "#/presentation/v1/mapper/admin/AdminBookingMapper";
import {
  GenericSuccessMessage,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  SortOrder,
} from "@sharemyride/shared";

export class AdminBookingControllerV1 implements IAdminBookingControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _adminListAllBookingsUseCase: IAdminListAllBookingsUseCase,
    private readonly _adminGetBookingDetailsUseCase: IAdminGetBookingDetailsUseCase,
  ) {}

  async listAllBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search ? (req.query.search as string) : undefined;
      const sortField = req.query.sortField
        ? (req.query.sortField as any)
        : undefined;
      const sortValue = req.query.sortValue
        ? (req.query.sortValue as SortOrder)
        : undefined;

      this._logger.info("Admin fetching all bookings list", { page, limit, search });

      const result = await this._adminListAllBookingsUseCase.execute({
        page,
        limit,
        search,
        sortField,
        sortValue,
      });

      const response = AdminBookingMapper.toAdminBookingListResponse(result);

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

  async getBookingDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const bookingId = req.params.bookingId as string;

      this._logger.info("Admin fetching booking details for bookingId:", { bookingId });

      const details = await this._adminGetBookingDetailsUseCase.execute(bookingId);
      const response = AdminBookingMapper.toAdminBookingDetailsResponse(details);

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
