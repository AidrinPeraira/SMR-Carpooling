import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetAllUsersUseCase } from "#/application/use-case/admin/users/GetAllUsersUseCase";
import { mockUserRepository } from "&#/mocks/MockUserRepository";
import { createMockUserData } from "&#/fixtures/dto/UserData";
import { AccountStatus, UserRole } from "@sharemyride/shared";
import { userQueryFieldMapper } from "#/presentation/utils/query-mapper";

describe("GetAllUsersUseCase", () => {
  const useCase = new GetAllUsersUseCase(mockUserRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve users matching query and map them to GetAllUsersResponseDTO", async () => {
    const searchFields = ["first_name", "last_name", "email_id", "phone_number"];
    const mockQuery = {
      limit: 10,
      page: 1,
      search: "Test",
    };

    const mockUser1 = createMockUserData({
      userId: "user-1",
      firstName: "John",
      lastName: "Doe",
      emailId: "john.doe@example.com",
      userRole: UserRole.PASSENGER,
      accountStatus: AccountStatus.ACTIVE,
      phoneNumber: "1111111111",
      isDriver: false,
    });

    const mockUser2 = createMockUserData({
      userId: "user-2",
      firstName: "Jane",
      lastName: "Smith",
      emailId: "jane.smith@example.com",
      userRole: UserRole.DRIVER,
      accountStatus: AccountStatus.BLOCKED,
      phoneNumber: "2222222222",
      isDriver: true,
    });

    vi.mocked(mockUserRepository.find).mockResolvedValue({
      data: [mockUser1, mockUser2],
      paginationMeta: {
        totatlItems: 2,
        currentPage: 1,
        limit: 10,
        totalPages: 1,
      },
    });

    const result = await useCase.execute(mockQuery);

    expect(mockUserRepository.find).toHaveBeenCalledWith({
      ...mockQuery,
      searchFields: searchFields.map(userQueryFieldMapper),
    });
    expect(result.data).toHaveLength(2);
    expect(result.paginationMeta).toEqual({
      totatlItems: 2,
      currentPage: 1,
      limit: 10,
      totalPages: 1,
    });
    expect(result.data[0]).toEqual({
      userId: mockUser1.userId,
      firstName: mockUser1.firstName,
      lastName: mockUser1.lastName,
      emailId: mockUser1.emailId,
      userRole: mockUser1.userRole,
      accountStatus: mockUser1.accountStatus,
      phoneNumber: mockUser1.phoneNumber,
      isDriver: mockUser1.isDriver,
      createdAt: mockUser1.createdAt,
      profileImage: mockUser1.profileImage,
    });
    expect(result.data[1]).toEqual({
      userId: mockUser2.userId,
      firstName: mockUser2.firstName,
      lastName: mockUser2.lastName,
      emailId: mockUser2.emailId,
      userRole: mockUser2.userRole,
      accountStatus: mockUser2.accountStatus,
      phoneNumber: mockUser2.phoneNumber,
      isDriver: mockUser2.isDriver,
      createdAt: mockUser2.createdAt,
      profileImage: mockUser2.profileImage,
    });
  });

  it("should return an empty array if no users are found", async () => {
    const mockQuery = {
      limit: 5,
      page: 1,
    };

    vi.mocked(mockUserRepository.find).mockResolvedValue({
      data: [],
      paginationMeta: {
        totatlItems: 0,
        currentPage: 1,
        limit: 5,
        totalPages: 0,
      },
    });

    const result = await useCase.execute(mockQuery);

    expect(mockUserRepository.find).toHaveBeenCalledWith({
      ...mockQuery,
      searchFields: undefined,
    });
    expect(result.data).toEqual([]);
    expect(result.paginationMeta).toEqual({
      totatlItems: 0,
      currentPage: 1,
      limit: 5,
      totalPages: 0,
    });
  });
});
