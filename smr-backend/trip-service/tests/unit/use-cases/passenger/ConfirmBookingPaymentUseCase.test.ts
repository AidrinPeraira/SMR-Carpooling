import { describe, expect, it, vi, beforeEach } from "vitest";
import { ConfirmBookingPaymentUseCase } from "#/application/use-case/booking/ConfirmBookingPaymentUseCase";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import {
  ApplicationError,
  BookingErrorMessage,
  BookingStatus,
  HttpStatusCodes,
} from "@sharemyride/shared";

describe("ConfirmBookingPaymentUseCase", () => {
  let mockBookingRepository: IBookingRepository;
  let useCase: ConfirmBookingPaymentUseCase;

  const mockBooking = {
    bookingId: "b-123",
    passengerId: "passenger-123",
    tripId: "t-456",
    status: BookingStatus.PAYMENT_PROCESSING,
    seatCount: 2,
    totalPrice: 150,
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
    };

    useCase = new ConfirmBookingPaymentUseCase(mockBookingRepository);
  });

  it("should update booking status to CONFIRMED when valid", async () => {
    await useCase.execute("b-123");

    expect(mockBookingRepository.findByBookingId).toHaveBeenCalledWith("b-123");
    expect(mockBookingRepository.update).toHaveBeenCalledWith("b-123", {
      status: BookingStatus.CONFIRMED,
    });
  });

  it("should throw ApplicationError (404) if booking is not found", async () => {
    vi.mocked(mockBookingRepository.findByBookingId).mockResolvedValueOnce(null);

    await expect(useCase.execute("non-existent")).rejects.toThrow(
      ApplicationError,
    );

    try {
      await useCase.execute("non-existent");
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

    await expect(useCase.execute("b-123")).rejects.toThrow(ApplicationError);

    try {
      await useCase.execute("b-123");
    } catch (err: any) {
      expect(err.statusCode).toBe(HttpStatusCodes.BadRequest);
      expect(err.message).toBe(BookingErrorMessage.INVALID_STATUS_TRANSITION);
    }
  });
});
