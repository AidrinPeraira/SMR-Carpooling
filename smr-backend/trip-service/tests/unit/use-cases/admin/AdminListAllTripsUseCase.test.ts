import { describe, expect, it, vi, beforeEach } from "vitest";
import { AdminListAllTripsUseCase } from "#/application/use-case/admin/trip/AdminListAllTripsUseCase";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { TripStatus } from "@sharemyride/shared";

describe("AdminListAllTripsUseCase", () => {
  let mockTripRepository: ITripRepository;
  let useCase: AdminListAllTripsUseCase;

  const mockPaginatedTrips = {
    data: [
      {
        tripId: "trip-1",
        driverName: "John Doe",
        vehicleName: "Toyota Corolla",
        tripOrigin: "Origin A",
        tripDestination: "Destination B",
        availableSeats: 4,
        vacantSeats: 3,
        startTime: new Date("2026-09-01T10:00:00Z"),
        tripStatus: TripStatus.SCHEDULED,
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

    mockTripRepository = {
      save: vi.fn(),
      findTripDetails: vi.fn(),
      findMatchingTrips: vi.fn(),
      findJourneyDetails: vi.fn(),
      findByTripId: vi.fn(),
      update: vi.fn(),
      atmoicReserveSeat: vi.fn(),
      findAllTrips: vi.fn().mockResolvedValue(mockPaginatedTrips),
    };

    useCase = new AdminListAllTripsUseCase(mockTripRepository);
  });

  it("should return paginated list of trips from trip repository", async () => {
    const query = { page: 1, limit: 10, search: "John" };
    const result = await useCase.execute(query);

    expect(mockTripRepository.findAllTrips).toHaveBeenCalledWith(query);
    expect(result.data.length).toBe(1);
    expect(result.data[0]!.tripId).toBe("trip-1");
    expect(result.data[0]!.driverName).toBe("John Doe");
    expect(result.paginationMeta.totalItems).toBe(1);
  });

  it("should throw error if findAllTrips is not implemented on repository", async () => {
    delete mockTripRepository.findAllTrips;
    await expect(useCase.execute({ page: 1, limit: 10 })).rejects.toThrow(
      "findAllTrips method not implemented in repository",
    );
  });
});
