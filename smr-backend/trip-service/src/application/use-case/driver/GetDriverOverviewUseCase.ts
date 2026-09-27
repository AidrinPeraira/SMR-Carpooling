import {
  DriverOverviewResponseDTO,
  RecentBookingDTO,
  TodayTripDTO,
} from "#/application/dto/driver/DriverOverviewDTO";
import { IBookingRepository } from "#/application/interfaces/repository/IBookingRepository";
import { IDriverRepository } from "#/application/interfaces/repository/IDriverRepository";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IVehicleRepository } from "#/application/interfaces/repository/IVehicleRepository";
import { IGetDriverOverviewUseCase } from "#/application/interfaces/use-case/driver/IGetDriverOverviewUseCase";
import {
  ApplicationError,
  BookingStatus,
  ErrorCode,
  ErrorDetails,
  GenericErrorMessage,
  HttpStatusCodes,
  TripStatus,
  VehicleStatus,
} from "@sharemyride/shared";

export class GetDriverOverviewUseCase implements IGetDriverOverviewUseCase {
  constructor(
    private readonly _driverRepository: IDriverRepository,
    private readonly _bookingRepository: IBookingRepository,
    private readonly _tripRepository: ITripRepository,
    private readonly _vehicleRepository: IVehicleRepository,
  ) {}

  async execute(driverId: string): Promise<DriverOverviewResponseDTO> {
    const [driver, tripsResult, bookingsResult, vehicles] = await Promise.all([
      this._driverRepository.findByDriverId(driverId),
      this._tripRepository.findTripsByDriverId(driverId, { limit: 50 }),
      this._bookingRepository.findBookingsByDriverId(driverId, {
        limit: 3,
        bookingStatus: BookingStatus.CONFIRMED,
      }),
      this._vehicleRepository.findByDriverId(driverId),
    ]);

    if (!driver) {
      throw new ApplicationError(
        GenericErrorMessage.NOT_FOUND,
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "Driver overview use case.",
          description: "Driver not found for given id",
        },
      );
    }

    const trips = tripsResult.data;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let todayTrip: TodayTripDTO | null = null;
    const todayTripData = trips.find((t) => {
      const start = new Date(t.tripDetails.startTime);
      return (
        start >= today &&
        start < tomorrow &&
        t.tripDetails.tripStatus !== TripStatus.COMPLETED &&
        t.tripDetails.tripStatus !== TripStatus.CANCELLED
      );
    });

    if (todayTripData) {
      todayTrip = {
        tripId: todayTripData.tripDetails.tripId,
        origin: todayTripData.tripDetails.tripOrigin.stopName,
        destination: todayTripData.tripDetails.tripDestination.stopName,
        startTime: todayTripData.tripDetails.startTime,
        vacantSeats: todayTripData.tripDetails.vacantSeats,
        totalSeats: todayTripData.tripDetails.totalSeats,
        tripStatus: todayTripData.tripDetails.tripStatus,
      };
    }

    const recentBookings: RecentBookingDTO[] = bookingsResult.data.map((b) => ({
      bookingId: b.bookingId,
      passengerName: b.passngerName,
      pickup: b.pickupPointName,
      dropOff: b.dropOffPointName,
      seatCount: b.seatCount,
      status: b.status,
      totalPrice: b.totalPrice,
      createdAt: b.tripDate,
    }));

    const completedTrips = trips.filter(
      (t) => t.tripDetails.tripStatus === TripStatus.COMPLETED,
    );
    const confirmedBookings = completedTrips.flatMap((t) =>
      t.bookingDetails.filter((b) => b.status === BookingStatus.CONFIRMED),
    );

    const stats = {
      totalTripsCompleted: completedTrips.length,
      totalEarnings: confirmedBookings.reduce(
        (sum, b) => sum + b.totalPrice,
        0,
      ),
      totalPassengers: confirmedBookings.reduce(
        (sum, b) => sum + b.seatCount,
        0,
      ),
    };

    const activeVehicle = vehicles.find(
      (v) => v.vehicleStatus === VehicleStatus.ACTIVE,
    );

    return {
      driverStatus: driver.driverStatus,
      todayTrip,
      recentBookings,
      stats,
      activeVehicle: activeVehicle
        ? {
            vehicleType: activeVehicle.vehicleType,
            vehicleMake: activeVehicle.vehicleMake,
            vehicleModel: activeVehicle.vehicleModel,
            registrationNumber: activeVehicle.registrationNumber,
            vehicleStatus: activeVehicle.vehicleStatus,
          }
        : null,
    };
  }
}
