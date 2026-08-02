import { describe, it, expect, vi } from "vitest";
import { GetApplicationDetailsUseCase } from "#/application/use-case/application/GetApplicationDetailsUseCase";

describe("GetApplicationDetailsUseCase", () => {
  it("should fetch application details from repository by application id", async () => {
    const mockDetails = {
      applicationId: "app-1",
      userId: "user-1",
      firstName: "John",
    };

    const mockAppRepo = {
      getFullApplicationDetails: vi.fn().mockResolvedValue(mockDetails),
    };

    const useCase = new GetApplicationDetailsUseCase(mockAppRepo as any);
    const result = await useCase.execute("app-1");

    expect(mockAppRepo.getFullApplicationDetails).toHaveBeenCalledWith("app-1");
    expect(result).toEqual(mockDetails);
  });
});
