import { describe, expect, it, vi } from "vitest";
import { GetPassengerBookingDetailsUseCase } from "#/application/use-case/passenger/GetPassngerBookingDetailsUseCase";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IDriverRepository } from "#/application/interfaces/repository/IDriverRepository";
import { IVehicleRepository } from "#/application/interfaces/repository/IVehicleRepository";
import { ApplicationError } from "@sharemyride/shared";

describe("GetPassengerBookingDetailsUseCase", () => {
  const mockBooking = {
    bookingId: "b-100",
    passengerId: "passenger-1",
    tripId: "t-100",
    pickupPoint: { stopName: "Stop A", stopAddress: "Addr A", stopLat: 10, stopLng: 75 },
    dropOffPoint: { stopName: "Stop B", stopAddress: "Addr B", stopLat: 11, stopLng: 76 },
    distanceKm: 15.0,
    seatCount: 2,
    totalPrice: 300,
    status: "CONFIRMED",
  };

  const mockTrip = {
    tripId: "t-100",
    driverId: "driver-1",
    vehicleId: "v-1",
    startTime: new Date(),
    tripRoute: [[75, 10], [76, 11]],
  };

  const mockDriver = {
    driverId: "driver-1",
    firstName: "Jane",
    lastName: "Doe",
  };

  const mockVehicle = {
    vehicleId: "v-1",
    vehicleMake: "Honda",
    vehicleModel: "Civic",
    vehicleImage: "http://example.com/car.png",
  };

  it("should throw ApplicationError if booking is not found", async () => {
    const mockBookingsRepo = {
      findByBookingId: vi.fn().mockResolvedValue(null),
    } as unknown as IBookingRepository;

    const useCase = new GetPassengerBookingDetailsUseCase(
      mockBookingsRepo,
      {} as any,
      {} as any,
      {} as any,
    );

    await expect(useCase.execute("b-999", "passenger-1")).rejects.toThrow(ApplicationError);
  });

  it("should throw ApplicationError if booking does not belong to passenger", async () => {
    const mockBookingsRepo = {
      findByBookingId: vi.fn().mockResolvedValue(mockBooking),
    } as unknown as IBookingRepository;

    const useCase = new GetPassengerBookingDetailsUseCase(
      mockBookingsRepo,
      {} as any,
      {} as any,
      {} as any,
    );

    await expect(useCase.execute("b-100", "other-passenger")).rejects.toThrow(ApplicationError);
  });

  it("should return booking details for authorized passenger", async () => {
    const mockBookingsRepo = {
      findByBookingId: vi.fn().mockResolvedValue(mockBooking),
    } as unknown as IBookingRepository;
    const mockTripsRepo = {
      findByTripId: vi.fn().mockResolvedValue(mockTrip),
    } as unknown as ITripRepository;
    const mockDriversRepo = {
      findByDriverId: vi.fn().mockResolvedValue(mockDriver),
    } as unknown as IDriverRepository;
    const mockVehiclesRepo = {
      findByVehicleId: vi.fn().mockResolvedValue(mockVehicle),
    } as unknown as IVehicleRepository;

    const useCase = new GetPassengerBookingDetailsUseCase(
      mockBookingsRepo,
      mockTripsRepo,
      mockDriversRepo,
      mockVehiclesRepo,
    );

    const result = await useCase.execute("b-100", "passenger-1");

    expect(result.bookingId).toBe("b-100");
    expect(result.driverName).toBe("Jane Doe");
    expect(result.tripVehicle).toBe("Honda Civic");
    expect(result.tirpVehicleImage).toBe("http://example.com/car.png");
  });
});
