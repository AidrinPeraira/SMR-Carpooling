import { describe, it, expect, vi, beforeEach } from "vitest";
import { NewBookingHandler } from "#/presentation/event-handlers/NewBookingHandler";
import { ISendNewBookingEmailUseCase } from "#/application/interfaces/use-case/ISendNewBookingEmailUseCase";
import { ILogger, NewBookingEvent, EventName } from "@sharemyride/shared";

describe("NewBookingHandler", () => {
  let handler: NewBookingHandler;
  let mockLogger: ILogger;
  let mockUseCase: ISendNewBookingEmailUseCase;

  const mockEvent: NewBookingEvent = {
    eventName: EventName.BOOKING_NEW_BOOKING,
    timestamp: new Date(),
    payload: {
      bookingId: "b-123",
      passengerId: "p-1",
      passengerName: "John Doe",
      passengerEmail: "john@example.com",
      passengerOrigin: { stopLat: 10.1, stopLng: 76.1, stopName: "A", stopAddress: "Addr A" },
      passengerDestination: { stopLat: 10.2, stopLng: 76.2, stopName: "B", stopAddress: "Addr B" },
      seatCount: 2,
      bookingAmount: 500,
      driverId: "d-1",
      driverName: "Jane Smith",
      driverEmail: "jane@example.com",
      tripId: "t-456",
      tripDate: new Date("2026-08-15T10:00:00Z"),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockLogger = {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      http: vi.fn(),
    };

    mockUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    };

    handler = new NewBookingHandler(mockLogger, mockUseCase);
  });

  it("should map event payload to DTO and invoke use case", async () => {
    await handler.handle(mockEvent);

    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining("Handling new booking event"),
      expect.objectContaining({
        bookingId: "b-123",
        passengerEmail: "john@example.com",
        driverEmail: "jane@example.com",
      }),
    );

    expect(mockUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        bookingId: "b-123",
        passengerName: "John Doe",
        passengerEmail: "john@example.com",
        driverName: "Jane Smith",
        driverEmail: "jane@example.com",
      }),
    );
  });
});
