import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Star, MessageSquare, Sparkles, Shield, User,
  CheckCircle2, ArrowRight, IndianRupee, Lock
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../apiConfig';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const FEATURES = [
  { icon: User, title: 'Profile Creation', desc: 'Create your relationship profile with photos and personal details', color: '#E91E63' },
  { icon: Heart, title: 'Smart Matching', desc: 'Compatibility-based profile matching with Mutual Match system', color: '#4A154B' },
  { icon: MessageSquare, title: 'Private Messaging', desc: 'Chat only after mutual match -- complete privacy guaranteed', color: '#E91E63' },
  { icon: Star, title: 'Astrology & Guidance', desc: 'Free horoscope, relationship articles, and self-improvement content', color: '#D4AF77' },
  { icon: Sparkles, title: 'AI Relationship Coach', desc: 'Limited daily AI assistant for relationship guidance (5 msg/day)', color: '#7C3AED' },
  { icon: Shield, title: 'Full Dashboard', desc: 'Manage matches, subscription, notifications and your profile', color: '#22A447' },
];

export default function UserSubscriptionPage() {
  const navigate = useNavigate();
  const { user, token, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    setError('');
    setLoading(true);
    try {
      const orderRes = await fetch(`${API_BASE}/user/subscription/create-order`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      const order = await orderRes.json();

      if (order.already_paid) {
        const updated = { ...user, subscription_paid: true };
        setUser(updated);
        localStorage.setItem('mm_user', JSON.stringify(updated));
        navigate('/user/dashboard');
        return;
      }

      const verifyPayment = async (paymentData) => {
        const verRes = await fetch(`${API_BASE}/user/subscription/verify-payment`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentData)
        });
        if (verRes.ok) {
          const updated = { ...user, subscription_paid: true };
          setUser(updated);
          localStorage.setItem('mm_user', JSON.stringify(updated));
          navigate('/user/dashboard');
        } else {
          const e = await verRes.json().catch(() => ({}));
          setError(e.detail || 'Payment verification failed. Contact support.');
        }
        setLoading(false);
      };

      const orderId = order.order_id || order.id;

      if (order.is_mock || !RAZORPAY_KEY) {
        await verifyPayment({
          razorpay_order_id: orderId,
          razorpay_payment_id: 'mock_pay_' + Date.now(),
          razorpay_signature: 'mock_sig',
          is_mock: true
        });
        return;
      }

      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) { setError('Payment gateway failed to load. Please try again.'); setLoading(false); return; }

      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'MAANMITRA',
        description: 'Membership -- Full Portal Access',
        order_id: orderId,
        image: '/maanmitra-original-logo-transparent.png',
        handler: async (response) => {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
        },
        prefill: { email: user?.email || '', contact: user?.phone || '' },
        theme: { color: '#4A154B' },
        config: {
          display: {
            blocks: {
              upi_block: {
                name: 'Pay using UPI / QR / UPI ID',
                instruments: [
                  {
                    method: 'upi',
                    flows: ['collect', 'qr', 'intent']
                  }
                ]
              }
            },
            sequence: ['block.upi_block'],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        modal: { ondismiss: () => setLoading(false) }
      });
      rzp.on('payment.failed', function (resp) {
        setLoading(false);
        setError(resp.error?.description || 'Payment was unsuccessful or declined.');
      });
      rzp.open();
    } catch (err) {
      setError(err.message || 'Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #FFF1F5 0%, #F5E6FF 50%, #FFF1F5 100%)', minHeight: '100vh' }}>
      <PublicNavbar />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #4A154B, #E91E63)', borderRadius: '50px', padding: '8px 20px', marginBottom: '20px' }}>
            <Heart size={16} color="#fff" fill="#fff" />
            <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.5px' }}>EXCLUSIVE MEMBERSHIP</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#4A154B', margin: '0 0 12px', lineHeight: 1.2 }}>
            Find Your Perfect Match
          </h1>
          <p style={{ color: '#756572', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto' }}>
            Join MAANMITRA's relationship platform. Create your profile, discover compatible matches, and build meaningful connections.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', alignItems: 'start' }}>

          {/* Features Grid */}
          <div>
            <h2 style={{ color: '#4A154B', fontSize: '1.1rem', fontWeight: '700', marginBottom: '20px' }}>
              Everything included in your membership:
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {FEATURES.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', background: '#fff', borderRadius: '14px', padding: '14px 16px', boxShadow: '0 2px 12px rgba(74,21,75,0.06)', border: '1px solid #F1DCE5' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: f.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <f.icon size={18} color={f.color} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#32152E', fontSize: '0.9rem', marginBottom: '2px' }}>{f.title}</div>
                    <div style={{ color: '#756572', fontSize: '0.82rem', lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Card */}
          <div style={{ position: 'sticky', top: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', boxShadow: '0 12px 48px rgba(74,21,75,0.12)', border: '1px solid #F1DCE5' }}>

              {/* Price */}
              <div style={{ background: 'linear-gradient(135deg, #4A154B, #611E63)', borderRadius: '16px', padding: '24px', textAlign: 'center', marginBottom: '24px', color: '#fff' }}>
                <div style={{ fontSize: '0.82rem', opacity: 0.8, marginBottom: '6px' }}>One-time membership fee</div>
                <div style={{ fontSize: '3.2rem', fontWeight: '900', letterSpacing: '-2px', lineHeight: 1 }}>&#8377;499</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.7, marginTop: '8px' }}>Lifetime access -- No monthly charges</div>
              </div>

              {/* What you get highlights */}
              {[
                'Unlimited profile browsing',
                'Mutual match system',
                'Private messaging (after match)',
                'AI Relationship Coach (5/day)',
                'Astrology & guidance content',
                'Full member dashboard',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: i < 5 ? '1px solid #FBF0F4' : 'none' }}>
                  <CheckCircle2 size={15} color="#22A447" />
                  <span style={{ fontSize: '0.88rem', color: '#32152E' }}>{item}</span>
                </div>
              ))}

              {error && (
                <div style={{ background: '#FEECEE', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px 14px', borderRadius: '10px', fontSize: '0.84rem', marginTop: '16px' }}>
                  {error}
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={loading}
                style={{
                  width: '100%', marginTop: '20px', padding: '16px',
                  background: loading ? '#9B7EA8' : 'linear-gradient(135deg, #E91E63, #C2185B)',
                  color: '#fff', border: 'none', borderRadius: '14px',
                  fontSize: '1rem', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 6px 20px rgba(233,30,99,0.35)', transition: 'all 0.2s'
                }}
              >
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    <Heart size={18} fill="#fff" /> Join MAANMITRA -- Pay &#8377;499
                  </>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', fontSize: '0.78rem', color: '#9B7EA8' }}>
                <Lock size={12} />
                Secured by Razorpay. 100% safe payment.
              </div>

              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.78rem', color: '#B4A0B8' }}>
                Already a member? <span style={{ color: '#E91E63', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/user/dashboard')}>Go to Dashboard</span>
              </div>
            </div>

            {/* Trust badge */}
            <div style={{ background: '#F9F5FF', border: '1px solid #E9D5FF', borderRadius: '12px', padding: '14px 16px', marginTop: '16px', textAlign: 'center', fontSize: '0.82rem', color: '#6D28D9' }}>
              <strong>Privacy First</strong> -- Your identity is never shared without your explicit consent. All matches are mutual.
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

