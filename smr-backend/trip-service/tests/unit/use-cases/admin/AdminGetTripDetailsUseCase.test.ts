import { describe, expect, it, vi, beforeEach } from "vitest";
import { AdminGetTripDetailsUseCase } from "#/application/use-case/admin/trip/AdminGetTripDetailsUseCase";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import {
  ApplicationError,
  BookingStatus,
  HttpStatusCodes,
  TripErrorMessage,
} from "@sharemyride/shared";

describe("AdminGetTripDetailsUseCase", () => {
  let mockTripRepository: ITripRepository;
  let useCase: AdminGetTripDetailsUseCase;

  const mockTripDetails = {
    tripId: "trip-123",
    tripOrigin: { stopLat: 10, stopLng: 76, stopName: "A", stopAddress: "Addr A" },
    tripDestination: { stopLat: 11, stopLng: 77, stopName: "B", stopAddress: "Addr B" },
    route: [[10, 76], [11, 77]] as [number, number][],
    tripDate: new Date("2026-09-01T10:00:00Z"),
    vehicleId: "vehicle-1",
    vehicleName: "Toyota Camry",
    vehicleImage: "camry.jpg",
    driverId: "driver-1",
    driverName: "Jane Smith",
    bookings: [
      {
        bookingId: "booking-1",
        passengerName: "Bob Pass",
        bookingStatus: BookingStatus.CONFIRMED,
        bookingOrigin: "Stop A",
        bookingDestination: "Stop B",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockTripRepository = {
      cleanIndices: vi.fn(),
      save: vi.fn(),
      findTripDetails: vi.fn(),
      findMatchingTrips: vi.fn(),
      findJourneyDetails: vi.fn(),
      findByTripId: vi.fn(),
      update: vi.fn(),
      atmoicReserveSeat: vi.fn(),
      atmoicReleaseSeat: vi.fn(),
      findAdminTripDetails: vi.fn().mockResolvedValue(mockTripDetails),
    } as unknown as ITripRepository;

    useCase = new AdminGetTripDetailsUseCase(mockTripRepository);
  });

  it("should return full trip details when trip exists", async () => {
    const result = await useCase.execute("trip-123");

    expect(mockTripRepository.findAdminTripDetails).toHaveBeenCalledWith("trip-123");
    expect(result.tripId).toBe("trip-123");
    expect(result.driverName).toBe("Jane Smith");
    expect(result.bookings.length).toBe(1);
    expect(result.bookings[0]!.passengerName).toBe("Bob Pass");
  });

  it("should throw ApplicationError 404 when trip is not found", async () => {
    vi.mocked(mockTripRepository.findAdminTripDetails).mockResolvedValue(null);

    await expect(useCase.execute("invalid-trip-id")).rejects.toThrow(ApplicationError);
    await expect(useCase.execute("invalid-trip-id")).rejects.toMatchObject({
      message: TripErrorMessage.NOT_FOUND,
      statusCode: HttpStatusCodes.NotFound,
    });
  });

  
});
