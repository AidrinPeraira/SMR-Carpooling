import { describe, expect, it, vi, beforeEach } from "vitest";
import { DriverGetTripDetailsUseCase } from "#/application/use-case/trip/DriverGetTripDetailsUseCase";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { ApplicationError, TripStatus } from "@sharemyride/shared";

describe("DriverGetTripDetailsUseCase", () => {
  let mockTripRepository: ITripRepository;
  let useCase: DriverGetTripDetailsUseCase;

  const mockPayload = {
    tripDetails: {
      tripId: "trip-123",
      driverId: "driver-123",
      vehicleId: "v-123",
      tripOrigin: { stopName: "Origin", stopAddress: "Address A", stopLat: 12.9, stopLng: 77.5 } as any,
      tripDestination: { stopName: "Destination", stopAddress: "Address B", stopLat: 12.95, stopLng: 77.6 } as any,
      tripStops: [],
      tripRoute: [],
      tripDistance: 15,
      availableSeats: 3,
      vacantSeats: 2,
      tripTags: [],
      startTime: new Date("2026-09-01T10:00:00Z"),
      totalSeats: 3,
      tripStatus: TripStatus.SCHEDULED,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    vehicleDetails: {
      vehicleId: "v-123",
      driverId: "driver-123",
      recordId: "rec-1",
      vehicleType: "SEDAN" as any,
      vehicleModel: "Civic",
      vehicleMake: "Honda",
      vehicleCapacity: 4,
      registrationNumber: "KA01AB1234",
      vehicleImage: "http://example.com/car.jpg",
      vehicleStatus: "APPROVED" as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    bookingDetails: [
      {
        bookingId: "b-1",
        passengerId: "p-1",
        tripId: "trip-123",
        pickupPoint: {} as any,
        dropOffPoint: {} as any,
        pickupPlaceId: "p1",
        dropOffPlaceId: "p2",
        distanceKm: 5,
        seatCount: 1,
        totalPrice: 100,
        status: "requested" as any,
        passengerName: "John Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockTripRepository = {
      save: vi.fn(),
      findTripDetails: vi.fn().mockResolvedValue(mockPayload),
      findTripsByDriverId: vi.fn(),
      findMatchingTrips: vi.fn(),
      findJourneyDetails: vi.fn(),
      findByTripId: vi.fn(),
      update: vi.fn(),
      atmoicReserveSeat: vi.fn(),
      atmoicReleaseSeat: vi.fn(),
    };

    useCase = new DriverGetTripDetailsUseCase(mockTripRepository);
  });

  it("should throw ApplicationError if trip details not found", async () => {
    vi.mocked(mockTripRepository.findTripDetails).mockResolvedValueOnce(null);

    await expect(
      useCase.execute("non-existent", "driver-123"),
    ).rejects.toThrow(ApplicationError);
  });

  it("should throw ApplicationError if trip does not belong to driver", async () => {
    await expect(
      useCase.execute("trip-123", "other-driver"),
    ).rejects.toThrow(ApplicationError);
  });

  it("should return formatted trip details for driver", async () => {
    const result = await useCase.execute("trip-123", "driver-123");

    expect(mockTripRepository.findTripDetails).toHaveBeenCalledWith("trip-123");
    expect(result.tripVehicle).toBe("Honda Civic");
    expect(result.tripBookings.length).toBe(1);
    expect(result.tripBookings[0]!.passengerName).toBe("John Doe");
  });
});
