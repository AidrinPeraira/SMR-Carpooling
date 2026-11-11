import crypto from "node:crypto";
import { AppConfig } from "#/application.config";
import {
  IPaymentOrderResult,
  IPaymentProvider,
} from "#/application/interfaces/services/IPaymentProvider";
import {
  ApplicationError,
  ErrorCode,
  HttpStatusCodes,
  PaymentErrorMessage,
} from "@sharemyride/shared";
import Razorpay from "razorpay";

/**
 * This class implements the payment provider
 * using RazorPay
 */
export class RazorPayPaymentProvider implements IPaymentProvider {
  private _client: Razorpay;

  constructor() {
    this._client = new Razorpay({
      key_id: AppConfig.RAZORPAY_API_KEY,
      key_secret: AppConfig.RAZORPAY_API_SECRET,
    });
  }

  async createOrder(
    amount: number,
    paymentId: string,
    currency: string = "INR",
  ): Promise<IPaymentOrderResult> {
    try {
      const newOrder = await this._client.orders.create({
        amount: Math.round(amount * 100), // Razorpay expects amount in smallest currency unit (paise for INR)
        receipt: paymentId,
        currency: currency,
      });

      return {
        orderId: newOrder.id,
        amount: Number(newOrder.amount),
        currency: newOrder.currency,
      };
    } catch (error) {
      throw new ApplicationError(
        PaymentErrorMessage.ORDER_CREATION_FAILED,
        HttpStatusCodes.InternalServerError,
        ErrorCode.SYSTEM_INTERNAL_ERROR,
        {
          location: "RazorPayPaymentProvider - createOrder",
          cause: error,
        },
      );
    }
  }

  async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string,
  ): Promise<void> {
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", AppConfig.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== signature) {
      throw new ApplicationError(
        PaymentErrorMessage.VERIFICATION_FAILED,
        HttpStatusCodes.BadRequest,
        ErrorCode.INPUT_VALIDATION_ERROR,
        {
          location: "RazorPayPaymentProvider - verifyPayment",
          description: "Razorpay signature verification failed",
        },
      );
    }
  }
}
