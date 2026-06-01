import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { vi } from "vitest";

const UserRepository = vi.fn(
  class implements IUserRepository {
    constructor() {}
    find = vi.fn();
    findById = vi.fn();
    findByCustomId = vi.fn();
    findByEmail = vi.fn();
    save = vi.fn();
    updateById = vi.fn();
    updateByCustomId = vi.fn();
    deleteById = vi.fn();
    deleteByCustomId = vi.fn();
  },
);
export const mockUserRepository = new UserRepository();
