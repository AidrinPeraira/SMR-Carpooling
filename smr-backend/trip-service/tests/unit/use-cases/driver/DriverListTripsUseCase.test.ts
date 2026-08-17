import { describe, expect, it, vi, beforeEach } from "vitest";
import { DriverListTripsUseCase } from "#/application/use-case/trip/DriverListTripsUseCase";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { TripStatus } from "@sharemyride/shared";

describe("DriverListTripsUseCase", () => {
  let mockTripRepository: ITripRepository;
  let useCase: DriverListTripsUseCase;

  const mockPaginatedTrips = {
    data: [
      {
        tripDetails: {
          tripId: "trip-1",
          driverId: "driver-123",
          tripOrigin: { stopName: "Origin A" } as any,
          tripDestination: { stopName: "Destination A" } as any,
          availableSeats: 3,
          vacantSeats: 2,
          startTime: new Date("2026-09-01T10:00:00Z"),
          tripStatus: TripStatus.SCHEDULED,
        } as any,
        vehicleDetails: {
          vehicleMake: "Toyota",
          vehicleModel: "Corolla",
        } as any,
        bookingDetails: [],
      },
    ],
    paginationMeta: {
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: 10,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockTripRepository = {
      save: vi.fn(),
      findTripDetails: vi.fn(),
      findTripsByDriverId: vi.fn().mockResolvedValue(mockPaginatedTrips as any),
      findMatchingTrips: vi.fn(),
      findJourneyDetails: vi.fn(),
      findByTripId: vi.fn(),
    };

    useCase = new DriverListTripsUseCase(mockTripRepository);
  });

  it("should return paginated list of driver trips", async () => {
    const queryDto = { page: 1, limit: 10, tripStatus: TripStatus.SCHEDULED };
    const result = await useCase.execute("driver-123", queryDto);

    expect(mockTripRepository.findTripsByDriverId).toHaveBeenCalledWith(
      "driver-123",
      queryDto,
    );
    expect(result.data.length).toBe(1);
    expect(result.data[0]!.tripId).toBe("trip-1");
    expect(result.data[0]!.vehicleMake).toBe("Toyota");
    expect(result.data[0]!.vehicleModel).toBe("Corolla");
  });
});
