import { IJourneyRepository } from "#/application/interfaces/repository/IJourneyRepository";
import { JourneyEntity } from "#/domain/entities/JourneyEntity";
import { prisma } from "#/infrastructure/database/prisma";
import { Prisma } from "#/infrastructure/database/generated/prisma/client";
import { JourneyStop, TripStatus, TripStop } from "@sharemyride/shared";

interface JourneyRecord {
  journeyId: string;
  driverId: string;
  origin: unknown;
  destination: unknown;
  intermediateStops: unknown;
  journeyStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * This class implements the repository that handles database
 * operations on journey records, the live representation of a trip.
 */
export class JourneyRepository implements IJourneyRepository {
  private readonly _journeyModel = prisma.journey;

  constructor() {}

  /**
   * Creates a new journey record for a trip
   *
   * @param journey Journey entity, journeyId matches the tripId
   */
  async save(journey: JourneyEntity): Promise<JourneyEntity> {
    const created = await this._journeyModel.create({
      data: {
        journeyId: journey.journeyId,
        driverId: journey.driverId,
        origin: journey.origin as unknown as Prisma.InputJsonValue,
        destination: journey.destination as unknown as Prisma.InputJsonValue,
        intermediateStops:
          journey.intermediateStops as unknown as Prisma.InputJsonValue,
        journeyStatus: journey.journeyStatus,
        createdAt: journey.createdAt,
        updatedAt: journey.updatedAt,
      },
    });

    return this._toEntity(created);
  }

  /**
   * Updates fields of a journey by journeyId
   *
   * @param journeyId Journey ID
   * @param journey Fields to update
   */
  async updateById(
    journeyId: string,
    journey: Partial<JourneyEntity>,
  ): Promise<JourneyEntity> {
    const updateData: Prisma.JourneyUpdateInput = {};

    if (journey.origin !== undefined)
      updateData.origin = journey.origin as unknown as Prisma.InputJsonValue;
    if (journey.destination !== undefined)
      updateData.destination =
        journey.destination as unknown as Prisma.InputJsonValue;
    if (journey.intermediateStops !== undefined)
      updateData.intermediateStops =
        journey.intermediateStops as unknown as Prisma.InputJsonValue;
    if (journey.journeyStatus !== undefined)
      updateData.journeyStatus = journey.journeyStatus;

    updateData.updatedAt = journey.updatedAt ?? new Date();

    const updated = await this._journeyModel.update({
      where: { journeyId },
      data: updateData,
    });

    return this._toEntity(updated);
  }

  /**
   * Finds a single journey by journeyId
   *
   * @param journeyId Journey ID, same as the tripId
   */
  async findById(journeyId: string): Promise<JourneyEntity | null> {
    const journey = await this._journeyModel.findUnique({
      where: { journeyId },
    });

    if (!journey) return null;

    return this._toEntity(journey);
  }

  /**
   * Maps a journey database record to the journey entity
   */
  private _toEntity(record: JourneyRecord): JourneyEntity {
    return {
      journeyId: record.journeyId,
      driverId: record.driverId,
      origin: record.origin as TripStop,
      destination: record.destination as TripStop,
      intermediateStops: record.intermediateStops as JourneyStop[],
      journeyStatus: record.journeyStatus as
        | TripStatus.ONGOING
        | TripStatus.COMPLETED,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
