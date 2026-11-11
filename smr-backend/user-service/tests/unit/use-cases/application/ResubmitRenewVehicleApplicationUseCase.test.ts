import { describe, it, expect, vi } from "vitest";
import { ResubmitRenewVehicleApplicationUseCase } from "#/application/use-case/application/ResubmitRenewVehicleApplicationUseCase";
import { mockStorageService } from "&#/mocks/MockStorageService";
import { ApplicationStatus } from "@sharemyride/shared";

describe("ResubmitRenewVehicleApplicationUseCase", () => {
  const mockAppRepo = {
    findByCustomId: vi.fn(),
    updateByCustomId: vi.fn().mockResolvedValue(undefined),
  };
  const mockVehicleRecordRepo = {
    findByApplicationId: vi.fn(),
    updateByCustomId: vi.fn().mockResolvedValue(undefined),
  };

  const useCase = new ResubmitRenewVehicleApplicationUseCase(
    mockAppRepo as any,
    mockVehicleRecordRepo as any,
    mockStorageService,
  );

  it("should throw error if application is not in RETURNED status", async () => {
    mockAppRepo.findByCustomId.mockResolvedValue({
      applicationId: "app-1",
      applicationStatus: ApplicationStatus.PENDING,
    });

    await expect(
      useCase.execute({ applicationId: "app-1" }),
    ).rejects.toThrow();
  });

  it("should update vehicle record and reset application status to PENDING", async () => {
    mockAppRepo.findByCustomId.mockResolvedValue({
      applicationId: "app-1",
      applicationStatus: ApplicationStatus.RETURNED,
    });
    mockVehicleRecordRepo.findByApplicationId.mockResolvedValue({
      recordId: "vehicle-rec-1",
      registrationNumber: "REG123",
    });

    await useCase.execute({
      applicationId: "app-1",
      registrationNumber: "REG999",
    });

    expect(mockVehicleRecordRepo.updateByCustomId).toHaveBeenCalledWith(
      "vehicle-rec-1",
      expect.objectContaining({
        registrationNumber: "REG999",
      }),
    );
    expect(mockAppRepo.updateByCustomId).toHaveBeenCalledWith(
      "app-1",
      expect.objectContaining({
        applicationStatus: ApplicationStatus.PENDING,
      }),
    );
  });
});
