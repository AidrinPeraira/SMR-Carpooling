import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { IAddDriverUseCase } from "#/application/interfaces/use-case/driver/IAddDriverUseCase";
import { IUpdateDriverUseCase } from "#/application/interfaces/use-case/driver/IUpdateDriverUseCase";
import { IAddVehicleUseCase } from "#/application/interfaces/use-case/vehicle/IAddVehicleUseCase";
import { IUpdateVehicleUseCase } from "#/application/interfaces/use-case/vehicle/IUpdateVehicleUseCase";
import {
  ApplicationApprovedEvent,
  ApplicationType,
  DriverStatus,
  ILogger,
  VehicleStatus,
} from "@sharemyride/shared";

/**
 * This class implements an event handler that creates or updates corresponding vehicle and driver
 * by calling the use cases based on the applicationType in the event payload.
 */
export class ApplicationApprovedHandler implements IEventHandler<ApplicationApprovedEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _addVehicleUseCase: IAddVehicleUseCase,
    private readonly _addDriverUseCase: IAddDriverUseCase,
    private readonly _updateVehicleUseCase: IUpdateVehicleUseCase,
    private readonly _updateDriverUseCase: IUpdateDriverUseCase,
  ) {}

  async handle(event: ApplicationApprovedEvent): Promise<void> {
    const { userId, applicationId, applicationType, driverData, vehicleData } =
      event.payload;

    this._logger.info("Handling application approved event: ", {
      applicationType,
      applicationId,
      userId,
    });

    switch (applicationType) {
      case ApplicationType.ONBOARDING: {
        if (driverData) {
          await this._addDriverUseCase.execute({
            driverId: userId,
            recordId: driverData.driverRecordId,
            licenseNumber: driverData.licenseNumber,
            licenseImage: driverData.licenseImage,
            driverStatus: DriverStatus.ACTIVE,
          });
        }

        if (vehicleData) {
          await this._addVehicleUseCase.execute({
            driverId: userId,
            vehicleId: vehicleData.vehicleRecordId,
            recordId: vehicleData.vehicleRecordId,
            vehicleType: vehicleData.vehicleType,
            vehicleModel: vehicleData.vehicleModel,
            vehicleMake: vehicleData.vehicleMake,
            vehicleCapacity: vehicleData.vehicleCapacity,
            registrationNumber: vehicleData.registrationNumber,
            vehicleImage: vehicleData.vehicleImage,
          });
        }
        break;
      }

      case ApplicationType.NEW_VEHICLE: {
        if (vehicleData) {
          await this._addVehicleUseCase.execute({
            driverId: userId,
            vehicleId: vehicleData.vehicleRecordId,
            recordId: vehicleData.vehicleRecordId,
            vehicleType: vehicleData.vehicleType,
            vehicleModel: vehicleData.vehicleModel,
            vehicleMake: vehicleData.vehicleMake,
            vehicleCapacity: vehicleData.vehicleCapacity,
            registrationNumber: vehicleData.registrationNumber,
            vehicleImage: vehicleData.vehicleImage,
          });
        }
        break;
      }

      case ApplicationType.RENEW_DRIVER: {
        if (driverData) {
          await this._updateDriverUseCase.execute({
            driverId: userId,
            recordId: driverData.driverRecordId,
            licenseNumber: driverData.licenseNumber,
            licenseImage: driverData.licenseImage,
            driverStatus: DriverStatus.ACTIVE,
          });
        }
        break;
      }

      case ApplicationType.RENEW_VEHICLE: {
        if (vehicleData) {
          await this._updateVehicleUseCase.execute({
            driverId: userId,
            recordId: vehicleData.vehicleRecordId,
            vehicleType: vehicleData.vehicleType,
            vehicleModel: vehicleData.vehicleModel,
            vehicleMake: vehicleData.vehicleMake,
            vehicleCapacity: vehicleData.vehicleCapacity,
            registrationNumber: vehicleData.registrationNumber,
            vehicleImage: vehicleData.vehicleImage,
            vehicleStatus: VehicleStatus.ACTIVE,
          });
        }
        break;
      }
    }
  }
}
