import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, Settings, CheckCircle2, Heart,
  MessageSquare, Star, ArrowRight, AlertCircle,
  Search, ShieldCheck, Send, User, Lock, Sparkles,
  RefreshCw, ChevronRight, Bell, BookOpen, Users,
  Wallet, Phone, Video, CreditCard, History, Zap, TrendingUp
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../apiConfig';
import { openRazorpayCheckout } from '../../utils/razorpay';

// ---------------------------------------------------------------------------
// PAYWALL GUARD -- shown inside any user page if not subscribed
// ---------------------------------------------------------------------------
function SubscriptionGuard({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user?.subscription_paid) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#4A154B,#E91E63)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Lock size={30} color="#fff" />
        </div>
        <h2 style={{ color: '#4A154B', fontSize: '1.4rem', fontWeight: '800', margin: '0 0 10px' }}>Membership Required</h2>
        <p style={{ color: '#756572', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          Activate your MAANMITRA membership for a one-time fee of <strong>&#8377;499</strong> to access your full portal -- profile matching, messaging, AI coach, and more.
        </p>
        <button
          onClick={() => navigate('/user/subscribe')}
          style={{ background: 'linear-gradient(135deg,#E91E63,#C2185B)', color: '#fff', border: 'none', borderRadius: '14px', padding: '14px 32px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Heart size={18} fill="#fff" /> Activate Membership -- &#8377;499
        </button>
      </div>
    );
  }
  return children;
}

// ---------------------------------------------------------------------------
// 1. USER DASHBOARD (/user/dashboard)
// ---------------------------------------------------------------------------
export function UserDashboardPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always load free articles
    fetch(`${API_BASE}/user/content/articles`)
      .then(res => res.ok ? res.json() : [])
      .then(d => setArticles(Array.isArray(d) ? d.slice(0, 3) : []))
      .catch(console.error);

    if (user?.subscription_paid && token) {
      fetch(`${API_BASE}/user/matches`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : [])
        .then(d => setMatches(Array.isArray(d) ? d.slice(0, 3) : []))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, user]);

  const emojiMap = { heart: '', star: '', brain: '', chat: '', globe: '' };

  return (
    <DashboardLayout role="user">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Namaste, {user?.full_name?.split(' ')[0] || 'Friend'}</h1>
          <p className="mm-dashboard-subtitle">Welcome to MAANMITRA -- your trusted relationship companion</p>
        </div>
        {user?.subscription_paid ? (
          <button onClick={() => navigate('/user/discover')} className="mm-btn-primary mm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={14} /> Discover Matches
          </button>
        ) : (
          <button onClick={() => navigate('/user/subscribe')} className="mm-btn-primary mm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#E91E63,#C2185B)' }}>
            <Heart size={14} /> Activate -- &#8377;499
          </button>
        )}
      </div>

      {/* Subscription Banner if not paid */}
      {!user?.subscription_paid && (
        <div style={{ background: 'linear-gradient(135deg,#4A154B,#611E63)', borderRadius: '20px', padding: '24px 28px', marginBottom: '24px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.78rem', opacity: 0.75, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MAANMITRA MEMBERSHIP</div>
            <h2 style={{ margin: '0 0 6px', fontSize: '1.3rem', fontWeight: '800' }}>Activate Your Profile Today</h2>
            <p style={{ margin: 0, opacity: 0.85, fontSize: '0.88rem' }}>One-time &#8377;499 -- Lifetime access. Find your match, chat privately, get AI guidance.</p>
          </div>
          <button
            onClick={() => navigate('/user/subscribe')}
            style={{ background: 'linear-gradient(135deg,#E91E63,#C2185B)', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(0,0,0,0.25)' }}
          >
            Join Now -- &#8377;499
          </button>
        </div>
      )}

      {/* Stats Row */}
      {user?.subscription_paid && (
        <div className="mm-stats-grid" style={{ marginBottom: '24px' }}>
          <div className="mm-stat-tile" style={{ cursor: 'pointer' }} onClick={() => navigate('/user/wallet')}>
            <div className="mm-stat-icon-wrap" style={{ background: '#FFF1F5', color: '#E91E63' }}><Wallet size={22} /></div>
            <div className="mm-stat-info">
              <span className="mm-stat-label">Wallet Balance</span>
              <span className="mm-stat-val" style={{ color: '#E91E63' }}>₹{user?.wallet_balance_inr || 0}</span>
            </div>
          </div>
          <div className="mm-stat-tile">
            <div className="mm-stat-icon-wrap" style={{ background: '#FFF1F5', color: '#E91E63' }}><Heart size={22} /></div>
            <div className="mm-stat-info">
              <span className="mm-stat-label">Mutual Matches</span>
              <span className="mm-stat-val">{matches.length}</span>
            </div>
          </div>
          <div className="mm-stat-tile">
            <div className="mm-stat-icon-wrap" style={{ background: '#E8F5E9', color: '#22A447' }}><Users size={22} /></div>
            <div className="mm-stat-info">
              <span className="mm-stat-label">Membership</span>
              <span className="mm-stat-val" style={{ fontSize: '0.95rem', color: '#22A447' }}>Active</span>
            </div>
          </div>
          <div className="mm-stat-tile">
            <div className="mm-stat-icon-wrap" style={{ background: '#FFF8E1', color: '#D4AF77' }}><ShieldCheck size={22} /></div>
            <div className="mm-stat-info">
              <span className="mm-stat-label">Privacy</span>
              <span className="mm-stat-val">100% Safe</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Matches */}
      {user?.subscription_paid && matches.length > 0 && (
        <div className="mm-card" style={{ marginBottom: '24px' }}>
          <div className="mm-card-header-row">
            <h3 className="mm-card-title">Your Matches</h3>
            <Link to="/user/matches" className="mm-link-accent">View All <ChevronRight size={14} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginTop: '16px' }}>
            {matches.map(m => (
              <div key={m.match_id} style={{ background: '#FFF1F5', borderRadius: '14px', padding: '16px', textAlign: 'center', border: '1px solid #F1DCE5' }}>
                <img src={m.photo_url || '/counselor_ananya.jpg'} alt={m.full_name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', marginBottom: '8px' }} />
                <div style={{ fontWeight: '700', color: '#4A154B', fontSize: '0.88rem' }}>{m.full_name}</div>
                {m.city && <div style={{ color: '#9B7EA8', fontSize: '0.75rem' }}>{m.city}</div>}
                <Link to={`/user/chat/${m.match_id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px', background: '#E91E63', color: '#fff', borderRadius: '8px', padding: '5px 12px', fontSize: '0.75rem', fontWeight: '700', textDecoration: 'none' }}>
                  <MessageSquare size={12} /> Chat
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discover prompt if no matches */}
      {user?.subscription_paid && matches.length === 0 && !loading && (
        <div className="mm-card" style={{ marginBottom: '24px', textAlign: 'center', padding: '32px' }}>
          <Heart size={40} color="#E91E63" style={{ marginBottom: '12px' }} />
          <h3 style={{ color: '#4A154B', margin: '0 0 8px' }}>Start Discovering Matches</h3>
          <p style={{ color: '#756572', margin: '0 0 20px', fontSize: '0.9rem' }}>Browse profiles and like the ones you connect with. When both of you like each other, it's a match!</p>
          <Link to="/user/discover" className="mm-btn-primary">Discover Profiles <ArrowRight size={16} /></Link>
        </div>
      )}

      {/* Free Content Articles */}
      <div className="mm-card">
        <div className="mm-card-header-row">
          <h3 className="mm-card-title">Relationship Guidance</h3>
          <Link to="/user/content" className="mm-link-accent">All Articles <ChevronRight size={14} /></Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {articles.map(a => (
            <div key={a.id} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '12px', background: '#FFF9FC', borderRadius: '12px', border: '1px solid #F1DCE5' }}>
              <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg,#4A154B,#E91E63)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', color: '#E91E63', fontWeight: '700', marginBottom: '2px' }}>{a.category} -- {a.read_time}</div>
                <div style={{ fontWeight: '700', color: '#32152E', fontSize: '0.88rem', marginBottom: '2px' }}>{a.title}</div>
                <div style={{ color: '#756572', fontSize: '0.8rem' }}>{a.summary}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// 2. DISCOVER PROFILES (/user/discover)
// ---------------------------------------------------------------------------
export function UserDiscoverPage() {
  const { user, token } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});
  const [matches, setMatches] = useState({});

  const fetchProfiles = () => {
    setLoading(true);
    fetch(`${API_BASE}/user/discover`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(d => setProfiles(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (token) fetchProfiles(); }, [token]);

  const handleLike = async (targetUserId) => {
    setLiked(prev => ({ ...prev, [targetUserId]: true }));
    try {
      const res = await fetch(`${API_BASE}/user/like/${targetUserId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.is_mutual) {
          setMatches(prev => ({ ...prev, [targetUserId]: data.match_id }));
        }
      }
    } catch (err) { console.error(err); }
  };

  return (
    <DashboardLayout role="user">
      <SubscriptionGuard>
        <div className="mm-dashboard-header">
          <div>
            <h1 className="mm-dashboard-title">Discover Matches</h1>
            <p className="mm-dashboard-subtitle">Like profiles to express interest. When both of you like each other, it's a Match!</p>
          </div>
          <button onClick={fetchProfiles} className="mm-btn-secondary mm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="mm-loading-state"><div className="mm-spinner" /><p>Finding profiles for you...</p></div>
        ) : profiles.length === 0 ? (
          <div className="mm-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <Heart size={48} color="#E91E63" style={{ marginBottom: '16px', opacity: 0.4 }} />
            <h3 style={{ color: '#4A154B' }}>No new profiles right now</h3>
            <p style={{ color: '#756572' }}>You have seen all available profiles. Check back soon!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {profiles.map(p => (
              <div key={p.user_id} style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 4px 20px rgba(74,21,75,0.08)', border: '1px solid #F1DCE5', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '200px', background: 'linear-gradient(135deg,#4A154B,#611E63)' }}>
                  <img src={p.photo_url || '/counselor_ananya.jpg'} alt={p.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                  {matches[p.user_id] && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#E91E63', color: '#fff', borderRadius: '20px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: '700' }}>
                      Mutual Match!
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px' }}>
                  <div style={{ fontWeight: '800', color: '#4A154B', fontSize: '1rem', marginBottom: '2px' }}>{p.full_name}{p.age ? `, ${p.age}` : ''}</div>
                  {p.city && <div style={{ color: '#9B7EA8', fontSize: '0.78rem', marginBottom: '8px' }}>{p.city}</div>}
                  {p.bio && <p style={{ color: '#756572', fontSize: '0.82rem', margin: '0 0 10px', lineHeight: 1.5 }}>{p.bio}</p>}
                  {p.interests && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                      {p.interests.split(',').slice(0, 3).map((tag, i) => (
                        <span key={i} style={{ background: '#F5E6FF', color: '#7C3AED', borderRadius: '20px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: '600' }}>{tag.trim()}</span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => handleLike(p.user_id)}
                    disabled={liked[p.user_id]}
                    style={{
                      width: '100%', padding: '10px',
                      background: liked[p.user_id] ? (matches[p.user_id] ? 'linear-gradient(135deg,#22A447,#16803A)' : '#D4AF77') : 'linear-gradient(135deg,#E91E63,#C2185B)',
                      color: '#fff', border: 'none', borderRadius: '10px',
                      fontSize: '0.88rem', fontWeight: '700', cursor: liked[p.user_id] ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <Heart size={15} fill={liked[p.user_id] ? '#fff' : 'transparent'} />
                    {liked[p.user_id] ? (matches[p.user_id] ? 'Matched!' : 'Liked') : 'Like'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SubscriptionGuard>
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// 3. MY MATCHES (/user/matches)
// ---------------------------------------------------------------------------
export function UserMatchesPage() {
  const { token } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/user/matches`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(d => setMatches(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <DashboardLayout role="user">
      <SubscriptionGuard>
        <div className="mm-dashboard-header">
          <div>
            <h1 className="mm-dashboard-title">My Matches</h1>
            <p className="mm-dashboard-subtitle">These are your mutual matches. Start a conversation!</p>
          </div>
        </div>

        {loading ? (
          <div className="mm-loading-state"><div className="mm-spinner" /><p>Loading matches...</p></div>
        ) : matches.length === 0 ? (
          <div className="mm-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <Heart size={48} color="#E91E63" style={{ marginBottom: '16px', opacity: 0.4 }} />
            <h3 style={{ color: '#4A154B' }}>No mutual matches yet</h3>
            <p style={{ color: '#756572', marginBottom: '20px' }}>Go discover profiles and start liking. When someone likes you back, you'll see them here.</p>
            <Link to="/user/discover" className="mm-btn-primary">Discover Profiles</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {matches.map(m => (
              <div key={m.match_id} style={{ background: '#fff', borderRadius: '20px', border: '1px solid #F1DCE5', boxShadow: '0 4px 16px rgba(74,21,75,0.07)', overflow: 'hidden' }}>
                <div style={{ height: '160px', background: 'linear-gradient(135deg,#4A154B,#E91E63)', position: 'relative' }}>
                  <img src={m.photo_url || '/counselor_ananya.jpg'} alt={m.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                  <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: '#E91E63', color: '#fff', borderRadius: '12px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: '700' }}>
                    Matched {m.matched_at ? new Date(m.matched_at).toLocaleDateString('en-IN') : ''}
                  </div>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: '800', color: '#4A154B', marginBottom: '2px' }}>{m.full_name}{m.age ? `, ${m.age}` : ''}</div>
                  {m.city && <div style={{ color: '#9B7EA8', fontSize: '0.78rem', marginBottom: '10px' }}>{m.city}</div>}
                  <Link
                    to={`/user/chat/${m.match_id}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'linear-gradient(135deg,#4A154B,#611E63)', color: '#fff', borderRadius: '10px', padding: '10px', fontSize: '0.85rem', fontWeight: '700', textDecoration: 'none' }}
                  >
                    <MessageSquare size={15} /> Start Chat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </SubscriptionGuard>
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// 4. MATCH CHAT (/user/chat/:matchId)
// ---------------------------------------------------------------------------
export function UserMatchChatPage() {
  const { token, user, setUser } = useAuth();
  const matchId = window.location.pathname.split('/').pop();
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [topupModalOpen, setTopupModalOpen] = useState(false);
  const [sessionAction, setSessionAction] = useState(null); // 'call' | 'video'
  const [topupAmount, setTopupAmount] = useState(250);
  const [topupLoading, setTopupLoading] = useState(false);
  const [callAlert, setCallAlert] = useState(null);
  const bottomRef = useRef(null);

  const fetchMessages = () => {
    fetch(`${API_BASE}/user/matches/${matchId}/messages`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(d => { setMessages(Array.isArray(d) ? d : []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (token && matchId) fetchMessages(); }, [token, matchId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = inputVal.trim();
    if (!text || sending) return;
    setSending(true);
    setInputVal('');
    setMessages(prev => [...prev, { id: Date.now(), is_me: true, text, sent_at: new Date().toISOString(), is_read: false }]);
    try {
      await fetch(`${API_BASE}/user/matches/${matchId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
    } catch (err) { console.error(err); }
    setSending(false);
  };

  const initiateSession = (type) => {
    setSessionAction(type);
    const minRequired = type === 'video' ? 25 : 15;
    const currentBal = user?.wallet_balance_inr || 0;
    if (currentBal < minRequired) {
      setTopupModalOpen(true);
    } else {
      setCallAlert(`Connecting ${type === 'video' ? 'HD Video Call (VC)' : 'Voice Call'}... Wallet balance: ₹${currentBal} (deducts ₹${minRequired}/min).`);
      setTimeout(() => setCallAlert(null), 5000);
    }
  };

  const handleQuickTopup = async (amount) => {
    setTopupLoading(true);
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
        name: 'MAANMITRA Wallet',
        description: `Top-up ₹${amount} for Chat, Voice & Video Call sessions`,
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
            const updated = { ...user, wallet_balance_inr: vData.wallet_balance_inr };
            setUser(updated);
            localStorage.setItem('mm_user', JSON.stringify(updated));
            setTopupModalOpen(false);
            setCallAlert(`₹${amount} added successfully! New Balance: ₹${vData.wallet_balance_inr}. Starting your ${sessionAction || 'session'} now.`);
            setTimeout(() => setCallAlert(null), 5000);
          }
        },
        onDismiss: () => setTopupLoading(false),
        onError: () => setTopupLoading(false)
      });
    } catch (e) {
      console.error(e);
    } finally {
      setTopupLoading(false);
    }
  };

  return (
    <DashboardLayout role="user">
      <SubscriptionGuard>
        <div className="mm-dashboard-header">
          <div>
            <h1 className="mm-dashboard-title">Match Chat &amp; Calls</h1>
            <p className="mm-dashboard-subtitle">Private, encrypted conversation with your verified match</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              to="/user/wallet"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: '#FFF1F5',
                border: '1px solid #F0DCE8',
                color: '#4A154B',
                fontWeight: 700,
                fontSize: '0.82rem',
                textDecoration: 'none'
              }}
            >
              <Wallet size={15} color="#E91E63" />
              <span>Wallet: ₹{user?.wallet_balance_inr || 0}</span>
              <span style={{ fontSize: '0.7rem', color: '#E91E63', fontWeight: 800 }}>+Top-Up</span>
            </Link>
            <Link to="/user/matches" className="mm-btn-secondary mm-btn-sm">All Matches</Link>
          </div>
        </div>

        {callAlert && (
          <div
            style={{
              padding: '12px 18px',
              borderRadius: '12px',
              background: '#E8F5E9',
              color: '#2E7D32',
              border: '1px solid #A5D6A7',
              marginBottom: '16px',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{callAlert}</span>
          </div>
        )}

        <div className="mm-chat-box-container">
          <div className="mm-chat-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mm-status-dot online" />
              <strong>Match Conversation</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--mm-secondary-text)', marginLeft: '6px' }}>Encrypted</span>
            </div>

            {/* Voice & Video Call Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => initiateSession('call')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FFF1F5',
                  border: '1px solid #F0DCE8',
                  color: '#4A154B',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Voice Call (₹15/min)"
              >
                <Phone size={14} color="#E91E63" /> Call (₹15/m)
              </button>
              <button
                type="button"
                onClick={() => initiateSession('video')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #4A154B, #E91E63)',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(233, 30, 99, 0.2)'
                }}
                title="HD Video Call (₹25/min)"
              >
                <Video size={14} /> Video Call (₹25/m)
              </button>
            </div>
          </div>

          <div className="mm-chat-messages-area">
            {loading ? <div style={{ textAlign: 'center', padding: '40px' }}><div className="mm-spinner" /></div> :
              messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9B7EA8' }}>
                  No messages yet. Say hello or start a call!
                </div>
              ) : (
                messages.map(m => (
                  <div key={m.id} className={`mm-chat-bubble ${m.is_me ? 'outgoing' : 'incoming'}`}>
                    <div className="mm-bubble-text">{m.text || m.message_text}</div>
                    <span className="mm-bubble-time">{m.sent_at ? new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                ))
              )
            }
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="mm-chat-input-bar">
            <input
              type="text" placeholder="Type your message..."
              value={inputVal} onChange={e => setInputVal(e.target.value)}
              className="mm-input" disabled={sending}
            />
            <button type="submit" className="mm-btn-primary" disabled={sending || !inputVal.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Top-Up Modal for Calls & VC */}
        {topupModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(30, 10, 32, 0.65)',
              backdropFilter: 'blur(5px)',
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
                padding: '30px',
                maxWidth: '460px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                border: '1px solid #F0DCE8'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wallet size={22} color="#E91E63" />
                  <h3 style={{ margin: 0, color: '#4A154B', fontSize: '1.2rem', fontWeight: 800 }}>
                    Recharge Wallet to Connect
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setTopupModalOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#8E738A' }}
                >
                  &times;
                </button>
              </div>

              <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: '#665063', lineHeight: 1.5 }}>
                Your current wallet balance is <strong>₹{user?.wallet_balance_inr || 0}</strong>.
                {sessionAction === 'video' ? ' HD Video Calls require at least ₹25.' : ' Voice Calls require at least ₹15.'}
                Please top up to proceed.
              </p>

              {/* Quick Preset Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {[100, 250, 500].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopupAmount(amt)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '12px',
                      border: topupAmount === amt ? '2px solid #E91E63' : '1px solid #EADBEC',
                      background: topupAmount === amt ? '#FFF1F5' : '#FFFFFF',
                      fontWeight: 800,
                      color: '#4A154B',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    ₹{amt}
                    <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 500, color: '#8E738A', marginTop: '2px' }}>
                      {amt === 100 ? 'Basic' : amt === 250 ? 'Popular' : 'Best'}
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleQuickTopup(topupAmount)}
                disabled={topupLoading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: topupLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 18px rgba(233, 30, 99, 0.3)'
                }}
              >
                <CreditCard size={18} />
                {topupLoading ? 'Connecting Razorpay...' : `Pay ₹${topupAmount} via Razorpay`}
              </button>

              <div style={{ textAlign: 'center', marginTop: '14px' }}>
                <Link
                  to="/user/wallet"
                  onClick={() => setTopupModalOpen(false)}
                  style={{ color: '#4A154B', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Go to Full Wallet &amp; Transactions Page
                </Link>
              </div>
            </div>
          </div>
        )}
      </SubscriptionGuard>
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// 5. CONTENT / ARTICLES (/user/content)
// ---------------------------------------------------------------------------
export function UserContentPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch(`${API_BASE}/user/content/articles`)
      .then(res => res.ok ? res.json() : [])
      .then(d => setArticles(Array.isArray(d) ? d : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(articles.map(a => a.category))];
  const filtered = activeCategory === 'All' ? articles : articles.filter(a => a.category === activeCategory);
  const catColors = { Relationship: '#E91E63', Astrology: '#D4AF77', 'Self-Growth': '#7C3AED', Guidance: '#22A447' };

  return (
    <DashboardLayout role="user">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Guidance & Astrology</h1>
          <p className="mm-dashboard-subtitle">Free relationship articles, horoscope, and self-improvement content</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mm-tabs-bar" style={{ marginBottom: '20px' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`mm-tab-btn ${activeCategory === cat ? 'active' : ''}`}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mm-loading-state"><div className="mm-spinner" /><p>Loading articles...</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map(a => (
            <div key={a.id} style={{ background: '#fff', borderRadius: '18px', border: '1px solid #F1DCE5', overflow: 'hidden', boxShadow: '0 2px 12px rgba(74,21,75,0.06)' }}>
              <div style={{ height: '8px', background: catColors[a.category] || '#4A154B' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'inline-block', background: (catColors[a.category] || '#4A154B') + '15', color: catColors[a.category] || '#4A154B', borderRadius: '20px', padding: '3px 10px', fontSize: '0.72rem', fontWeight: '700', marginBottom: '10px' }}>
                  {a.category}
                </div>
                <h3 style={{ color: '#4A154B', fontSize: '0.95rem', fontWeight: '800', margin: '0 0 8px', lineHeight: 1.3 }}>{a.title}</h3>
                <p style={{ color: '#756572', fontSize: '0.82rem', margin: '0 0 12px', lineHeight: 1.5 }}>{a.summary}</p>
                <div style={{ fontSize: '0.75rem', color: '#B4A0B8' }}>{a.read_time} read</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// 6. AI ASSISTANT (/user/ai)
// ---------------------------------------------------------------------------
export function UserAIPage() {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Namaste! I am your MAANMITRA AI relationship coach. Ask me anything about relationships, communication, compatibility, or emotional wellness. I am here to help! (5 messages per day)' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(5);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = inputVal.trim();
    if (!text || loading || remaining <= 0) return;
    setLoading(true);
    setInputVal('');
    setMessages(prev => [...prev, { role: 'user', text }]);

    try {
      const res = await fetch(`${API_BASE}/user/ai/chat`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
        setRemaining(data.remaining_today);
      } else {
        const err = await res.json().catch(() => ({}));
        setMessages(prev => [...prev, { role: 'assistant', text: err.detail || 'Sorry, I could not process that. Please try again.' }]);
        if (res.status === 429) setRemaining(0);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Connection error. Please check your internet and try again.' }]);
    }
    setLoading(false);
  };

  return (
    <DashboardLayout role="user">
      <SubscriptionGuard>
        <div className="mm-dashboard-header">
          <div>
            <h1 className="mm-dashboard-title">AI Relationship Coach</h1>
            <p className="mm-dashboard-subtitle">Ask for guidance on relationships, communication & compatibility</p>
          </div>
          <div style={{ background: remaining > 0 ? '#F0FDF4' : '#FEECEE', border: `1px solid ${remaining > 0 ? '#86EFAC' : '#FCA5A5'}`, color: remaining > 0 ? '#16A34A' : '#DC2626', borderRadius: '10px', padding: '6px 14px', fontSize: '0.82rem', fontWeight: '700' }}>
            {remaining} / 5 messages left today
          </div>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #F1DCE5', boxShadow: '0 4px 20px rgba(74,21,75,0.08)', overflow: 'hidden' }}>
            {/* Chat Header */}
            <div style={{ background: 'linear-gradient(135deg,#4A154B,#611E63)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={20} color="#fff" />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem' }}>MAANMITRA AI Coach</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>Powered by AI -- Relationship Guidance</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ height: '400px', overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '80%', padding: '12px 16px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: m.role === 'user' ? 'linear-gradient(135deg,#4A154B,#611E63)' : '#F5F0FF',
                    color: m.role === 'user' ? '#fff' : '#32152E',
                    fontSize: '0.88rem', lineHeight: 1.6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ background: '#F5F0FF', borderRadius: '18px 18px 18px 4px', padding: '12px 20px', color: '#7C3AED', fontSize: '0.85rem' }}>
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            {remaining > 0 ? (
              <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid #F1DCE5', display: 'flex', gap: '10px' }}>
                <input
                  type="text" placeholder="Ask about relationships, compatibility, communication..."
                  value={inputVal} onChange={e => setInputVal(e.target.value)}
                  className="mm-input" disabled={loading}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="mm-btn-primary" disabled={loading || !inputVal.trim()}>
                  <Send size={16} />
                </button>
              </form>
            ) : (
              <div style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid #F1DCE5', background: '#FFF8F0', color: '#92400E', fontSize: '0.85rem' }}>
                Daily limit reached (5 messages/day). Come back tomorrow!
              </div>
            )}
          </div>

          {/* Suggested Prompts */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ color: '#9B7EA8', fontSize: '0.78rem', marginBottom: '8px', fontWeight: '600' }}>Try asking:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                'How do I know if someone is right for me?',
                'Tips for better communication in relationships',
                'How does astrology affect compatibility?',
                'How to overcome fear of commitment?'
              ].map((q, i) => (
                <button key={i} onClick={() => setInputVal(q)} disabled={remaining <= 0}
                  style={{ background: '#F5E6FF', color: '#7C3AED', border: '1px solid #E9D5FF', borderRadius: '20px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: '600', cursor: remaining > 0 ? 'pointer' : 'not-allowed', opacity: remaining > 0 ? 1 : 0.5 }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SubscriptionGuard>
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// 7. USER PROFILE PAGE (/user/profile)
// ---------------------------------------------------------------------------
export function UserProfilePage() {
  const { user, token, setUser } = useAuth();
  const [form, setForm] = useState({
    full_name: user?.full_name || '', phone: user?.phone || '',
    gender: '', age: '', city: '', bio: '', looking_for: 'partner',
    interests: '', horoscope_sign: '', education: '', occupation: ''
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    // Load account info
    setForm(f => ({ ...f, full_name: user?.full_name || '', phone: user?.phone || '' }));
    if (user?.subscription_paid) {
      fetch(`${API_BASE}/user/my-profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : {})
        .then(d => {
          if (d.has_profile) setForm(f => ({ ...f, ...d }));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save account info
      await fetch(`${API_BASE}/user/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: form.full_name, phone: form.phone })
      });
      // Save relationship profile if subscribed
      if (user?.subscription_paid) {
        await fetch(`${API_BASE}/user/my-profile`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      }
      const updated = { ...user, full_name: form.full_name, phone: form.phone };
      setUser(updated);
      localStorage.setItem('mm_user', JSON.stringify(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const field = (label, name, type = 'text', options = null) => (
    <div className="mm-form-group">
      <label className="mm-form-label">{label}</label>
      {options ? (
        <select className="mm-input" value={form[name] || ''} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea className="mm-input" value={form[name] || ''} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} rows={3} style={{ resize: 'vertical' }} />
      ) : (
        <input type={type} className="mm-input" value={form[name] || ''} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} />
      )}
    </div>
  );

  return (
    <DashboardLayout role="user">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">My Profile</h1>
          <p className="mm-dashboard-subtitle">Manage your account and relationship profile</p>
        </div>
      </div>

      <div className="mm-card" style={{ maxWidth: '640px' }}>
        {saved && (
          <div className="mm-alert mm-alert-success" style={{ marginBottom: '16px' }}>
            <CheckCircle2 size={18} /> Profile saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="mm-auth-form">
          <div style={{ background: '#F9F5FF', borderRadius: '12px', padding: '14px', marginBottom: '20px', fontSize: '0.85rem', color: '#6D28D9' }}>
            <strong>Account Information</strong>
          </div>
          {field('Full Name', 'full_name')}
          <div className="mm-form-group">
            <label className="mm-form-label">Email (Login ID)</label>
            <input type="email" defaultValue={user?.email || ''} className="mm-input" disabled />
          </div>
          {field('Phone Number', 'phone', 'tel')}

          {user?.subscription_paid && (
            <>
              <div style={{ background: '#FFF1F5', borderRadius: '12px', padding: '14px', margin: '20px 0', fontSize: '0.85rem', color: '#E91E63' }}>
                <strong>Relationship Profile</strong> -- Visible to your matches
              </div>
              {field('Gender', 'gender', 'text', [
                { value: '', label: 'Select gender...' },
                { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' }
              ])}
              {field('Age', 'age', 'number')}
              {field('City', 'city')}
              {field('About Me', 'bio', 'textarea')}
              {field('Looking For', 'looking_for', 'text', [
                { value: 'partner', label: 'Life Partner' }, { value: 'marriage', label: 'Marriage' },
                { value: 'friendship', label: 'Friendship' }
              ])}
              {field('Interests (comma-separated)', 'interests')}
              {field('Horoscope Sign', 'horoscope_sign', 'text', [
                { value: '', label: 'Select sign...' },
                ...['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(s => ({ value: s.toLowerCase(), label: s }))
              ])}
              {field('Education', 'education')}
              {field('Occupation', 'occupation')}
            </>
          )}

          <button type="submit" disabled={saving} className="mm-btn-primary mm-btn-lg" style={{ marginTop: '8px' }}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// 8. SUBSCRIPTION STATUS (/user/subscription)
// ---------------------------------------------------------------------------
export function UserSubscriptionStatusPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <DashboardLayout role="user">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Membership Status</h1>
          <p className="mm-dashboard-subtitle">Your MAANMITRA portal subscription details</p>
        </div>
      </div>

      <div className="mm-card" style={{ maxWidth: '480px' }}>
        {user?.subscription_paid ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg,#22A447,#16803A)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={36} color="#fff" />
            </div>
            <h2 style={{ color: '#4A154B', margin: '0 0 8px' }}>Membership Active</h2>
            <p style={{ color: '#756572', margin: '0 0 20px' }}>You have full access to the MAANMITRA portal.</p>
            <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '12px', padding: '14px', marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', color: '#16A34A' }}><strong>Amount Paid:</strong> &#8377;499 (One-time)</div>
              <div style={{ fontSize: '0.85rem', color: '#16A34A', marginTop: '4px' }}><strong>Access:</strong> Lifetime -- No renewal needed</div>
            </div>
            <button onClick={() => navigate('/user/dashboard')} className="mm-btn-primary">Go to Dashboard</button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ width: '72px', height: '72px', background: '#F3E8F5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Lock size={32} color="#4A154B" />
            </div>
            <h2 style={{ color: '#4A154B', margin: '0 0 8px' }}>No Active Membership</h2>
            <p style={{ color: '#756572', margin: '0 0 20px' }}>Activate your membership to access all features.</p>
            <button onClick={() => navigate('/user/subscribe')} className="mm-btn-primary mm-btn-lg">
              <Heart size={18} /> Activate -- &#8377;499
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// 21. USER SESSION HISTORY (/user/sessions)
// ---------------------------------------------------------------------------
export function UserSessionsPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, totalBilled: 0, totalMinutes: 0 });

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/user/sessions`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(d => {
        const list = Array.isArray(d) ? d : (d.sessions || []);
        setSessions(list);
        const totalBilled = list.reduce((s, x) => s + (x.total_billed_inr || 0), 0);
        const totalMinutes = list.reduce((s, x) => s + (x.minutes_billed || 0), 0);
        setStats({ total: list.length, totalBilled, totalMinutes });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const typeIcon = (t) => t === 'video' ? <Video size={16} /> : t === 'audio' ? <Phone size={16} /> : <MessageSquare size={16} />;
  const typeColor = (t) => t === 'video' ? '#7C3AED' : t === 'audio' ? '#0EA5E9' : '#059669';
  const typeLabel = (t) => t === 'video' ? 'Video Call' : t === 'audio' ? 'Voice Call' : 'Text Chat';

  const formatDuration = (secs) => {
    if (!secs) return '—';
    const m = Math.floor(secs / 60), s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const statusBadge = (status) => {
    const map = {
      active: { bg: '#D1FAE5', color: '#065F46', text: 'Active' },
      ended: { bg: '#E5E7EB', color: '#374151', text: 'Ended' },
      terminated: { bg: '#FEE2E2', color: '#991B1B', text: 'Auto-Ended' },
    };
    const s = map[status] || map.ended;
    return (
      <span style={{ background: s.bg, color: s.color, fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
        {s.text}
      </span>
    );
  };

  return (
    <DashboardLayout role="user">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Session History</h1>
          <p className="mm-dashboard-subtitle">Your past counselling sessions — chat, voice &amp; video</p>
        </div>
        <button
          onClick={() => navigate('/counselling')}
          className="mm-btn-primary mm-btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Zap size={14} /> Start New Session
        </button>
      </div>

      {/* Stats Row */}
      <div className="mm-stats-grid" style={{ marginBottom: '24px' }}>
        <div className="mm-stat-tile">
          <div className="mm-stat-icon-wrap" style={{ background: '#F3E8F5', color: '#4A154B' }}>
            <History size={20} />
          </div>
          <div className="mm-stat-info">
            <span className="mm-stat-label">Total Sessions</span>
            <span className="mm-stat-val">{stats.total}</span>
          </div>
        </div>
        <div className="mm-stat-tile">
          <div className="mm-stat-icon-wrap" style={{ background: '#FFF1F5', color: '#E91E63' }}>
            <Wallet size={20} />
          </div>
          <div className="mm-stat-info">
            <span className="mm-stat-label">Total Spent</span>
            <span className="mm-stat-val">₹{stats.totalBilled.toLocaleString()}</span>
          </div>
        </div>
        <div className="mm-stat-tile">
          <div className="mm-stat-icon-wrap" style={{ background: '#FFF8E1', color: '#D4AF77' }}>
            <Clock size={20} />
          </div>
          <div className="mm-stat-info">
            <span className="mm-stat-label">Total Minutes</span>
            <span className="mm-stat-val">{stats.totalMinutes} min</span>
          </div>
        </div>
        <div className="mm-stat-tile" style={{ cursor: 'pointer' }} onClick={() => navigate('/user/wallet')}>
          <div className="mm-stat-icon-wrap" style={{ background: '#E8F5E9', color: '#22A447' }}>
            <TrendingUp size={20} />
          </div>
          <div className="mm-stat-info">
            <span className="mm-stat-label">Wallet Balance</span>
            <span className="mm-stat-val" style={{ color: '#22A447' }}>₹{user?.wallet_balance_inr || 0}</span>
          </div>
        </div>
      </div>

      {/* Session List */}
      <div className="mm-card">
        <div className="mm-card-header-row" style={{ marginBottom: '16px' }}>
          <h3 className="mm-card-title">All Sessions</h3>
          <span style={{ fontSize: '0.82rem', color: '#9CA3AF' }}>{sessions.length} records</span>
        </div>

        {loading ? (
          <div className="mm-loading-state" style={{ minHeight: '200px' }}>
            <div className="mm-spinner" />
            <p>Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ width: '72px', height: '72px', background: '#F3E8F5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <MessageSquare size={32} color="#4A154B" />
            </div>
            <h3 style={{ color: '#4A154B', margin: '0 0 8px' }}>No sessions yet</h3>
            <p style={{ color: '#9CA3AF', margin: '0 0 20px' }}>Start your first counselling session by connecting with an expert</p>
            <button onClick={() => navigate('/counselling')} className="mm-btn-primary">
              <Search size={16} /> Find a Counsellor
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
                  {['Date & Time', 'Counsellor', 'Type', 'Duration', 'Amount', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 700, color: '#6B7280', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => (
                  <tr key={s.id || i} style={{ borderBottom: '1px solid #F9FAFB', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600, color: '#1F2937' }}>
                        {s.started_at ? new Date(s.started_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#9CA3AF' }}>
                        {s.started_at ? new Date(s.started_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F3E8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <User size={14} color="#4A154B" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1F2937' }}>{s.partner_name || 'Counsellor'}</div>
                          <div style={{ fontSize: '0.74rem', color: '#9CA3AF' }}>ID #{s.partner_id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        background: `${typeColor(s.communication_type)}18`,
                        color: typeColor(s.communication_type),
                        padding: '4px 10px', borderRadius: '20px', fontWeight: 600, fontSize: '0.78rem'
                      }}>
                        {typeIcon(s.communication_type)} {typeLabel(s.communication_type)}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#374151' }}>
                      <div style={{ fontWeight: 600 }}>{formatDuration(s.duration_seconds)}</div>
                      <div style={{ fontSize: '0.74rem', color: '#9CA3AF' }}>{s.minutes_billed || 0} min billed</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 700, color: '#1F2937' }}>₹{s.total_billed_inr || 0}</div>
                      <div style={{ fontSize: '0.74rem', color: '#9CA3AF' }}>₹{s.rate_per_minute_inr || 0}/min</div>
                    </td>
                    <td style={{ padding: '12px' }}>{statusBadge(s.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Wallet CTA */}
      {!loading && sessions.length > 0 && (
        <div style={{
          marginTop: '20px', background: 'linear-gradient(135deg,#4A154B,#E91E63)',
          borderRadius: '20px', padding: '20px 24px', color: '#fff',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '3px' }}>Keep the conversations going</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Top up your wallet to book more sessions</div>
          </div>
          <button
            onClick={() => navigate('/user/wallet')}
            style={{ background: '#fff', color: '#4A154B', border: 'none', borderRadius: '12px', padding: '10px 22px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}
          >
            <Wallet size={16} /> Top Up Wallet
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
