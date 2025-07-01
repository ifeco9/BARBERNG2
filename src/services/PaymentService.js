import { Alert } from 'react-native';
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
            amount: parseFloat(amount),
            status: 'pending',
            payment_method: 'paystack'
          }
        ])
        .select();
      
      if (error) throw error;
      
      return data[0];
    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  }
  
  // Process payment with Paystack
  static async processPaystackPayment(amount, email, reference) {
    try {
      // This is a placeholder for actual Paystack integration
      // In a real app, you would use the Paystack SDK or API
      console.log(`Processing Paystack payment: ${amount} for ${email}, ref: ${reference}`);
      
      // Simulate successful payment
      return {
        success: true,
        reference,
        method: 'paystack',
        message: 'Payment successful',
      };
    } catch (error) {
      console.error('Payment error:', error);
      return {
        success: false,
        message: error.message || 'Payment failed',
      };
    }
  }

  // Process payment with Flutterwave
  static async processFlutterwavePayment(amount, email, reference) {
    try {
      // This is a placeholder for actual Flutterwave integration
      console.log(`Processing Flutterwave payment: ${amount} for ${email}, ref: ${reference}`);
      
      // Simulate successful payment
      return {
        success: true,
        reference,
        method: 'flutterwave',
        message: 'Payment successful',
      };
    } catch (error) {
      console.error('Payment error:', error);
      return {
        success: false,
        message: error.message || 'Payment failed',
      };
    }
  }

  // Show payment options to user
  static showPaymentOptions(amount, email, onSuccess, onFailure) {
    Alert.alert(
      'Select Payment Method',
      `Pay ₦${amount}`,
      [
        {
          text: 'Paystack',
          onPress: async () => {
            const reference = `ref-${Date.now()}`;
            const result = await this.processPaystackPayment(amount, email, reference);
            if (result.success) {
              onSuccess(result);
            } else {
              onFailure(result);
            }
          },
        },
        {
          text: 'Flutterwave',
          onPress: async () => {
            const reference = `ref-${Date.now()}`;
            const result = await this.processFlutterwavePayment(amount, email, reference);
            if (result.success) {
              onSuccess(result);
            } else {
              onFailure(result);
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  }
}
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
// Implement real Paystack integration
const processPaystackPayment = async (amount, email, reference, metadata) => {
  return new Promise((resolve, reject) => {
    if (!PAYSTACK_PUBLIC_KEY) {
      reject(new Error('Paystack public key not configured'));
      return;
    }
    
    // Create a PaystackWebView reference
    const paystackWebViewRef = React.createRef();
    
    // Create a modal to show the payment webview
    const PaymentModal = () => {
      const [visible, setVisible] = useState(true);
      
      return (
        <Modal visible={visible} animationType="slide">
          <View style={{ flex: 1 }}>
            <Paystack
              paystackKey={PAYSTACK_PUBLIC_KEY}
              amount={amount * 100} // Convert to kobo
              billingEmail={email}
              activityIndicatorColor="green"
              channels={['card', 'bank', 'ussd', 'qr', 'mobile_money']}
              refNumber={reference}
              billingName={metadata.customerName || 'Customer'}
              onCancel={() => {
                setVisible(false);
                reject(new Error('Payment was cancelled'));
              }}
              onSuccess={(res) => {
                setVisible(false);
                resolve({
                  reference: res.transactionRef.reference,
                  status: 'success',
                  gateway: 'paystack',
                  amount: amount,
                  metadata: metadata
                });
              }}
              autoStart={true}
            />
          </View>
        </Modal>
      );
    };
    
    // Render the payment modal
    const rootTag = document.getElementById('root');
    const root = ReactDOM.createRoot(rootTag);
    root.render(<PaymentModal />);
  });
};

// Implement real Flutterwave integration
const processFlutterwavePayment = async (amount, email, reference, metadata) => {
  // Similar implementation to Paystack but using Flutterwave SDK
  // ...
};