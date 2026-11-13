import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Sparkles,
  Phone,
  Video,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  PlusCircle,
  TrendingUp,
  CreditCard,
  Zap
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../apiConfig';
import { openRazorpayCheckout } from '../../utils/razorpay';

export default function UserWalletPage() {
  const { user, token, setUser } = useAuth();
  const [balance, setBalance] = useState(user?.wallet_balance_inr || 0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(250);
  const [customAmount, setCustomAmount] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const TOPUP_PRESETS = [
    {
      amount: 100,
      label: 'Starter Pack',
      tag: 'Basic',
      chatVal: '10 Chats',
      callVal: '6 mins VC',
      popular: false,
    },
    {
      amount: 250,
      label: 'Popular Pack',
      tag: 'Most Popular',
      chatVal: '25 Chats',
      callVal: '10 mins VC',
      popular: true,
    },
    {
      amount: 500,
      label: 'Best Value',
      tag: 'Recommended',
      chatVal: '50 Chats',
      callVal: '20 mins VC',
      popular: false,
    },
    {
      amount: 1000,
      label: 'VIP Access',
      tag: 'Power User',
      chatVal: '100+ Chats',
      callVal: '40 mins VC',
      popular: false,
    },
  ];

  const fetchWalletData = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/user/wallet`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const currentBal = data.wallet_balance_inr ?? 0;
        setBalance(currentBal);
        setTransactions(data.transactions || []);
        if (user) {
          const updated = { ...user, wallet_balance_inr: currentBal };
          setUser(updated);
          localStorage.setItem('mm_user', JSON.stringify(updated));
        }
      }
    } catch (err) {
      console.error('Failed to load wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [token]);

  const activeAmount = customAmount ? parseInt(customAmount, 10) : selectedAmount;

  const handleTopup = async () => {
    if (!activeAmount || activeAmount < 50) {
      setStatusMsg({ type: 'error', text: 'Please select or enter an amount of at least ₹50.' });
      return;
    }
    setProcessing(true);
    setStatusMsg({ type: '', text: '' });

    try {
      // 1. Create order on backend
      const orderRes = await fetch(`${API_BASE}/user/wallet/create-topup-order`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount_inr: activeAmount })
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.detail || 'Failed to initialize payment.');
      }

      const orderData = await orderRes.json();

      // 2. Open Razorpay Checkout modal
      await openRazorpayCheckout({
        key: orderData.key_id,
        order_id: orderData.order_id,
        amount: orderData.amount,
        currency: 'INR',
        name: 'MAANMITRA Wallet Top-Up',
        description: `Add ₹${activeAmount} to your session wallet for Chat, Audio & Video Calls`,
        prefill: {
          name: orderData.user_name || user?.full_name || '',
          email: orderData.user_email || user?.email || '',
          contact: orderData.user_phone || user?.phone || ''
        },
        themeColor: '#4A154B',
        onSuccess: async (rzpResponse) => {
          try {
            // 3. Verify signature on backend and credit wallet
            const verifyRes = await fetch(`${API_BASE}/user/wallet/verify-topup`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: rzpResponse.razorpay_order_id,
                razorpay_payment_id: rzpResponse.razorpay_payment_id,
                razorpay_signature: rzpResponse.razorpay_signature,
                amount_inr: activeAmount
              })
            });

            if (!verifyRes.ok) {
              const err = await verifyRes.json();
              throw new Error(err.detail || 'Payment verification failed.');
            }

            const verifyData = await verifyRes.json();
            setBalance(verifyData.wallet_balance_inr);
            setStatusMsg({
              type: 'success',
              text: `₹${activeAmount} successfully added to your wallet! New balance: ₹${verifyData.wallet_balance_inr}`
            });
            setCustomAmount('');
            await fetchWalletData();
          } catch (err) {
            setStatusMsg({ type: 'error', text: err.message || 'Verification failed.' });
          } finally {
            setProcessing(false);
          }
        },
        onDismiss: () => {
          setProcessing(false);
          setStatusMsg({ type: 'info', text: 'Top-up was cancelled.' });
        },
        onError: (err) => {
          setProcessing(false);
          setStatusMsg({ type: 'error', text: err.description || 'Payment could not be completed.' });
        }
      });
    } catch (err) {
      setProcessing(false);
      setStatusMsg({ type: 'error', text: err.message || 'Something went wrong.' });
    }
  };

  return (
    <DashboardLayout role="user">
      <div className="mm-dashboard-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="mm-dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Wallet size={28} color="#4A154B" /> My Wallet &amp; Top-Up
          </h1>
          <p className="mm-dashboard-subtitle">
            Manage your credits for 1-on-1 private Chat, Voice Calls, and Video Calls (VC)
          </p>
        </div>
        <button
          onClick={fetchWalletData}
          className="mm-btn-secondary mm-btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'mm-spin' : ''} /> Refresh
        </button>
      </div>

      {statusMsg.text && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background:
              statusMsg.type === 'success'
                ? '#E8F5E9'
                : statusMsg.type === 'error'
                ? '#FFEBEE'
                : '#FFF8E1',
            color:
              statusMsg.type === 'success'
                ? '#2E7D32'
                : statusMsg.type === 'error'
                ? '#C62828'
                : '#F57F17',
            border: `1px solid ${
              statusMsg.type === 'success'
                ? '#A5D6A7'
                : statusMsg.type === 'error'
                ? '#FFCDD2'
                : '#FFE082'
            }`,
            fontWeight: 600,
            fontSize: '0.92rem'
          }}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Grid: Balance & Recharge on Left, Rates & Rules on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Current Balance Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4A154B 0%, #681A6A 60%, #831843 100%)',
            borderRadius: '24px',
            padding: '28px',
            color: '#FFFFFF',
            boxShadow: '0 12px 30px rgba(74, 21, 75, 0.22)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1, pointerEvents: 'none' }}>
            <Wallet size={180} color="#FFFFFF" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85, fontWeight: 700 }}>
              AVAILABLE BALANCE
            </span>
            <span
              style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Zap size={13} color="#D4AF77" /> Real-time Billing
            </span>
          </div>

          <div style={{ fontSize: '2.8rem', fontWeight: 800, margin: '8px 0 16px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span>₹{balance}</span>
            <span style={{ fontSize: '1rem', fontWeight: 500, opacity: 0.8 }}>INR</span>
          </div>

          <p style={{ fontSize: '0.88rem', opacity: 0.9, lineHeight: 1.5, margin: '0 0 20px', maxWidth: '340px' }}>
            Your balance is automatically deducted as you engage in live chat, voice calls, or video sessions with verified companions.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/user/matches"
              style={{
                background: '#FFFFFF',
                color: '#4A154B',
                fontWeight: 700,
                fontSize: '0.88rem',
                padding: '10px 18px',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <MessageSquare size={15} /> Start Chatting
            </Link>
            <Link
              to="/counselling"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.88rem',
                padding: '10px 18px',
                borderRadius: '12px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(255,255,255,0.25)'
              }}
            >
              <Phone size={15} /> Explore Experts
            </Link>
          </div>
        </div>

        {/* Transparent Session Pricing Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid #F0DCE8',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={20} color="#E91E63" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#4A154B', fontWeight: 800 }}>
              Session Rate Breakdown
            </h3>
          </div>
          <p style={{ margin: '0 0 20px', fontSize: '0.84rem', color: '#665063' }}>
            Zero hidden charges. Wallet credits never expire and are refundable on request.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '14px',
                background: '#FFF8FA',
                border: '1px solid #FFE7EF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FFE7EF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E91E63' }}>
                  <MessageSquare size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#4A154B' }}>Private Text Chat</div>
                  <div style={{ fontSize: '0.75rem', color: '#8E738A' }}>End-to-end encrypted messaging</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#E91E63' }}>₹10</span>
                <span style={{ fontSize: '0.75rem', color: '#8E738A', display: 'block' }}>/ session</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '14px',
                background: '#FFF8FA',
                border: '1px solid #FFE7EF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FFE7EF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E91E63' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#4A154B' }}>Voice Call</div>
                  <div style={{ fontSize: '0.75rem', color: '#8E738A' }}>Direct high-clarity audio call</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#E91E63' }}>₹15</span>
                <span style={{ fontSize: '0.75rem', color: '#8E738A', display: 'block' }}>/ min</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '14px',
                background: '#FFF8FA',
                border: '1px solid #FFE7EF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FFE7EF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E91E63' }}>
                  <Video size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#4A154B' }}>HD Video Call (VC)</div>
                  <div style={{ fontSize: '0.75rem', color: '#8E738A' }}>Secure 1-on-1 face-to-face video</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#E91E63' }}>₹25</span>
                <span style={{ fontSize: '0.75rem', color: '#8E738A', display: 'block' }}>/ min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top-Up Section */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid #F0DCE8',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          marginBottom: '32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <PlusCircle size={22} color="#E91E63" />
          <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#4A154B', fontWeight: 800 }}>
            Recharge Your Wallet
          </h2>
        </div>
        <p style={{ margin: '0 0 24px', fontSize: '0.9rem', color: '#665063' }}>
          Choose a top-up pack or type a custom amount. Instant credit via UPI, QR, Google Pay, PhonePe, Paytm, or Cards.
        </p>

        {/* Preset Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}
        >
          {TOPUP_PRESETS.map((p) => {
            const isSelected = !customAmount && selectedAmount === p.amount;
            return (
              <div
                key={p.amount}
                onClick={() => {
                  setSelectedAmount(p.amount);
                  setCustomAmount('');
                }}
                style={{
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #E91E63' : '1px solid #EADBEC',
                  background: isSelected ? '#FFF1F5' : '#FFFFFF',
                  borderRadius: '18px',
                  padding: '20px',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 8px 20px rgba(233, 30, 99, 0.12)' : 'none'
                }}
              >
                {p.popular && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -10,
                      right: 14,
                      background: 'linear-gradient(135deg, #E91E63, #C2185B)',
                      color: '#FFFFFF',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {p.tag}
                  </span>
                )}
                <div style={{ fontSize: '0.8rem', color: '#8E738A', fontWeight: 600, marginBottom: '6px' }}>
                  {p.label}
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4A154B', marginBottom: '12px' }}>
                  ₹{p.amount}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#665063', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span>✓ {p.chatVal}</span>
                  <span>✓ {p.callVal}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Amount & Pay Button Row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
            padding: '20px',
            background: '#FAF6F9',
            borderRadius: '16px',
            border: '1px solid #F0DCE8'
          }}
        >
          <div style={{ flex: '1 1 240px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#4A154B', marginBottom: '6px' }}>
              Or Enter Custom Amount (₹)
            </label>
            <input
              type="number"
              min="50"
              max="50000"
              placeholder="e.g. 350"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid #D8BDD3',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ flex: '2 1 300px', display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handleTopup}
              disabled={processing || !activeAmount || activeAmount < 50}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                padding: '15px 28px',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: processing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(233, 30, 99, 0.3)',
                opacity: processing || !activeAmount || activeAmount < 50 ? 0.6 : 1
              }}
            >
              <CreditCard size={20} />
              {processing
                ? 'Opening Payment...'
                : `Top-Up ₹${activeAmount || 0} via Razorpay`}
            </button>
          </div>
        </div>

        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#8E738A' }}>
          <ShieldCheck size={16} color="#22C55E" />
          <span>Secured by Razorpay. 100% RBI-compliant payment gateway. Supports UPI QR, PhonePe, GPay, Paytm, and all major Indian cards.</span>
        </div>
      </div>

      {/* Transaction History */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid #F0DCE8',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="#4A154B" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#4A154B', fontWeight: 800 }}>
              Recent Transactions
            </h3>
          </div>
          <span style={{ fontSize: '0.82rem', color: '#8E738A' }}>
            {transactions.length} record{transactions.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="mm-spinner" />
          </div>
        ) : transactions.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 20px',
              color: '#8E738A',
              background: '#FAF6F9',
              borderRadius: '16px'
            }}
          >
            <Wallet size={36} color="#C4B5C6" style={{ margin: '0 auto 12px' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>No wallet transactions yet.</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.84rem' }}>
              Your top-ups and session deductions will show here in real time.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F0DCE8', color: '#8E738A', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Type</th>
                  <th style={{ padding: '12px 14px' }}>Description</th>
                  <th style={{ padding: '12px 14px' }}>Date &amp; Time</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amount</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Balance After</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  const isCredit = t.transaction_type === 'topup' || t.amount_inr > 0;
                  return (
                    <tr key={t.id} style={{ borderBottom: '1px solid #FAF0F5' }}>
                      <td style={{ padding: '14px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: isCredit ? '#E8F5E9' : '#FFF1F5',
                            color: isCredit ? '#2E7D32' : '#C2185B'
                          }}
                        >
                          {isCredit ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                          {isCredit ? 'CREDIT' : 'DEBIT'}
                        </span>
                      </td>
                      <td style={{ padding: '14px', color: '#4A154B', fontWeight: 600 }}>
                        {t.description || (isCredit ? 'Wallet Top-Up' : 'Session Usage')}
                      </td>
                      <td style={{ padding: '14px', color: '#8E738A', fontSize: '0.82rem' }}>
                        {t.created_at ? new Date(t.created_at).toLocaleString() : 'Just now'}
                      </td>
                      <td
                        style={{
                          padding: '14px',
                          textAlign: 'right',
                          fontWeight: 800,
                          color: isCredit ? '#2E7D32' : '#C2185B'
                        }}
                      >
                        {isCredit ? `+₹${Math.abs(t.amount_inr)}` : `-₹${Math.abs(t.amount_inr)}`}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right', color: '#4A154B', fontWeight: 700 }}>
                        ₹{t.balance_after_inr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

