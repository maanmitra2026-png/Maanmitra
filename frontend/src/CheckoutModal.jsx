import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  X,
  Sparkles,
  AlertCircle,
  Lock,
  ArrowRight
} from 'lucide-react';
import { openRazorpayCheckout, RAZORPAY_KEY_ID } from './utils/razorpay';

export default function CheckoutModal({
  checkoutData, // { order_id, amount, currency, key_id, plan_name, plan_code, is_mock }
  onClose,
  onPaymentSuccess,
  api,
  notify
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!checkoutData) return null;

  const { order_id, amount, currency, plan_name, plan_code, is_mock } = checkoutData;
  const displayAmount = (amount / 100).toFixed(0);

  async function handlePay() {
    try {
      setSubmitting(true);
      setErrorMsg(null);

      if (RAZORPAY_KEY_ID && !is_mock) {
        await openRazorpayCheckout({
          order_id,
          amount,
          currency: currency || 'INR',
          name: 'MAANMITRA',
          description: `Subscription: ${plan_name}`,
          onSuccess: async (rzpRes) => {
            try {
              const res = await api('/subscriptions/verify', {
                method: 'POST',
                body: {
                  provider_order_id: rzpRes.razorpay_order_id,
                  provider_payment_id: rzpRes.razorpay_payment_id,
                  provider_signature: rzpRes.razorpay_signature
                }
              });
              notify(res.message || 'Payment successfully verified! Your subscription is now active.');
              if (onPaymentSuccess) {
                onPaymentSuccess(res.subscription);
              }
              onClose();
            } catch (err) {
              setErrorMsg(err.message || 'Payment verification failed.');
              notify(err.message || 'Payment verification failed', true);
            } finally {
              setSubmitting(false);
            }
          },
          onDismiss: () => {
            setSubmitting(false);
          },
          onError: (err) => {
            setSubmitting(false);
            const msg = err?.description || 'Payment was cancelled or unsuccessful.';
            setErrorMsg(msg);
            notify(msg, true);
          }
        });
        return;
      }

      // Mock / fallback mode
      const mockPaymentId = `pay_mock_${Date.now()}`;
      const mockSignature = `mock_signature_${order_id}`;

      const res = await api('/subscriptions/verify', {
        method: 'POST',
        body: {
          provider_order_id: order_id,
          provider_payment_id: mockPaymentId,
          provider_signature: mockSignature
        }
      });

      notify(res.message || 'Payment successfully verified! Your subscription is now active.');
      if (onPaymentSuccess) {
        onPaymentSuccess(res.subscription);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Payment verification failed.');
      notify(err.message || 'Payment verification failed', true);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSimulateFailure() {
    try {
      setSubmitting(true);
      setErrorMsg(null);
      // Intentionally sending invalid signature to demonstrate failure rejection
      await api('/subscriptions/verify', {
        method: 'POST',
        body: {
          provider_order_id: order_id,
          provider_payment_id: `pay_mock_failed`,
          provider_signature: `invalid_tampered_signature`
        }
      });
    } catch (err) {
      setErrorMsg(`Payment Failure Simulated: ${err.message}. Entitlements were not granted.`);
      notify(`Verification correctly rejected: ${err.message}`, true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="upgrade-modal-backdrop" onClick={onClose}>
      <div className="upgrade-modal-card checkout-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="upgrade-modal-close"
          onClick={onClose}
          aria-label="Close checkout modal"
        >
          <X size={20} />
        </button>

        <div className="checkout-head">
          <div className="upgrade-modal-badge" style={{ background: 'var(--brand-emerald-surface)', color: 'var(--brand-emerald-dark)' }}>
            <Lock size={13} /> SECURE RAZORPAY CHECKOUT
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '8px 0 4px', color: 'var(--brand-emerald-dark)' }}>
            Complete Your Subscription
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--muted)' }}>
            You are subscribing to <strong>{plan_name}</strong> on a recurring monthly billing schedule.
          </p>
        </div>

        {/* Order Summary Box */}
        <div className="checkout-summary-box">
          <div className="summary-row">
            <span>Membership Plan</span>
            <strong>{plan_name}</strong>
          </div>
          <div className="summary-row">
            <span>Billing Period</span>
            <span>Monthly (30 days access)</span>
          </div>
          <div className="summary-row">
            <span>Order Reference</span>
            <code style={{ fontSize: '0.78rem' }}>{order_id}</code>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total Payable Amount</span>
            <div className="total-figure">
              <span className="total-curr">₹</span>
              <span className="total-val">{displayAmount}</span>
              <span className="total-period">/ month</span>
            </div>
          </div>
          <small className="tax-inclusive-tag">All applicable taxes included . Cancel anytime</small>
        </div>

        {errorMsg && (
          <div className="checkout-error-box">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="checkout-actions">
          <button
            type="button"
            className="btn btn-gold checkout-pay-btn"
            onClick={handlePay}
            disabled={submitting}
          >
            {submitting ? 'Verifying with Gateway...' : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <ShieldCheck size={18} /> Pay ₹{displayAmount} & Activate {plan_code}
              </span>
            )}
          </button>

          <button
            type="button"
            className="btn-outline test-failure-btn"
            onClick={handleSimulateFailure}
            disabled={submitting}
            title="QA Testing: Test payment failure response"
          >
            Simulate Gateway Payment Failure
          </button>
        </div>

        <div className="checkout-trust-foot">
          <div className="foot-guarantee">
            <ShieldCheck size={14} color="var(--brand-gold)" />
            <span>256-Bit SSL Encryption . HMAC-SHA256 Server Signature Verification . Idempotent Activation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
