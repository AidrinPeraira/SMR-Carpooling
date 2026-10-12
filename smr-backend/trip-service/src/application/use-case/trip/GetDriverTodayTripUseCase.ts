import { DriverTodayTripResponseDTO } from "#/application/dto/trip/DriverTripDTO";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IGetDriverTodayTripUseCase } from "#/application/interfaces/use-case/trip/IGetDriverTodayTrip";

const COMMISSION_RATE = 0.05;

export class GetDriverTodayTripUseCase implements IGetDriverTodayTripUseCase {
  constructor(private readonly _tripRepository: ITripRepository) {}

  async execute(driverId: string): Promise<DriverTodayTripResponseDTO | null> {
    const result = await this._tripRepository.findDriverTodayTrip(driverId);
    if (!result) return null;

    const { tripDetails, bookingDetails } = result;

    const confirmedSeats = bookingDetails.reduce(
      (sum, b) => sum + b.seatCount,
      0,
    );
    const totalBookingAmount = bookingDetails.reduce(
      (sum, b) => sum + b.totalPrice,
      0,
    );
    const estimatedEarnings = Math.round(
      totalBookingAmount * (1 - COMMISSION_RATE),
    );

    return {
      tripId: tripDetails.tripId,
      startTime: tripDetails.startTime.toISOString(),
      confirmedSeats,
      totalSeats: tripDetails.totalSeats,
      estimatedEarnings,
      startLocation: tripDetails.tripOrigin,
      endLocation: tripDetails.tripDestination,
      status: tripDetails.tripStatus,
    };
  }
}
