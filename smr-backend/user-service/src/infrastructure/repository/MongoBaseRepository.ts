import { IBaseRepository } from "#/application/interfaces/repository/IBaseRepository";
import {
  ApplicationError,
  ErrorCode,
  ErrorDetails,
  GenericErrorMessage,
  HttpStatusCodes,
} from "@smr/shared";
import { Document, Model, QueryFilter, UpdateQuery } from "mongoose";

/**
 * This is the implementation for the base repository
 * It handles operations common across all repositories.
 * It takes the correct entity type and the infered document type as a generic.
 *
 * @param _customIdName : The name of customId created for each collection.
 * @param DocType : The infered type for document infrered from schema
 */
export abstract class MongoBaseRepository<
  EntityType,
  DocType extends Document,
> implements IBaseRepository<EntityType> {
  constructor(
    private readonly _customIdName: string,
    protected readonly model: Model<DocType>,
  ) {}

  /**
   * Mapper function implemented by corresponding repsittory.
   * Takes a document and maps it values to a domain entity to return to the use case.
   * Maps the MongoDB "_id" field to "id".
   *
   * @param data : Mongoose document
   * @return Domain entity type.
   */
  protected abstract toDomainEntityMapper(data: DocType): EntityType;

  /**
   * This functions takes a Mongoose QueryFilter object and queries the DB to return an array of matching docs. An empty array if nothing is found.
   *
   * @param query : Mongoose query
   * @return Array of Domain Entities
   */
  async find(query: QueryFilter<DocType>): Promise<EntityType[]> {
    const data = await this.model.find(query).lean();
    return data.map((d) => this.toDomainEntityMapper(d));
  }

  /**
   * This method queries the database for document with given MongoDb ID.
   * It fetches the document and maps into domain entity and returns.
   * If not found returns null
   *
   * @param id : MongoDB document id
   * @return Domain Entity or null.
   */
  async findById(id: string): Promise<EntityType | null> {
    let data = await this.model.findById(id).lean();
    return data ? this.toDomainEntityMapper(data) : null;
  }

  /**
   * This method queries the database for document for the custom id field set in the document.
   * It fetches the document and maps into domain entity and returns.
   * If not found returns null
   *
   * @param customId : Value of the custom id field set for the collection.
   * @return Domain Entity or null.
   */
  async findByCustomId(customId: string): Promise<EntityType | null> {
    const query: QueryFilter<DocType> = {
      [this._customIdName]: customId,
    };
    const data = await this.model.findOne(query).lean();
    return data ? this.toDomainEntityMapper(data) : null;
  }

  /**
   * This method queries the database for document with given MongoDb ID.
   * It updates the document with given data.
   * If not found or updates fails the method throws an application error.
   *
   * @param id : MongoDB document id
   * @param data : Partial entity with data to be updated
   * @return updated Domain Entity.
   */
  async updateById(id: string, data: Partial<EntityType>): Promise<EntityType> {
    const updated = await this.model
      .findOneAndUpdate(
        { _id: id } as QueryFilter<DocType>,
        data as unknown as UpdateQuery<DocType>,
        {
          returnDocument: "after",
        },
      )
      .exec();

    if (!updated) {
      throw new ApplicationError(
        GenericErrorMessage.INTERNAL_SERVER_ERROR,
        HttpStatusCodes.NotModified,
        ErrorCode.SYSTEM_DB_ERROR,
        ErrorDetails.SYSTEM_DB_ERROR,
      );
    }

    return this.toDomainEntityMapper(updated);
  }

  /**
   * This method queries the database for document with given custom id.
   * It updates the document with given data.
   * If not found or updates fails the method throws an application error.
   *
   * @param id : Value of custom id field
   * @param data : Partial entity with data to be updated
   * @return updated Domain Entity.
   */
  async updateByCustomId(
    customId: string,
    data: Partial<EntityType>,
  ): Promise<EntityType> {
    const updated = await this.model
      .findOneAndUpdate(
        { [this._customIdName]: customId } as QueryFilter<DocType>,
        data as unknown as UpdateQuery<DocType>,
        {
          returnDocument: "after",
        },
      )
      .exec();

    if (!updated) {
      throw new ApplicationError(
        GenericErrorMessage.INTERNAL_SERVER_ERROR,
        HttpStatusCodes.NotModified,
        ErrorCode.SYSTEM_DB_ERROR,
        ErrorDetails.SYSTEM_DB_ERROR,
      );
    }

    return this.toDomainEntityMapper(updated);
  }

  /**
   * This method queries the database for document with given MongoDb ID.
   * It deltes the document with given id.
   * If delete operation fails the method throws an application error.
   *
   * @param id : MongoDB document id
   * @return true if success. throws error if failed.
   */
  async deleteById(id: string): Promise<boolean> {
    const deleted = await this.model
      .deleteOne({ _id: id } as QueryFilter<DocType>)
      .exec();

    if (!deleted.acknowledged) {
      throw new ApplicationError(
        GenericErrorMessage.INTERNAL_SERVER_ERROR,
        HttpStatusCodes.NotModified,
        ErrorCode.SYSTEM_DB_ERROR,
        ErrorDetails.SYSTEM_DB_ERROR,
      );
    }

    return deleted.acknowledged;
  }

  /**
   * This method queries the database for document with given custom ID.
   * It deltes the document with given id.
   * If delete operation fails the method throws an application error.
   *
   * @param id : custom id
   * @return true if success. throws error if failed.
   */
  async deleteByCustomId(customId: string): Promise<boolean> {
    const deleted = await this.model
      .deleteOne({ _id: customId } as QueryFilter<DocType>)
      .exec();

    if (!deleted.acknowledged) {
      throw new ApplicationError(
        GenericErrorMessage.INTERNAL_SERVER_ERROR,
        HttpStatusCodes.NotModified,
        ErrorCode.SYSTEM_DB_ERROR,
        ErrorDetails.SYSTEM_DB_ERROR,
      );
    }

    return deleted.acknowledged;
  }

  /**
   * This method takes a complete domain entity and cretes a new document in the database collection.
   * If creation fails. It throws an error, else return enity data as updated in DB.
   *
   * @param data : Domain entity without id field.
   * @return Domain entity.
   */
  async save(data: Omit<EntityType, "id">): Promise<EntityType> {
    const created = await this.model.create(
      data as unknown as Partial<DocType>,
    );

    if (!created) {
      throw new ApplicationError(
        GenericErrorMessage.INTERNAL_SERVER_ERROR,
        HttpStatusCodes.NotModified,
        ErrorCode.SYSTEM_DB_ERROR,
        ErrorDetails.SYSTEM_DB_ERROR,
      );
    }

    return this.toDomainEntityMapper(created);
  }
}
