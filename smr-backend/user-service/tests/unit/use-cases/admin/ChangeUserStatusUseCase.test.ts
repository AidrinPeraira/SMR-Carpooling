import { describe, it, expect, vi, beforeEach } from "vitest";
import { ChangeUserStatusUseCase } from "#/application/use-case/admin/users/ChangeUserStatusUseCase";
import { mockUserRepository } from "&#/mocks/MockUserRepository";
import { mockSessionStore } from "&#/mocks/MockSessionStore";
import { mockEventBus } from "&#/mocks/MockEventBus";
import { createMockUserData } from "&#/fixtures/dto/UserData";
import {
  AccountStatus,
  AuthSessionNames,
  EventName,
} from "@smr/shared";

describe("ChangeUserStatusUseCase", () => {
  const useCase = new ChangeUserStatusUseCase(
    mockUserRepository,
    mockSessionStore,
    mockEventBus,
  );

  const mockUser = createMockUserData({
    userId: "user-123",
    accountStatus: AccountStatus.ACTIVE,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should block user, publish block event and blacklist the user in session store", async () => {
    // Arrange
    const request = {
      userId: "user-123",
      status: AccountStatus.BLOCKED,
    };

    const blockedUser = {
      ...mockUser,
      accountStatus: AccountStatus.BLOCKED,
    };

    vi.mocked(mockUserRepository.updateByCustomId).mockResolvedValue(blockedUser);

    // Act
    await useCase.execute(request);

    // Assert
    expect(mockUserRepository.updateByCustomId).toHaveBeenCalledWith("user-123", {
      accountStatus: AccountStatus.BLOCKED,
    });

    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: EventName.ADMIN_USER_BLOCKED,
        payload: {
          userId: "user-123",
          status: AccountStatus.BLOCKED,
        },
      }),
    );

    const expectedBlacklistKey = `${AuthSessionNames.AUTH_BLACKLIST}:user-123`;
    expect(mockSessionStore.setSession).toHaveBeenCalledWith(
      expectedBlacklistKey,
      {
        userId: "user-123",
        status: AccountStatus.BLOCKED,
      },
    );
  });

  it("should unblock user, publish unblock event and remove the user from session store blacklist", async () => {
    // Arrange
    const request = {
      userId: "user-123",
      status: AccountStatus.ACTIVE,
    };

    const activeUser = {
      ...mockUser,
      accountStatus: AccountStatus.ACTIVE,
    };

    vi.mocked(mockUserRepository.updateByCustomId).mockResolvedValue(activeUser);

    // Act
    await useCase.execute(request);

    // Assert
    expect(mockUserRepository.updateByCustomId).toHaveBeenCalledWith("user-123", {
      accountStatus: AccountStatus.ACTIVE,
    });

    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: EventName.ADMIN_USER_UNBLOCKED,
        payload: {
          userId: "user-123",
          status: AccountStatus.BLOCKED,
        },
      }),
    );

    const expectedBlacklistKey = `${AuthSessionNames.AUTH_BLACKLIST}:user-123`;
    expect(mockSessionStore.removeSession).toHaveBeenCalledWith(expectedBlacklistKey);
  });

  it("should propagate errors if database update fails", async () => {
    // Arrange
    const request = {
      userId: "user-123",
      status: AccountStatus.BLOCKED,
    };

    const dbError = new Error("Database error");
    vi.mocked(mockUserRepository.updateByCustomId).mockRejectedValue(dbError);

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow("Database error");

    expect(mockEventBus.publish).not.toHaveBeenCalled();
    expect(mockSessionStore.setSession).not.toHaveBeenCalled();
  });
});
