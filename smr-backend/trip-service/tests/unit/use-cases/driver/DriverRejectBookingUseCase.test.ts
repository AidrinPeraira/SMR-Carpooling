import { describe, it, expect, vi, beforeEach } from "vitest";
import { DriverRejectBookingUseCase } from "#/application/use-case/driver/DriverRejectBookingUseCase";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import {
  ApplicationError,
  BookingStatus,
  TripStatus,
} from "@sharemyride/shared";

describe("DriverRejectBookingUseCase", () => {
  let useCase: DriverRejectBookingUseCase;
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

  beforeEach(() => {
    vi.clearAllMocks();

    mockBookingRepository = {
      save: vi.fn(),
      updateStatus: vi.fn().mockResolvedValue(undefined),
      findByBookingId: vi.fn().mockResolvedValue(mockBooking),
      findBookingsByDriverId: vi.fn(),
    };

    mockTripRepository = {
      save: vi.fn(),
      findTripDetails: vi.fn(),
      findMatchingTrips: vi.fn(),
      findJourneyDetails: vi.fn(),
      findByTripId: vi.fn().mockResolvedValue(mockTrip),
    };

    useCase = new DriverRejectBookingUseCase(
      mockBookingRepository,
      mockTripRepository,
    );
  });

  it("should reject booking successfully", async () => {
    await useCase.execute("b-123", "driver-1");

    expect(mockBookingRepository.updateStatus).toHaveBeenCalledWith(
      "b-123",
      BookingStatus.REJECTED,
    );
  });

  it("should throw error if booking does not exist", async () => {
    vi.spyOn(mockBookingRepository, "findByBookingId").mockResolvedValueOnce(null);

    await expect(useCase.execute("invalid-id", "driver-1")).rejects.toThrow(
      ApplicationError,
    );
  });

  it("should throw error if trip does not belong to driver", async () => {
    await expect(useCase.execute("b-123", "other-driver")).rejects.toThrow(
      ApplicationError,
    );
  });
});
