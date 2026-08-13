import { describe, it, expect, vi, beforeEach } from "vitest";
import { DriverAcceptBookingUseCase } from "#/application/use-case/driver/DriverAcceptBookingUseCase";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import {
  ApplicationError,
  BookingStatus,
  TripStatus,
} from "@sharemyride/shared";

describe("DriverAcceptBookingUseCase", () => {
  let useCase: DriverAcceptBookingUseCase;
  let mockBookingRepository: IBookingRepository;
  let mockTripRepository: ITripRepository;

  const mockBooking = {
    bookingId: "b-123",
    passengerId: "passenger-1",
    tripId: "trip-1",
    pickupPoint: { stopLat: 10.1, stopLng: 76.1, stopName: "Pickup", stopAddress: "Pickup Addr" },
    dropOffPoint: { stopLat: 10.2, stopLng: 76.2, stopName: "Dropoff", stopAddress: "Dropoff Addr" },
    pickupPlaceId: "p-1",
    dropOffPlaceId: "p-2",
    distanceKm: 15,
    seatCount: 2,
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

  beforeEach(() => {
    vi.clearAllMocks();

    mockBookingRepository = {
      save: vi.fn(),
      updateStatus: vi.fn().mockResolvedValue(undefined),
      findByBookingId: vi.fn().mockResolvedValue(mockBooking),
      findBookingsByDriverId: vi.fn(),
      findBookingsByPassengerId: vi.fn(),
    };

    mockTripRepository = {
      save: vi.fn(),
      findTripDetails: vi.fn(),
      findMatchingTrips: vi.fn(),
      findJourneyDetails: vi.fn(),
      findByTripId: vi.fn().mockResolvedValue(mockTrip),
    };

    useCase = new DriverAcceptBookingUseCase(
      mockBookingRepository,
      mockTripRepository,
    );
  });

  it("should accept booking successfully", async () => {
    await useCase.execute("b-123", "driver-1");

    expect(mockBookingRepository.updateStatus).toHaveBeenCalledWith(
      "b-123",
      BookingStatus.PAYMENT_PENDING,
    );
  });

  it("should throw error if booking does not exist", async () => {
    vi.spyOn(mockBookingRepository, "findByBookingId").mockResolvedValueOnce(null);

    await expect(useCase.execute("invalid-id", "driver-1")).rejects.toThrow(
      ApplicationError,
    );
  });

  it("should throw error if booking status is not REQUESTED", async () => {
    vi.spyOn(mockBookingRepository, "findByBookingId").mockResolvedValueOnce({
      ...mockBooking,
      status: BookingStatus.CONFIRMED,
    });

    await expect(useCase.execute("b-123", "driver-1")).rejects.toThrow(
      ApplicationError,
    );
  });

  it("should throw error if vacant seats are less than requested seats", async () => {
    vi.spyOn(mockTripRepository, "findByTripId").mockResolvedValueOnce({
      ...mockTrip,
      vacantSeats: 1, // requested is 2
    });

    await expect(useCase.execute("b-123", "driver-1")).rejects.toThrow(
      ApplicationError,
    );
  });
});
