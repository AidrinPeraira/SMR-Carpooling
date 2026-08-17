import { describe, expect, it, vi, beforeEach } from "vitest";
import { AdminListAllBookingsUseCase } from "#/application/use-case/admin/booking/AdminListAllBookingsUseCase";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { BookingStatus } from "@sharemyride/shared";

describe("AdminListAllBookingsUseCase", () => {
  let mockBookingRepository: IBookingRepository;
  let useCase: AdminListAllBookingsUseCase;

  const mockPaginatedBookings = {
    data: [
      {
        bookingId: "booking-100",
        passengerName: "Alice Walker",
        bookingOrigin: "Location X",
        bookingDestination: "Location Y",
        status: BookingStatus.CONFIRMED,
        tripDate: new Date("2026-09-02T12:00:00Z"),
      },
    ],
    paginationMeta: {
      currentPage: 1,
      limit: 10,
      totalItems: 1,
      totalPages: 1,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockBookingRepository = {
      save: vi.fn(),
      updateStatus: vi.fn(),
      findByBookingId: vi.fn(),
      findBookingsByDriverId: vi.fn(),
      findBookingsByPassengerId: vi.fn(),
      findAllBookings: vi.fn().mockResolvedValue(mockPaginatedBookings),
    };

    useCase = new AdminListAllBookingsUseCase(mockBookingRepository);
  });

  it("should return paginated list of bookings from booking repository", async () => {
    const query = { page: 1, limit: 10, search: "Alice" };
    const result = await useCase.execute(query);

    expect(mockBookingRepository.findAllBookings).toHaveBeenCalledWith(query);
    expect(result.data.length).toBe(1);
    expect(result.data[0]!.bookingId).toBe("booking-100");
    expect(result.data[0]!.passengerName).toBe("Alice Walker");
    expect(result.paginationMeta.totalItems).toBe(1);
  });

  it("should throw error if findAllBookings is not implemented on repository", async () => {
    delete mockBookingRepository.findAllBookings;
    await expect(useCase.execute({ page: 1, limit: 10 })).rejects.toThrow(
      "findAllBookings method not implemented in repository",
    );
  });
});
