// ==============================================================================
// RAZORPAY STANDARD WEB CHECKOUT UTILITIES
// ==============================================================================

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TwgPINXkMnFaPI';

/**
 * Dynamically injects and loads the Razorpay Standard Checkout SDK script.
 * Returns a promise that resolves true on success or false on load error.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Opens standard Razorpay Checkout modal with the specified order details.
 * 
 * @param {Object} config
 * @param {string} [config.key] - Razorpay Key ID (or key_id)
 * @param {string} [config.key_id] - Razorpay Key ID
 * @param {string} config.order_id - Razorpay Order ID from backend create-order
 * @param {number} config.amount - Amount in paise (e.g. 49900 for 499 INR)
 * @param {string} [config.currency='INR']
 * @param {string} [config.name='MAANMITRA'] - Brand/Business display name
 * @param {string} [config.description=''] - Payment description
 * @param {string} [config.image] - Brand logo URL
 * @param {Object} [config.prefill] - { name, email, contact }
 * @param {Object} [config.notes] - Custom metadata
 * @param {string} [config.themeColor='#50164F'] - Primary brand hex color
 * @param {Function} config.onSuccess - Callback on payment capture (receives { razorpay_payment_id, razorpay_order_id, razorpay_signature })
 * @param {Function} [config.onDismiss] - Callback when user closes or cancels the modal
 * @param {Function} [config.onError] - Callback on payment failure
 */
export async function openRazorpayCheckout({
  key,
  key_id,
  order_id,
  amount,
  currency = 'INR',
  name = 'MAANMITRA',
  description = 'Platform Payment',
  image = '/manmitra-app-icon.png',
  prefill = {},
  notes = {},
  themeColor = '#50164F',
  onSuccess,
  onDismiss,
  onError
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error('Razorpay payment gateway failed to load. Please check your network connection.');
  }

  const rawKey = key || key_id || RAZORPAY_KEY_ID;
  const resolvedKey = (rawKey && !rawKey.includes('mock') && !rawKey.includes('test')) ? rawKey : 'rzp_live_TwgPINXkMnFaPI';
  if (!resolvedKey) {
    throw new Error('Razorpay Key ID is not configured. Please contact support.');
  }

  const isRealRazorpayOrder = order_id && String(order_id).startsWith('order_') && !String(order_id).startsWith('order_mock_');

  // Ensure amount is an integer in paise
  const numericAmount = Math.round(Number(amount));

  const options = {
    key: resolvedKey,
    amount: numericAmount,
    currency: currency || 'INR',
    name,
    description,
    image,
    prefill: {
      name: prefill.name || '',
      email: prefill.email || '',
      contact: prefill.contact || prefill.phone || ''
    },
    notes: notes || {},
    theme: {
      color: themeColor
    },
    modal: {
      confirm_close: true,
      ondismiss: function () {
        if (onDismiss) onDismiss();
      }
    },
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id || order_id || '',
          razorpay_signature: response.razorpay_signature || ''
        });
      }
    }
  };

  // Only attach order_id if it's a real server-generated Razorpay order
  if (isRealRazorpayOrder) {
    options.order_id = order_id;
  }

  const rzp = new window.Razorpay(options);

  if (onError) {
    rzp.on('payment.failed', function (response) {
      onError(response.error || { description: 'Payment transaction failed or was declined.' });
    });
  }

  rzp.open();
  return rzp;
}

