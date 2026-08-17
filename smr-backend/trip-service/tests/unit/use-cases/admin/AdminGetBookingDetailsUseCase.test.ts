import { describe, expect, it, vi, beforeEach } from "vitest";
import { AdminGetBookingDetailsUseCase } from "#/application/use-case/admin/booking/AdminGetBookingDetailsUseCase";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import {
  ApplicationError,
  BookingErrorMessage,
  BookingStatus,
  HttpStatusCodes,
} from "@sharemyride/shared";

describe("AdminGetBookingDetailsUseCase", () => {
  let mockBookingRepository: IBookingRepository;
  let useCase: AdminGetBookingDetailsUseCase;

  const mockBookingDetails = {
    bookingId: "b-1",
    tripId: "t-1",
    tripDate: "2026-09-02T12:00:00.000Z",
    tripOrigin: { stopLat: 10, stopLng: 76, stopName: "Origin", stopAddress: "Address O" },
    tripDestination: { stopLat: 11, stopLng: 77, stopName: "Dest", stopAddress: "Address D" },
    tripRoute: [[10, 76], [11, 77]] as [number, number][],
    vehicelName: "Honda Civic",
    passengerId: "p-1",
    passengerName: "Charlie Pass",
    bookingStatus: BookingStatus.CONFIRMED,
    bookingOrigin: { stopLat: 10, stopLng: 76, stopName: "Origin", stopAddress: "Address O" },
    bookingDestination: { stopLat: 11, stopLng: 77, stopName: "Dest", stopAddress: "Address D" },
    distanceKm: 15,
    seatCount: 2,
    totalPrice: 150,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockBookingRepository = {
      save: vi.fn(),
      updateStatus: vi.fn(),
      findByBookingId: vi.fn(),
      findBookingsByDriverId: vi.fn(),
      findBookingsByPassengerId: vi.fn(),
      findAdminBookingDetails: vi.fn().mockResolvedValue(mockBookingDetails),
    };

    useCase = new AdminGetBookingDetailsUseCase(mockBookingRepository);
  });

  it("should return full booking details when booking exists", async () => {
    const result = await useCase.execute("b-1");

    expect(mockBookingRepository.findAdminBookingDetails).toHaveBeenCalledWith("b-1");
    expect(result.bookingId).toBe("b-1");
    expect(result.passengerName).toBe("Charlie Pass");
    expect(result.vehicelName).toBe("Honda Civic");
    expect(result.distanceKm).toBe(15);
  });

  it("should throw ApplicationError 404 when booking is not found", async () => {
    vi.mocked(mockBookingRepository.findAdminBookingDetails!).mockResolvedValue(null);

    await expect(useCase.execute("invalid-b-id")).rejects.toThrow(ApplicationError);
    await expect(useCase.execute("invalid-b-id")).rejects.toMatchObject({
      message: BookingErrorMessage.NOT_FOUND,
      statusCode: HttpStatusCodes.NotFound,
    });
  });

  it("should throw error if findAdminBookingDetails is not implemented on repository", async () => {
    delete mockBookingRepository.findAdminBookingDetails;
    await expect(useCase.execute("b-1")).rejects.toThrow(
      "findAdminBookingDetails method not implemented in repository",
    );
  });
});
