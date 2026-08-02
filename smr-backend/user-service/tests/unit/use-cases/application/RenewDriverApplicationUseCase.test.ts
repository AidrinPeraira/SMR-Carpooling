import { describe, it, expect, vi } from "vitest";
import { RenewDriverApplicationUseCase } from "#/application/use-case/application/RenewDriverApplicationUseCase";
import { mockStorageService } from "&#/mocks/MockStorageService";

describe("RenewDriverApplicationUseCase", () => {
  const mockAppRepo = {
    save: vi.fn().mockResolvedValue(undefined),
  };

  const mockDriverRecordRepo = {
    findByLicenseNumber: vi.fn(),
    save: vi.fn().mockResolvedValue(undefined),
  };

  const mockUniqueIdGenerator = {
    generateRandomId: vi.fn().mockReturnValue("mock-id"),
  };

  const useCase = new RenewDriverApplicationUseCase(
    mockAppRepo as any,
    mockDriverRecordRepo as any,
    mockUniqueIdGenerator as any,
    mockStorageService,
  );

  it("should throw error if driver record not found", async () => {
    mockDriverRecordRepo.findByLicenseNumber.mockResolvedValue([]);

    await expect(
      useCase.execute({
        userId: "user-1",
        licenseNumber: "DL123",
        licenseExpiry: new Date("2020-01-01"),
        licenseFile: "temp/user-files/user-1/license.jpg",
      }),
    ).rejects.toThrow();
  });

  it("should throw error if an active valid driver record exists", async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);

    mockDriverRecordRepo.findByLicenseNumber.mockResolvedValue([
      { recordId: "rec-1", licenseExpiry: futureDate },
    ]);

    await expect(
      useCase.execute({
        userId: "user-1",
        licenseNumber: "DL123",
        licenseExpiry: futureDate,
        licenseFile: "temp/user-files/user-1/license.jpg",
      }),
    ).rejects.toThrow();
  });

  it("should save application and record if existing record is expired", async () => {
    const pastDate = new Date("2020-01-01");
    mockDriverRecordRepo.findByLicenseNumber.mockResolvedValue([
      { recordId: "rec-1", licenseExpiry: pastDate },
    ]);
    vi.mocked(mockStorageService.moveFile).mockResolvedValue(undefined);

    await useCase.execute({
      userId: "user-1",
      licenseNumber: "DL123",
      licenseExpiry: new Date("2030-01-01"),
      licenseFile: "temp/user-files/user-1/license.jpg",
    });

    expect(mockAppRepo.save).toHaveBeenCalledTimes(1);
    expect(mockDriverRecordRepo.save).toHaveBeenCalledTimes(1);
    expect(mockStorageService.moveFile).toHaveBeenCalledWith(
      "temp/user-files/user-1/license.jpg",
      "user-files/user-1/license.jpg",
    );
  });
});
