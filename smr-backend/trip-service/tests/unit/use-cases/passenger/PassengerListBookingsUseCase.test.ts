import { describe, expect, it, vi } from "vitest";
import { PassengerListBookingsUseCase } from "#/application/use-case/booking/PassengerListBookingsUseCase";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";

describe("PassengerListBookingsUseCase", () => {
  it("should return paginated passenger bookings", async () => {
    const mockBookingsRepo = {
      findBookingsByPassengerId: vi.fn().mockResolvedValue({
        data: [
          {
            bookingId: "b-1",
            driverName: "John Driver",
            tripDate: new Date(),
            tripVehicle: "Toyota Prius",
            pickupPointName: "Origin",
            pickupPointAddress: "Origin Address",
            dropOffPointName: "Dest",
            dropOffPointAddress: "Dest Address",
            bookingDistance: 12.5,
            seatCount: 1,
            status: "REQUESTED",
            totalPrice: 250,
          },
        ],
        paginationMeta: {
          currentPage: 1,
          limit: 10,
          totalItems: 1,
          totalPages: 1,
        },
      }),
    } as unknown as IBookingRepository;

    const useCase = new PassengerListBookingsUseCase(mockBookingsRepo);
    const result = await useCase.execute("passenger-123", { page: 1, limit: 10 });

    expect(mockBookingsRepo.findBookingsByPassengerId).toHaveBeenCalledWith(
      "passenger-123",
      { page: 1, limit: 10 },
    );
    expect(result.data).toHaveLength(1);
    expect(result.data?.[0]?.bookingId).toBe("b-1");
  });
});
