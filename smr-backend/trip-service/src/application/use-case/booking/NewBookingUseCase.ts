import { NewBookingRequestDTO } from "#/application/dto/booking/NewBookingDTO";
import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IDriverRepository } from "#/application/interfaces/repository/IDriverRepository";
import { IPassengerRepository } from "#/application/interfaces/repository/IPassengerRepository";
import { IPricingRulesRepository } from "#/application/interfaces/repository/IPricingRulesRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IConfigurationStore } from "#/application/interfaces/store/IConfigurationsStore";
import { INewBookingUseCase } from "#/application/interfaces/use-case/booking/INewBookingUseCase";
import { BookingEntity } from "#/domain/entities/BookingEntity";
import {
  ApplicationError,
  BookingErrorMessage,
  BookingStatus,
  ErrorCode,
  ErrorDetails,
  EventName,
  HttpStatusCodes,
  NewBookingEvent,
  TripStatus,
} from "@sharemyride/shared";

export class NewBookingUseCase implements INewBookingUseCase {
  constructor(
    private readonly _bookingRepository: IBookingRepository,
    private readonly _configStore: IConfigurationStore,
    private readonly _configRepository: IPricingRulesRepository,
    private readonly _tripRepository: ITripRepository,
    private readonly _eventBus: IEventBus,
    private readonly _passengerRepository: IPassengerRepository,
    private readonly _driverRepository: IDriverRepository,
  ) {}

  /**
   * This method gets the trip and vehicle details, verifies the data,
   * calculates pricing, and creates a new booking.
   * It also publishes new booking event for other services.
   *
   * @param dto : Booking details from user
   */
  async execute(dto: NewBookingRequestDTO): Promise<void> {
    const existingTrip = await this._tripRepository.findTripDetails(dto.tripId);

    if (!existingTrip || !existingTrip.tripDetails) {
      throw new ApplicationError(
        BookingErrorMessage.TRIP_NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "NewBookingUseCase",
          description: `No matching trip found for tripId: ${dto.tripId}`,
        },
      );
    }

    if (existingTrip.tripDetails.tripStatus !== TripStatus.SCHEDULED) {
      throw new ApplicationError(
        BookingErrorMessage.CANNOT_BOOK_STATUS,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "NewBookingUseCase",
          description: "Trip status is not scheduled for joining",
        },
      );
    }

    if (existingTrip.tripDetails.availableSeats < dto.seatCount) {
      throw new ApplicationError(
        BookingErrorMessage.INSUFFICIENT_SEATS,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "NewBookingUseCase",
          description: `Requested seats (${dto.seatCount}) exceed available seats (${existingTrip.tripDetails.availableSeats})`,
        },
      );
    }

    // Check if passenger already has an active booking on this trip
    const alreadyBooked = existingTrip.bookingDetails?.some(
      (b) =>
        b.passengerId === dto.passengerId &&
        b.status !== BookingStatus.CANCELLED &&
        b.status !== BookingStatus.WITHDRAWN &&
        b.status !== BookingStatus.REJECTED,
    );

    if (alreadyBooked) {
      throw new ApplicationError(
        BookingErrorMessage.ALREADY_BOOKED,
        HttpStatusCodes.BadRequest,
        ErrorCode.DOMAIN_CONFLICT,
        ErrorDetails.DOMAIN_CONFLICT,
        {
          location: "NewBookingUseCase",
          description: "Passenger already has an active booking for this trip",
        },
      );
    }

    // Check seat availability
    if (dto.seatCount > existingTrip.tripDetails.vacantSeats) {
      throw new ApplicationError(
        BookingErrorMessage.INSUFFICIENT_SEATS,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_FORBIDDEN,
        ErrorDetails.INPUT_FORBIDDEN,
        {
          location: "NewBookingUseCase",
          description: `Requested seats (${dto.seatCount}) exceed vacant seats (${existingTrip.tripDetails.vacantSeats})`,
        },
      );
    }

    // Calculate pricing based on vehicle rules
    let pricingRules = await this._configStore.getPricingRules();
    if (!pricingRules) {
      pricingRules = await this._configRepository.findAll();
      if (pricingRules) {
        await this._configStore.setPricingRules(pricingRules);
      }
    }

    const vehicleType = existingTrip.vehicleDetails.vehicleType;
    const matchingRule = pricingRules?.find(
      (rule) => rule.vehicleType === vehicleType && rule.isActive,
    );

    const basePrice = matchingRule ? matchingRule.basePrice : 0;
    const pricePerKm = matchingRule ? matchingRule.pricePerKm : 0;
    const totalPrice = Math.round(
      (basePrice + pricePerKm * dto.distanceKm) * dto.seatCount,
    );

    const newBooking: Omit<BookingEntity, "bookingId"> = {
      passengerId: dto.passengerId,
      tripId: dto.tripId,
      pickupPoint: dto.pickupPoint,
      dropOffPoint: dto.dropOffPoint,
      pickupPlaceId: dto.pickupPlaceId,
      dropOffPlaceId: dto.dropOffPlaceId,
      distanceKm: dto.distanceKm,
      seatCount: dto.seatCount,
      totalPrice,
      status: BookingStatus.REQUESTED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const savedBooking = await this._bookingRepository.save(newBooking);

    const passenger = await this._passengerRepository.findByPassengerId(
      dto.passengerId,
    );
    const driver = await this._driverRepository.findByDriverId(
      existingTrip.tripDetails.driverId,
    );

    const newBookingEvent: NewBookingEvent = {
      eventName: EventName.BOOKING_NEW_BOOKING,
      timestamp: new Date(),
      payload: {
        bookingId: savedBooking.bookingId,
        passengerId: dto.passengerId,
        passengerName: passenger
          ? `${passenger.firstName} ${passenger.lastName}`.trim()
          : "Passenger",
        passengerEmail: passenger ? passenger.emailId : "",
        passengerOrigin: dto.pickupPoint,
        passengerDestination: dto.dropOffPoint,
        seatCount: dto.seatCount,
        bookingAmount: totalPrice,
        driverId: existingTrip.tripDetails.driverId,
        driverName: driver
          ? `${driver.firstName} ${driver.lastName}`.trim()
          : "Driver",
        driverEmail: driver ? driver.emailId : "",
        tripId: dto.tripId,
        tripDate: existingTrip.tripDetails.startTime,
      },
    };

    await this._eventBus.publish(newBookingEvent);
  }
}
