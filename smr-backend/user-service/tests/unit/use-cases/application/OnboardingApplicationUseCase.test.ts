import { describe, it, expect, vi, beforeEach } from "vitest";
import { OnboardingApplicationUseCase } from "#/application/use-case/application/OnboardingApplicationUseCase";
import { mockStorageService } from "&#/mocks/MockStorageService";
import { FileNames, ImageFileTypes, VehicleTypes } from "@sharemyride/shared";

describe("OnboardingApplicationUseCase", () => {
  const mockApplicationRepo = {
    save: vi.fn().mockResolvedValue(undefined),
    findById: vi.fn(),
    findByUserId: vi.fn(),
  };

  const mockVehicleRecordRepo = {
    save: vi.fn().mockResolvedValue(undefined),
    findById: vi.fn(),
  };

  const mockDriverRecordRepo = {
    save: vi.fn().mockResolvedValue(undefined),
    findById: vi.fn(),
  };

  const mockUniqueIdGenerator = {
    generateRandomId: vi.fn().mockReturnValue("mock-id"),
  };

  const useCase = new OnboardingApplicationUseCase(
    mockApplicationRepo as any,
    mockVehicleRecordRepo as any,
    mockDriverRecordRepo as any,
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
        licenseNumber: "DL123",
        licenseExpiry: new Date("2030-01-01"),
        licenseFile: "temp/user-files/user-1/driver_license-123.jpg",
        vehicleType: VehicleTypes.SEDAN,
        vehicleModel: "Civic",
        vehicleMake: "Honda",
        vehicleImage: "temp/user-files/user-1/vehicle_image-123.jpg",
        vehicleCapacity: 0,
        registrationNumber: "REG123",
        registrationExpiry: new Date("2030-01-01"),
        registrationFile: "temp/user-files/user-1/vehicle_registration-123.jpg",
        insuranceNumber: "INS123",
        insuranceExpiry: new Date("2030-01-01"),
        insuranceFile: "temp/user-files/user-1/vehicle_insurance-123.jpg",
      }),
    ).rejects.toThrow();
  });

  it("should move all uploaded temp files and save application, driver, and vehicle records", async () => {
    vi.mocked(mockStorageService.moveFile).mockResolvedValue(undefined);

    const dto = {
      userId: "user-1",
      licenseNumber: "DL123",
      licenseExpiry: new Date("2030-01-01"),
      licenseFile: "temp/user-files/user-1/driver_license-123.jpg",
      vehicleType: VehicleTypes.SEDAN,
      vehicleModel: "Civic",
      vehicleMake: "Honda",
      vehicleImage: "temp/user-files/user-1/vehicle_image-123.jpg",
      vehicleCapacity: 4,
      registrationNumber: "REG123",
      registrationExpiry: new Date("2030-01-01"),
      registrationFile: "temp/user-files/user-1/vehicle_registration-123.jpg",
      insuranceNumber: "INS123",
      insuranceExpiry: new Date("2030-01-01"),
      insuranceFile: "temp/user-files/user-1/vehicle_insurance-123.jpg",
    };

    await useCase.execute(dto);

    expect(mockStorageService.moveFile).toHaveBeenCalledWith(
      "temp/user-files/user-1/driver_license-123.jpg",
      "user-files/user-1/driver_license-123.jpg",
    );
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
    expect(mockDriverRecordRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        licenseFile: "user-files/user-1/driver_license-123.jpg",
      }),
    );
    expect(mockVehicleRecordRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        vehicleImage: "user-files/user-1/vehicle_image-123.jpg",
        registrationFile: "user-files/user-1/vehicle_registration-123.jpg",
        insuranceFile: "user-files/user-1/vehicle_insurance-123.jpg",
      }),
    );
  });
});
