import { describe, it, expect, vi } from "vitest";
import { GetAllApplicationsUseCase } from "#/application/use-case/admin/application/GetAllApplicationsUseCase";

describe("GetAllApplicationsUseCase", () => {
  it("should query applications repository with search fields and return paginated data", async () => {
    const mockPaginatedResult = {
      data: [{ applicationId: "app-1", firstName: "John" }],
      meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
    };

    const mockAppRepo = {
      findApplications: vi.fn().mockResolvedValue(mockPaginatedResult),
    };

    const useCase = new GetAllApplicationsUseCase(mockAppRepo as any);
    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(mockAppRepo.findApplications).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        limit: 10,
        searchFields: ["firstName", "lastName", "emailId"],
      }),
    );
    expect(result).toEqual(mockPaginatedResult);
  });
});
