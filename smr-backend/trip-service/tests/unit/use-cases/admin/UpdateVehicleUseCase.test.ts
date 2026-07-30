import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateVehicleUseCase } from "#/application/use-case/admin/configurations/UpdateVehicleUseCase";
import { mockVehicleListRepository } from "&#/mocks/MockVehicleListRepository";
import { mockConfigurationStore } from "&#/mocks/MockConfigurationStore";
import { mockEventBus } from "&#/mocks/MockEventBus";
import { createMockVehicleList } from "&#/fixtures/dto/ConfigurationData";
import {
  ApplicationError,
  ErrorCode,
  EventName,
  HttpStatusCodes,
  VehicleListMessages,
  VehicleTypes,
} from "@sharemyride/shared";

describe("UpdateVehicleUseCase", () => {
  const useCase = new UpdateVehicleUseCase(
    mockVehicleListRepository,
    mockConfigurationStore,
    mockEventBus,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update vehicle configuration, refresh config store cache and publish ADMIN_UPDATE_NEW_VEHICLE event", async () => {
    // Arrange
    const request = {
      id: "veh-123",
      vehicleMake: "Honda",
      vehicleModel: "Accord",
      isActive: false,
    };

    const updatedVehicle = createMockVehicleList({
      id: "veh-123",
      vehicleType: VehicleTypes.SEDAN,
      vehicleMake: "Honda",
      vehicleModel: "Accord",
      isActive: false,
    });

    const allVehicles = [updatedVehicle];

    vi.mocked(mockVehicleListRepository.updateById).mockResolvedValue(
      updatedVehicle,
    );
    vi.mocked(mockVehicleListRepository.findAll).mockResolvedValue(allVehicles);

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(mockVehicleListRepository.updateById).toHaveBeenCalledWith(
      "veh-123",
      request,
    );
    expect(mockVehicleListRepository.findAll).toHaveBeenCalled();
    expect(mockConfigurationStore.setVehicleList).toHaveBeenCalledWith(allVehicles);
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: EventName.ADMIN_UPDATE_NEW_VEHICLE,
        payload: {
          id: "veh-123",
          vehicleType: VehicleTypes.SEDAN,
          vehicleMake: "Honda",
          vehicleModel: "Accord",
          isActive: false,
        },
      }),
    );
    expect(result).toEqual({ vehicle: updatedVehicle });
  });

  it("should throw ApplicationError when vehicle configuration is not found", async () => {
    // Arrange
    const request = {
      id: "non-existent-veh",
      isActive: false,
    };

    vi.mocked(mockVehicleListRepository.updateById).mockResolvedValue(null as any);

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(ApplicationError);
    await expect(useCase.execute(request)).rejects.toMatchObject({
      message: VehicleListMessages.VEHICLE_NOT_FOUND,
      statusCode: HttpStatusCodes.NotFound,
      errorCode: ErrorCode.DOMAIN_NOT_FOUND,
    });

    expect(mockConfigurationStore.setVehicleList).not.toHaveBeenCalled();
    expect(mockEventBus.publish).not.toHaveBeenCalled();
  });

  it("should handle null response from vehicleListRepository.findAll cleanly", async () => {
    // Arrange
    const request = { id: "veh-123", vehicleMake: "Nissan" };
    const updatedVehicle = createMockVehicleList({
      id: "veh-123",
      vehicleMake: "Nissan",
    });

    vi.mocked(mockVehicleListRepository.updateById).mockResolvedValue(
      updatedVehicle,
    );
    vi.mocked(mockVehicleListRepository.findAll).mockResolvedValue(null);

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(mockConfigurationStore.setVehicleList).toHaveBeenCalledWith([]);
    expect(result).toEqual({ vehicle: updatedVehicle });
  });
});
