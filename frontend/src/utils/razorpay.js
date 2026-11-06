// ==============================================================================
// RAZORPAY STANDARD WEB CHECKOUT UTILITIES
// ==============================================================================

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

/**
 * Dynamically injects and loads the Razorpay Standard Checkout SDK script.
 * Returns a promise that resolves true on success or false on load error.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
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
 * @param {string} config.order_id - Razorpay Order ID from backend create-order
 * @param {number} config.amount - Amount in paise (e.g. 49900 for 499 INR)
 * @param {string} [config.currency='INR']
 * @param {string} [config.name='MAANMITRA'] - Brand/Business display name
 * @param {string} [config.description=''] - Payment description
 * @param {string} [config.image] - Brand logo URL
 * @param {Object} [config.prefill] - { name, email, contact }
 * @param {Object} [config.notes] - Custom metadata
 * @param {string} [config.themeColor='#4A154B'] - Primary brand hex color
 * @param {Function} config.onSuccess - Callback on payment capture (receives { razorpay_payment_id, razorpay_order_id, razorpay_signature })
 * @param {Function} [config.onDismiss] - Callback when user closes or cancels the modal
 * @param {Function} [config.onError] - Callback on payment failure
 */
export async function openRazorpayCheckout({
  order_id,
  amount,
  currency = 'INR',
  name = 'MAANMITRA',
  description = 'Payment',
  image = '/maanmitra-original-logo-transparent.png',
  prefill = {},
  notes = {},
  themeColor = '#4A154B',
  onSuccess,
  onDismiss,
  onError
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error('Razorpay payment gateway failed to load. Please check your network connection.');
  }

  const key = RAZORPAY_KEY_ID;
  if (!key) {
    throw new Error('Razorpay Key ID is not configured (VITE_RAZORPAY_KEY_ID missing).');
  }

  const options = {
    key,
    amount,
    currency,
    name,
    description,
    order_id,
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
    config: {
      display: {
        blocks: {
          upi_methods: {
            name: 'UPI / QR / UPI ID',
            instruments: [
              {
                method: 'upi',
                flows: ['collect', 'qr', 'intent']
              }
            ]
          }
        },
        sequence: ['block.upi_methods'],
        preferences: {
          show_default_blocks: true
        }
      }
    },
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        });
      }
    },
    modal: {
      ondismiss: function () {
        if (onDismiss) onDismiss();
      }
    }
  };

  const rzp = new window.Razorpay(options);

  if (onError) {
    rzp.on('payment.failed', function (response) {
      onError(response.error);
    });
  }

  rzp.open();
  return rzp;
}

