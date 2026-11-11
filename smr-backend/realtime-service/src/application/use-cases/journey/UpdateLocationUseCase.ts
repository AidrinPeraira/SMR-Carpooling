import { UpdateLocationRequestDTO } from "#/application/dto/JourneyDTO";
import { ISocketEmitter } from "#/application/interfaces/sockets/ISocketEmitter";
import { IUpdateLocationUseCase } from "#/application/interfaces/use-cases/journey/IUpdateLocationUseCase";
import { SocketEvents } from "@sharemyride/shared";

/**
 * This class implements the use case that handles sharing
 * live location updates to members in the journey room
 */
export class UpdateLocationUseCase implements IUpdateLocationUseCase {
  constructor(private readonly _socketEmitter: ISocketEmitter) {}

  async execute(dto: UpdateLocationRequestDTO): Promise<void> {
    await this._socketEmitter.emitToRoom(
      `journey:${dto.journeyId}`,
      SocketEvents.JOURNEY_LOCATION_BROADCAST,
      {
        lat: dto.lat,
        lng: dto.lng,
        heading: dto.heading,
        speed: dto.speed,
        timestamp: dto.timestamp,
      },
    );
  }
}
