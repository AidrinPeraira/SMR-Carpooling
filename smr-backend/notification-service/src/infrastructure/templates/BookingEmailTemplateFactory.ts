import { BookingCancellationMailDTO } from "#/application/dto/email/BookingCancellationMailDTO";
import { BookingPaymentMailDTO } from "#/application/dto/email/BookingPaymentMailDTO";
import { NewBookingMailDTO } from "#/application/dto/email/NewBookingMailDTO";
import { IBookingEmailTemplateFactory } from "#/application/interfaces/templates/IBookingEmailTemplateFactory";
import { EmailTemplate } from "#/application/utils/EmailTemplate";
import { NotificationEntity } from "#/domain/entities/NotificationEntity";

export class BookingEmailTemplateFactory implements IBookingEmailTemplateFactory {
  createNewBookingNotifications(data: NewBookingMailDTO): NotificationEntity[] {
    const driverNotification: NotificationEntity = {
      recipient: data.driverEmail,
      subject: `New Booking Request - ShareMyRide`,
      body: EmailTemplate.generate(
        "New Booking Request",
        `
        <p>Hello <strong>${data.driverName}</strong>,</p>
        <p>You have received a new booking request on your trip!</p>
        <table class="data-table">
          <tr><th>Passenger:</th><td>${data.passengerName}</td></tr>
          <tr><th>Seats Requested:</th><td>${data.seatCount}</td></tr>
          <tr><th>Total Amount:</th><td>₹${data.bookingAmount}</td></tr>
          <tr><th>Pickup:</th><td>${data.passengerOrigin.stopName} (${data.passengerOrigin.stopAddress})</td></tr>
          <tr><th>Drop-off:</th><td>${data.passengerDestination.stopName} (${data.passengerDestination.stopAddress})</td></tr>
          <tr><th>Trip Date:</th><td>${new Date(data.tripDate).toLocaleString()}</td></tr>
        </table>
        <p>Please review the booking request in your ShareMyRide dashboard.</p>
        <a href="https://sharemyride.com/dashboard" class="button">View Dashboard</a>
        `
      ),
    };

    const passengerNotification: NotificationEntity = {
      recipient: data.passengerEmail,
      subject: `Booking Request Submitted - ShareMyRide`,
      body: EmailTemplate.generate(
        "Booking Request Submitted",
        `
        <p>Hello <strong>${data.passengerName}</strong>,</p>
        <p>Your booking request (ID: <strong>${data.bookingId}</strong>) has been successfully submitted!</p>
        <table class="data-table">
          <tr><th>Driver:</th><td>${data.driverName}</td></tr>
          <tr><th>Seats:</th><td>${data.seatCount}</td></tr>
          <tr><th>Total Price:</th><td>₹${data.bookingAmount}</td></tr>
          <tr><th>Pickup:</th><td>${data.passengerOrigin.stopName}</td></tr>
          <tr><th>Drop-off:</th><td>${data.passengerDestination.stopName}</td></tr>
        </table>
        <p>We will notify you once the driver confirms your booking.</p>
        `
      ),
    };

    return [driverNotification, passengerNotification];
  }

  createBookingCancellationNotifications(data: BookingCancellationMailDTO): NotificationEntity[] {
    const driverNotification: NotificationEntity = {
      recipient: data.driverEmail,
      subject: `Booking Cancelled - ShareMyRide`,
      body: EmailTemplate.generate(
        "Booking Cancelled",
        `
        <p>Hello <strong>${data.driverName}</strong>,</p>
        <p>A passenger has cancelled their booking for your trip.</p>
        <table class="data-table">
          <tr><th>Passenger:</th><td>${data.passengerName}</td></tr>
          <tr><th>Pickup:</th><td>${data.bookingStart}</td></tr>
          <tr><th>Drop-off:</th><td>${data.bookingStop}</td></tr>
        </table>
        <p>The seats they reserved are now available again for other passengers.</p>
        `
      ),
    };

    const passengerNotification: NotificationEntity = {
      recipient: data.passengerEmail,
      subject: `Booking Cancelled Successfully - ShareMyRide`,
      body: EmailTemplate.generate(
        "Booking Cancelled",
        `
        <p>Hello <strong>${data.passengerName}</strong>,</p>
        <p>Your booking (ID: <strong>${data.bookingId}</strong>) has been successfully cancelled.</p>
        <table class="data-table">
          <tr><th>Driver:</th><td>${data.driverName}</td></tr>
          <tr><th>Pickup:</th><td>${data.bookingStart}</td></tr>
          <tr><th>Drop-off:</th><td>${data.bookingStop}</td></tr>
          <tr><th>Amount:</th><td>₹${data.amount}</td></tr>
        </table>
        <p>If you have already paid for this booking, the refund will be processed shortly.</p>
        `
      ),
    };

    return [driverNotification, passengerNotification];
  }

  createBookingPaymentSuccessNotification(data: BookingPaymentMailDTO): NotificationEntity {
    return {
      recipient: data.emailId,
      subject: `Booking Payment Successful - ShareMyRide`,
      body: EmailTemplate.generate(
        "Payment Successful",
        `
        <p>Hello <strong>${data.firstName} ${data.lastName}</strong>,</p>
        <p>Your payment for booking (ID: <strong>${data.bookingId}</strong>) has been successfully processed and confirmed!</p>
        <p>Thank you for riding with ShareMyRide.</p>
        <a href="https://sharemyride.com/bookings" class="button">View Booking</a>
        `
      ),
    };
  }

  createBookingPaymentFailedNotification(data: BookingPaymentMailDTO): NotificationEntity {
    return {
      recipient: data.emailId,
      subject: `Booking Payment Failed - ShareMyRide`,
      body: EmailTemplate.generate(
        "Payment Failed",
        `
        <p>Hello <strong>${data.firstName} ${data.lastName}</strong>,</p>
        <p>Your payment for booking (ID: <strong>${data.bookingId}</strong>) failed or timed out.</p>
        <p>The reserved seats for this booking have been released. If you wish to try again, please initiate a new payment or re-book your ride.</p>
        <a href="https://sharemyride.com/bookings" class="button">Go to Bookings</a>
        `
      ),
    };
  }
}
