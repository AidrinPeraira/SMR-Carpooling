export interface IBaseRepository<EntityType> {

  findById(id: string): Promise<EntityType | null>

  findByCustomId(id: string): Promise<EntityType | null>

  save(data: EntityType): Promise<EntityType>

  updateById(id: string, data: Partial<EntityType>): Promise<EntityType>

  updateByCustomId(customId: string, data: Partial<EntityType>): Promise<EntityType>

  deleteById(id: string): Promise<boolean>

  deleteByCustomId(CustomId: string): Promise<boolean>
}
