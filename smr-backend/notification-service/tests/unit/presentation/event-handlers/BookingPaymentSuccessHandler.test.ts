import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookingPaymentSuccessHandler } from "#/presentation/event-handlers/BookingPaymentSuccessHandler";
import { ISendBookingPaymentSuccessMailUseCase } from "#/application/interfaces/use-case/ISendBookingPaymentSuccessMailUseCase";
import { ILogger, BookingPaymentSuccessEvent, EventName } from "@sharemyride/shared";

describe("BookingPaymentSuccessHandler", () => {
  let handler: BookingPaymentSuccessHandler;
  let mockLogger: ILogger;
  let mockUseCase: ISendBookingPaymentSuccessMailUseCase;

  const mockEvent: BookingPaymentSuccessEvent = {
    eventName: EventName.BOOKING_PAYMENT_SUCCESS,
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

    handler = new BookingPaymentSuccessHandler(mockLogger, mockUseCase);
  });

  it("should map event payload to DTO and invoke payment success mail use case", async () => {
    await handler.handle(mockEvent);

    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining("Handling booking payment success notification"),
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
