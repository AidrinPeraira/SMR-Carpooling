import { describe, expect, it, vi, beforeEach } from "vitest";
import { InitiateBookingPaymentUseCase } from "#/application/use-case/booking/InitiateBookingPaymentUseCase";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IPassengerRepository } from "#/application/interfaces/repository/IPassengerRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { ISchedulerService } from "#/application/interfaces/services/ISchedulerService";
import { ITokenService } from "#/application/interfaces/services/ITokenService";

import {
  ApplicationError,
  BookingErrorMessage,
  BookingStatus,
  HttpStatusCodes,
  TripStatus,
  UserErrorMessage,
} from "@sharemyride/shared";

describe("InitiateBookingPaymentUseCase", () => {
  let mockBookingRepository: IBookingRepository;
  let mockPassengerRepository: IPassengerRepository;
  let mockTripRepository: ITripRepository;
  let mockUniqueIdService: IUniqueIdGenerator;
  let mockSchedulerService: ISchedulerService;
  let mockTokenService: ITokenService;
  let useCase: InitiateBookingPaymentUseCase;

  const mockPassenger = {
    passengerId: "passenger-123",
    isActive: true,
    firstName: "John",
    lastName: "Doe",
    emailId: "john@example.com",
    phoneNumber: "1234567890",
  };

  const mockBooking = {
    bookingId: "b-123",
    passengerId: "passenger-123",
    tripId: "t-456",
    status: BookingStatus.PAYMENT_PENDING,
    seatCount: 2,
    totalPrice: 150,
    paymentKey: null,
    paymentKeyExpiry: null,
  };

  const mockTrip = {
    tripId: "t-456",
    driverId: "driver-789",
    vacantSeats: 3,
    tripStatus: TripStatus.SCHEDULED,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockBookingRepository = {
      save: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
      findByBookingId: vi.fn().mockResolvedValue({ ...mockBooking }),
      findBookingsByDriverId: vi.fn(),
      findBookingsByPassengerId: vi.fn(),
    };

    mockPassengerRepository = {
      save: vi.fn(),
      findByPassengerId: vi.fn().mockResolvedValue({ ...mockPassenger }),
      update: vi.fn(),
    };

    mockTripRepository = {
      save: vi.fn(),
      findTripDetails: vi.fn(),
      findMatchingTrips: vi.fn(),
      findJourneyDetails: vi.fn(),
      findByTripId: vi.fn().mockResolvedValue({ ...mockTrip }),
      update: vi.fn(),
      atmoicReserveSeat: vi.fn().mockResolvedValue({ ...mockTrip, vacantSeats: 1 }),
      atmoicReleaseSeat: vi.fn(),
    };

    mockUniqueIdService = {
      generateRandomId: vi.fn().mockReturnValue("pay-key-999"),
    };

    mockSchedulerService = {
      scheduleJob: vi.fn().mockResolvedValue(undefined),
    };

    mockTokenService = {
      generateToken: vi.fn().mockReturnValue("mocked.jwt.token"),
      verifyToken: vi.fn(),
    };

    useCase = new InitiateBookingPaymentUseCase(
      mockBookingRepository,
      mockPassengerRepository,
      mockTripRepository,
      mockUniqueIdService,
      mockSchedulerService,
      mockTokenService,
      "http://localhost/webhook/trips/booking-cleanup",
    );
  });

  it("should successfully initiate booking payment when passenger and booking are valid", async () => {
    const result = await useCase.execute("b-123", "passenger-123");

    expect(result.paymentToken).toBe("mocked.jwt.token");

    expect(mockTripRepository.atmoicReserveSeat).toHaveBeenCalledWith("t-456", 2);
    expect(mockBookingRepository.update).toHaveBeenCalledWith(
      "b-123",
      expect.objectContaining({
        paymentKey: "pay-key-999",
        paymentKeyExpiry: expect.any(Date),
      }),
    );
  });

  it("should throw ApplicationError (404) if passenger is not found", async () => {
    vi.mocked(mockPassengerRepository.findByPassengerId).mockResolvedValueOnce(null);

    await expect(useCase.execute("b-123", "passenger-123")).rejects.toThrow(
      ApplicationError,
    );

    try {
      await useCase.execute("b-123", "passenger-123");
    } catch (err: any) {
      expect(err.statusCode).toBe(HttpStatusCodes.NotFound);
      expect(err.message).toBe(UserErrorMessage.NOT_FOUND);
    }
  });

  it("should throw ApplicationError (403) if passenger account is inactive", async () => {
    vi.mocked(mockPassengerRepository.findByPassengerId).mockResolvedValueOnce({
      ...mockPassenger,
      isActive: false,
    } as any);

    await expect(useCase.execute("b-123", "passenger-123")).rejects.toThrow(
      ApplicationError,
    );

    try {
      await useCase.execute("b-123", "passenger-123");
    } catch (err: any) {
      expect(err.statusCode).toBe(HttpStatusCodes.Forbidden);
      expect(err.message).toBe(UserErrorMessage.ACCOUNT_BLOCKED);
    }
  });

  it("should throw ApplicationError (404) if booking is not found", async () => {
    vi.mocked(mockBookingRepository.findByBookingId).mockResolvedValueOnce(null);

    await expect(useCase.execute("b-123", "passenger-123")).rejects.toThrow(
      ApplicationError,
    );

    try {
      await useCase.execute("b-123", "passenger-123");
    } catch (err: any) {
      expect(err.statusCode).toBe(HttpStatusCodes.NotFound);
      expect(err.message).toBe(BookingErrorMessage.NOT_FOUND);
    }
  });

  it("should throw ApplicationError (400) if booking status is not PAYMENT_PENDING", async () => {
    vi.mocked(mockBookingRepository.findByBookingId).mockResolvedValueOnce({
      ...mockBooking,
      status: BookingStatus.REQUESTED,
    } as any);

    await expect(useCase.execute("b-123", "passenger-123")).rejects.toThrow(
      ApplicationError,
    );

    try {
      await useCase.execute("b-123", "passenger-123");
    } catch (err: any) {
      expect(err.statusCode).toBe(HttpStatusCodes.BadRequest);
      expect(err.message).toBe(BookingErrorMessage.INVALID_STATUS_TRANSITION);
    }
  });

  it("should throw ApplicationError (403) if booking does not belong to passenger", async () => {
    await expect(useCase.execute("b-123", "other-passenger")).rejects.toThrow(
      ApplicationError,
    );

    try {
      await useCase.execute("b-123", "other-passenger");
    } catch (err: any) {
      expect(err.statusCode).toBe(HttpStatusCodes.Forbidden);
      expect(err.message).toBe(BookingErrorMessage.UNAUTHORIZED_PASSENGER);
    }
  });

  it("should throw ApplicationError (409) if payment key is active and unexpired", async () => {
    const futureDate = new Date(Date.now() + 60 * 1000);
    vi.mocked(mockBookingRepository.findByBookingId).mockResolvedValueOnce({
      ...mockBooking,
      paymentKey: "active-key",
      paymentKeyExpiry: futureDate,
    } as any);

    await expect(useCase.execute("b-123", "passenger-123")).rejects.toThrow(
      ApplicationError,
    );

    try {
      await useCase.execute("b-123", "passenger-123");
    } catch (err: any) {
      expect(err.statusCode).toBe(HttpStatusCodes.Conflict);
      expect(err.message).toBe("Payment initiation is already in progress.");
    }
  });

  it("should throw ApplicationError (400) if atomic seat reservation fails", async () => {
    vi.mocked(mockTripRepository.atmoicReserveSeat).mockResolvedValueOnce(null);

    await expect(useCase.execute("b-123", "passenger-123")).rejects.toThrow(
      ApplicationError,
    );

    try {
      await useCase.execute("b-123", "passenger-123");
    } catch (err: any) {
      expect(err.statusCode).toBe(HttpStatusCodes.BadRequest);
      expect(err.message).toBe(BookingErrorMessage.INSUFFICIENT_SEATS);
    }
  });
});
