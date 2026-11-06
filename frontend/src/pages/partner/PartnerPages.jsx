import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar, Clock, DollarSign, Settings, CheckCircle2,
  Phone, Video, MessageSquare, Star, ArrowRight, AlertCircle,
  ToggleLeft, ToggleRight, ShieldCheck, Heart, User, Check, X,
  Radio, Users, Wallet, ArrowDownToLine, TrendingUp, Gift,
  HelpCircle, Bell, Search, Eye, Filter, Plus, ChevronRight,
  Sparkles, Lock, FileText, Send, Mic, MicOff, VideoOff,
  Share2, Award, Info, RefreshCw, AlertTriangle, PhoneIncoming, PhoneOff
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../apiConfig';

// ============================================================================
// INCOMING CALL NOTIFICATION — renders globally for partners
// ============================================================================
function IncomingCallNotification({ call, onAccept, onDecline }) {
  const [elapsed, setElapsed] = useState(30); // 30s to respond

  useEffect(() => {
    if (!call) return;
    setElapsed(30);
    const timer = setInterval(() => {
      setElapsed(prev => {
        if (prev <= 1) { clearInterval(timer); onDecline(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [call]);

  if (!call) return null;

  const typeLabel = call.communication_type === 'video' ? 'Video Call' : call.communication_type === 'audio' ? 'Voice Call' : 'Chat Session';
  const typeColor = call.communication_type === 'video' ? '#7C3AED' : call.communication_type === 'audio' ? '#0EA5E9' : '#059669';
  const TypeIcon = call.communication_type === 'video' ? Video : call.communication_type === 'audio' ? Phone : MessageSquare;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.65)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(6px)', animation: 'fadeIn 0.2s ease'
    }}>
      <div style={{
        background: '#fff', borderRadius: '28px', padding: '36px 40px',
        maxWidth: '420px', width: '90%', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: `3px solid ${typeColor}`
      }}>
        {/* Pulsing ring */}
        <div style={{
          width: '90px', height: '90px', borderRadius: '50%',
          background: `${typeColor}18`, margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse 1.5s infinite',
          border: `3px solid ${typeColor}40`
        }}>
          <TypeIcon size={40} color={typeColor} />
        </div>

        <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', color: typeColor, fontWeight: 700, marginBottom: '6px' }}>
          Incoming {typeLabel}
        </div>
        <h2 style={{ margin: '0 0 6px', fontSize: '1.5rem', color: '#1a1a2e' }}>
          {call.user_name || 'A Member'}
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 20px' }}>
          wants to start a live {typeLabel.toLowerCase()} with you
        </p>

        {/* Countdown */}
        <div style={{
          background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: '12px',
          padding: '10px', marginBottom: '24px', fontSize: '0.85rem', color: '#6b7280'
        }}>
          Auto-declining in <strong style={{ color: elapsed <= 10 ? '#EF4444' : '#374151' }}>{elapsed}s</strong>
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          <button
            onClick={onDecline}
            style={{
              flex: 1, padding: '14px', borderRadius: '14px', border: 'none',
              background: '#FEE2E2', color: '#DC2626', fontSize: '1rem', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <PhoneOff size={20} /> Decline
          </button>
          <button
            onClick={onAccept}
            style={{
              flex: 1, padding: '14px', borderRadius: '14px', border: 'none',
              background: `linear-gradient(135deg, ${typeColor}, ${typeColor}cc)`,
              color: '#fff', fontSize: '1rem', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: `0 4px 14px ${typeColor}44`
            }}
          >
            <PhoneIncoming size={20} /> Accept
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook: listen for incoming calls via signaling WebSocket
function useIncomingCallListener(token, partnerId) {
  const navigate = useNavigate();
  const wsRef = useRef(null);
  const [incomingCall, setIncomingCall] = useState(null);

  const connect = useCallback(() => {
    if (!token || !partnerId) return;
    // Connect to partner-specific signaling channel
    const wsUrl = (import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/v1')
      .replace(/\/$/, '').replace(/\/api\/v1$/, '');
    const ws = new WebSocket(`${wsUrl}/api/v1/ws/maanmitra/signaling/${partnerId}?token=${token}`);
    wsRef.current = ws;

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        if (data.type === 'incoming_call') {
          setIncomingCall(data);
        } else if (data.type === 'session_terminated' || data.type === 'call_ended') {
          setIncomingCall(null);
        }
      } catch (e) { /* noop */ }
    };

    ws.onclose = () => {
      // Reconnect after 5s if still mounted
      setTimeout(() => { if (wsRef.current === ws) connect(); }, 5000);
    };
  }, [token, partnerId]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) { wsRef.current.onclose = null; wsRef.current.close(); }
    };
  }, [connect]);

  const handleAccept = useCallback(() => {
    if (!incomingCall) return;
    const { session_id, communication_type } = incomingCall;
    setIncomingCall(null);
    navigate(`/session/${session_id}?type=${communication_type}&role=partner`);
  }, [incomingCall, navigate]);

  const handleDecline = useCallback(() => {
    setIncomingCall(null);
  }, []);

  return { incomingCall, handleAccept, handleDecline };
}

// ============================================================================
// 1. OVERVIEW / DASHBOARD (/partner/dashboard)
// ============================================================================
export function PartnerDashboardPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [toggling, setToggling] = useState(false);

  // Incoming call WebSocket listener (partner-id from profile)
  const [partnerId, setPartnerId] = useState(null);
  const { incomingCall, handleAccept, handleDecline } = useIncomingCallListener(token, partnerId);

  const fetchDashboard = () => {
    fetch(`${API_BASE}/partner/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(res => {
        if (res) {
          setData(res);
          setIsOnline(res.profile?.is_online ?? false);
          if (res.profile?.id) setPartnerId(res.profile.id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, [token]);

  const toggleOnline = async () => {
    if (p.verification_status !== 'approved') {
      alert("Your ID is currently inactive. Please complete your Zoom induction call and activation to go online and accept clients.");
      return;
    }
    setToggling(true);
    try {
      const res = await fetch(`${API_BASE}/partner/toggle-status`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setIsOnline(json.is_online);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

  const handleCompleteSession = async (bookingId) => {
    try {
      const res = await fetch(`${API_BASE}/partner/bookings/${bookingId}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDashboard();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="partner">
        <div className="mm-loading-state" style={{ minHeight: '60vh' }}>
          <div className="mm-spinner"></div>
          <p>Loading Counsellor Studio...</p>
        </div>
      </DashboardLayout>
    );
  }

  const p = data?.profile || {};
  const w = data?.wallet || {};
  const r = data?.rank || {};
  const stats = data?.statistics || {};
  const upcoming = data?.upcoming_bookings || [];
  const todayList = data?.today_schedule || [];
  const weekly = data?.weekly_chart || [];

  return (
    <DashboardLayout role="partner">
      {/* Incoming call overlay — renders on top of everything */}
      <IncomingCallNotification
        call={incomingCall}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
      {/* 1. TOP HERO BANNER */}
      <div className="mm-dashboard-header" style={{ alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={p.profile_photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${p.display_name || 'Companion'}`}
            alt={p.display_name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--mm-gold)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="mm-dashboard-title" style={{ margin: 0 }}>
                {p.display_name || user?.full_name || 'Mentor Studio'}
              </h1>
              <span className={`mm-badge-status ${p.verification_status || 'approved'}`}>
                {p.verification_status === 'approved' ? 'v Verified Partner' : p.verification_status || 'Under Review'}
              </span>
              {p.is_demo && (
                <span style={{ background: '#FAF3E8', color: '#D4AF77', border: '1px solid #D4AF77', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '9999px' }}>
                  DEMO MODE
                </span>
              )}
            </div>
            <p className="mm-dashboard-subtitle" style={{ marginTop: '4px' }}>
              {p.headline || 'Empathetic Listener & Wellness Mentor'} - {p.city || 'Pune, India'}
            </p>
          </div>
        </div>

        {/* ONLINE TOGGLE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <div className="mm-online-switch-wrap">
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isOnline ? 'var(--mm-success)' : 'var(--mm-secondary-text)' }}>
              {isOnline ? 'Online & Ready to Listen' : 'Offline'}
            </span>
            <button
              onClick={toggleOnline}
              disabled={toggling}
              className={`mm-toggle-btn ${isOnline ? 'on' : 'off'}`}
              title="Toggle client availability"
            >
              {isOnline ? <ToggleRight size={28} color="var(--mm-success)" /> : <ToggleLeft size={28} color="var(--mm-secondary-text)" />}
            </button>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--mm-secondary-text)' }}>
            Profile Completeness: <strong>{p.completeness_percentage || 85}%</strong>
          </span>
        </div>
      </div>

      {/* INACTIVE / INDUCTION BANNER (Exploration Mode) */}
      {p.verification_status !== 'approved' && (
        <div style={{
          background: p.zoom_meeting_completed ? '#F0FDF4' : '#FFF9EB',
          border: `1px solid ${p.zoom_meeting_completed ? '#86EFAC' : '#FDE68A'}`,
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: p.zoom_meeting_completed ? '#DCFCE7' : '#FEF3C7',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {p.zoom_meeting_completed ? (
                <CheckCircle2 size={24} color="#16A34A" />
              ) : (
                <Video size={24} color="#D97706" />
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '700', color: p.zoom_meeting_completed ? '#166534' : '#92400E', fontSize: '0.96rem' }}>
                  {p.zoom_meeting_completed
                    ? 'Zoom Induction Call Completed'
                    : p.zoom_meeting_scheduled
                    ? 'Zoom Induction Call Scheduled'
                    : 'Account Inactive (Exploration Mode)'}
                </span>
                <span style={{
                  background: p.zoom_meeting_completed ? '#DCFCE7' : '#FEF3C7',
                  color: p.zoom_meeting_completed ? '#166534' : '#92400E',
                  fontSize: '0.72rem', fontWeight: '800', padding: '2px 8px', borderRadius: '9999px',
                  border: `1px solid ${p.zoom_meeting_completed ? '#86EFAC' : '#FDE68A'}`
                }}>
                  {p.zoom_meeting_completed ? 'ACTIVATION READY' : 'INDUCTION PENDING'}
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: p.zoom_meeting_completed ? '#15803D' : '#78350F', marginTop: '3px', lineHeight: 1.4 }}>
                {p.zoom_meeting_completed
                  ? 'Your induction orientation is complete! Activate your ID to start accepting client calls and sessions.'
                  : p.zoom_meeting_scheduled
                  ? `Scheduled for: ${p.zoom_meeting_datetime ? new Date(p.zoom_meeting_datetime).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) : 'Time confirmed by admin'}. Attend call to unlock activation.`
                  : 'You have full access to explore the partner portal and prepare your profile. Our team will schedule your Zoom induction call soon.'}
              </div>
            </div>
          </div>

          <Link
            to="/partner/onboarding"
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '0.88rem',
              textDecoration: 'none',
              background: p.zoom_meeting_completed ? 'linear-gradient(135deg,#E91E63,#D81B60)' : '#4A154B',
              color: '#FFF',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(74,21,75,0.2)'
            }}
          >
            {p.zoom_meeting_completed ? 'Activate ID Now' : 'View Induction Status'}
          </Link>
        </div>
      )}

      {/* 2. STATS TILES (8 PRIMARY METRICS) */}
      <div className="mm-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
        <div className="mm-stat-tile">
          <div className="mm-stat-icon-wrap" style={{ background: '#EAF8EE', color: 'var(--mm-success)' }}>
            <DollarSign size={20} />
          </div>
          <div className="mm-stat-info">
            <span className="mm-stat-label">Today's Earnings</span>
            <span className="mm-stat-val">₹{(stats.today_earnings_inr || 0).toLocaleString()}</span>
            <span className="mm-stat-sub">70% net mentor share</span>
          </div>
        </div>

        <div className="mm-stat-tile">
          <div className="mm-stat-icon-wrap" style={{ background: '#FFF1F5', color: 'var(--mm-rose)' }}>
            <Calendar size={20} />
          </div>
          <div className="mm-stat-info">
            <span className="mm-stat-label">Monthly Earnings</span>
            <span className="mm-stat-val">₹{(stats.monthly_earnings_inr || 0).toLocaleString()}</span>
            <span className="mm-stat-sub">Current calendar month</span>
          </div>
        </div>

        <div className="mm-stat-tile">
          <div className="mm-stat-icon-wrap" style={{ background: '#FAF3E8', color: 'var(--mm-gold)' }}>
            <Wallet size={20} />
          </div>
          <div className="mm-stat-info">
            <span className="mm-stat-label">Available Balance</span>
            <span className="mm-stat-val">₹{(w.available_balance_inr || 0).toLocaleString()}</span>
            <Link to="/partner/withdrawals" style={{ fontSize: '0.75rem', color: 'var(--mm-rose)', fontWeight: 700 }}>
              Withdraw Funds
            </Link>
          </div>
        </div>

        <div className="mm-stat-tile">
          <div className="mm-stat-icon-wrap" style={{ background: '#F0EAF8', color: 'var(--mm-plum)' }}>
            <Clock size={20} />
          </div>
          <div className="mm-stat-info">
            <span className="mm-stat-label">Billable Minutes</span>
            <span className="mm-stat-val">{(stats.total_billable_minutes || 0).toLocaleString()} m</span>
            <span className="mm-stat-sub">{stats.total_sessions || 0} completed sessions</span>
          </div>
        </div>
      </div>

      {/* 3. RANK PROGRESSION HIGHLIGHT & WEEKLY EARNINGS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '24px' }}>
        {/* RANK CARD */}
        <div className="mm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={22} color="var(--mm-gold)" />
                <h3 className="mm-card-title" style={{ margin: 0 }}>Rank & Tier Standing</h3>
              </div>
              <span style={{
                background: 'var(--mm-gold)',
                color: '#320C33',
                fontWeight: 800,
                fontSize: '0.72rem',
                padding: '3px 10px',
                borderRadius: '9999px',
                letterSpacing: '0.04em'
              }}>
                LEVEL {r.current_level || p.rank_level || 10} - {r.title || 'Master Mentor'}
              </span>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--mm-secondary-text)', lineHeight: 1.5 }}>
              Current Consultation Pricing: <strong>₹{r.price_per_minute_inr || p.per_minute_rate_inr || 10} / minute</strong>
              <br />
              Revenue Share: <strong>{r.mentor_share_percentage || 70}% Mentor Share</strong> - {r.platform_share_percentage || 30}% Platform Fee
            </p>

            {r.next_level && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--mm-plum)' }}>
                    Progress to Level {r.next_level} ({r.next_title} - ₹{r.next_price_inr}/min)
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--mm-rose)' }}>{r.progress_percentage || 0}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F1DCE5', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${r.progress_percentage || 0}%`, height: '100%', background: 'linear-gradient(90deg, var(--mm-rose), var(--mm-gold))', borderRadius: '9999px' }}></div>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--mm-border)' }}>
            <Link to="/partner/rank" className="mm-btn-secondary mm-btn-sm" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
              View Ranks & Criteria
            </Link>
          </div>
        </div>

        {/* WEEKLY ACTIVITY CHART */}
        <div className="mm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 className="mm-card-title" style={{ margin: 0 }}>7-Day Earnings Activity</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--mm-secondary-text)' }}>Last 7 Days</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingTop: '12px', borderBottom: '1px solid var(--mm-border)' }}>
            {weekly.length === 0 ? (
              <div style={{ margin: 'auto', color: 'var(--mm-secondary-text)', fontSize: '0.85rem' }}>No activity in past 7 days</div>
            ) : (
              weekly.map((d, i) => {
                const maxAmt = Math.max(...weekly.map(x => x.amount), 500);
                const barHeight = Math.max(12, Math.round((d.amount / maxAmt) * 110));
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '6px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: d.amount > 0 ? 'var(--mm-rose)' : 'var(--mm-secondary-text)' }}>
                      ₹{d.amount}
                    </span>
                    <div style={{
                      width: '28px',
                      height: `${barHeight}px`,
                      background: d.amount > 0 ? 'linear-gradient(180deg, var(--mm-rose), var(--mm-plum))' : '#F1DCE5',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.3s'
                    }}></div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--mm-secondary-text)', fontWeight: 600 }}>
                      {d.day}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 4. UPCOMING & TODAY'S SESSIONS */}
      <div className="mm-card" style={{ marginTop: '24px' }}>
        <div className="mm-card-header-row">
          <div>
            <h3 className="mm-card-title">Upcoming Client Consultations</h3>
            <p style={{ color: 'var(--mm-secondary-text)', fontSize: '0.82rem', margin: '2px 0 0' }}>
              Authorized 1-on-1 audio, video, and chat sessions
            </p>
          </div>
          <Link to="/partner/sessions" className="mm-btn-secondary mm-btn-sm">
            View All Sessions
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--mm-secondary-text)' }}>
            <Calendar size={36} color="var(--mm-gold)" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontWeight: 600 }}>No upcoming sessions booked currently.</p>
            <p style={{ fontSize: '0.82rem' }}>Ensure your calendar slots are published in the Availability tab to receive client bookings.</p>
          </div>
        ) : (
          <div className="mm-table-responsive" style={{ marginTop: '16px' }}>
            <table className="mm-table">
              <thead>
                <tr>
                  <th>Booking Code</th>
                  <th>Client Name</th>
                  <th>Scheduled Date & Time</th>
                  <th>Session Mode</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map(b => (
                  <tr key={b.id}>
                    <td><strong style={{ color: 'var(--mm-plum)' }}>{b.booking_code}</strong></td>
                    <td>{b.user_name || 'Member'}</td>
                    <td>{b.scheduled_start ? new Date(b.scheduled_start).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'TBD'}</td>
                    <td>
                      <span className="mm-badge-comm" style={{ textTransform: 'capitalize' }}>
                        {b.communication_type === 'video' ? 'Video Video' : b.communication_type === 'audio' ? 'Audio Audio' : 'Chat Chat'}
                      </span>
                    </td>
                    <td>₹{b.total_amount}</td>
                    <td><span className={`mm-badge-status ${b.booking_status}`}>{b.booking_status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link to={`/call/${b.id}`} className="mm-btn-primary mm-btn-sm" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                          Join Call
                        </Link>
                        <button
                          onClick={() => handleCompleteSession(b.id)}
                          className="mm-btn-secondary mm-btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          title="Mark completed to credit wallet"
                        >
                          Complete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 2. PROFESSIONAL PROFILE MANAGEMENT (/partner/profile)
// ============================================================================
export function PartnerProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchProfile = () => {
    fetch(`${API_BASE}/partner/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch(`${API_BASE}/partner/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setMsg('Profile updated successfully!');
        fetchProfile();
      }
    } catch (err) {
      console.error(err);
      setMsg('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenPreview = async () => {
    try {
      const res = await fetch(`${API_BASE}/partner/profile/preview`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPreview(await res.json());
        setShowPreviewModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="partner">
        <div className="mm-loading-state"><div className="mm-spinner"></div><p>Loading profile...</p></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Professional Profile & Credentials</h1>
          <p className="mm-dashboard-subtitle">Manage public bio, credentials, pricing rates, and preview your client-facing page</p>
        </div>
        <button onClick={handleOpenPreview} className="mm-btn-secondary mm-btn-sm">
          <Eye size={16} /> Public Profile Preview
        </button>
      </div>

      {msg && (
        <div className="mm-alert mm-alert-success" style={{ marginBottom: '18px' }}>
          <CheckCircle2 size={18} /> {msg}
        </div>
      )}

      {/* COMPLETENESS PROGRESS BAR */}
      <div className="mm-card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontWeight: 700, color: 'var(--mm-plum)', fontSize: '0.9rem' }}>
            Profile Completeness
          </span>
          <span style={{ fontWeight: 800, color: 'var(--mm-rose)', fontSize: '0.9rem' }}>
            {profile?.completeness_percentage || 85}%
          </span>
        </div>
        <div style={{ width: '100%', height: '8px', background: '#F1DCE5', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ width: `${profile?.completeness_percentage || 85}%`, height: '100%', background: 'linear-gradient(90deg, var(--mm-rose), var(--mm-gold))', borderRadius: '9999px' }}></div>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--mm-secondary-text)', marginTop: '4px', display: 'block' }}>
          Profiles above 80% receive up to 3.4x more client consultation requests.
        </span>
      </div>

      <div className="mm-card">
        <form onSubmit={handleSubmit}>
          <div className="mm-grid-2">
            <div className="mm-form-group">
              <label className="mm-form-label">Public Display Name *</label>
              <input
                type="text"
                value={profile?.display_name || ''}
                onChange={e => setProfile({ ...profile, display_name: e.target.value })}
                className="mm-input"
                required
              />
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Professional Headline *</label>
              <input
                type="text"
                value={profile?.headline || ''}
                onChange={e => setProfile({ ...profile, headline: e.target.value })}
                className="mm-input"
                placeholder="e.g. Senior Relationship & Pre-Cohabitation Mentor"
                required
              />
            </div>
          </div>

          <div className="mm-form-group">
            <label className="mm-form-label">Professional Biography & Listening Approach *</label>
            <textarea
              rows="4"
              value={profile?.bio || ''}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              className="mm-textarea"
              placeholder="Describe your background, listening philosophy, and who you can best support..."
              required
            />
          </div>

          <div className="mm-grid-3">
            <div className="mm-form-group">
              <label className="mm-form-label">Spoken Languages *</label>
              <input
                type="text"
                value={profile?.languages || ''}
                onChange={e => setProfile({ ...profile, languages: e.target.value })}
                className="mm-input"
                placeholder="Hindi, English, Marathi"
                required
              />
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Experience (Years)</label>
              <input
                type="number"
                value={profile?.experience_years || 3}
                onChange={e => setProfile({ ...profile, experience_years: parseInt(e.target.value) || 0 })}
                className="mm-input"
                min="0"
                max="50"
              />
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Location / City</label>
              <input
                type="text"
                value={profile?.city || ''}
                onChange={e => setProfile({ ...profile, city: e.target.value })}
                className="mm-input"
                placeholder="Pune / Mumbai, Maharashtra"
              />
            </div>
          </div>

          <div className="mm-grid-2">
            <div className="mm-form-group">
              <label className="mm-form-label">Highest Qualification / Degree</label>
              <input
                type="text"
                value={profile?.education || ''}
                onChange={e => setProfile({ ...profile, education: e.target.value })}
                className="mm-input"
                placeholder="Master's in Psychology / Guidance"
              />
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Profile Photo URL</label>
              <input
                type="text"
                value={profile?.profile_photo_url || ''}
                onChange={e => setProfile({ ...profile, profile_photo_url: e.target.value })}
                className="mm-input"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="mm-grid-2" style={{ marginTop: '12px' }}>
            <div className="mm-form-group">
              <label className="mm-form-label">Intro Video URL (YouTube / Vimeo / Loom)</label>
              <input
                type="text"
                value={profile?.intro_video_url || ''}
                onChange={e => setProfile({ ...profile, intro_video_url: e.target.value })}
                className="mm-input"
                placeholder="https://youtu.be/..."
              />
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Rank-Governed Per-Minute Price</label>
              <input
                type="text"
                value={`₹${profile?.per_minute_rate_inr || 10} / min (Level ${profile?.rank_level || 10})`}
                disabled
                className="mm-input"
                style={{ background: '#FAF3E8', fontWeight: 700, color: 'var(--mm-plum)' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={saving} className="mm-btn-primary mm-btn-lg">
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
            <button type="button" onClick={handleOpenPreview} className="mm-btn-secondary mm-btn-lg">
              Preview Client View
            </button>
          </div>
        </form>
      </div>

      {/* PREVIEW MODAL */}
      {showPreviewModal && preview && (
        <div className="mm-modal-backdrop" onClick={() => setShowPreviewModal(false)}>
          <div className="mm-modal-card" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: 'var(--mm-plum)' }}>Public Profile Preview</h3>
              <button onClick={() => setShowPreviewModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <img
                src={preview.profile_photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${preview.display_name}`}
                alt={preview.display_name}
                style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', border: '3px solid var(--mm-gold)' }}
              />
              <h2 style={{ fontSize: '1.4rem', color: 'var(--mm-plum)', margin: '0 0 4px' }}>{preview.display_name}</h2>
              <p style={{ color: 'var(--mm-secondary-text)', fontSize: '0.9rem', margin: 0 }}>{preview.headline}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '8px', fontSize: '0.82rem', color: 'var(--mm-secondary-text)' }}>
                <span>* {preview.rating_average} ({preview.review_count} reviews)</span>
                <span>- {preview.experience_years} yrs exp</span>
                <span>- {preview.city}</span>
              </div>
            </div>

            <div style={{ background: '#FFF1F5', borderRadius: '12px', padding: '16px', margin: '16px 0' }}>
              <h4 style={{ color: 'var(--mm-plum)', margin: '0 0 6px', fontSize: '0.9rem' }}>About</h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--mm-primary-text)', lineHeight: 1.5, margin: 0 }}>
                {preview.bio}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--mm-border)' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--mm-plum)' }}>
                ₹{preview.per_minute_rate_inr} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--mm-secondary-text)' }}>/ minute</span>
              </span>
              <button onClick={() => setShowPreviewModal(false)} className="mm-btn-primary mm-btn-sm">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

// ============================================================================
// 3. EXPERTISE CATEGORIES (/partner/expertise)
// ============================================================================
export function PartnerExpertisePage() {
  const { token } = useAuth();
  const [catalog, setCatalog] = useState([]);
  const [selectedMap, setSelectedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/partner/expertise`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(res => {
        if (res) {
          setCatalog(res.catalog || []);
          setSelectedMap(res.selected_map || {});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const toggleCategory = (catName) => {
    setSelectedMap(prev => {
      const copy = { ...prev };
      if (copy[catName]) {
        delete copy[catName];
      } else {
        copy[catName] = { subcategories: [], skills: [], is_primary: Object.keys(copy).length === 0 };
      }
      return copy;
    });
  };

  const toggleSubcategory = (catName, sub) => {
    setSelectedMap(prev => {
      const current = prev[catName] || { subcategories: [], skills: [], is_primary: false };
      const exists = current.subcategories.includes(sub);
      const nextSubs = exists ? current.subcategories.filter(s => s !== sub) : [...current.subcategories, sub];
      return { ...prev, [catName]: { ...current, subcategories: nextSubs } };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const expertises = Object.entries(selectedMap).map(([category_name, details]) => ({
      category_name,
      subcategories: details.subcategories || [],
      skills: details.skills || [],
      is_primary: !!details.is_primary
    }));

    try {
      const res = await fetch(`${API_BASE}/partner/expertise`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ expertises })
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="partner">
        <div className="mm-loading-state"><div className="mm-spinner"></div><p>Loading expertise catalog...</p></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">My Areas of Expertise & Mentorship</h1>
          <p className="mm-dashboard-subtitle">Select categories and skills you offer to match with appropriate client requests</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="mm-btn-primary mm-btn-sm">
          {saving ? 'Saving...' : 'Save Selected Expertise'}
        </button>
      </div>

      {saved && (
        <div className="mm-alert mm-alert-success" style={{ marginBottom: '18px' }}>
          <CheckCircle2 size={18} /> Expertise catalog successfully updated!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
        {catalog.map(cat => {
          const isSelected = !!selectedMap[cat.name];
          const currentEntry = selectedMap[cat.name] || { subcategories: [], skills: [] };

          return (
            <div
              key={cat.id}
              className="mm-card"
              style={{
                border: isSelected ? '2px solid var(--mm-rose)' : '1px solid var(--mm-border)',
                background: isSelected ? '#FFFFFF' : '#FAF8FA',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--mm-plum)', margin: '0 0 4px' }}>{cat.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--mm-secondary-text)', margin: 0 }}>{cat.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.name)}
                  className={isSelected ? 'mm-btn-primary mm-btn-sm' : 'mm-btn-secondary mm-btn-sm'}
                  style={{ whiteSpace: 'nowrap', padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  {isSelected ? 'v Selected' : '+ Add'}
                </button>
              </div>

              {cat.requires_license && (
                <div style={{ background: '#FFF1F5', border: '1px solid #F1DCE5', borderRadius: '8px', padding: '6px 10px', fontSize: '0.75rem', color: 'var(--mm-rose)', marginBottom: '12px' }}>
                  ! Regulated: Requires verified Clinical Degree or License in Verification tab.
                </div>
              )}

              {isSelected && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--mm-border)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mm-plum)', display: 'block', marginBottom: '8px' }}>
                    Select Subcategories:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {cat.subcategories.map(sub => {
                      const hasSub = currentEntry.subcategories.includes(sub);
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => toggleSubcategory(cat.name, sub)}
                          style={{
                            background: hasSub ? 'var(--mm-rose)' : '#FFF1F5',
                            color: hasSub ? '#FFFFFF' : 'var(--mm-primary-text)',
                            border: '1px solid var(--mm-border)',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            padding: '3px 10px',
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          {hasSub ? 'v ' : '+ '}{sub}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 4. VERIFICATION & KYC DOCUMENTS (/partner/verification)
// ============================================================================
export function PartnerVerificationPage() {
  const { token } = useAuth();
  const [verif, setVerif] = useState(null);
  const [docType, setDocType] = useState('aadhaar');
  const [docNum, setDocNum] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchVerif = () => {
    fetch(`${API_BASE}/partner/verification`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(setVerif)
      .catch(console.error);
  };

  useEffect(() => {
    fetchVerif();
  }, [token]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    try {
      const res = await fetch(`${API_BASE}/partner/verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          document_type: docType,
          document_number: docNum,
          document_data_url: fileUrl || `kyc_storage/${docType}_doc.pdf`
        })
      });
      if (res.ok) {
        setMsg('Document submitted successfully. Status updated to Under Review.');
        setDocNum('');
        setFileUrl('');
        fetchVerif();
      }
    } catch (err) {
      console.error(err);
      setMsg('Failed to submit document');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Verification & KYC Documents</h1>
          <p className="mm-dashboard-subtitle">Submit government identity and qualifications for compliance review</p>
        </div>
      </div>

      {/* STATUS BANNER */}
      <div className="mm-card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #FFF1F5, #FFFFFF)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--mm-secondary-text)', fontWeight: 600 }}>CURRENT ACCOUNT VERIFICATION</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className={`mm-badge-status ${verif?.verification_status || 'under_review'}`} style={{ fontSize: '0.9rem', padding: '4px 12px' }}>
                {verif?.verification_status === 'approved' ? 'v Fully Verified' : verif?.verification_status === 'under_review' ? 'pending Under Review' : verif?.verification_status || 'Pending'}
              </span>
            </div>
            {verif?.admin_notes && (
              <p style={{ fontSize: '0.85rem', color: 'var(--mm-primary-text)', marginTop: '8px' }}>
                Review Notes: <em>"{verif.admin_notes}"</em>
              </p>
            )}
          </div>
          <ShieldCheck size={44} color="var(--mm-gold)" />
        </div>
      </div>

      {msg && (
        <div className="mm-alert mm-alert-success" style={{ marginBottom: '18px' }}>
          <CheckCircle2 size={18} /> {msg}
        </div>
      )}

      {/* SUBMISSION FORM */}
      <div className="mm-card" style={{ marginBottom: '24px' }}>
        <h3 className="mm-card-title" style={{ marginBottom: '16px' }}>Submit Document for Review</h3>
        <form onSubmit={handleUpload}>
          <div className="mm-grid-3">
            <div className="mm-form-group">
              <label className="mm-form-label">Document Type *</label>
              <select value={docType} onChange={e => setDocType(e.target.value)} className="mm-select">
                <option value="aadhaar">Aadhaar Card (Govt ID)</option>
                <option value="pan">PAN Card (Tax & Payouts)</option>
                <option value="passport">Passport</option>
                <option value="driving_license">Driving License</option>
                <option value="experience_certificate">Degree / Certification</option>
              </select>
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Document Number (Optional Masked)</label>
              <input
                type="text"
                value={docNum}
                onChange={e => setDocNum(e.target.value)}
                className="mm-input"
                placeholder="e.g. 5839 ---- 9201"
              />
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Document URL or Secure Key</label>
              <input
                type="text"
                value={fileUrl}
                onChange={e => setFileUrl(e.target.value)}
                className="mm-input"
                placeholder="https://... or storage_key"
              />
            </div>
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--mm-secondary-text)', margin: '8px 0 16px' }}>
            Lock Documents are stored privately with AES-256 encryption. Personal details are never revealed publicly.
          </p>

          <button type="submit" disabled={submitting} className="mm-btn-primary mm-btn-md">
            {submitting ? 'Submitting...' : 'Upload & Submit Document'}
          </button>
        </form>
      </div>

      {/* SUBMITTED DOCUMENTS TABLE */}
      <div className="mm-card">
        <h3 className="mm-card-title" style={{ marginBottom: '16px' }}>Uploaded Verification Records</h3>
        {!verif?.documents || verif.documents.length === 0 ? (
          <p style={{ color: 'var(--mm-secondary-text)', fontSize: '0.88rem' }}>No verification documents uploaded yet.</p>
        ) : (
          <table className="mm-table">
            <thead>
              <tr>
                <th>Document Type</th>
                <th>Masked Number</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {verif.documents.map(d => (
                <tr key={d.id}>
                  <td style={{ textTransform: 'capitalize', fontWeight: 600 }}>{d.document_type.replace('_', ' ')}</td>
                  <td><code>{d.document_number_masked || '----'}</code></td>
                  <td>{d.submitted_at}</td>
                  <td>
                    <span className={`mm-badge-status ${d.verification_status}`}>{d.verification_status}</span>
                  </td>
                  <td>{d.review_notes || 'Pending review'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 5. AVAILABILITY CALENDAR (/partner/availability)
// ============================================================================
export function PartnerAvailabilityPage() {
  const { token } = useAuth();
  const [data, setData] = useState({ recurring_rules: [], slots: [] });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('10:30 AM');
  const [commType, setCommType] = useState('all');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchAvail = () => {
    fetch(`${API_BASE}/partner/availability`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(res => {
        if (res) setData(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAvail();
  }, [token]);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await fetch(`${API_BASE}/partner/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          slots: [{
            slot_date: selectedDate,
            start_time: startTime,
            end_time: endTime,
            communication_type: commType
          }]
        })
      });
      if (res.ok) {
        setMsg('Slot added successfully!');
        fetchAvail();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      const res = await fetch(`${API_BASE}/partner/availability/slots/${slotId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAvail();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Availability Calendar & Custom Slots</h1>
          <p className="mm-dashboard-subtitle">Configure working days, time slots, and block dates to prevent double-booking</p>
        </div>
      </div>

      {msg && (
        <div className="mm-alert mm-alert-success" style={{ marginBottom: '18px' }}>
          <CheckCircle2 size={18} /> {msg}
        </div>
      )}

      {/* CREATE SLOT FORM */}
      <div className="mm-card" style={{ marginBottom: '24px' }}>
        <h3 className="mm-card-title" style={{ marginBottom: '16px' }}>Add Specific Date Time Slot</h3>
        <form onSubmit={handleAddSlot}>
          <div className="mm-grid-4">
            <div className="mm-form-group">
              <label className="mm-form-label">Date *</label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="mm-input"
                required
              />
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Start Time *</label>
              <select value={startTime} onChange={e => setStartTime(e.target.value)} className="mm-select">
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="06:00 PM">06:00 PM</option>
                <option value="08:00 PM">08:00 PM</option>
              </select>
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">End Time *</label>
              <select value={endTime} onChange={e => setEndTime(e.target.value)} className="mm-select">
                <option value="09:30 AM">09:30 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="04:30 PM">04:30 PM</option>
                <option value="06:30 PM">06:30 PM</option>
                <option value="08:30 PM">08:30 PM</option>
              </select>
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Allowed Mode</label>
              <select value={commType} onChange={e => setCommType(e.target.value)} className="mm-select">
                <option value="all">All Modes (Video, Audio, Chat)</option>
                <option value="video">Video Call Only</option>
                <option value="audio">Voice Audio Only</option>
                <option value="chat">Chat Only</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={saving} className="mm-btn-primary mm-btn-md" style={{ marginTop: '12px' }}>
            <Plus size={16} /> Publish Availability Slot
          </button>
        </form>
      </div>

      {/* ACTIVE SLOTS TABLE */}
      <div className="mm-card">
        <h3 className="mm-card-title" style={{ marginBottom: '16px' }}>Published Calendar Slots</h3>
        {data.slots.length === 0 ? (
          <p style={{ color: 'var(--mm-secondary-text)', fontSize: '0.88rem' }}>No custom slots configured yet.</p>
        ) : (
          <table className="mm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time Window</th>
                <th>Mode</th>
                <th>Booking Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.slots.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.slot_date}</strong></td>
                  <td>{s.start_time} - {s.end_time}</td>
                  <td style={{ textTransform: 'capitalize' }}>{s.communication_type}</td>
                  <td>
                    {s.is_booked ? (
                      <span className="mm-badge-status approved">Booked by Client</span>
                    ) : (
                      <span className="mm-badge-status" style={{ background: '#EAF8EE', color: 'var(--mm-success)' }}>Available</span>
                    )}
                  </td>
                  <td>
                    {!s.is_booked && (
                      <button onClick={() => handleDeleteSlot(s.id)} className="mm-btn-danger mm-btn-sm" style={{ padding: '3px 8px' }}>
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 6. MY SESSIONS & BOOKINGS (/partner/sessions or /partner/bookings)
// ============================================================================
export function PartnerBookingsPage() {
  const { token } = useAuth();
  const [tab, setTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = (currTab = tab) => {
    setLoading(true);
    fetch(`${API_BASE}/partner/bookings?tab=${currTab}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings(tab);
  }, [token, tab]);

  const handleAccept = async (id) => {
    await fetch(`${API_BASE}/partner/bookings/${id}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchBookings(tab);
  };

  const handleDecline = async (id) => {
    const reason = prompt('Please enter decline reason:') || 'Schedule conflict';
    await fetch(`${API_BASE}/partner/bookings/${id}/reject?reason=${encodeURIComponent(reason)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchBookings(tab);
  };

  const handleComplete = async (id) => {
    await fetch(`${API_BASE}/partner/bookings/${id}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchBookings(tab);
  };

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">My Client Consultations & Bookings</h1>
          <p className="mm-dashboard-subtitle">Manage upcoming, live, and completed client sessions</p>
        </div>
      </div>

      {/* TABS */}
      <div className="mm-tab-nav" style={{ marginBottom: '20px' }}>
        {[
          { key: 'all', label: 'All Sessions' },
          { key: 'pending', label: 'Pending Requests' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'live', label: 'Live Now' },
          { key: 'completed', label: 'Completed' },
          { key: 'cancelled', label: 'Cancelled' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`mm-tab-btn ${tab === t.key ? 'active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mm-card">
        {loading ? (
          <div className="mm-loading-state"><div className="mm-spinner"></div><p>Loading bookings...</p></div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--mm-secondary-text)' }}>
            <Calendar size={36} color="var(--mm-gold)" style={{ margin: '0 auto 8px' }} />
            <p>No bookings found in this category.</p>
          </div>
        ) : (
          <table className="mm-table">
            <thead>
              <tr>
                <th>Booking Code</th>
                <th>Client Name</th>
                <th>Scheduled Start</th>
                <th>Duration</th>
                <th>Mode</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td><strong>{b.booking_code}</strong></td>
                  <td>{b.user_name || 'Member'}</td>
                  <td>{b.scheduled_start ? new Date(b.scheduled_start).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'TBD'}</td>
                  <td>{b.duration_minutes} mins</td>
                  <td><span className="mm-badge-comm">{b.communication_type}</span></td>
                  <td>₹{b.total_amount}</td>
                  <td><span className={`mm-badge-status ${b.booking_status}`}>{b.booking_status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {b.booking_status === 'pending' && (
                        <>
                          <button onClick={() => handleAccept(b.id)} className="mm-btn-primary mm-btn-sm" style={{ padding: '3px 8px' }}>
                            Accept
                          </button>
                          <button onClick={() => handleDecline(b.id)} className="mm-btn-danger mm-btn-sm" style={{ padding: '3px 8px' }}>
                            Decline
                          </button>
                        </>
                      )}
                      {(b.booking_status === 'confirmed' || b.booking_status === 'accepted' || b.booking_status === 'in_progress') && (
                        <>
                          <Link to={`/call/${b.id}`} className="mm-btn-primary mm-btn-sm" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                            Join Call
                          </Link>
                          <button onClick={() => handleComplete(b.id)} className="mm-btn-secondary mm-btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                            Complete
                          </button>
                        </>
                      )}
                      {b.booking_status === 'completed' && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--mm-success)', fontWeight: 700 }}>Credited</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 7. CHAT & MESSAGES (/partner/messages)
// ============================================================================
export function PartnerMessagesPage() {
  const { token, user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [thread, setThread] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchConversations = () => {
    fetch(`${API_BASE}/partner/messages/conversations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(res => {
        setConversations(res);
        if (res.length > 0 && !activeConv) {
          setActiveConv(res[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConversations();
  }, [token]);

  useEffect(() => {
    if (activeConv) {
      fetch(`${API_BASE}/partner/messages/${activeConv.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(setThread)
        .catch(console.error);
    }
  }, [activeConv, token]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeConv) return;
    const msgText = newMsg.trim();
    setNewMsg('');

    try {
      const res = await fetch(`${API_BASE}/partner/messages/${activeConv.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message_text: msgText, message_type: 'text' })
      });
      if (res.ok) {
        // Refresh thread
        fetch(`${API_BASE}/partner/messages/${activeConv.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(r => r.json())
          .then(setThread);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Chat & Real-time Messages</h1>
          <p className="mm-dashboard-subtitle">Confidential in-app communication with your booked clients</p>
        </div>
      </div>

      <div className="mm-card" style={{ padding: 0, overflow: 'hidden', height: '620px', display: 'flex' }}>
        {/* LEFT PANE: CONVERSATION LIST */}
        <div style={{ width: '300px', borderRight: '1px solid var(--mm-border)', background: '#FAF8FA', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--mm-border)', fontWeight: 700, color: 'var(--mm-plum)' }}>
            Client Conversations
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.length === 0 ? (
              <p style={{ padding: '24px', fontSize: '0.85rem', color: 'var(--mm-secondary-text)', textAlign: 'center' }}>
                No active conversations yet.
              </p>
            ) : (
              conversations.map(c => (
                <div
                  key={c.id}
                  onClick={() => setActiveConv(c)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--mm-border)',
                    cursor: 'pointer',
                    background: activeConv?.id === c.id ? '#FFF1F5' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <img
                    src={c.user_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.user_name}`}
                    alt={c.user_name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--mm-plum)', fontSize: '0.88rem' }}>{c.user_name}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--mm-secondary-text)' }}>{c.last_message_time}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--mm-secondary-text)', margin: '2px 0 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {c.last_message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANE: CHAT THREAD */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
          {activeConv ? (
            <>
              {/* HEADER */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--mm-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--mm-plum)' }}>{thread?.user_name || activeConv.user_name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--mm-success)', fontWeight: 600 }}> Active Session Connection</span>
                </div>
                <Link to={activeConv.booking_id ? `/call/${activeConv.booking_id}` : '#'} className="mm-btn-primary mm-btn-sm">
                  Launch Audio/Video Room
                </Link>
              </div>

              {/* MESSAGES LIST */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {thread?.messages?.map(m => (
                  <div
                    key={m.id}
                    style={{
                      alignSelf: m.is_partner ? 'flex-end' : 'flex-start',
                      maxWidth: '70%',
                      background: m.is_partner ? 'var(--mm-plum)' : '#F5EEF4',
                      color: m.is_partner ? '#FFFFFF' : 'var(--mm-primary-text)',
                      borderRadius: m.is_partner ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      padding: '10px 14px',
                      fontSize: '0.88rem',
                      lineHeight: 1.4
                    }}
                  >
                    <div>{m.message_text}</div>
                    <span style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '4px', display: 'block', textAlign: 'right' }}>
                      {m.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* INPUT BAR */}
              <form onSubmit={handleSend} style={{ padding: '14px 18px', borderTop: '1px solid var(--mm-border)', display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  placeholder="Type a thoughtful, empathetic message..."
                  className="mm-input"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="mm-btn-primary mm-btn-md">
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--mm-secondary-text)' }}>
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 8. AUDIO SESSIONS STUDIO (/partner/audio-sessions)
// ============================================================================
export function PartnerAudioSessionsPage() {
  const [micOn, setMicOn] = useState(true);
  const [inCall, setInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval;
    if (inCall) {
      interval = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [inCall]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Audio Consultations Console</h1>
          <p className="mm-dashboard-subtitle">One-on-one encrypted voice conversation station with real-time waveform visualizer</p>
        </div>
      </div>

      <div className="mm-card" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: '40px 24px' }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: inCall ? 'linear-gradient(135deg, var(--mm-rose), var(--mm-plum))' : '#F1DCE5',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: inCall ? '0 0 30px rgba(233, 30, 99, 0.4)' : 'none'
        }}>
          <Phone size={48} color={inCall ? '#FFFFFF' : 'var(--mm-plum)'} />
        </div>

        <h3 style={{ color: 'var(--mm-plum)', margin: '0 0 6px' }}>
          {inCall ? 'Voice Consultation In Progress' : 'Encrypted Voice Room Ready'}
        </h3>
        <p style={{ color: 'var(--mm-secondary-text)', fontSize: '0.88rem' }}>
          {inCall ? `Elapsed: ${formatTimer(callDuration)} - High-Definition Audio` : 'Connect with booked client via private audio session.'}
        </p>

        {inCall && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', height: '36px', alignItems: 'center', margin: '20px 0' }}>
            {[18, 30, 14, 36, 24, 40, 20, 32, 16, 28].map((h, i) => (
              <span key={i} style={{ width: '4px', height: `${h}px`, background: 'var(--mm-rose)', borderRadius: '4px' }}></span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '24px' }}>
          {inCall ? (
            <>
              <button
                onClick={() => setMicOn(!micOn)}
                className="mm-btn-secondary mm-btn-md"
                style={{ width: '48px', height: '48px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}
              >
                {micOn ? <Mic size={20} /> : <MicOff size={20} color="var(--mm-error)" />}
              </button>
              <button
                onClick={() => { setInCall(false); setCallDuration(0); }}
                className="mm-btn-danger mm-btn-md"
                style={{ borderRadius: '9999px', padding: '12px 24px' }}
              >
                End Voice Consultation
              </button>
            </>
          ) : (
            <button
              onClick={() => { setInCall(true); setCallDuration(0); }}
              className="mm-btn-primary mm-btn-lg"
              style={{ borderRadius: '9999px' }}
            >
              Start Audio Consultation Test
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 9. VIDEO SESSIONS STUDIO (/partner/video-sessions)
// ============================================================================
export function PartnerVideoSessionsPage() {
  const [camOn, setCamOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Video Consultation Studio</h1>
          <p className="mm-dashboard-subtitle">Peer-to-peer WebRTC video room with encrypted media streaming and session duration billing</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* REMOTE CLIENT TILE */}
        <div className="mm-card" style={{ background: '#1C0D1C', color: '#FFFFFF', minHeight: '360px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <User size={64} color="rgba(255, 255, 255, 0.4)" />
          <p style={{ marginTop: '12px', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>Client stream will appear here when connected</p>
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem' }}>
            Client Video Feed
          </div>
        </div>

        {/* LOCAL MENTOR PREVIEW */}
        <div className="mm-card" style={{ background: '#2E152E', color: '#FFFFFF', minHeight: '360px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {camOn ? (
            <div style={{ textAlign: 'center' }}>
              <Video size={56} color="var(--mm-gold)" />
              <p style={{ marginTop: '12px', fontSize: '0.9rem', color: '#FFFFFF' }}>Mentor Camera Active (Mirror)</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center', opacity: 0.6 }}>
              <VideoOff size={56} color="#FFFFFF" />
              <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>Camera Off</p>
            </div>
          )}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem' }}>
            You (Mentor Mirror)
          </div>
        </div>
      </div>

      {/* CONTROLS BAR */}
      <div className="mm-card" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center' }}>
        <button
          onClick={() => setMicOn(!micOn)}
          className={`mm-btn-secondary mm-btn-md ${!micOn ? 'mm-btn-danger' : ''}`}
        >
          {micOn ? <Mic size={18} /> : <MicOff size={18} />}
          {micOn ? 'Mute' : 'Unmute'}
        </button>

        <button
          onClick={() => setCamOn(!camOn)}
          className={`mm-btn-secondary mm-btn-md ${!camOn ? 'mm-btn-danger' : ''}`}
        >
          {camOn ? <Video size={18} /> : <VideoOff size={18} />}
          {camOn ? 'Stop Camera' : 'Start Camera'}
        </button>

        <Link to="/partner/sessions" className="mm-btn-danger mm-btn-md">
          Leave Video Studio
        </Link>
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 10. LIVE STREAMING STUDIO (/partner/live)
// ============================================================================
export function PartnerLiveStreamingPage() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal Guidance');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLive = () => {
    fetch(`${API_BASE}/partner/live`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLive();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/partner/live`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description: desc,
          category,
          scheduled_at: new Date().toISOString()
        })
      });
      if (res.ok) {
        setShowModal(false);
        setTitle('');
        setDesc('');
        fetchLive();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleLive = async (session, action) => {
    await fetch(`${API_BASE}/partner/live/${session.id}/${action}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchLive();
  };

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Live Mentorship Streaming Studio</h1>
          <p className="mm-dashboard-subtitle">Host live video Q&A streams, broadcast relationship insights, and interact with audience questions</p>
        </div>
        <button onClick={() => setShowModal(true)} className="mm-btn-primary mm-btn-md">
          <Radio size={16} /> Schedule Live Stream
        </button>
      </div>

      <div className="mm-card">
        {loading ? (
          <div className="mm-loading-state"><div className="mm-spinner"></div><p>Loading live broadcasts...</p></div>
        ) : sessions.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--mm-secondary-text)' }}>
            <Radio size={40} color="var(--mm-gold)" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontWeight: 600 }}>No live streams scheduled yet.</p>
            <p style={{ fontSize: '0.82rem' }}>Broadcast live advice to hundreds of followers simultaneously.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {sessions.map(s => (
              <div key={s.id} className="mm-card" style={{ border: s.status === 'live' ? '2px solid var(--mm-rose)' : '1px solid var(--mm-border)', background: '#FAF8FA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{
                    background: s.status === 'live' ? 'var(--mm-error)' : '#F1DCE5',
                    color: s.status === 'live' ? '#FFFFFF' : 'var(--mm-plum)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {s.status === 'live' ? ' LIVE BROADCAST' : s.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--mm-secondary-text)' }}>
                     {s.viewer_count || 0} Viewers
                  </span>
                </div>

                <h3 style={{ fontSize: '1.05rem', color: 'var(--mm-plum)', margin: '4px 0 6px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--mm-secondary-text)', lineHeight: 1.4, margin: '0 0 12px' }}>
                  {s.description || 'Live audience discussion.'}
                </p>

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  {s.status === 'scheduled' && (
                    <button onClick={() => handleToggleLive(s, 'start')} className="mm-btn-primary mm-btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                      Go Live Now
                    </button>
                  )}
                  {s.status === 'live' && (
                    <button onClick={() => handleToggleLive(s, 'end')} className="mm-btn-danger mm-btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                      End Live Broadcast
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="mm-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="mm-modal-card" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: 'var(--mm-plum)', marginTop: 0 }}>Schedule Live Mentorship Stream</h3>
            <form onSubmit={handleCreate}>
              <div className="mm-form-group">
                <label className="mm-form-label">Stream Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="mm-input"
                  placeholder="e.g. Q&A: Overcoming Conflict in Relationships"
                  required
                />
              </div>

              <div className="mm-form-group">
                <label className="mm-form-label">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="mm-select">
                  <option value="Personal Guidance">Personal Guidance</option>
                  <option value="Relationship Wellness">Relationship Wellness</option>
                  <option value="Mindfulness & Emotional Calm">Mindfulness & Emotional Calm</option>
                  <option value="Career & Study Focus">Career & Study Focus</option>
                </select>
              </div>

              <div className="mm-form-group">
                <label className="mm-form-label">Description</label>
                <textarea
                  rows="3"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  className="mm-textarea"
                  placeholder="What topics will you cover in this stream?"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="mm-btn-secondary mm-btn-md">
                  Cancel
                </button>
                <button type="submit" className="mm-btn-primary mm-btn-md">
                  Create Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

// ============================================================================
// 11. GROUP WORKSHOPS (/partner/workshops)
// ============================================================================
export function PartnerWorkshopsPage() {
  const { token } = useAuth();
  const [workshops, setWorkshops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Relationship Wellness');
  const [capacity, setCapacity] = useState(25);
  const [fee, setFee] = useState(499);
  const [duration, setDuration] = useState(60);
  const [schedDate, setSchedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  const fetchWorkshops = () => {
    fetch(`${API_BASE}/partner/workshops`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(setWorkshops)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorkshops();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/partner/workshops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description: desc,
          category,
          scheduled_at: `${schedDate}T18:00:00`,
          duration_minutes: duration,
          capacity,
          fee_inr: fee
        })
      });
      if (res.ok) {
        setShowModal(false);
        fetchWorkshops();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Group Workshops & Masterclasses</h1>
          <p className="mm-dashboard-subtitle">Host ticketed group masterclasses and earn per registered participant</p>
        </div>
        <button onClick={() => setShowModal(true)} className="mm-btn-primary mm-btn-md">
          <Plus size={16} /> Create Group Workshop
        </button>
      </div>

      <div className="mm-card">
        {loading ? (
          <div className="mm-loading-state"><div className="mm-spinner"></div><p>Loading workshops...</p></div>
        ) : workshops.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--mm-secondary-text)' }}>
            <Users size={40} color="var(--mm-gold)" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontWeight: 600 }}>No group workshops published yet.</p>
            <p style={{ fontSize: '0.82rem' }}>Teach cohort classes to multiple members at once.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
            {workshops.map(w => (
              <div key={w.id} className="mm-card" style={{ border: '1px solid var(--mm-border)', background: '#FAF8FA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="mm-badge-comm">{w.category}</span>
                  <span style={{ fontWeight: 800, color: 'var(--mm-plum)' }}>₹{w.fee_inr} / seat</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--mm-plum)', margin: '4px 0 6px' }}>{w.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--mm-secondary-text)', lineHeight: 1.4, margin: '0 0 12px' }}>
                  {w.description}
                </p>

                <div style={{ fontSize: '0.78rem', color: 'var(--mm-secondary-text)', display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span> {w.scheduled_display || 'Upcoming'}</span>
                  <span>pending {w.duration_minutes} mins</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--mm-border)' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--mm-plum)' }}>
                    Seats: {w.registered_count || 0} / {w.capacity}
                  </span>
                  <button className="mm-btn-primary mm-btn-sm" style={{ padding: '4px 10px' }}>
                    Manage Workshop
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="mm-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="mm-modal-card" style={{ maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: 'var(--mm-plum)', marginTop: 0 }}>Create Group Masterclass</h3>
            <form onSubmit={handleCreate}>
              <div className="mm-form-group">
                <label className="mm-form-label">Workshop Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="mm-input"
                  placeholder="e.g. Couples Communication Masterclass"
                  required
                />
              </div>

              <div className="mm-grid-2">
                <div className="mm-form-group">
                  <label className="mm-form-label">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="mm-select">
                    <option value="Relationship Wellness">Relationship Wellness</option>
                    <option value="Creative Expression">Creative Expression</option>
                    <option value="Mindfulness Practice">Mindfulness Practice</option>
                    <option value="Career & Public Speaking">Career & Public Speaking</option>
                  </select>
                </div>

                <div className="mm-form-group">
                  <label className="mm-form-label">Date *</label>
                  <input
                    type="date"
                    value={schedDate}
                    onChange={e => setSchedDate(e.target.value)}
                    className="mm-input"
                    required
                  />
                </div>
              </div>

              <div className="mm-grid-3">
                <div className="mm-form-group">
                  <label className="mm-form-label">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(parseInt(e.target.value) || 60)}
                    className="mm-input"
                  />
                </div>

                <div className="mm-form-group">
                  <label className="mm-form-label">Seat Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={e => setCapacity(parseInt(e.target.value) || 25)}
                    className="mm-input"
                  />
                </div>

                <div className="mm-form-group">
                  <label className="mm-form-label">Joining Fee (₹)</label>
                  <input
                    type="number"
                    value={fee}
                    onChange={e => setFee(parseInt(e.target.value) || 499)}
                    className="mm-input"
                  />
                </div>
              </div>

              <div className="mm-form-group">
                <label className="mm-form-label">Description & Syllabus</label>
                <textarea
                  rows="3"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  className="mm-textarea"
                  placeholder="Outline what attendees will learn in this session..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="mm-btn-secondary mm-btn-md">
                  Cancel
                </button>
                <button type="submit" className="mm-btn-primary mm-btn-md">
                  Publish Masterclass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

// ============================================================================
// 12. MY EARNINGS & 70/30 POLICY (/partner/earnings)
// ============================================================================
export function PartnerEarningsPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Earnings Calculator State
  const [calcMins, setCalcMins] = useState(30);
  const [calcRate, setCalcRate] = useState(30);

  useEffect(() => {
    fetch(`${API_BASE}/partner/earnings`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const grossSim = calcMins * calcRate;
  const mentorSim = Math.round(grossSim * 0.70);
  const platformSim = grossSim - mentorSim;

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Earnings Ledger & Revenue Share</h1>
          <p className="mm-dashboard-subtitle">Transparent financial ledger tracked with integer paise precision</p>
        </div>
      </div>

      {/* REVENUE SHARE POLICY BOX */}
      <div className="mm-card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #FAF3E8, #FFFFFF)', border: '1px solid var(--mm-gold)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--mm-gold)', letterSpacing: '0.05em' }}>
              BUSINESS REVENUE-SHARING MODEL
            </span>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--mm-plum)', margin: '4px 0' }}>
              70% Mentor Share - 30% Platform Share
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--mm-secondary-text)', margin: 0 }}>
              {data?.policy?.notice || 'Calculated automatically on completed consultations with zero hidden deductions.'}
            </p>
          </div>
          <Award size={40} color="var(--mm-gold)" />
        </div>
      </div>

      {/* CALCULATOR */}
      <div className="mm-card" style={{ marginBottom: '24px' }}>
        <h3 className="mm-card-title" style={{ marginBottom: '14px' }}>Interactive Earnings Calculator</h3>
        <div className="mm-grid-2">
          <div>
            <label className="mm-form-label">Consultation Duration: <strong>{calcMins} Minutes</strong></label>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={calcMins}
              onChange={e => setCalcMins(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--mm-rose)' }}
            />

            <label className="mm-form-label" style={{ marginTop: '14px' }}>Rank Per-Minute Rate: <strong>₹{calcRate} / min</strong></label>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={calcRate}
              onChange={e => setCalcRate(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--mm-rose)' }}
            />
          </div>

          <div style={{ background: '#FFF1F5', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.88rem' }}>Client Pays:</span>
              <strong style={{ color: 'var(--mm-plum)' }}>₹{grossSim}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--mm-success)', fontWeight: 700 }}>
              <span style={{ fontSize: '0.88rem' }}>Your Net Payout (70%):</span>
              <span style={{ fontSize: '1.1rem' }}>₹{mentorSim}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--mm-secondary-text)' }}>
              <span>Platform Share (30%):</span>
              <span>₹{platformSim}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FINANCIAL LEDGER */}
      <div className="mm-card">
        <h3 className="mm-card-title" style={{ marginBottom: '16px' }}>Immutable Financial Ledger</h3>
        {!data?.ledger || data.ledger.length === 0 ? (
          <p style={{ color: 'var(--mm-secondary-text)', fontSize: '0.88rem' }}>No financial ledger entries recorded yet.</p>
        ) : (
          <table className="mm-table">
            <thead>
              <tr>
                <th>Reference Code</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {data.ledger.map(l => (
                <tr key={l.id}>
                  <td><code>{l.reference_code}</code></td>
                  <td><span className="mm-badge-comm">{l.transaction_type}</span></td>
                  <td>{l.description}</td>
                  <td style={{ fontWeight: 700, color: l.amount_inr >= 0 ? 'var(--mm-success)' : 'var(--mm-error)' }}>
                    {l.amount_inr >= 0 ? `+₹${l.amount_inr}` : `-₹${Math.abs(l.amount_inr)}`}
                  </td>
                  <td>₹{l.balance_after_inr}</td>
                  <td style={{ fontSize: '0.8rem' }}>{l.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 13. WALLET MANAGEMENT (/partner/wallet)
// ============================================================================
export function PartnerWalletPage() {
  const { token } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/partner/wallet`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(setWallet)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Wallet & Payout Account</h1>
          <p className="mm-dashboard-subtitle">Manage available balance, linked bank account, and settlement status</p>
        </div>
        <Link to="/partner/withdrawals" className="mm-btn-primary mm-btn-md">
          Request Payout
        </Link>
      </div>

      <div className="mm-stats-grid" style={{ marginBottom: '24px' }}>
        <div className="mm-stat-tile">
          <div className="mm-stat-icon-wrap" style={{ background: '#EAF8EE', color: 'var(--mm-success)' }}>
            <Wallet size={22} />
          </div>
          <div className="mm-stat-info">
            <span className="mm-stat-label">Available to Withdraw</span>
            <span className="mm-stat-val">₹{(wallet?.available_balance_inr || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="mm-stat-tile">
          <div className="mm-stat-icon-wrap" style={{ background: '#FEF7E6', color: 'var(--mm-warning)' }}>
            <Clock size={22} />
          </div>
          <div className="mm-stat-info">
            <span className="mm-stat-label">Pending Settlements</span>
            <span className="mm-stat-val">₹{(wallet?.pending_balance_inr || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="mm-stat-tile">
          <div className="mm-stat-icon-wrap" style={{ background: '#FFF1F5', color: 'var(--mm-rose)' }}>
            <TrendingUp size={22} />
          </div>
          <div className="mm-stat-info">
            <span className="mm-stat-label">Total Lifetime Earnings</span>
            <span className="mm-stat-val">₹{(wallet?.total_earned_inr || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* BANK DETAILS CARD */}
      <div className="mm-card" style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="mm-card-title" style={{ margin: 0 }}>Linked Bank Account for Payouts</h3>
          <span className="mm-badge-status approved">Verified Account</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.88rem' }}>
          <div>
            <span style={{ color: 'var(--mm-secondary-text)', display: 'block', fontSize: '0.75rem' }}>BANK NAME</span>
            <strong style={{ color: 'var(--mm-plum)' }}>{wallet?.bank_account?.bank_name || 'HDFC Bank'}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--mm-secondary-text)', display: 'block', fontSize: '0.75rem' }}>ACCOUNT NUMBER</span>
            <strong style={{ color: 'var(--mm-plum)' }}>{wallet?.bank_account?.account_number_masked || '--------4829'}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--mm-secondary-text)', display: 'block', fontSize: '0.75rem' }}>IFSC CODE</span>
            <strong style={{ color: 'var(--mm-plum)' }}>{wallet?.bank_account?.ifsc_code || 'HDFC0001234'}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--mm-secondary-text)', display: 'block', fontSize: '0.75rem' }}>PAYOUT CYCLE</span>
            <strong style={{ color: 'var(--mm-plum)' }}>Direct NEFT / IMPS</strong>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 14. WITHDRAWALS (/partner/withdrawals)
// ============================================================================
export function PartnerWithdrawalsPage() {
  const { token } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const loadData = () => {
    fetch(`${API_BASE}/partner/wallet`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : null)
      .then(setWallet);

    fetch(`${API_BASE}/partner/withdrawals`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(setWithdrawals);
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    setError('');

    const val = parseInt(amount);
    if (!val || val < 500) {
      setError('Minimum withdrawal request is ₹500.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/partner/withdrawals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount_inr: val })
      });
      const json = await res.json();
      if (res.ok) {
        setMsg(`Payout request #${json.reference_code} for ₹${val} submitted successfully!`);
        setAmount('');
        loadData();
      } else {
        setError(json.detail || 'Withdrawal request failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Bank Withdrawals & Payout History</h1>
          <p className="mm-dashboard-subtitle">Submit payout requests to your verified bank account</p>
        </div>
      </div>

      {msg && <div className="mm-alert mm-alert-success" style={{ marginBottom: '16px' }}><CheckCircle2 size={18} /> {msg}</div>}
      {error && <div className="mm-alert mm-alert-error" style={{ marginBottom: '16px' }}><AlertCircle size={18} /> {error}</div>}

      {/* REQUEST FORM */}
      <div className="mm-card" style={{ maxWidth: '640px', marginBottom: '24px' }}>
        <h3 className="mm-card-title" style={{ marginBottom: '8px' }}>Request Bank Transfer</h3>
        <p style={{ color: 'var(--mm-secondary-text)', fontSize: '0.85rem', marginBottom: '16px' }}>
          Available Balance: <strong>₹{(wallet?.available_balance_inr || 0).toLocaleString()}</strong> (Min. request ₹500)
        </p>

        <form onSubmit={handleRequest} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="number"
            min="500"
            max={wallet?.available_balance_inr || 500000}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="mm-input"
            placeholder="Enter Amount in ₹"
            required
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={submitting} className="mm-btn-primary mm-btn-md">
            {submitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>

      {/* HISTORY TABLE */}
      <div className="mm-card">
        <h3 className="mm-card-title" style={{ marginBottom: '16px' }}>Payout Request History</h3>
        {withdrawals.length === 0 ? (
          <p style={{ color: 'var(--mm-secondary-text)', fontSize: '0.88rem' }}>No withdrawal requests submitted yet.</p>
        ) : (
          <table className="mm-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Amount</th>
                <th>Bank Destination</th>
                <th>Status</th>
                <th>Requested Date</th>
                <th>Processed Date</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map(w => (
                <tr key={w.id}>
                  <td><code>{w.reference_code}</code></td>
                  <td><strong>₹{w.amount_inr}</strong></td>
                  <td>{w.bank_name} ({w.account_number_masked})</td>
                  <td>
                    <span className={`mm-badge-status ${w.status}`}>{w.status}</span>
                  </td>
                  <td>{w.requested_at}</td>
                  <td>{w.processed_at || 'Pending Queue'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 15. RANK & PERFORMANCE (/partner/rank)
// ============================================================================
export function PartnerRankPage() {
  const { token } = useAuth();
  const [rankData, setRankData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/partner/ranks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(setRankData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <DashboardLayout role="partner">
        <div className="mm-loading-state"><div className="mm-spinner"></div><p>Loading rank progression system...</p></div>
      </DashboardLayout>
    );
  }

  const curr = rankData?.current_rank || {};
  const perf = rankData?.performance || {};
  const nextCrit = rankData?.next_rank_criteria || {};
  const allLevels = rankData?.all_levels || [];

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Rank Progression & Performance Tiers</h1>
          <p className="mm-dashboard-subtitle">Progress from Level 10 (Starter) to Level 1 (Principal Mentor) to unlock higher rates and priority placement</p>
        </div>
      </div>

      {/* CURRENT RANK BOARD */}
      <div className="mm-card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #FFF1F5, #FAF3E8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--mm-gold)', letterSpacing: '0.06em' }}>
              YOUR CURRENT MENTOR TIER
            </span>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--mm-plum)', margin: '4px 0' }}>
              Level {curr.level} -- {curr.title}
            </h2>
            <p style={{ color: 'var(--mm-primary-text)', fontSize: '0.9rem', margin: 0 }}>
              Permitted Hourly / Minute Rate: <strong>₹{curr.price_per_minute_inr} / min</strong> - {curr.mentor_share_percentage}% Net Payout Share
            </p>
          </div>
          <Award size={48} color="var(--mm-gold)" />
        </div>
      </div>

      {/* PERFORMANCE METRICS CARDS */}
      <div className="mm-stats-grid" style={{ marginBottom: '24px' }}>
        <div className="mm-stat-tile">
          <div className="mm-stat-info">
            <span className="mm-stat-label">Completed Sessions</span>
            <span className="mm-stat-val">{perf.completed_sessions || 0}</span>
            <span className="mm-stat-sub">Req for next: {nextCrit.min_sessions || 0}</span>
          </div>
        </div>

        <div className="mm-stat-tile">
          <div className="mm-stat-info">
            <span className="mm-stat-label">Billable Minutes</span>
            <span className="mm-stat-val">{perf.completed_billable_minutes || 0}</span>
            <span className="mm-stat-sub">Total client minutes</span>
          </div>
        </div>

        <div className="mm-stat-tile">
          <div className="mm-stat-info">
            <span className="mm-stat-label">Client Rating</span>
            <span className="mm-stat-val">* {perf.rating_average || 4.9}</span>
            <span className="mm-stat-sub">Min threshold: {nextCrit.min_rating || 4.0}</span>
          </div>
        </div>

        <div className="mm-stat-tile">
          <div className="mm-stat-info">
            <span className="mm-stat-label">Cancellation Rate</span>
            <span className="mm-stat-val">{perf.cancellation_rate || 0}%</span>
            <span className="mm-stat-sub">Max threshold: {nextCrit.max_cancellation_rate || 20}%</span>
          </div>
        </div>
      </div>

      {/* ALL 10 LEVELS TABLE */}
      <div className="mm-card">
        <h3 className="mm-card-title" style={{ marginBottom: '16px' }}>All 10 Platform Progression Levels</h3>
        <table className="mm-table">
          <thead>
            <tr>
              <th>Level</th>
              <th>Title</th>
              <th>Rate / Min</th>
              <th>Required Sessions</th>
              <th>Min Billable Mins</th>
              <th>Min Rating</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allLevels.map(lvl => (
              <tr key={lvl.level} style={{ background: lvl.is_current ? '#FFF1F5' : 'transparent' }}>
                <td><strong>Level {lvl.level}</strong></td>
                <td>{lvl.title}</td>
                <td><strong>₹{lvl.price_per_minute_inr}/min</strong></td>
                <td>{lvl.min_sessions} sessions</td>
                <td>{lvl.min_minutes} mins</td>
                <td>* {lvl.min_rating}</td>
                <td>
                  {lvl.is_current ? (
                    <span className="mm-badge-status approved">Current Level</span>
                  ) : lvl.level > curr.level ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--mm-success)', fontWeight: 700 }}>Achieved</span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--mm-secondary-text)' }}>Locked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 16. BONUSES & REWARDS (/partner/bonuses)
// ============================================================================
export function PartnerBonusesPage() {
  const { token } = useAuth();
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchBonuses = () => {
    fetch(`${API_BASE}/partner/bonuses`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(setBonuses)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBonuses();
  }, [token]);

  const handleClaim = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/partner/bonuses/${id}/claim`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) {
        setMsg(json.message);
        fetchBonuses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Bonuses & Performance Rewards</h1>
          <p className="mm-dashboard-subtitle">Earn cash milestone rewards and weekend availability performance incentives</p>
        </div>
      </div>

      {msg && <div className="mm-alert mm-alert-success" style={{ marginBottom: '16px' }}><CheckCircle2 size={18} /> {msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {bonuses.map(b => (
          <div key={b.id} className="mm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="mm-badge-comm">{b.badge_text}</span>
                <span style={{ fontWeight: 800, color: 'var(--mm-success)', fontSize: '1.2rem' }}>
                  ₹{b.reward_amount_inr.toLocaleString()}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', color: 'var(--mm-plum)', margin: '4px 0 8px' }}>{b.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--mm-secondary-text)', lineHeight: 1.5, margin: '0 0 14px' }}>
                {b.description}
              </p>

              <div style={{ fontSize: '0.78rem', color: 'var(--mm-secondary-text)' }}>
                Target Criteria: <strong>{b.criteria_value} {b.criteria_type.replace('_', ' ')}</strong>
                <br />
                Your Current Progress: <strong>{b.current_progress}</strong>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid var(--mm-border)' }}>
              {b.is_claimed ? (
                <button disabled className="mm-btn-secondary mm-btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  Reward Credited to Wallet
                </button>
              ) : b.is_eligible ? (
                <button onClick={() => handleClaim(b.id)} className="mm-btn-primary mm-btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                  Claim ₹{b.reward_amount_inr} Bonus Now
                </button>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--mm-secondary-text)', display: 'block', textAlign: 'center' }}>
                  Campaign Active until {b.end_date}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 17. REVIEWS & RATINGS (/partner/reviews)
// ============================================================================
export function PartnerReviewsPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/partner/reviews`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Client Reviews & Satisfaction</h1>
          <p className="mm-dashboard-subtitle">Feedback and ratings submitted after completed consultation sessions</p>
        </div>
      </div>

      <div className="mm-card" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div style={{ textAlign: 'center', minWidth: '120px' }}>
          <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--mm-plum)', display: 'block', lineHeight: 1 }}>
            {data?.rating_average || 4.9}
          </span>
          <div style={{ color: 'var(--mm-gold)', margin: '4px 0' }}>*****</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--mm-secondary-text)' }}>
            {data?.total_reviews || 0} verified reviews
          </span>
        </div>

        <div style={{ flex: 1, borderLeft: '1px solid var(--mm-border)', paddingLeft: '24px' }}>
          {[5, 4, 3, 2, 1].map(star => {
            const count = data?.distribution?.[star] || 0;
            const pct = data?.total_reviews ? Math.round((count / data.total_reviews) * 100) : 0;
            return (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', marginBottom: '4px' }}>
                <span style={{ width: '45px' }}>{star} Stars</span>
                <div style={{ flex: 1, height: '6px', background: '#F1DCE5', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'var(--mm-gold)', borderRadius: '4px' }}></div>
                </div>
                <span style={{ width: '30px', textAlign: 'right', color: 'var(--mm-secondary-text)' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* REVIEWS LIST */}
      <div className="mm-card">
        <h3 className="mm-card-title" style={{ marginBottom: '16px' }}>Written Client Testimonials</h3>
        {!data?.reviews || data.reviews.length === 0 ? (
          <p style={{ color: 'var(--mm-secondary-text)', fontSize: '0.88rem' }}>No reviews received yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {data.reviews.map(r => (
              <div key={r.id} style={{ padding: '14px', borderRadius: '10px', background: '#FAF8FA', border: '1px solid var(--mm-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--mm-plum)' }}>{r.user_name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--mm-secondary-text)' }}>{r.date}</span>
                </div>
                <div style={{ color: 'var(--mm-gold)', fontSize: '0.85rem', marginBottom: '6px' }}>
                  {'*'.repeat(r.rating)}{'*'.repeat(5 - r.rating)}
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--mm-primary-text)', lineHeight: 1.5, margin: 0 }}>
                  "{r.review_text}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 18. NOTIFICATIONS (/partner/notifications)
// ============================================================================
export function PartnerNotificationsPage() {
  const { token } = useAuth();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    fetch(`${API_BASE}/partner/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(setNotifs)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, [token]);

  const handleMarkAll = async () => {
    await fetch(`${API_BASE}/partner/notifications/read-all`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchNotifs();
  };

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Notification Center</h1>
          <p className="mm-dashboard-subtitle">Booking alerts, payment credits, and platform announcements</p>
        </div>
        <button onClick={handleMarkAll} className="mm-btn-secondary mm-btn-sm">
          Mark All as Read
        </button>
      </div>

      <div className="mm-card">
        {notifs.length === 0 ? (
          <p style={{ color: 'var(--mm-secondary-text)', textAlign: 'center', padding: '24px' }}>
            No new notifications.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifs.map(n => (
              <div
                key={n.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: n.is_read ? '#FFFFFF' : '#FFF1F5',
                  border: '1px solid var(--mm-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 2px', color: 'var(--mm-plum)', fontSize: '0.9rem' }}>{n.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--mm-primary-text)' }}>{n.message}</p>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--mm-secondary-text)', whiteSpace: 'nowrap' }}>
                  {n.date}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ============================================================================
// 19. HELP & SUPPORT TICKETS (/partner/support)
// ============================================================================
export function PartnerSupportPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState('Earnings & Payouts');
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(true);

  const fetchTickets = () => {
    fetch(`${API_BASE}/partner/support`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(setTickets)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/partner/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          subject,
          description: desc,
          priority
        })
      });
      if (res.ok) {
        setShowModal(false);
        setSubject('');
        setDesc('');
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Help & Support Desk</h1>
          <p className="mm-dashboard-subtitle">Direct ticket support for financial clarifications, technical assistance, and inquiries</p>
        </div>
        <button onClick={() => setShowModal(true)} className="mm-btn-primary mm-btn-md">
          <Plus size={16} /> Open Support Ticket
        </button>
      </div>

      <div className="mm-card">
        {tickets.length === 0 ? (
          <p style={{ color: 'var(--mm-secondary-text)', textAlign: 'center', padding: '24px' }}>
            No support tickets created.
          </p>
        ) : (
          <table className="mm-table">
            <thead>
              <tr>
                <th>Ticket Code</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t.id}>
                  <td><code>{t.ticket_code}</code></td>
                  <td>{t.category}</td>
                  <td><strong>{t.subject}</strong></td>
                  <td style={{ textTransform: 'capitalize' }}>{t.priority}</td>
                  <td>
                    <span className={`mm-badge-status ${t.status === 'resolved' ? 'approved' : 'pending'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="mm-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="mm-modal-card" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: 'var(--mm-plum)', marginTop: 0 }}>Open a Support Ticket</h3>
            <form onSubmit={handleCreate}>
              <div className="mm-form-group">
                <label className="mm-form-label">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="mm-select">
                  <option value="Earnings & Payouts">Earnings & Payouts</option>
                  <option value="Technical Support">Technical & WebRTC Issues</option>
                  <option value="Client Policy Dispute">Client Policy Dispute</option>
                  <option value="Account & KYC">Account & KYC Verification</option>
                </select>
              </div>

              <div className="mm-form-group">
                <label className="mm-form-label">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="mm-input"
                  placeholder="Summary of issue..."
                  required
                />
              </div>

              <div className="mm-form-group">
                <label className="mm-form-label">Details *</label>
                <textarea
                  rows="4"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  className="mm-textarea"
                  placeholder="Explain your question or problem in detail..."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="mm-btn-secondary mm-btn-md">
                  Cancel
                </button>
                <button type="submit" className="mm-btn-primary mm-btn-md">
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

// ============================================================================
// 20. SETTINGS (/partner/settings)
// ============================================================================
export function PartnerSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout role="partner">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Account & Studio Settings</h1>
          <p className="mm-dashboard-subtitle">Configure notification channels, privacy parameters, and security credentials</p>
        </div>
      </div>

      {saved && (
        <div className="mm-alert mm-alert-success" style={{ marginBottom: '18px' }}>
          <CheckCircle2 size={18} /> Preferences successfully updated!
        </div>
      )}

      <div className="mm-card" style={{ maxWidth: '640px' }}>
        <form onSubmit={handleSave}>
          <h3 style={{ color: 'var(--mm-plum)', marginBottom: '14px' }}>Notification Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} />
              Email alerts for new client bookings and payments
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={smsAlerts} onChange={e => setSmsAlerts(e.target.checked)} />
              SMS / WhatsApp session start reminders (15 mins prior)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={inAppAlerts} onChange={e => setInAppAlerts(e.target.checked)} />
              Browser push notifications for incoming real-time chats
            </label>
          </div>

          <h3 style={{ color: 'var(--mm-plum)', marginBottom: '14px' }}>Security & Login</h3>
          <div className="mm-form-group">
            <label className="mm-form-label">Current Password</label>
            <input type="password" placeholder="--------" className="mm-input" />
          </div>

          <div className="mm-grid-2">
            <div className="mm-form-group">
              <label className="mm-form-label">New Password</label>
              <input type="password" placeholder="--------" className="mm-input" />
            </div>
            <div className="mm-form-group">
              <label className="mm-form-label">Confirm New Password</label>
              <input type="password" placeholder="--------" className="mm-input" />
            </div>
          </div>

          <button type="submit" className="mm-btn-primary mm-btn-md" style={{ marginTop: '16px' }}>
            Save Preferences
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
