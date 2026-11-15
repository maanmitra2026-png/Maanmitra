/**
 * Cashfree Payment Gateway v3 SDK Utility
 * Provides dynamic loader and checkout initiator for Cashfree Payments.
 */

let cashfreeSdkPromise = null;

export const loadCashfreeSDK = () => {
  if (window.Cashfree) {
    return Promise.resolve(window.Cashfree);
  }

  if (cashfreeSdkPromise) {
    return cashfreeSdkPromise;
  }

  cashfreeSdkPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="cashfree.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.Cashfree));
      existingScript.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => {
      resolve(window.Cashfree);
    };
    script.onerror = (err) => {
      console.error('Failed to load Cashfree SDK script', err);
      reject(err);
    };
    document.head.appendChild(script);
  });

  return cashfreeSdkPromise;
};

/**
 * Triggers Cashfree checkout flow.
 * @param {Object} options
 * @param {string} options.paymentSessionId - Session ID returned by backend
 * @param {string} [options.mode='production'] - 'production' or 'sandbox'
 * @param {string} [options.redirectTarget='_modal'] - '_modal' or '_self'
 * @returns {Promise<any>}
 */
export const openCashfreeCheckout = async ({
  paymentSessionId,
  mode = 'production',
  redirectTarget = '_modal',
}) => {
  if (!paymentSessionId) {
    throw new Error('Cashfree payment session ID is required.');
  }

  const CashfreeFactory = await loadCashfreeSDK();
  if (!CashfreeFactory) {
    throw new Error('Cashfree SDK is not available. Please check internet connection.');
  }

  const cashfreeInstance = CashfreeFactory({
    mode: mode === 'sandbox' || mode === 'test' ? 'sandbox' : 'production',
  });

  return cashfreeInstance.checkout({
    paymentSessionId,
    redirectTarget,
  });
};

