import { IAddNewVehicleListConfigUseCase } from "#/application/interfaces/use-case/admin/config/IAddNewVehicleListConfigUseCase";
import { IEventHandler } from "#/application/interfaces/messaging/IEventHandler";
import { ILogger, NewVehicleEvent } from "@sharemyride/shared";

/**
 * This implements the logic for handling changes in vehicle list from trip service.
 * It calls the use case to create a new db entry in vehicle list repo.
 */
export class NewVehicleConfigHandler implements IEventHandler<NewVehicleEvent> {
  constructor(
    private readonly _logger: ILogger,
    private readonly _useCase: IAddNewVehicleListConfigUseCase,
  ) {}

  async handle(event: NewVehicleEvent): Promise<void> {
    this._logger.info(
      "Handling NewVehicleEvent in user-service: ",
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
