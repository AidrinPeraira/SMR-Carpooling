import { describe, it, expect, vi, beforeEach } from "vitest";
import { DriverGetBookingDetailsUseCase } from "#/application/use-case/booking/DriverGetBookingDetailsUseCase";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IPassengerRepository } from "#/application/interfaces/repository/IPassengerRepository";
import { IVehicleRepository } from "#/application/interfaces/repository/IVehicleRepository";
import {
  ApplicationError,
  BookingStatus,
  HttpStatusCodes,
  TripStatus,
  VehicleStatus,
  VehicleTypes,
} from "@sharemyride/shared";

describe("DriverGetBookingDetailsUseCase", () => {
  let useCase: DriverGetBookingDetailsUseCase;
  let mockBookingRepository: IBookingRepository;
  let mockTripRepository: ITripRepository;
  let mockPassengerRepository: IPassengerRepository;
  let mockVehicleRepository: IVehicleRepository;

  const mockBooking = {
    bookingId: "b-123",
    passengerId: "passenger-1",
    tripId: "trip-1",
    pickupPoint: { stopLat: 10.1, stopLng: 76.1, stopName: "Pickup", stopAddress: "Pickup Addr" },
    dropOffPoint: { stopLat: 10.2, stopLng: 76.2, stopName: "Dropoff", stopAddress: "Dropoff Addr" },
    pickupPlaceId: "p-1",
    dropOffPlaceId: "p-2",
    distanceKm: 15,
    seatCount: 1,
    totalPrice: 150,
    status: BookingStatus.REQUESTED,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTrip = {
    tripId: "trip-1",
    driverId: "driver-1",
    vehicleId: "vehicle-1",
    tripOrigin: mockBooking.pickupPoint,
    tripDestination: mockBooking.dropOffPoint,
    tripStops: [],
    tripRoute: [[76.1, 10.1], [76.2, 10.2]] as any,
    tripDistance: 15,
    availableSeats: 4,
    vacantSeats: 4,
    tripTags: [],
    startTime: new Date(),
    totalSeats: 4,
    tripStatus: TripStatus.SCHEDULED,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPassenger = {
    passengerId: "passenger-1",
    firstName: "John",
    lastName: "Doe",
    emailId: "john@example.com",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockVehicle = {
    vehicleId: "vehicle-1",
    driverId: "driver-1",
    recordId: "rec-1",
    vehicleType: "car" as VehicleTypes,
    vehicleModel: "Model 3",
    vehicleMake: "Tesla",
    vehicleCapacity: 4,
    registrationNumber: "REG123",
    vehicleImage: "",
    vehicleStatus: VehicleStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockBookingRepository = {
      save: vi.fn(),
      update: vi.fn(),
      findByBookingId: vi.fn().mockResolvedValue(mockBooking),
      findBookingsByDriverId: vi.fn(),
      findBookingsByPassengerId: vi.fn(),
    };

    mockTripRepository = {
      cleanIndices: vi.fn(),
      save: vi.fn(),
      findTripDetails: vi.fn(),
      findMatchingTrips: vi.fn(),
      findJourneyDetails: vi.fn(),
      findByTripId: vi.fn().mockResolvedValue(mockTrip),
      update: vi.fn(),
      atmoicReserveSeat: vi.fn(),
      atmoicReleaseSeat: vi.fn(),
    };

    mockPassengerRepository = {
      save: vi.fn(),
      findByPassengerId: vi.fn().mockResolvedValue(mockPassenger),
      update: vi.fn(),
    };

    mockVehicleRepository = {
      save: vi.fn(),
      updateByRegistrationNumber: vi.fn(),
      findByDriverId: vi.fn(),
      findByVehicleId: vi.fn().mockResolvedValue(mockVehicle),
    };

    useCase = new DriverGetBookingDetailsUseCase(
      mockBookingRepository,
      mockTripRepository,
      mockPassengerRepository,
      mockVehicleRepository,
    );
  });

  it("should return booking details successfully for driver", async () => {
    const result = await useCase.execute("b-123", "driver-1");

    expect(result.bookingId).toBe("b-123");
    expect(result.passngerName).toBe("John Doe");
    expect(result.tripVehicle).toBe("Tesla Model 3");
    expect(result.status).toBe(BookingStatus.REQUESTED);
  });

  it("should throw NotFound error if booking does not exist", async () => {
    vi.spyOn(mockBookingRepository, "findByBookingId").mockResolvedValueOnce(null);

    await expect(useCase.execute("invalid-id", "driver-1")).rejects.toThrow(
      ApplicationError,
    );
  });

  it("should throw NotFound error if trip does not belong to driver", async () => {
    await expect(useCase.execute("b-123", "other-driver")).rejects.toThrow(
      ApplicationError,
    );
  });
});
