import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star, Phone, Video, MessageSquare, ShieldCheck, CheckCircle2,
  Calendar, Clock, Globe, Heart, ArrowLeft, AlertCircle,
  Sparkles, Check, Lock, Zap, Wallet, CreditCard
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../apiConfig';
import { openRazorpayCheckout } from '../../utils/razorpay';

export default function PartnerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [partner, setPartner] = useState(null);
  const [packages, setPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [instantLoading, setInstantLoading] = useState(false);
  const [topupModalOpen, setTopupModalOpen] = useState(false);
  const [pendingCommType, setPendingCommType] = useState('video');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Booking Form State
  const [selectedCommType, setSelectedCommType] = useState('chat');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 - 10:30 AM');

  useEffect(() => {
    // Fetch Partner details
    fetch(`${API_BASE}/partners/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Partner not found');
        return res.json();
      })
      .then(data => {
        setPartner(data);
        if (data.allows_chat) setSelectedCommType('chat');
        else if (data.allows_audio) setSelectedCommType('audio');
        else if (data.allows_video) setSelectedCommType('video');
      })
      .catch(err => {
        const fallback = fallbackPartners.find(p => String(p.id) === String(id)) || fallbackPartners[0];
        if (fallback) {
          setPartner(fallback);
        } else {
          setErrorMsg('Companion profile could not be loaded.');
        }
      })
      .finally(() => setLoading(false));

    // Fetch conversation packages
    fetch(`${API_BASE}/packages`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setPackages(data);
        if (data.length > 0) setSelectedPackageId(data[0].id);
      })
      .catch(() => {});

    // Fetch reviews
    fetch(`${API_BASE}/partners/${id}/reviews`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setReviews(data))
      .catch(() => {});
  }, [id]);

  const selectedPackage = packages.find(p => p.id === selectedPackageId) || packages[0];
  const calculatedPrice = selectedPackage ? selectedPackage.price : (partner?.hourly_rate || 299);

  const timeSlots = [
    '09:00 - 09:30 AM',
    '10:00 - 10:30 AM',
    '11:30 - 12:00 PM',
    '02:00 - 02:30 PM',
    '04:00 - 04:30 PM',
    '06:00 - 06:30 PM',
    '08:00 - 08:30 PM'
  ];

  const handleStartInstantSession = async (type) => {
    if (!user) {
      navigate(`/login?redirect=/partners/${id}`);
      return;
    }
    if (user.role === 'maanmitra_partner') {
      setErrorMsg('Maanmitra Partners cannot initiate sessions from a partner account.');
      return;
    }

    const rate = type === 'video' ? 25 : type === 'audio' ? 15 : 5;
    const balance = user.wallet_balance_inr || 0;

    if (balance < rate) {
      setPendingCommType(type);
      setTopupModalOpen(true);
      return;
    }

    setInstantLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE}/sessions/instant-start`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          partner_id: partner.id,
          communication_type: type
        })
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 402) {
          setPendingCommType(type);
          setTopupModalOpen(true);
          return;
        }
        throw new Error(err.detail?.message || err.detail || 'Could not start instant session.');
      }

      const session = await res.json();
      navigate(`/session/${session.session_id}?type=${type}`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to start instant session.');
    } finally {
      setInstantLoading(false);
    }
  };

  const handleQuickTopup = async (amount) => {
    try {
      const orderRes = await fetch(`${API_BASE}/user/wallet/create-topup-order`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount_inr: amount })
      });
      if (!orderRes.ok) throw new Error('Order creation failed');
      const orderData = await orderRes.json();

      await openRazorpayCheckout({
        order_id: orderData.order_id,
        amount: orderData.amount,
        name: 'MAANMITRA Wallet Recharge',
        description: `Top-up ₹${amount} for real-time per-minute calling`,
        prefill: {
          name: user?.full_name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        onSuccess: async (rzpRes) => {
          const verifyRes = await fetch(`${API_BASE}/user/wallet/verify-topup`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: rzpRes.razorpay_order_id,
              razorpay_payment_id: rzpRes.razorpay_payment_id,
              razorpay_signature: rzpRes.razorpay_signature,
              amount_inr: amount
            })
          });
          if (verifyRes.ok) {
            const vData = await verifyRes.json();
            setTopupModalOpen(false);
            if (user) {
              user.wallet_balance_inr = vData.wallet_balance_inr;
            }
            // Auto start the pending session now that wallet is funded
            handleStartInstantSession(pendingCommType);
          }
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleBookNow = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!user) {
      // Redirect to login with return path
      navigate(`/login?redirect=/partners/${id}`);
      return;
    }

    if (user.role === 'maanmitra_partner') {
      setErrorMsg('Maanmitra Partners cannot book other companions from a partner account. Please use a Member account.');
      return;
    }

    setBookingLoading(true);

    try {
      // Convert date + slot to ISO scheduled_start
      const hourPart = selectedTimeSlot.split(' ')[0].split(':')[0];
      const isPM = selectedTimeSlot.includes('PM') && parseInt(hourPart, 10) < 12;
      const hour24 = isPM ? parseInt(hourPart, 10) + 12 : parseInt(hourPart, 10);
      const scheduledDateTime = new Date(`${bookingDate}T${String(hour24).padStart(2, '0')}:00:00Z`).toISOString();

      // 1. Create booking in backend
      const bookingPayload = {
        partner_id: partner.id,
        package_id: selectedPackage ? selectedPackage.id : null,
        scheduled_start: scheduledDateTime,
        duration_minutes: selectedPackage ? selectedPackage.duration_minutes : 30,
        communication_type: selectedCommType,
        user_notes: `Scheduled session via web portal`
      };

      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Could not complete booking.');
      }

      const bookingData = await res.json();

      // 2. Create Razorpay Payment Order
      const orderRes = await fetch(`${API_BASE}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ booking_id: bookingData.id })
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.detail || 'Payment initiation failed.');
      }

      const orderData = await orderRes.json();

      // 3. Process payment via Razorpay Standard Checkout
      await openRazorpayCheckout({
        key: orderData.key_id,
        order_id: orderData.order_id,
        amount: orderData.amount, // amount in paise
        currency: orderData.currency || 'INR',
        name: 'MAANMITRA',
        description: `Session Booking with ${partner.display_name}`,
        prefill: {
          name: user.full_name || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        onSuccess: async (rzpResponse) => {
          setBookingLoading(true);
          try {
            const verifyRes = await fetch(`${API_BASE}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                booking_id: bookingData.id,
                razorpay_order_id: rzpResponse.razorpay_order_id,
                razorpay_payment_id: rzpResponse.razorpay_payment_id,
                razorpay_signature: rzpResponse.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              setSuccessMsg('Payment Successful & Booking Confirmed! Redirecting to your dashboard...');
              setTimeout(() => navigate('/user/bookings'), 1500);
            } else {
              setErrorMsg(verifyData.detail || 'Payment verification failed. Please contact support.');
            }
          } catch (vErr) {
            setErrorMsg('Network error verifying payment. Please check your bookings page.');
          } finally {
            setBookingLoading(false);
          }
        },
        onDismiss: async () => {
          setBookingLoading(false);
          setErrorMsg('Payment cancelled. Your booking was not completed.');
          try {
            await fetch(`${API_BASE}/payments/mark-failed`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ booking_id: bookingData.id, reason: 'cancelled_by_user' })
            });
          } catch (_) {}
        },
        onError: async (payErr) => {
          setBookingLoading(false);
          setErrorMsg(payErr?.description || 'Payment failed. Please try with another payment method.');
          try {
            await fetch(`${API_BASE}/payments/mark-failed`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ booking_id: bookingData.id, reason: payErr?.description || 'gateway_failure' })
            });
          } catch (_) {}
        }
      });

    } catch (err) {
      setErrorMsg(err.message || 'Booking process failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mm-page-wrapper">
        <PublicNavbar />
        <div className="mm-loading-state" style={{ minHeight: '60vh' }}>
          <div className="mm-spinner"></div>
          <p>Loading companion profile...</p>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="mm-page-wrapper">
        <PublicNavbar />
        <div className="mm-empty-state" style={{ minHeight: '60vh' }}>
          <AlertCircle size={48} color="var(--mm-error)" />
          <h2>Companion Not Found</h2>
          <p>The companion profile you are looking for is inactive or does not exist.</p>
          <Link to="/explore" className="mm-btn-primary">Browse Other Partners</Link>
        </div>
        <PublicFooter />
      </div>
    );
  }

  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />

      <div className="mm-container" style={{ padding: '30px 16px 80px' }}>
        {/* Back Link */}
        <Link to="/explore" className="mm-back-link">
          <ArrowLeft size={16} /> Back to All Companions
        </Link>

        {errorMsg && (
          <div className="mm-alert mm-alert-error" style={{ marginBottom: '20px' }}>
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mm-alert mm-alert-success" style={{ marginBottom: '20px' }}>
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        <div className="mm-profile-layout">
          {/* LEFT COLUMN: Profile Details */}
          <div className="mm-profile-main">
            {/* Header Card */}
            <div className="mm-profile-header-card">
              <div className="mm-profile-hero-row">
                <div className="mm-profile-avatar-wrap">
                  <img
                    src={partner.profile_photo_url || partner.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'}
                    alt={partner.display_name}
                    className="mm-profile-avatar-img"
                  />
                  <span className={`mm-status-badge ${partner.availability_status === 'online' || partner.is_online ? 'online' : 'offline'}`}>
                    {partner.availability_status === 'online' || partner.is_online ? 'Online' : 'Offline'}
                  </span>
                </div>

                <div className="mm-profile-hero-info">
                  <div className="mm-profile-name-row">
                    <h1 className="mm-profile-name">{partner.display_name}</h1>
                    <span className="mm-verified-tag">
                      <CheckCircle2 size={16} /> Verified Partner
                    </span>
                  </div>

                  <p className="mm-profile-headline">
                    Empathetic conversational companion & active listener
                  </p>

                  <div className="mm-profile-meta-row">
                    <div className="mm-meta-item">
                      <Star size={16} color="#F59E0B" fill="#F59E0B" />
                      <strong>{partner.rating_average || partner.rating || '4.9'}</strong>
                      <span>({partner.review_count || partner.total_reviews || 28} reviews)</span>
                    </div>
                    <div className="mm-meta-item">
                      <Globe size={16} color="var(--mm-secondary-text)" />
                      <span>{Array.isArray(partner.languages) ? partner.languages.join(', ') : (partner.languages || 'Hindi, English')}</span>
                    </div>
                  </div>

                  {/* Mode Badges */}
                  <div className="mm-profile-modes">
                    {(partner.allows_chat !== false) && <span className="mm-mode-pill"><MessageSquare size={14} /> Text Chat</span>}
                    {(partner.allows_audio !== false) && <span className="mm-mode-pill"><Phone size={14} /> Voice Call</span>}
                    {(partner.allows_video !== false) && <span className="mm-mode-pill"><Video size={14} /> Video Call</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* About & Approach */}
            <div className="mm-card mm-profile-section">
              <h2 className="mm-section-title">About Me</h2>
              <p className="mm-profile-bio-text">
                {partner.bio || "Hello! I love making people feel heard, appreciated, and at ease. Whether you want to talk about how your day went, discuss books, share funny thoughts, or simply need someone attentive who listens without judgment, I am here for you."}
              </p>

              {/* Disclaimer */}
              <div className="mm-companion-notice">
                <ShieldCheck size={18} color="var(--mm-plum)" />
                <div>
                  <strong>Friendly Companionship Service:</strong> Maanmitra Partners provide active listening, warm conversations, and social companionship. They do not provide psychiatric diagnosis, therapy, or medical advice.
                </div>
              </div>
            </div>

            {/* Topics I Love Chatting About */}
            <div className="mm-card mm-profile-section">
              <h2 className="mm-section-title">Topics We Can Chat About</h2>
              <div className="mm-topics-tags">
                <span className="mm-topic-tag"> Daily Life & Thoughts</span>
                <span className="mm-topic-tag"> Books & Poetry</span>
                <span className="mm-topic-tag"> Movies & Web Series</span>
                <span className="mm-topic-tag"> Travel & Culture</span>
                <span className="mm-topic-tag"> Work Routine & Motivation</span>
                <span className="mm-topic-tag"> Self-care & Mindfulness</span>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mm-card mm-profile-section">
              <div className="mm-section-header-row">
                <h2 className="mm-section-title">Conversation Reviews</h2>
                <span className="mm-reviews-rating">
                  <Star size={16} color="#F59E0B" fill="#F59E0B" /> {partner.rating ? partner.rating.toFixed(1) : '4.9'} / 5.0
                </span>
              </div>

              {reviews.length === 0 ? (
                <div className="mm-empty-reviews">
                  <Heart size={32} color="var(--mm-rose)" />
                  <p><strong>"Wonderfully warm and comforting experience!"</strong></p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--mm-secondary-text)' }}>
                    - Verified member (100% confidential feedback)
                  </p>
                </div>
              ) : (
                <div className="mm-reviews-list">
                  {reviews.map(rev => (
                    <div key={rev.id} className="mm-review-item">
                      <div className="mm-review-top">
                        <strong>Verified Member</strong>
                        <div className="mm-stars-row">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} size={14} color="#F59E0B" fill="#F59E0B" />
                          ))}
                        </div>
                      </div>
                      <p className="mm-review-comment">{rev.comment}</p>
                      <span className="mm-review-date">{new Date(rev.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Booking Widget */}
          <div className="mm-profile-sidebar">

            {/* Instant Real-Time Session (Per-Minute Model) */}
            <div
              style={{
                background: 'linear-gradient(135deg, #4A154B 0%, #681A6A 100%)',
                borderRadius: '20px',
                padding: '24px',
                color: '#FFFFFF',
                marginBottom: '20px',
                boxShadow: '0 8px 24px rgba(74, 21, 75, 0.22)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Zap size={18} color="#D4AF77" />
                <span style={{ fontSize: '0.74rem', letterSpacing: '0.08em', fontWeight: 800, textTransform: 'uppercase', color: '#D4AF77' }}>
                  INSTANT CONNECT • PAY PER MINUTE
                </span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 800 }}>
                Talk with {partner.display_name} Now
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '0.84rem', opacity: 0.88, lineHeight: 1.45 }}>
                Connect live right now without advance booking. Direct real-time per-minute billing from your wallet.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
                {partner.allows_chat && (
                  <button
                    type="button"
                    onClick={() => handleStartInstantSession('chat')}
                    disabled={instantLoading}
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      borderRadius: '12px',
                      padding: '12px 8px',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <MessageSquare size={18} color="#D4AF77" style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>Live Chat</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>₹5 / min</div>
                  </button>
                )}
                {partner.allows_audio && (
                  <button
                    type="button"
                    onClick={() => handleStartInstantSession('audio')}
                    disabled={instantLoading}
                    style={{
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      borderRadius: '12px',
                      padding: '12px 8px',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <Phone size={18} color="#22C55E" style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>Voice Call</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>₹15 / min</div>
                  </button>
                )}
                {partner.allows_video && (
                  <button
                    type="button"
                    onClick={() => handleStartInstantSession('video')}
                    disabled={instantLoading}
                    style={{
                      background: 'linear-gradient(135deg, #E91E63, #C2185B)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 8px',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(233, 30, 99, 0.4)'
                    }}
                  >
                    <Video size={18} color="#FFFFFF" style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontWeight: 800, fontSize: '0.84rem' }}>Video Call</div>
                    <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>₹25 / min</div>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Top-up Modal */}
            {topupModalOpen && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(6px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  padding: '16px'
                }}
              >
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '28px',
                    maxWidth: '420px',
                    width: '100%',
                    color: '#4A154B',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Wallet size={22} color="#E91E63" />
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Top-Up Wallet</h3>
                    </div>
                    <button
                      onClick={() => setTopupModalOpen(false)}
                      style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#8E738A' }}
                    >
                      &times;
                    </button>
                  </div>
                  <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: '#665063', lineHeight: 1.5 }}>
                    Your current wallet balance is <strong>₹{user?.wallet_balance_inr || 0}</strong>.
                    Starting a {pendingCommType} call requires at least ₹{pendingCommType === 'video' ? 25 : pendingCommType === 'audio' ? 15 : 5}.
                    Choose a quick top-up pack to proceed immediately:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
                    {[100, 250, 500].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleQuickTopup(amt)}
                        style={{
                          padding: '12px 8px',
                          borderRadius: '12px',
                          border: '1.5px solid #E91E63',
                          background: '#FFF1F5',
                          fontWeight: 800,
                          color: '#4A154B',
                          fontSize: '1rem',
                          cursor: 'pointer'
                        }}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#8E738A' }}>
                    Secured by Razorpay • UPI QR / GPay / PhonePe / Cards
                  </div>
                </div>
              </div>
            )}

            <div className="mm-booking-widget-card">
              <div className="mm-widget-header">
                <h3>Book a Friendly Conversation</h3>
                <span className="mm-widget-rate">
                  ₹{calculatedPrice} <small>/ session</small>
                </span>
              </div>

              <form onSubmit={handleBookNow} className="mm-booking-form">
                {/* 1. Comm Format */}
                <div className="mm-form-group">
                  <label className="mm-form-label">1. Choose Communication Mode</label>
                  <div className="mm-mode-selector-grid">
                    {partner.allows_chat && (
                      <button
                        type="button"
                        onClick={() => setSelectedCommType('chat')}
                        className={`mm-mode-opt-btn ${selectedCommType === 'chat' ? 'active' : ''}`}
                      >
                        <MessageSquare size={16} />
                        <span>Chat</span>
                      </button>
                    )}
                    {partner.allows_audio && (
                      <button
                        type="button"
                        onClick={() => setSelectedCommType('audio')}
                        className={`mm-mode-opt-btn ${selectedCommType === 'audio' ? 'active' : ''}`}
                      >
                        <Phone size={16} />
                        <span>Voice</span>
                      </button>
                    )}
                    {partner.allows_video && (
                      <button
                        type="button"
                        onClick={() => setSelectedCommType('video')}
                        className={`mm-mode-opt-btn ${selectedCommType === 'video' ? 'active' : ''}`}
                      >
                        <Video size={16} />
                        <span>Video</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Package Selector */}
                <div className="mm-form-group">
                  <label className="mm-form-label">2. Select Session Duration</label>
                  <select
                    value={selectedPackageId}
                    onChange={(e) => setSelectedPackageId(e.target.value)}
                    className="mm-select"
                  >
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} ({pkg.duration_minutes} mins) -- ₹{pkg.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Date Selection */}
                <div className="mm-form-group">
                  <label className="mm-form-label">
                    <Calendar size={14} /> 3. Select Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="mm-input"
                    required
                  />
                </div>

                {/* 4. Slot Selection */}
                <div className="mm-form-group">
                  <label className="mm-form-label">
                    <Clock size={14} /> 4. Select Time Slot
                  </label>
                  <div className="mm-slots-grid">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`mm-slot-btn ${selectedTimeSlot === slot ? 'active' : ''}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="mm-price-summary-box">
                  <div className="mm-summary-row">
                    <span>Session Fee ({selectedPackage?.duration_minutes || 30} mins)</span>
                    <span>₹{calculatedPrice}</span>
                  </div>
                  <div className="mm-summary-row">
                    <span>GST (18% included)</span>
                    <span>₹{Math.round(calculatedPrice * 0.18)}</span>
                  </div>
                  <div className="mm-summary-total">
                    <strong>Total Amount Payable</strong>
                    <strong>₹{calculatedPrice}</strong>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="mm-btn-primary mm-btn-block mm-btn-lg"
                >
                  {bookingLoading ? (
                    'Securing Your Slot...'
                  ) : (
                    <>
                      <Lock size={16} /> Confirm & Pay Securely
                    </>
                  )}
                </button>

                <p className="mm-secure-badge">
                  <ShieldCheck size={14} color="var(--mm-success)" /> 100% Private & Encrypted Payments via Razorpay
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}


const fallbackPartners = [
  {
    id: 1,
    display_name: 'Priya S.',
    profile_photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=85',
    languages: ['Hindi', 'English'],
    rating_average: 4.8,
    review_count: 236,
    bio: 'Warm, empathetic listener. Ready to chat about your day, dreams, or anything on your mind with zero judgment.',
    hourly_rate: 299,
    rate_chat_15m: 99,
    rate_audio_30m: 299,
    rate_video_30m: 499,
    allows_chat: true,
    allows_audio: true,
    allows_video: true,
    availability_status: 'online'
  },
  {
    id: 2,
    display_name: 'Ananya R.',
    profile_photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85',
    languages: ['Marathi', 'Hindi'],
    rating_average: 4.9,
    review_count: 184,
    bio: 'Friendly companion who loves heartfelt conversations, storytelling, and sharing positive daily energy.',
    hourly_rate: 299,
    rate_chat_15m: 99,
    rate_audio_30m: 299,
    rate_video_30m: 499,
    allows_chat: true,
    allows_audio: true,
    allows_video: true,
    availability_status: 'online'
  },
  {
    id: 3,
    display_name: 'Neha K.',
    profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85',
    languages: ['English', 'Hindi'],
    rating_average: 4.7,
    review_count: 98,
    bio: 'Patient listener and cheerful spirit. Passionate about art, books, and creating a calm space for you.',
    hourly_rate: 299,
    rate_chat_15m: 99,
    rate_audio_30m: 299,
    rate_video_30m: 499,
    allows_chat: true,
    allows_audio: true,
    allows_video: true,
    availability_status: 'online'
  },
  {
    id: 4,
    display_name: 'Sana M.',
    profile_photo_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=85',
    languages: ['Hindi', 'Urdu'],
    rating_average: 4.8,
    review_count: 142,
    bio: 'Gentle, attentive listener here whenever you need a supportive ear after a long or hectic workday.',
    hourly_rate: 299,
    rate_chat_15m: 99,
    rate_audio_30m: 299,
    rate_video_30m: 499,
    allows_chat: true,
    allows_audio: true,
    allows_video: true,
    availability_status: 'online'
  }
];
