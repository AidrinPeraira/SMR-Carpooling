import {
  CreateBookingPaymentOrderRequestDTO,
  CreateBookingPaymentOrderResponseDTO,
  VerifyBookingPaymentOrderRequestDTO,
} from "#/application/dto/payments/BookingPaymentDTO";
import {
  CreateBookingPaymentOrderRequest,
  CreateBookingPaymentOrderResult,
  VerifyBookingPaymentOrderRequest,
} from "@sharemyride/shared";

export class PaymentMapper {
  static toCreateBookingPaymentOrderDTO(
    request: CreateBookingPaymentOrderRequest,
  ): CreateBookingPaymentOrderRequestDTO {
    return {
      paymentToken: request.payment_token,
    };
  }

  static toCreateBookingPaymentOrderResult(
    dto: CreateBookingPaymentOrderResponseDTO,
  ): CreateBookingPaymentOrderResult {
    return {
      order_number: dto.orderNumber,
    };
  }

  static toVerifyBookingPaymentOrderDTO(
    request: VerifyBookingPaymentOrderRequest,
  ): VerifyBookingPaymentOrderRequestDTO {
    return {
      orderNumber: request.order_number,
      paymentId: request.payment_id,
      verificationKey: request.verification_key,
    };
  }
}
