import { describe, it, expect, vi } from "vitest";
import { GetApplicationDetailsUseCase } from "#/application/use-case/application/GetApplicationDetailsUseCase";
import { ApplicationError } from "@sharemyride/shared";

describe("GetApplicationDetailsUseCase", () => {
  it("should fetch application details and transform file paths into signed URLs", async () => {
    const mockDetails = {
      applicationId: "app-1",
      userId: "user-1",
      firstName: "John",
      driverRecord: [
        {
          recordId: "dr-1",
          licenseFile: "temp/license.png",
        },
      ],
      vehicleRecord: [
        {
          recordId: "vr-1",
          registrationFile: "temp/reg.png",
          insuranceFile: "temp/ins.png",
          vehicleImage: "temp/img.png",
        },
      ],
    };

    const mockAppRepo = {
      getFullApplicationDetails: vi.fn().mockResolvedValue(mockDetails),
    };

    const mockStorageService = {
      generateSignedDownloadURL: vi
        .fn()
        .mockImplementation((path: string) => Promise.resolve(`https://signed.url/${path}`)),
    };

    const useCase = new GetApplicationDetailsUseCase(
      mockAppRepo as any,
      mockStorageService as any,
    );
    const result = await useCase.execute("app-1");

    expect(mockAppRepo.getFullApplicationDetails).toHaveBeenCalledWith("app-1");
    expect(mockStorageService.generateSignedDownloadURL).toHaveBeenCalledWith(
      "temp/license.png",
      3600,
    );
    expect(mockStorageService.generateSignedDownloadURL).toHaveBeenCalledWith(
      "temp/reg.png",
      3600,
    );
    expect(result.driverRecord![0]!.licenseFile).toBe(
      "https://signed.url/temp/license.png",
    );
    expect(result.vehicleRecord![0]!.registrationFile).toBe(
      "https://signed.url/temp/reg.png",
    );
  });

  it("should throw ApplicationError if application is not found", async () => {
    const mockAppRepo = {
      getFullApplicationDetails: vi.fn().mockResolvedValue(null),
    };
    const mockStorageService = {
      generateSignedDownloadURL: vi.fn(),
    };

    const useCase = new GetApplicationDetailsUseCase(
      mockAppRepo as any,
      mockStorageService as any,
    );

    await expect(useCase.execute("non-existent")).rejects.toThrow(ApplicationError);
  });
});
