import { describe, it, expect, vi } from "vitest";
import { ResubmitRenewDriverApplicationUseCase } from "#/application/use-case/application/ResubmitRenewDriverApplicationUseCase";
import { mockStorageService } from "&#/mocks/MockStorageService";
import { ApplicationStatus } from "@sharemyride/shared";

describe("ResubmitRenewDriverApplicationUseCase", () => {
  const mockAppRepo = {
    findByCustomId: vi.fn(),
    updateByCustomId: vi.fn().mockResolvedValue(undefined),
  };
  const mockDriverRecordRepo = {
    findByApplicationId: vi.fn(),
    updateByCustomId: vi.fn().mockResolvedValue(undefined),
  };

  const useCase = new ResubmitRenewDriverApplicationUseCase(
    mockAppRepo as any,
    mockDriverRecordRepo as any,
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

  it("should update driver record and reset application status to PENDING", async () => {
    mockAppRepo.findByCustomId.mockResolvedValue({
      applicationId: "app-1",
      applicationStatus: ApplicationStatus.RETURNED,
    });
    mockDriverRecordRepo.findByApplicationId.mockResolvedValue({
      recordId: "driver-rec-1",
      licenseNumber: "DL123",
    });

    await useCase.execute({
      applicationId: "app-1",
      licenseNumber: "DL999",
    });

    expect(mockDriverRecordRepo.updateByCustomId).toHaveBeenCalledWith(
      "driver-rec-1",
      expect.objectContaining({
        licenseNumber: "DL999",
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
