import { describe, it, expect, vi, beforeEach } from "vitest";
import { NewVehicleApplicationUseCase } from "#/application/use-case/application/NewVehicleApplicationUseCase";
import { mockStorageService } from "&#/mocks/MockStorageService";
import { VehicleTypes } from "@sharemyride/shared";

describe("NewVehicleApplicationUseCase", () => {
  const mockApplicationRepo = {
    save: vi.fn().mockResolvedValue(undefined),
    findById: vi.fn(),
    findByUserId: vi.fn(),
  };

  const mockVehicleRecordRepo = {
    save: vi.fn().mockResolvedValue(undefined),
    findById: vi.fn(),
  };

  const mockUniqueIdGenerator = {
    generateRandomId: vi.fn().mockReturnValue("mock-id"),
  };

  const useCase = new NewVehicleApplicationUseCase(
    mockApplicationRepo as any,
    mockVehicleRecordRepo as any,
    mockUniqueIdGenerator as any,
    mockStorageService,
  );

  beforeEach(() => {
    vi.clearAllMocks();
    mockUniqueIdGenerator.generateRandomId.mockReturnValue("mock-id");
  });

  it("should throw error if vehicle capacity is invalid", async () => {
    await expect(
      useCase.execute({
        userId: "user-1",
        vehicleType: VehicleTypes.SEDAN,
        vehicleModel: "Civic",
        vehicleMake: "Honda",
        vehicleImage: "temp/user-files/user-1/vehicle_image-123.jpg",
        vehicleCapacity: 15,
        registrationNumber: "REG123",
        registrationExpiry: "2030-01-01",
        registrationFile: "temp/user-files/user-1/vehicle_registration-123.jpg",
        insuranceNumber: "INS123",
        insuranceExpiry: "2030-01-01",
        insuranceFile: "temp/user-files/user-1/vehicle_insurance-123.jpg",
      }),
    ).rejects.toThrow();
  });

  it("should move all uploaded temp vehicle files and save application and vehicle records", async () => {
    vi.mocked(mockStorageService.moveFile).mockResolvedValue(undefined);

    const dto = {
      userId: "user-1",
      vehicleType: VehicleTypes.SEDAN,
      vehicleModel: "Civic",
      vehicleMake: "Honda",
      vehicleImage: "temp/user-files/user-1/vehicle_image-123.jpg",
      vehicleCapacity: 4,
      registrationNumber: "REG123",
      registrationExpiry: "2030-01-01",
      registrationFile: "temp/user-files/user-1/vehicle_registration-123.jpg",
      insuranceNumber: "INS123",
      insuranceExpiry: "2030-01-01",
      insuranceFile: "temp/user-files/user-1/vehicle_insurance-123.jpg",
    };

    await useCase.execute(dto);

    expect(mockStorageService.moveFile).toHaveBeenCalledWith(
      "temp/user-files/user-1/vehicle_image-123.jpg",
      "user-files/user-1/vehicle_image-123.jpg",
    );
    expect(mockStorageService.moveFile).toHaveBeenCalledWith(
      "temp/user-files/user-1/vehicle_registration-123.jpg",
      "user-files/user-1/vehicle_registration-123.jpg",
    );
    expect(mockStorageService.moveFile).toHaveBeenCalledWith(
      "temp/user-files/user-1/vehicle_insurance-123.jpg",
      "user-files/user-1/vehicle_insurance-123.jpg",
    );

    expect(mockApplicationRepo.save).toHaveBeenCalledTimes(1);
    expect(mockVehicleRecordRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        vehicleImage: "user-files/user-1/vehicle_image-123.jpg",
        registrationFile: "user-files/user-1/vehicle_registration-123.jpg",
        insuranceFile: "user-files/user-1/vehicle_insurance-123.jpg",
      }),
    );
  });
});
