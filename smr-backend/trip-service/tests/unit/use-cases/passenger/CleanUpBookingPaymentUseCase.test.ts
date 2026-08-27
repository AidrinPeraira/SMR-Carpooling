import { describe, expect, it, vi, beforeEach } from "vitest";
import { CleanUpBookingPaymentUseCase } from "#/application/use-case/booking/CleanUpBookingPaymentUseCase";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { BookingStatus, TripStatus } from "@sharemyride/shared";

describe("CleanUpBookingPaymentUseCase", () => {
  let mockBookingRepository: IBookingRepository;
  let mockTripRepository: ITripRepository;
  let useCase: CleanUpBookingPaymentUseCase;

  const mockBooking = {
    bookingId: "b-123",
    passengerId: "passenger-123",
    tripId: "t-456",
    status: BookingStatus.PAYMENT_PROCESSING,
    seatCount: 2,
    totalPrice: 150,
    paymentKey: "pay-key-999",
    paymentKeyExpiry: new Date(),
  };

  const mockTrip = {
    tripId: "t-456",
    driverId: "driver-789",
    vacantSeats: 1,
    tripStatus: TripStatus.SCHEDULED,
  };

  const dto = {
    bookingId: "b-123",
    tripId: "t-456",
    paymentKey: "pay-key-999",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockBookingRepository = {
      save: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
      findByBookingId: vi.fn().mockResolvedValue({ ...mockBooking }),
      findBookingsByDriverId: vi.fn(),
      findBookingsByPassengerId: vi.fn(),
    } as unknown as IBookingRepository;

    mockTripRepository = {
      cleanIndices: vi.fn(),
      save: vi.fn(),
      findTripDetails: vi.fn(),
      findMatchingTrips: vi.fn(),
      findJourneyDetails: vi.fn(),
      findByTripId: vi.fn().mockResolvedValue({ ...mockTrip }),
      update: vi.fn(),
      atmoicReserveSeat: vi.fn(),
      atmoicReleaseSeat: vi.fn().mockResolvedValue({ ...mockTrip, vacantSeats: 3 }),
    } as unknown as ITripRepository;

    useCase = new CleanUpBookingPaymentUseCase(
      mockBookingRepository,
      mockTripRepository,
    );
  });

  it("should successfully release seats and update booking status to PAYMENT_FAILED when valid", async () => {
    await useCase.execute(dto);

    expect(mockBookingRepository.findByBookingId).toHaveBeenCalledWith("b-123");
    expect(mockTripRepository.atmoicReleaseSeat).toHaveBeenCalledWith("t-456", 2);
    expect(mockBookingRepository.update).toHaveBeenCalledWith("b-123", {
      status: BookingStatus.PAYMENT_FAILED,
      paymentKey: undefined,
      paymentKeyExpiry: undefined,
    });
  });

  it("should return early without releasing seats if booking is not found", async () => {
    vi.mocked(mockBookingRepository.findByBookingId).mockResolvedValueOnce(null);

    await useCase.execute(dto);

    expect(mockTripRepository.atmoicReleaseSeat).not.toHaveBeenCalled();
    expect(mockBookingRepository.update).not.toHaveBeenCalled();
  });

  it("should return early without releasing seats if booking status is not PAYMENT_PENDING", async () => {
    vi.mocked(mockBookingRepository.findByBookingId).mockResolvedValueOnce({
      ...mockBooking,
      status: BookingStatus.CONFIRMED,
    } as any);

    await useCase.execute(dto);

    expect(mockTripRepository.atmoicReleaseSeat).not.toHaveBeenCalled();
    expect(mockBookingRepository.update).not.toHaveBeenCalled();
  });

  it("should return early without releasing seats if paymentKey does not match", async () => {
    await useCase.execute({
      ...dto,
      paymentKey: "wrong-key",
    });

    expect(mockTripRepository.atmoicReleaseSeat).not.toHaveBeenCalled();
    expect(mockBookingRepository.update).not.toHaveBeenCalled();
  });
});
