import { describe, it, expect, vi } from "vitest";
import { RenewVehicleApplicationUseCase } from "#/application/use-case/application/RenewVehicleApplicationUseCase";
import { mockStorageService } from "&#/mocks/MockStorageService";
import { VehicleTypes } from "@sharemyride/shared";

describe("RenewVehicleApplicationUseCase", () => {
  const mockAppRepo = {
    save: vi.fn().mockResolvedValue(undefined),
  };

  const mockVehicleRecordRepo = {
    findByRegistrationNumber: vi.fn(),
    save: vi.fn().mockResolvedValue(undefined),
  };

  const mockUniqueIdGenerator = {
    generateRandomId: vi.fn().mockReturnValue("mock-id"),
  };

  const useCase = new RenewVehicleApplicationUseCase(
    mockAppRepo as any,
    mockVehicleRecordRepo as any,
    mockUniqueIdGenerator as any,
    mockStorageService,
  );

  it("should throw error if vehicle record not found", async () => {
    mockVehicleRecordRepo.findByRegistrationNumber.mockResolvedValue([]);

    await expect(
      useCase.execute({
        userId: "user-1",
        registrationNumber: "REG123",
        registrationExpiry: new Date("2030-01-01"),
        registrationFile: "temp/user-files/user-1/reg.jpg",
        insuranceNumber: "INS123",
        insuranceExpiry: new Date("2030-01-01"),
        insuranceFile: "temp/user-files/user-1/ins.jpg",
      }),
    ).rejects.toThrow();
  });

  it("should save renewed application reusing base vehicle specs if record is expired", async () => {
    const pastDate = new Date("2020-01-01");
    mockVehicleRecordRepo.findByRegistrationNumber.mockResolvedValue([
      {
        recordId: "rec-1",
        vehicleType: VehicleTypes.SEDAN,
        vehicleModel: "Civic",
        vehicleMake: "Honda",
        vehicleImage: "user-files/user-1/old.jpg",
        vehicleCapacity: 4,
        registrationExpiry: pastDate,
        insuranceExpiry: pastDate,
      },
    ]);
    vi.mocked(mockStorageService.moveFile).mockResolvedValue(undefined);

    await useCase.execute({
      userId: "user-1",
      registrationNumber: "REG123",
      registrationExpiry: new Date("2030-01-01"),
      registrationFile: "temp/user-files/user-1/reg.jpg",
      insuranceNumber: "INS123",
      insuranceExpiry: new Date("2030-01-01"),
      insuranceFile: "temp/user-files/user-1/ins.jpg",
    });

    expect(mockAppRepo.save).toHaveBeenCalledTimes(1);
    expect(mockVehicleRecordRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        vehicleModel: "Civic",
        vehicleMake: "Honda",
      }),
    );
  });
});
