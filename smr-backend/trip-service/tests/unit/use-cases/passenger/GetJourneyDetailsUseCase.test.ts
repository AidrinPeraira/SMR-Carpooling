import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetJourneyDetailsUseCase } from "#/application/use-case/trip/GetJourneyDetailsUseCase";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { mockPricingRulesRepository } from "&#/mocks/MockPricingRulesRepository";
import { mockConfigurationStore } from "&#/mocks/MockConfigurationStore";
import {
  ApplicationError,
  ErrorCode,
  HttpStatusCodes,
  TripStatus,
  VehicleTypes,
} from "@sharemyride/shared";

describe("GetJourneyDetailsUseCase", () => {
  let mockTripRepository: ITripRepository;
  let useCase: GetJourneyDetailsUseCase;

  const mockTripEntity = {
    tripId: "trip-123",
    driverId: "driver-1",
    vehicleId: "veh-1",
    tripOrigin: {
      stopLat: 10.0,
      stopLng: 76.0,
      stopName: "Origin",
      stopAddress: "Origin Addr",
    },
    tripDestination: {
      stopLat: 10.5,
      stopLng: 76.5,
      stopName: "Dest",
      stopAddress: "Dest Addr",
    },
    tripStops: [],
    tripRoute: [
      [76.0, 10.0],
      [76.5, 10.5],
    ] as [number, number][],
    tripDistance: 50,
    availableSeats: 3,
    vacantSeats: 3,
    tripTags: [],
    startTime: new Date(),
    totalSeats: 4,
    tripStatus: TripStatus.SCHEDULED,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAvailableStops = [
    { stopLat: 10.1, stopLng: 76.1, stopName: "Stop 1", stopAddress: "Addr 1" },
    { stopLat: 10.2, stopLng: 76.2, stopName: "Stop 2", stopAddress: "Addr 2" },
  ];

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
    } as unknown as ITripRepository;

    useCase = new GetJourneyDetailsUseCase(
      mockTripRepository,
      mockPricingRulesRepository,
      mockConfigurationStore,
    );
  });

  it("should return journey details with basePrice and pricePerKm from cached pricing rules", async () => {
    // Arrange
    vi.mocked(mockTripRepository.findJourneyDetails).mockResolvedValue({
      trip: mockTripEntity,
      availableStops: mockAvailableStops,
      vehicleType: VehicleTypes.SEDAN,
    });

    const cachedPricing = [
      {
        id: "price-1",
        vehicleType: VehicleTypes.SEDAN,
        basePrice: 50,
        pricePerKm: 15,
        isActive: true,
      },
    ];

    vi.mocked(mockConfigurationStore.getPricingRules).mockResolvedValue(
      cachedPricing,
    );

    // Act
    const result = await useCase.execute("trip-123");

    // Assert
    expect(mockTripRepository.findJourneyDetails).toHaveBeenCalledWith(
      "trip-123",
    );
    expect(mockConfigurationStore.getPricingRules).toHaveBeenCalled();
    expect(mockPricingRulesRepository.findAll).not.toHaveBeenCalled();

    expect(result).toEqual({
      tripId: "trip-123",
      tripStops: [mockTripEntity.tripOrigin, mockTripEntity.tripDestination],
      tripRoute: [mockTripEntity.tripRoute],
      availableStops: mockAvailableStops,
      basePrice: 50,
      pricePerKm: 15,
    });
  });

  it("should fallback to pricing repository when cache is empty and populate cache", async () => {
    // Arrange
    vi.mocked(mockTripRepository.findJourneyDetails).mockResolvedValue({
      trip: mockTripEntity,
      availableStops: mockAvailableStops,
      vehicleType: VehicleTypes.SUV,
    });

    vi.mocked(mockConfigurationStore.getPricingRules).mockResolvedValue(null);

    const dbPricing = [
      {
        id: "price-2",
        vehicleType: VehicleTypes.SUV,
        basePrice: 80,
        pricePerKm: 25,
        isActive: true,
      },
    ];

    vi.mocked(mockPricingRulesRepository.findAll).mockResolvedValue(dbPricing);

    // Act
    const result = await useCase.execute("trip-123");

    // Assert
    expect(mockConfigurationStore.getPricingRules).toHaveBeenCalled();
    expect(mockPricingRulesRepository.findAll).toHaveBeenCalled();
    expect(mockConfigurationStore.setPricingRules).toHaveBeenCalledWith(
      dbPricing,
    );

    expect(result.basePrice).toBe(80);
    expect(result.pricePerKm).toBe(25);
  });

  it("should throw ApplicationError when trip is not found", async () => {
    // Arrange
    vi.mocked(mockTripRepository.findJourneyDetails).mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute("invalid-id")).rejects.toThrow(
      ApplicationError,
    );
    await expect(useCase.execute("invalid-id")).rejects.toMatchObject({
      statusCode: HttpStatusCodes.NotFound,
      errorCode: ErrorCode.DOMAIN_NOT_FOUND,
    });
  });
});
