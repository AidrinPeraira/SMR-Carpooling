import { AddDriverRequestDTO } from "#/application/dto/driver/AddDriverRequestDTO";
import { IDriverRepository } from "#/application/interfaces/repository/IDriverRepository";
import { IPassengerRepository } from "#/application/interfaces/repository/IPassengerRepository";
import { IAddDriverUseCase } from "#/application/interfaces/use-case/driver/IAddDriverUseCase";
import { DriverEntity } from "#/domain/entities/DriverEntity";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  HttpStatusCodes,
} from "@sharemyride/shared";

/**
 * This is the implementation for add driver use case. It creates a new driver
 * using the data from application approval events
 */
export class AddDriverUseCase implements IAddDriverUseCase {
  constructor(
    private readonly _driverRepository: IDriverRepository,
    private readonly _passengerRepository: IPassengerRepository,
  ) {}

  /**
   * This method takes driver data and creates a new driver entity
   * based on the driver records data
   *
   * @param data : Driver details based on approved driver data
   */
  async execute(data: AddDriverRequestDTO): Promise<void> {
    const passenger = await this._passengerRepository.findByPassengerId(
      data.driverId,
    );

    if (!passenger) {
      throw new ApplicationError(
        "Passenger not found for driver creation",
        HttpStatusCodes.NotFound,
        ErrorCode.DOMAIN_NOT_FOUND,
        ErrorDetails.DOMAIN_NOT_FOUND,
        {
          location: "AddDriverUseCase",
          description: "Passenger record not found for the given driverId.",
        },
      );
    }

    const now = new Date();

    const driverEntity: DriverEntity = {
      driverId: data.driverId,
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      emailId: passenger.emailId,
      recordId: data.recordId,
      licenseNumber: data.licenseNumber,
      licenseImage: data.licenseImage,
      driverStatus: data.driverStatus,
      createdAt: now,
      updatedAt: now,
    };

    await this._driverRepository.save(driverEntity);
  }
}
