import React, { useState } from 'react';
import { CreditCard, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { openRazorpayCheckout, RAZORPAY_KEY_ID } from '../utils/razorpay';
import { API_BASE } from '../apiConfig';

/**
 * Reusable Razorpay Standard Checkout Button Component
 *
 * @param {Object} props
 * @param {number} props.amountInPaise - e.g. 49900 for Rs.499
 * @param {string} [props.label] - Button label
 * @param {string} [props.description] - Payment description
 * @param {string} [props.createOrderUrl] - Custom create-order endpoint (defaults to /api/v1/create-order)
 * @param {string} [props.verifyPaymentUrl] - Custom verify endpoint (defaults to /api/v1/verify-payment)
 * @param {Object} [props.prefill] - { name, email, phone }
 * @param {Object} [props.notes] - Custom metadata
 * @param {string} [props.token] - Optional auth bearer token
 * @param {Function} [props.onSuccess] - Callback after successful signature verification
 * @param {Function} [props.onError] - Callback on error
 * @param {string} [props.className] - CSS class name
 * @param {Object} [props.style] - Custom styles
 */
export default function RazorpayCheckoutButton({
  amountInPaise,
  label = 'Pay Now',
  description = 'MAANMITRA Payment',
  createOrderUrl = `${API_BASE}/create-order`,
  verifyPaymentUrl = `${API_BASE}/verify-payment`,
  prefill = {},
  notes = {},
  token = null,
  onSuccess,
  onError,
  className = '',
  style = {}
}) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheckout = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Step 1: Create Order on Backend
      const orderRes = await fetch(createOrderUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          notes
        })
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.detail || 'Failed to initialize payment order');
      }

      const orderData = await orderRes.json();
      const orderId = orderData.order_id || orderData.id;

      // Step 2: Open Razorpay Standard Checkout Modal
      await openRazorpayCheckout({
        order_id: orderId,
        amount: orderData.amount || amountInPaise,
        currency: orderData.currency || 'INR',
        name: 'MAANMITRA',
        description,
        prefill,
        notes,
        onSuccess: async (paymentResult) => {
          // Step 3: Verify Signature on Backend
          try {
            const verifyRes = await fetch(verifyPaymentUrl, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                razorpay_order_id: paymentResult.razorpay_order_id,
                razorpay_payment_id: paymentResult.razorpay_payment_id,
                razorpay_signature: paymentResult.razorpay_signature
              })
            });

            if (!verifyRes.ok) {
              const verifyErr = await verifyRes.json().catch(() => ({}));
              throw new Error(verifyErr.detail || 'Payment signature verification failed.');
            }

            const verifyData = await verifyRes.json();
            setLoading(false);
            if (onSuccess) {
              onSuccess(verifyData, paymentResult);
            }
          } catch (verErr) {
            setLoading(false);
            const msg = verErr.message || 'Signature verification failed.';
            setErrorMsg(msg);
            if (onError) onError(msg);
          }
        },
        onDismiss: () => {
          setLoading(false);
        },
        onError: (err) => {
          setLoading(false);
          const msg = err?.description || 'Payment was unsuccessful or cancelled.';
          setErrorMsg(msg);
          if (onError) onError(msg);
        }
      });
    } catch (err) {
      setLoading(false);
      const msg = err.message || 'Payment initiation failed.';
      setErrorMsg(msg);
      if (onError) onError(msg);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: '12px',
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.75 : 1,
          ...style
        }}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Processing...
          </>
        ) : (
          <>
            <CreditCard size={18} /> {label}
          </>
        )}
      </button>

      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#DC2626',
          fontSize: '0.82rem',
          background: '#FEECEE',
          padding: '8px 12px',
          borderRadius: '8px'
        }}>
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

