import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateNewVehicleUseCase } from "#/application/use-case/admin/configurations/CreateNewVehicleUseCase";
import { mockVehicleListRepository } from "&#/mocks/MockVehicleListRepository";
import { mockConfigurationStore } from "&#/mocks/MockConfigurationStore";
import { mockEventBus } from "&#/mocks/MockEventBus";
import {
  createMockVehicleList,
  createVehicleRequestDTO,
} from "&#/fixtures/dto/ConfigurationData";
import {
  ApplicationError,
  ErrorCode,
  EventName,
  HttpStatusCodes,
  VehicleListMessages,
  VehicleTypes,
} from "@sharemyride/shared";

describe("CreateNewVehicleUseCase", () => {
  const useCase = new CreateNewVehicleUseCase(
    mockVehicleListRepository,
    mockConfigurationStore,
    mockEventBus,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a new vehicle, update config store and publish ADMIN_ADD_NEW_VEHICLE event", async () => {
    // Arrange
    const request = createVehicleRequestDTO({
      vehicleType: VehicleTypes.SEDAN,
      vehicleMake: "Honda",
      vehicleModel: "Civic",
    });

    const newVehicle = createMockVehicleList({
      id: "veh-123",
      vehicleType: VehicleTypes.SEDAN,
      vehicleMake: "Honda",
      vehicleModel: "Civic",
      isActive: true,
    });

    const allVehicles = [newVehicle];

    vi.mocked(mockVehicleListRepository.findExistingVehicle).mockResolvedValue(null);
    vi.mocked(mockVehicleListRepository.save).mockResolvedValue(newVehicle);
    vi.mocked(mockVehicleListRepository.findAll).mockResolvedValue(allVehicles);

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(mockVehicleListRepository.findExistingVehicle).toHaveBeenCalledWith(
      VehicleTypes.SEDAN,
      "Honda",
      "Civic",
    );
    expect(mockVehicleListRepository.save).toHaveBeenCalledWith({
      vehicleType: VehicleTypes.SEDAN,
      vehicleMake: "Honda",
      vehicleModel: "Civic",
      isActive: true,
    });
    expect(mockVehicleListRepository.findAll).toHaveBeenCalled();
    expect(mockConfigurationStore.setVehicleList).toHaveBeenCalledWith(allVehicles);
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: EventName.ADMIN_ADD_NEW_VEHICLE,
        payload: newVehicle,
      }),
    );
    expect(result).toEqual({ vehicle: newVehicle });
  });

  it("should throw ApplicationError when vehicle already exists", async () => {
    // Arrange
    const request = createVehicleRequestDTO({
      vehicleType: VehicleTypes.SEDAN,
      vehicleMake: "Toyota",
      vehicleModel: "Camry",
    });

    const existingVehicle = createMockVehicleList();

    vi.mocked(mockVehicleListRepository.findExistingVehicle).mockResolvedValue(
      existingVehicle,
    );

    // Act & Assert
    await expect(useCase.execute(request)).rejects.toThrow(ApplicationError);
    await expect(useCase.execute(request)).rejects.toMatchObject({
      message: VehicleListMessages.VEHICLE_EXISTS,
      statusCode: HttpStatusCodes.Conflict,
      errorCode: ErrorCode.DOMAIN_ALREADY_EXISTS,
    });

    expect(mockVehicleListRepository.save).not.toHaveBeenCalled();
    expect(mockConfigurationStore.setVehicleList).not.toHaveBeenCalled();
    expect(mockEventBus.publish).not.toHaveBeenCalled();
  });

  it("should handle null response from vehicleListRepository.findAll cleanly", async () => {
    // Arrange
    const request = createVehicleRequestDTO();
    const newVehicle = createMockVehicleList();

    vi.mocked(mockVehicleListRepository.findExistingVehicle).mockResolvedValue(null);
    vi.mocked(mockVehicleListRepository.save).mockResolvedValue(newVehicle);
    vi.mocked(mockVehicleListRepository.findAll).mockResolvedValue(null);

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(mockConfigurationStore.setVehicleList).toHaveBeenCalledWith([]);
    expect(result).toEqual({ vehicle: newVehicle });
  });
});
