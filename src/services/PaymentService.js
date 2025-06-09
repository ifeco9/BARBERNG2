import { Paystack } from 'react-native-paystack-webview';
import { supabase } from '../api/supabase';

export class PaymentService {
  static PAYSTACK_PUBLIC_KEY = 'YOUR_PAYSTACK_PUBLIC_KEY';
  
  // Initialize payment for a booking
  static async initiateBookingPayment(booking, amount, email) {
    try {
      // Create a payment record in the database
      const { data, error } = await supabase
        .from('payments')
        .insert([
          {
            booking_id: booking.id,
            amount,
            status: 'pending',
            payment_method: 'paystack',
            customer_email: email,
          },
        ])
        .select();

      if (error) throw error;
      
      return {
        paymentId: data[0].id,
        reference: `booking-${booking.id}-${Date.now()}`,
        amount,
        email,
      };
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  }

  // Process successful payment
  static async processSuccessfulPayment(paymentId, transactionRef) {
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          transaction_reference: transactionRef,
          completed_at: new Date(),
        })
        .eq('id', paymentId);

      if (error) throw error;
      
      // Update the booking status
      const { data: payment } = await supabase
        .from('payments')
        .select('booking_id')
        .eq('id', paymentId)
        .single();
      
      if (payment) {
        await supabase
          .from('bookings')
          .update({ payment_status: 'paid' })
          .eq('id', payment.booking_id);
      }
      
      return true;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Handle failed payment
  static async handleFailedPayment(paymentId, reason) {
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'failed',
          failure_reason: reason,
        })
        .eq('id', paymentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error handling failed payment:', error);
      throw error;
    }
  }
}