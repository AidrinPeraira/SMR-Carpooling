import { IUpdateVehicleConfigUseCase } from "#/application/interfaces/use-case/admin/config/IUpdateVehicleConfigListUseCase";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ILogger, UpdateVehicleEvent } from "@sharemyride/shared";

/**
 * This class implements the handler for handling vehicle config update event.
 * It calls the use case to update the vehicle list repository.
 */
export class UpdateVehicleConfigHandler
  implements IEventHandler<UpdateVehicleEvent>
{
  constructor(
    private readonly _logger: ILogger,
    private readonly _useCase: IUpdateVehicleConfigUseCase,
  ) {}

  async handle(event: UpdateVehicleEvent): Promise<void> {
    this._logger.info(
      "Handling UpdateVehicleEvent in user-service: ",
      event.payload.id,
    );
    await this._useCase.execute({
      id: event.payload.id,
      vehicleType: event.payload.vehicleType,
      vehicleMake: event.payload.vehicleMake,
      vehicleModel: event.payload.vehicleModel,
      isActive: event.payload.isActive,
    });
  }
}
