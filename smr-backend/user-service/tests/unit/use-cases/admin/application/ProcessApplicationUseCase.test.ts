import { describe, it, expect, vi } from "vitest";
import { ProcessApplicationUseCase } from "#/application/use-case/admin/application/ProcessApplicationUseCase";
import { ApplicationError, ApplicationStatus, ApplicationType } from "@sharemyride/shared";

describe("ProcessApplicationUseCase", () => {
  it("should update application status and publish event when application is approved and pending", async () => {
    const mockExistingApp = {
      applicationId: "app-1",
      applicationStatus: ApplicationStatus.PENDING,
    };

    const mockFullApp = {
      applicationId: "app-1",
      applicationType: ApplicationType.ONBOARDING,
      userId: "user-1",
      firstName: "John",
      lastName: "Doe",
      emailId: "john@example.com",
      driverRecord: [{ recordId: "dr-1", licenseNumber: "DL123", licenseFile: "file.png" }],
      vehicleRecord: [{ recordId: "vr-1", vehicleType: "sedan", vehicleModel: "Civic", vehicleMake: "Honda", registrationNumber: "REG123", vehicleCapacity: 4 }],
    };

    const mockAppRepo = {
      findByCustomId: vi.fn().mockResolvedValue(mockExistingApp),
      updateByCustomId: vi.fn().mockResolvedValue(undefined),
      getFullApplicationDetails: vi.fn().mockResolvedValue(mockFullApp),
    };

    const mockUserRepo = {
      updateByCustomId: vi.fn().mockResolvedValue(undefined),
    };

    const mockEventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
    };

    const useCase = new ProcessApplicationUseCase(
      mockAppRepo as any,
      mockUserRepo as any,
      mockEventBus as any,
    );

    await useCase.execute({
      applicationId: "app-1",
      applicationStatus: ApplicationStatus.APPROVED,
      adminComment: { comment: "Looks good", adminId: "admin-1", time: new Date() },
    });

    expect(mockAppRepo.findByCustomId).toHaveBeenCalledWith("app-1");
    expect(mockAppRepo.updateByCustomId).toHaveBeenCalledWith(
      "app-1",
      expect.objectContaining({
        applicationStatus: ApplicationStatus.APPROVED,
      }),
    );
    expect(mockUserRepo.updateByCustomId).toHaveBeenCalledWith("user-1", {
      isDriver: true,
    });
    expect(mockEventBus.publish).toHaveBeenCalledTimes(1);
  });

  it("should throw ApplicationError if application is not in PENDING status", async () => {
    const mockExistingApp = {
      applicationId: "app-1",
      applicationStatus: ApplicationStatus.APPROVED,
    };

    const mockAppRepo = {
      findByCustomId: vi.fn().mockResolvedValue(mockExistingApp),
      updateByCustomId: vi.fn(),
      getFullApplicationDetails: vi.fn(),
    };

    const mockUserRepo = {
      updateByCustomId: vi.fn(),
    };

    const mockEventBus = {
      publish: vi.fn(),
    };

    const useCase = new ProcessApplicationUseCase(
      mockAppRepo as any,
      mockUserRepo as any,
      mockEventBus as any,
    );

    await expect(
      useCase.execute({
        applicationId: "app-1",
        applicationStatus: ApplicationStatus.REJECTED,
        adminComment: { comment: "Reject again", adminId: "admin-1", time: new Date() },
      }),
    ).rejects.toThrow(ApplicationError);
  });
});
