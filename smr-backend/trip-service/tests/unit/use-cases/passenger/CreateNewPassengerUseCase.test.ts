import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateNewPassengerUseCase } from "#/application/use-case/passenger/CreateNewPassengerUseCase";
import { mockPassengerRepository } from "&#/mocks/MockPassengerRepository";
import { CreateNewPassengerRequestDTO } from "#/application/dto/passenger/CreateNewPassengerRequestDTO";

describe("CreateNewPassengerUseCase", () => {
  const useCase = new CreateNewPassengerUseCase(mockPassengerRepository);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully create and save a new passenger entity", async () => {
    // Arrange
    const requestData: CreateNewPassengerRequestDTO = {
      userId: "user-123",
      firstName: "John",
      lastName: "Doe",
      emailId: "john.doe@example.com",
    };

    vi.mocked(mockPassengerRepository.save).mockImplementation(async (passenger) => passenger);

    // Act
    await useCase.execute(requestData);

    // Assert
    expect(mockPassengerRepository.save).toHaveBeenCalledTimes(1);
    expect(mockPassengerRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        passengerId: "user-123",
        firstName: "John",
        lastName: "Doe",
        emailId: "john.doe@example.com",
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });

  it("should propagate error if repository save fails", async () => {
    // Arrange
    const requestData: CreateNewPassengerRequestDTO = {
      userId: "user-456",
      firstName: "Jane",
      lastName: "Smith",
      emailId: "jane.smith@example.com",
    };

    const dbError = new Error("Database connection failed");
    vi.mocked(mockPassengerRepository.save).mockRejectedValue(dbError);

    // Act & Assert
    await expect(useCase.execute(requestData)).rejects.toThrow("Database connection failed");
    expect(mockPassengerRepository.save).toHaveBeenCalledTimes(1);
  });
});
