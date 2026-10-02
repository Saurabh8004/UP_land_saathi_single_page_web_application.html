import { supabase } from '../lib/supabase';
import { calculateAmount } from '../config/pricing';

// ============================================================
// TYPES
// ============================================================

export interface Payment {
  id: string;
  request_id: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  verified_at: string | null;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

// ============================================================
// CREATE RAZORPAY ORDER
// ============================================================

export async function createRazorpayOrder(requestId: string, packageCode: string): Promise<{
  success: boolean;
  data?: { orderId: string; amount: number; currency: string; keyId: string };
  error?: { code: string; message: string };
}> {
  try {
    // Calculate amount server-side (never trust client)
    const amount = calculateAmount(packageCode);
    const amountInPaise = amount * 100; // Razorpay uses paise
    
    // Check if order already exists for this request
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('request_id', requestId)
      .eq('status', 'created')
      .maybeSingle();
    
    if (existingPayment?.razorpay_order_id) {
      return {
        success: true,
        data: {
          orderId: existingPayment.razorpay_order_id,
          amount: amount,
          currency: 'INR',
          keyId: import.meta.env.VITE_RAZORPAY_KEY_ID
        }
      };
    }
    
    // Create Razorpay order via API
    // Note: In production, this should be a server-side API call
    // For now, we'll create a placeholder and handle verification
    const orderResponse = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId,
        packageCode,
        amount: amountInPaise
      })
    });
    
    if (!orderResponse.ok) {
      throw new Error('Failed to create Razorpay order');
    }
    
    const orderData = await orderResponse.json();
    
    // Store payment record
    const { error: dbError } = await supabase
      .from('payments')
      .insert({
        request_id: requestId,
        razorpay_order_id: orderData.id,
        amount: amount,
        currency: 'INR',
        status: 'created'
      });
    
    if (dbError) {
      console.error('Error storing payment:', dbError);
    }
    
    return {
      success: true,
      data: {
        orderId: orderData.id,
        amount: amount,
        currency: 'INR',
        keyId: import.meta.env.VITE_RAZORPAY_KEY_ID
      }
    };
    
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return {
      success: false,
      error: {
        code: 'PAYMENT_ERROR',
        message: 'Failed to create payment order. Please try again.'
      }
    };
  }
}

// ============================================================
// VERIFY PAYMENT
// ============================================================

export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<{
  success: boolean;
  data?: { paymentId: string; status: string };
  error?: { code: string; message: string };
}> {
  try {
    // Verify signature via API
    const verifyResponse = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature
      })
    });
    
    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      throw new Error(errorData.error?.message || 'Payment verification failed');
    }
    
    const verifyData = await verifyResponse.json();
    
    // Update payment record
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        status: 'captured',
        verified_at: new Date().toISOString(),
        raw_response: verifyData
      })
      .eq('razorpay_order_id', razorpayOrderId);
    
    if (updateError) {
      console.error('Error updating payment:', updateError);
    }
    
    // Update request status to paid
    const { data: payment } = await supabase
      .from('payments')
      .select('request_id')
      .eq('razorpay_order_id', razorpayOrderId)
      .single();
    
    if (payment) {
      await supabase
        .from('requests')
        .update({ status: 'paid' })
        .eq('id', payment.request_id);
      
      // Create verification update
      await supabase.from('verification_updates').insert({
        request_id: payment.request_id,
        status: 'paid',
        public_message: 'Payment confirmed. Your request is now being processed.',
        created_by: null
      });
    }
    
    return {
      success: true,
      data: {
        paymentId: razorpayPaymentId,
        status: 'captured'
      }
    };
    
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      error: {
        code: 'VERIFICATION_ERROR',
        message: error instanceof Error ? error.message : 'Payment verification failed.'
      }
    };
  }
}

// ============================================================
// GET PAYMENT FOR REQUEST
// ============================================================

export async function getPaymentForRequest(requestId: string): Promise<{
  success: boolean;
  data?: Payment;
  error?: { code: string; message: string };
}> {
  try {
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      return {
        success: false,
        error: {
          code: 'DB_ERROR',
          message: 'Failed to fetch payment.'
        }
      };
    }
    
    return {
      success: true,
      data: payment || undefined
    };
    
  } catch (error) {
    console.error('Error fetching payment:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Failed to fetch payment.'
      }
    };
  }
}

// ============================================================
// INITIATE REFUND
// ============================================================

export async function initiateRefund(
  paymentId: string,
  amount: number,
  reason: string
): Promise<{
  success: boolean;
  data?: { refundId: string; status: string };
  error?: { code: string; message: string };
}> {
  try {
    // Get payment details
    const { data: payment } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();
    
    if (!payment || !payment.razorpay_payment_id) {
      return {
        success: false,
        error: {
          code: 'INVALID_PAYMENT',
          message: 'Payment not found or not eligible for refund.'
        }
      };
    }
    
    // Create refund record
    const { data: refund, error: refundError } = await supabase
      .from('refunds')
      .insert({
        payment_id: paymentId,
        request_id: payment.request_id,
        amount: amount,
        reason: reason,
        status: 'pending'
      })
      .select()
      .single();
    
    if (refundError) {
      throw new Error('Failed to create refund record');
    }
    
    // Update request status
    await supabase
      .from('requests')
      .update({ status: 'refunded' })
      .eq('id', payment.request_id);
    
    return {
      success: true,
      data: {
        refundId: refund.id,
        status: refund.status
      }
    };
    
  } catch (error) {
    console.error('Error initiating refund:', error);
    return {
      success: false,
      error: {
        code: 'REFUND_ERROR',
        message: 'Failed to initiate refund.'
      }
    };
  }
}
