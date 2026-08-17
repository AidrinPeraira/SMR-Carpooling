import {
  DriverGetAllTripsQueryDTO,
  DriverListTripsResponseDTO,
} from "#/application/dto/trip/DriverTripsDetailsDTO";
import { ITripRepository } from "#/application/interfaces/repository/ITripRepository";
import { IDriverListTripsUseCase } from "#/application/interfaces/use-case/trip/IDriverListTripsUseCase";
import { PaginatedPayload } from "@sharemyride/shared";

/**
 * Use case to list all trips created by a driver with pagination and status filtering.
 */
export class DriverListTripsUseCase implements IDriverListTripsUseCase {
  constructor(private readonly _tripRepository: ITripRepository) {}

  async execute(
    driverId: string,
    query?: DriverGetAllTripsQueryDTO,
  ): Promise<PaginatedPayload<DriverListTripsResponseDTO[]>> {
    if (!this._tripRepository.findTripsByDriverId) {
      throw new Error(
        "Repository method findTripsByDriverId is not implemented.",
      );
    }

    const payload = await this._tripRepository.findTripsByDriverId(
      driverId,
      query,
    );

    const data: DriverListTripsResponseDTO[] = payload.data.map((item) => ({
      tripId: item.tripDetails.tripId,
      tripOrigin: item.tripDetails.tripOrigin.stopName,
      tripDestination: item.tripDetails.tripDestination.stopName,
      vehicleMake: item.vehicleDetails?.vehicleMake || "Vehicle",
      vehicleModel: item.vehicleDetails?.vehicleModel || "Model",
      availableSeats: item.tripDetails.availableSeats,
      vacantSeats: item.tripDetails.vacantSeats,
      startTime: item.tripDetails.startTime,
      tripStatus: item.tripDetails.tripStatus,
    }));

    return {
      data,
      paginationMeta: payload.paginationMeta,
    };
  }
}
