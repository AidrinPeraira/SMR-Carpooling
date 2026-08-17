import { describe, it, expect, vi, beforeEach } from "vitest";
import { SendNewBookingEmailUseCase } from "#/application/use-case/SendNewBookingEmailUseCase";
import { IMailService } from "#/application/interfaces/services/IMailService";
import { NewBookingMailDTO } from "#/application/dto/email/NewBookingMailDTO";

describe("SendNewBookingEmailUseCase", () => {
  let useCase: SendNewBookingEmailUseCase;
  let mockMailService: IMailService;

  const sampleDTO: NewBookingMailDTO = {
    bookingId: "b-123",
    passengerName: "John Doe",
    passengerEmail: "john@example.com",
    passengerOrigin: {
      stopLat: 10.1,
      stopLng: 76.1,
      stopName: "Kochi",
      stopAddress: "Kochi, Kerala",
    },
    passengerDestination: {
      stopLat: 10.2,
      stopLng: 76.2,
      stopName: "Trivandrum",
      stopAddress: "Trivandrum, Kerala",
    },
    seatCount: 2,
    bookingAmount: 500,
    driverName: "Jane Smith",
    driverEmail: "jane@example.com",
    tripId: "t-456",
    tripDate: new Date("2026-08-15T10:00:00Z"),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockMailService = {
      send: vi.fn().mockResolvedValue(undefined),
    };

    useCase = new SendNewBookingEmailUseCase(mockMailService);
  });

  it("should send email notifications to both driver and passenger", async () => {
    await useCase.execute(sampleDTO);

    expect(mockMailService.send).toHaveBeenCalledTimes(2);

    expect(mockMailService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        recipient: "jane@example.com",
        subject: "New Booking Request - ShareMyRide",
      }),
    );

    expect(mockMailService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        recipient: "john@example.com",
        subject: "Booking Request Submitted - ShareMyRide",
      }),
    );
  });
});
