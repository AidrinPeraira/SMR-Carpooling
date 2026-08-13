import { Request, Response, NextFunction } from "express";
import { INewBookingUseCase } from "#/application/interfaces/use-case/passenger/INewBookingUseCase";
import { IBookingControllerV1 } from "#/presentation/v1/interfaces/IBookingControllerV1";
import { BookingMapper } from "#/presentation/v1/mapper/BookingMapper";
import {
  CreateBookingSchema,
  CreateBookingSchemaType,
  GenericSuccessMessage,
  HttpStatusCodes,
  ILogger,
  makeSuccessResponse,
  zodParser,
} from "@sharemyride/shared";

export class BookingControllerV1 implements IBookingControllerV1 {
  constructor(
    private readonly _logger: ILogger,
    private readonly _newBookingUseCase: INewBookingUseCase,
  ) {}

  async createBooking(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const passengerId = req.headers["x-user-id"] as string;

      const validatedBody = zodParser<CreateBookingSchemaType>(
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
}
