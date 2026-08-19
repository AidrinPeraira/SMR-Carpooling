import { IPassengerRepository } from "#/application/interfaces/repository/IPassengerRepository";
import { PassengerEntity } from "#/domain/entities/PassengerEntity";
import { prisma } from "#/infrastructure/database/prisma";

/**
 * This class implements the repository to handle database operations
 * on passenger entities.
 */
export class PassengerRepository implements IPassengerRepository {
  private readonly passengerModel = prisma.passenger;

  constructor() {}

  async save(passenger: PassengerEntity): Promise<PassengerEntity> {
    const newPassenger = await this.passengerModel.create({ data: passenger });
    return newPassenger;
  }

  async findByPassengerId(passengerId: string): Promise<PassengerEntity | null> {
    const passenger = await this.passengerModel.findUnique({
      where: { passengerId },
    });
    return passenger;
  }

  async update(
    passengerId: string,
    data: Partial<PassengerEntity>,
  ): Promise<PassengerEntity | null> {
    const existing = await this.passengerModel.findUnique({
      where: { passengerId },
    });
    if (!existing) return null;

    const updatedPassenger = await this.passengerModel.update({
      where: { passengerId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return updatedPassenger;
  }
}
