import { describe, expect, it, vi, beforeEach } from "vitest";
import { WithdrawBookingUseCase } from "#/application/use-case/booking/WithdrawBookingUseCase";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { ApplicationError, BookingStatus } from "@sharemyride/shared";

describe("WithdrawBookingUseCase", () => {
  let mockBookingRepository: IBookingRepository;
  let useCase: WithdrawBookingUseCase;

  const mockBooking = {
    bookingId: "b-123",
    passengerId: "passenger-123",
    tripId: "t-456",
    status: BookingStatus.REQUESTED,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockBookingRepository = {
      save: vi.fn(),
      update: vi.fn().mockResolvedValue(undefined),
      findByBookingId: vi.fn().mockResolvedValue(mockBooking),
      findBookingsByDriverId: vi.fn(),
      findBookingsByPassengerId: vi.fn(),
    } as unknown as IBookingRepository;

    useCase = new WithdrawBookingUseCase(mockBookingRepository);
  });

  it("should throw ApplicationError if booking is not found", async () => {
    vi.mocked(mockBookingRepository.findByBookingId).mockResolvedValueOnce(null);

    await expect(
      useCase.execute("non-existent", "passenger-123"),
    ).rejects.toThrow(ApplicationError);
  });

  it("should throw ApplicationError if booking does not belong to passenger", async () => {
    await expect(
      useCase.execute("b-123", "other-passenger"),
    ).rejects.toThrow(ApplicationError);
  });

  it("should throw ApplicationError if booking status is not REQUESTED", async () => {
    vi.mocked(mockBookingRepository.findByBookingId).mockResolvedValueOnce({
      ...mockBooking,
      status: BookingStatus.CONFIRMED,
    } as any);

    await expect(
      useCase.execute("b-123", "passenger-123"),
    ).rejects.toThrow(ApplicationError);
  });

  it("should update booking status to CANCELLED on successful withdrawal", async () => {
    await useCase.execute("b-123", "passenger-123");

    expect(mockBookingRepository.findByBookingId).toHaveBeenCalledWith("b-123");
    expect(mockBookingRepository.update).toHaveBeenCalledWith("b-123", {
      status: BookingStatus.CANCELLED,
    });
  });
});
