import { Request, Response, NextFunction } from "express";
import { IDriverAcceptBookingUseCase } from "#/application/interfaces/use-case/booking/IDriverAcceptBookingUseCase";
import { IDriverGetBookingDetailsUseCase } from "#/application/interfaces/use-case/booking/IDriverGetBookingDetailsUseCase";
import { IDriverListAllBookingsUseCase } from "#/application/interfaces/use-case/booking/IDriverListAllBookingsUseCase";
import { IDriverRejectBookingUseCase } from "#/application/interfaces/use-case/booking/IDriverRejectBookingUseCase";
import { IGetPassngerBookingDetailsUseCase } from "#/application/interfaces/use-case/booking/IGetPassengerBookingDetailsUseCase";
import { INewBookingUseCase } from "#/application/interfaces/use-case/booking/INewBookingUseCase";
import { IPassengerListBookingsUseCase } from "#/application/interfaces/use-case/booking/IPassengerListBookingsUseCase";
import { IWithdrawBookingUseCase } from "#/application/interfaces/use-case/booking/IWithdrawBookingUseCase";
import { IInitiateBookingPaymentUseCase } from "#/application/interfaces/use-case/booking/IInitiateBookingPaymentUseCase";
import { IBookingControllerV1 } from "#/presentation/v1/interfaces/IBookingControllerV1";
import { BookingMapper } from "#/presentation/v1/mapper/BookingMapper";
import {
  CreateBookingRequest,
  CreateBookingSchema,
  DriverGetBookingsQueryRequest,
  DriverGetBookingsQuerySchema,
  GenericSuccessMessage,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  PassengerGetBookingsQueryRequest,
  PassengerGetBookingsQuerySchema,
  zodParser,
} from "@sharemyride/shared";

export class BookingControllerV1 implements IBookingControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _newBookingUseCase: INewBookingUseCase,
    private readonly _driverListAllBookingsUseCase: IDriverListAllBookingsUseCase,
    private readonly _driverGetBookingDetailsUseCase: IDriverGetBookingDetailsUseCase,
    private readonly _driverAcceptBookingUseCase: IDriverAcceptBookingUseCase,
    private readonly _driverRejectBookingUseCase: IDriverRejectBookingUseCase,
    private readonly _passengerListBookingsUseCase: IPassengerListBookingsUseCase,
    private readonly _getPassengerBookingDetailsUseCase: IGetPassngerBookingDetailsUseCase,
    private readonly _withdrawBookingUseCase: IWithdrawBookingUseCase,
    private readonly _initiateBookingPaymentUseCase: IInitiateBookingPaymentUseCase,
  ) {}

  async createBooking(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const passengerId = req.headers["x-user-id"] as string;

      const validatedBody = zodParser<CreateBookingRequest>(
        CreateBookingSchema,
        req.body,
      );

      this._logger.info("Creating new booking for passenger:", { passengerId });

      const dto = BookingMapper.toNewBookingRequestDTO(
        passengerId,
        validatedBody,
      );
      await this._newBookingUseCase.execute(dto);

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

  async getDriverBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.headers["x-user-id"] as string;

      const validatedQuery = zodParser<DriverGetBookingsQueryRequest>(
        DriverGetBookingsQuerySchema,
        req.query,
      );

      this._logger.info("Fetching driver bookings:", { driverId });

      const dto = BookingMapper.toDriverGetAllBookingsQueryDTO(validatedQuery);
      const result = await this._driverListAllBookingsUseCase.execute(
        driverId,
        dto,
      );
      const mapped = BookingMapper.toDriverGetAllBookingsResponse(result);

      res
        .status(HttpStatusCodes.Ok)
        .json(makeSuccessResponse("Driver bookings retrieved successfully", mapped));
    } catch (error) {
      next(error);
    }
  }

  async getDriverBookingDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.headers["x-user-id"] as string;
      const { bookingId } = req.params;

      this._logger.info("Fetching booking details for driver:", {
        driverId,
        bookingId,
      });

      const result = await this._driverGetBookingDetailsUseCase.execute(
        bookingId as string,
        driverId,
      );
      const mapped = BookingMapper.toDriverGetBookingDetailsResponse(result);

      res
        .status(HttpStatusCodes.Ok)
        .json(makeSuccessResponse("Booking details retrieved successfully", mapped));
    } catch (error) {
      next(error);
    }
  }

  async acceptBooking(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.headers["x-user-id"] as string;
      const { bookingId } = req.params;

      this._logger.info("Accepting booking request:", { driverId, bookingId });

      await this._driverAcceptBookingUseCase.execute(
        bookingId as string,
        driverId,
      );

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            "Booking request accepted successfully",
            null,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  async rejectBooking(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.headers["x-user-id"] as string;
      const { bookingId } = req.params;

      this._logger.info("Rejecting booking request:", { driverId, bookingId });

      await this._driverRejectBookingUseCase.execute(
        bookingId as string,
        driverId,
      );

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            "Booking request rejected successfully",
            null,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  async getPassengerBookings(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const passengerId = req.headers["x-user-id"] as string;

      const validatedQuery = zodParser<PassengerGetBookingsQueryRequest>(
        PassengerGetBookingsQuerySchema,
        req.query,
      );

      this._logger.info("Fetching passenger bookings:", { passengerId });

      const dto = BookingMapper.toPassengerGetAllBookingsQueryDTO(validatedQuery);
      const result = await this._passengerListBookingsUseCase.execute(
        passengerId,
        dto,
      );
      const mapped = BookingMapper.toPassengerGetAllBookingsResponse(result);

      res
        .status(HttpStatusCodes.Ok)
        .json(makeSuccessResponse("Passenger bookings retrieved successfully", mapped));
    } catch (error) {
      next(error);
    }
  }

  async getPassengerBookingDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const passengerId = req.headers["x-user-id"] as string;
      const { bookingId } = req.params;

      this._logger.info("Fetching passenger booking details:", {
        passengerId,
        bookingId,
      });

      const result = await this._getPassengerBookingDetailsUseCase.execute(
        bookingId as string,
        passengerId,
      );
      const mapped = BookingMapper.toPassengerGetBookingDetailsResponse(result);

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            "Passenger booking details retrieved successfully",
            mapped,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  async withdrawBooking(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const passengerId = req.headers["x-user-id"] as string;
      const { bookingId } = req.params;

      this._logger.info("Withdrawing booking request:", {
        passengerId,
        bookingId,
      });

      await this._withdrawBookingUseCase.execute(
        bookingId as string,
        passengerId,
      );

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            "Booking request withdrawn successfully",
            null,
          ),
        );
    } catch (error) {
      next(error);
    }
  }

  async initiateBookingPayment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const passengerId = req.headers["x-user-id"] as string;
      const { bookingId } = req.params;

      this._logger.info("Initiating payment for booking:", {
        passengerId,
        bookingId,
      });

      const result = await this._initiateBookingPaymentUseCase.execute(
        bookingId as string,
        passengerId,
      );

      const mapped = BookingMapper.toInitiateBookingPaymentResponse(result);

      res
        .status(HttpStatusCodes.Ok)
        .json(
          makeSuccessResponse(
            "Booking payment initiated successfully",
            mapped,
          ),
        );
    } catch (error) {
      next(error);
    }
  }
}
