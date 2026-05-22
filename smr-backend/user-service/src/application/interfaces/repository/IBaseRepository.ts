/**
 * This is the base repository interface
 * it creates a contract for the base repository
 * base reposiroy should handle common database operations.
 */
export interface IBaseRepository<EntityType> {
  find(query: Record<string, unknown>): Promise<EntityType[]>;

  findById(id: string): Promise<EntityType | null>;

  findByCustomId(id: string): Promise<EntityType | null>;

  save(data: Omit<EntityType, "id">): Promise<EntityType>;

  updateById(id: string, data: Partial<EntityType>): Promise<EntityType>;

  updateByCustomId(
    customId: string,
    data: Partial<EntityType>,
  ): Promise<EntityType>;

  deleteById(id: string): Promise<boolean>;

  deleteByCustomId(CustomId: string): Promise<boolean>;
}
