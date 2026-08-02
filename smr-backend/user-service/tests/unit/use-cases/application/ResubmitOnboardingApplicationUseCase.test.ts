import { describe, it, expect, vi } from "vitest";
import { ResubmitOnboardingApplicationUseCase } from "#/application/use-case/application/ResubmitOnboardingApplicationUseCase";
import { mockStorageService } from "&#/mocks/MockStorageService";
import { ApplicationStatus } from "@sharemyride/shared";

describe("ResubmitOnboardingApplicationUseCase", () => {
  const mockAppRepo = {
    findByCustomId: vi.fn(),
    updateByCustomId: vi.fn().mockResolvedValue(undefined),
  };
  const mockDriverRecordRepo = {
    findByApplicationId: vi.fn(),
    updateByCustomId: vi.fn().mockResolvedValue(undefined),
  };
  const mockVehicleRecordRepo = {
    findByApplicationId: vi.fn(),
    updateByCustomId: vi.fn().mockResolvedValue(undefined),
  };

  const useCase = new ResubmitOnboardingApplicationUseCase(
    mockAppRepo as any,
    mockDriverRecordRepo as any,
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

  it("should update application and records, move new file and delete old file", async () => {
    mockAppRepo.findByCustomId.mockResolvedValue({
      applicationId: "app-1",
      applicationStatus: ApplicationStatus.RETURNED,
    });
    mockDriverRecordRepo.findByApplicationId.mockResolvedValue({
      recordId: "driver-rec-1",
      licenseFile: "user-files/user-1/old-license.jpg",
    });
    mockVehicleRecordRepo.findByApplicationId.mockResolvedValue({
      recordId: "vehicle-rec-1",
    });

    vi.mocked(mockStorageService.moveFile).mockResolvedValue(undefined);
    vi.mocked(mockStorageService.deleteFile).mockResolvedValue(undefined);

    await useCase.execute({
      applicationId: "app-1",
      licenseFile: "temp/user-files/user-1/new-license.jpg",
    });

    expect(mockStorageService.moveFile).toHaveBeenCalledWith(
      "temp/user-files/user-1/new-license.jpg",
      "user-files/user-1/new-license.jpg",
    );
    expect(mockStorageService.deleteFile).toHaveBeenCalledWith(
      "user-files/user-1/old-license.jpg",
    );
    expect(mockDriverRecordRepo.updateByCustomId).toHaveBeenCalledWith(
      "driver-rec-1",
      expect.objectContaining({
        licenseFile: "user-files/user-1/new-license.jpg",
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
