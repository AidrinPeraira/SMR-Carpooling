import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookingPaymentFailedHandler } from "#/presentation/event-handlers/BookingPaymentFailedHandler";
import { ISendBookingPaymentFailedMailUseCase } from "#/application/interfaces/use-case/ISendBookingPaymentFailedMailUseCase";
import { ILogger, BookingPaymentFailureEvent, EventName } from "@sharemyride/shared";

describe("BookingPaymentFailedHandler", () => {
  let handler: BookingPaymentFailedHandler;
  let mockLogger: ILogger;
  let mockUseCase: ISendBookingPaymentFailedMailUseCase;

  const mockEvent: BookingPaymentFailureEvent = {
    eventName: EventName.BOOKING_PAYMENT_FAILURE,
    timestamp: new Date(),
    payload: {
      bookingId: "b-123",
      passengerId: "p-1",
      firstName: "John",
      lastName: "Doe",
      emailId: "john@example.com",
      paymentKey: "key-123",
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

    handler = new BookingPaymentFailedHandler(mockLogger, mockUseCase);
  });

  it("should map event payload to DTO and invoke payment failed mail use case", async () => {
    await handler.handle(mockEvent);

    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining("Handling booking payment failed notification"),
      expect.objectContaining({
        bookingId: "b-123",
        emailId: "john@example.com",
      }),
    );

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      bookingId: "b-123",
      passengerId: "p-1",
      firstName: "John",
      lastName: "Doe",
      emailId: "john@example.com",
    });
  });
});
