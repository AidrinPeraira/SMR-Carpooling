import { describe, it, expect, vi, beforeEach } from "vitest";
import { NewBookingUseCase } from "#/application/use-case/passenger/NewBookingUseCase";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IConfigurationStore } from "#/application/interfaces/store/IConfigurationsStore";
import { IPricingRulesRepository } from "#/application/interfaces/repository/IPricingRulesRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { NewBookingRequestDTO } from "#/application/dto/trip/BookingDTO";
import {
  ApplicationError,
  BookingStatus,
  HttpStatusCodes,
  Route,
  TripStatus,
  VehicleStatus,
  VehicleTypes,
} from "@sharemyride/shared";

describe("NewBookingUseCase", () => {
  let useCase: NewBookingUseCase;
  let mockBookingRepository: IBookingRepository;
  let mockConfigStore: IConfigurationStore;
  let mockPricingRepository: IPricingRulesRepository;
  let mockTripRepository: ITripRepository;

  const validDto: NewBookingRequestDTO = {
    passengerId: "passenger-123",
    tripId: "trip-123",
    pickupPoint: { stopLat: 10.1, stopLng: 76.1, stopName: "A", stopAddress: "Addr A" },
    dropOffPoint: { stopLat: 10.2, stopLng: 76.2, stopName: "B", stopAddress: "Addr B" },
    pickupPlaceId: "place-1",
    dropOffPlaceId: "place-2",
    seatCount: 2,
    distanceKm: 10,
  };

  const mockTripPayload = {
    tripDetails: {
      tripId: "trip-123",
      driverId: "driver-1",
      vehicleId: "vehicle-1",
      tripOrigin: validDto.pickupPoint,
      tripDestination: validDto.dropOffPoint,
      tripStops: [],
      tripRoute: [
        [10.1, 76.1],
        [10.2, 76.2],
      ] as Route,
      tripDistance: 10,
      availableSeats: 4,
      vacantSeats: 4,
      tripTags: [],
      startTime: new Date(),
      totalSeats: 4,
      tripStatus: TripStatus.SCHEDULED,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    vehicleDetails: {
      vehicleId: "vehicle-1",
      driverId: "driver-1",
      recordId: "rec-1",
      vehicleType: "car" as VehicleTypes,
      vehicleModel: "Model S",
      vehicleMake: "Tesla",
      vehicleCapacity: 4,
      registrationNumber: "REG123",
      vehicleImage: "",
      vehicleStatus: VehicleStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    bookingDetails: [],
  };

  const mockPricingRules = [
    {
      id: "rule-1",
      vehicleType: "car" as VehicleTypes,
      pricePerKm: 10,
      basePrice: 50,
      isActive: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    mockBookingRepository = {
      save: vi.fn(),
    };

    mockConfigStore = {
      getVehicleList: vi.fn(),
      setVehicleList: vi.fn(),
      getPricingRules: vi.fn().mockResolvedValue(mockPricingRules),
      setPricingRules: vi.fn(),
      invalidateCache: vi.fn(),
    };

    mockPricingRepository = {
      save: vi.fn(),
      findAll: vi.fn().mockResolvedValue(mockPricingRules),
      findByVehicleType: vi.fn(),
      updateById: vi.fn(),
    };

    mockTripRepository = {
      save: vi.fn(),
      findTripDetails: vi.fn().mockResolvedValue(mockTripPayload),
      findMatchingTrips: vi.fn(),
      findJourneyDetails: vi.fn(),
    };

    useCase = new NewBookingUseCase(
      mockBookingRepository,
      mockConfigStore,
      mockPricingRepository,
      mockTripRepository,
    );
  });

  it("should create a new booking successfully with calculated price", async () => {
    await useCase.execute(validDto);

    expect(mockTripRepository.findTripDetails).toHaveBeenCalledWith("trip-123");
    expect(mockBookingRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        passengerId: "passenger-123",
        tripId: "trip-123",
        totalPrice: 300, // (50 + 10 * 10) * 2 = 300
        status: BookingStatus.REQUESTED,
      }),
    );
  });

  it("should throw NotFound error if trip does not exist", async () => {
    vi.mocked(mockTripRepository.findTripDetails).mockResolvedValueOnce(null as any);

    await expect(useCase.execute(validDto)).rejects.toThrow(ApplicationError);
  });

  it("should throw BadRequest error if trip status is not SCHEDULED", async () => {
    vi.mocked(mockTripRepository.findTripDetails).mockResolvedValueOnce({
      ...mockTripPayload,
      tripDetails: {
        ...mockTripPayload.tripDetails,
        tripStatus: TripStatus.CANCELLED,
      },
    });

    await expect(useCase.execute(validDto)).rejects.toThrow(ApplicationError);
  });

  it("should throw BadRequest error if passenger is already booked on this trip", async () => {
    vi.mocked(mockTripRepository.findTripDetails).mockResolvedValueOnce({
      ...mockTripPayload,
      bookingDetails: [
        {
          bookingId: "b-1",
          passengerId: "passenger-123",
          tripId: "trip-123",
          pickupPoint: validDto.pickupPoint,
          dropOffPoint: validDto.dropOffPoint,
          pickupPlaceId: "place-1",
          dropOffPlaceId: "place-2",
          distanceKm: 10,
          seatCount: 1,
          totalPrice: 150,
          status: BookingStatus.CONFIRMED,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });

    await expect(useCase.execute(validDto)).rejects.toThrow(ApplicationError);
  });

  it("should throw BadRequest error if requested seats exceed vacant seats", async () => {
    const invalidSeatDto = { ...validDto, seatCount: 10 };

    await expect(useCase.execute(invalidSeatDto)).rejects.toThrow(ApplicationError);
  });
});
