import { describe, it, expect, vi } from "vitest";
import { GetApplicationsUseCase } from "#/application/use-case/application/GetApplicationsUseCase";
import { ApplicationStatus, ApplicationType } from "@sharemyride/shared";

describe("GetApplicationsUseCase", () => {
  it("should query applications for a user and return mapped application list", async () => {
    const now = new Date();
    const mockRepoResponse = {
      data: [
        {
          applicationId: "app-1",
          userId: "user-1",
          applicationType: ApplicationType.ONBOARDING,
          applicationStatus: ApplicationStatus.PENDING,
          createdAt: now,
          updatedAt: now,
        },
      ],
      meta: { total: 1, page: 1, limit: 100, totalPages: 1 },
    };

    const mockAppRepo = {
      find: vi.fn().mockResolvedValue(mockRepoResponse),
    };

    const useCase = new GetApplicationsUseCase(mockAppRepo as any);
    const result = await useCase.execute("user-1");

    expect(mockAppRepo.find).toHaveBeenCalledWith({
      filterField: "userId",
      filterValue: "user-1",
      page: 1,
      limit: 100,
      search: undefined,
      searchFields: ["applicationId", "applicationType"],
    });
    expect(result).toEqual([
      {
        applicationId: "app-1",
        applicationType: ApplicationType.ONBOARDING,
        applicationStatus: ApplicationStatus.PENDING,
        createdAt: now,
      },
    ]);
  });
});
