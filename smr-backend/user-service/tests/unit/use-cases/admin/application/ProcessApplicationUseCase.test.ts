import { describe, it, expect, vi } from "vitest";
import { ProcessApplicationUseCase } from "#/application/use-case/admin/application/ProcessApplicationUseCase";
import { ApplicationStatus, ApplicationType } from "@sharemyride/shared";

describe("ProcessApplicationUseCase", () => {
  it("should update application status and publish event when application is approved", async () => {
    const mockFullApp = {
      applicationId: "app-1",
      applicationType: ApplicationType.ONBOARDING,
      userId: "user-1",
      firstName: "John",
      lastName: "Doe",
      emailId: "john@example.com",
    };

    const mockAppRepo = {
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
});
