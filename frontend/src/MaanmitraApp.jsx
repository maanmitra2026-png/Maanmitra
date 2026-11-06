import React, { useState, useEffect, useRef } from 'react';
import {
  Heart, Phone, Video, MessageSquare, ShieldCheck, CheckCircle2,
  Clock, Calendar, Users, DollarSign, Settings, Search, LogOut,
  ChevronRight, ArrowLeft, Mic, MicOff, VideoOff, Camera, Send,
  X, Check, AlertCircle, FileText, Upload, Star, UserCheck,
  TrendingUp, Award, Lock, ExternalLink, HelpCircle, Bell,
  Sparkles, RefreshCw, Smartphone, Monitor, Eye, Play, Download
} from 'lucide-react';
import { ManmitraSymbol } from './ManmitraLogo';
import './maanmitra_theme.css';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');
const WS_BASE = API_BASE.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');

export default function MaanmitraApp() {
  // Navigation & Role State
  const [activeRole, setActiveRole] = useState('user'); // 'admin', 'partner', 'user', 'public'
  const [viewMode, setViewMode] = useState('responsive'); // 'responsive' (full web app), 'phone' (390px mobile frame), 'poster' (24-screen flow map)
  const [currentScreen, setCurrentScreen] = useState('browse'); // current screen id
  const [activeTab, setActiveTab] = useState('explore'); // tab id

  // Current Logged-in User
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    full_name: 'Amit Kumar',
    email: 'amit@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    token: ''
  });

  // Data States
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [partnerStats, setPartnerStats] = useState(null);
  const [partnerApprovalStatus, setPartnerApprovalStatus] = useState('pending');
  const [partnerOnline, setPartnerOnline] = useState(true);
  const [activeBooking, setActiveBooking] = useState(null);

  // Search, Filter & Loading
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Call / Video WebRTC State
  const [callActive, setCallActive] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [callMessages, setCallMessages] = useState([
    { id: 1, sender: 'Priya Sharma', text: 'Hello! Welcome to MAANMITRA. How was your day?', time: '10:02 AM', isMe: false },
    { id: 2, sender: 'Amit', text: 'Hi Priya, work was hectic, feeling wonderful to connect and chat!', time: '10:03 AM', isMe: true }
  ]);
  const [newMessageText, setNewMessageText] = useState('');
  const localVideoRef = useRef(null);

  // Call duration counter
  useEffect(() => {
    let interval = null;
    if (callActive) {
      interval = setInterval(() => setCallTimer(t => t + 1), 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load Initial API Data
  const loadPartners = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/partners`);
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
        if (data.length > 0 && !selectedPartner) {
          setSelectedPartner(data[0]);
        }
      } else {
        setPartners(defaultPartners);
        if (!selectedPartner) setSelectedPartner(defaultPartners[0]);
      }
    } catch (e) {
      setPartners(defaultPartners);
      if (!selectedPartner) setSelectedPartner(defaultPartners[0]);
    } finally {
      setLoading(false);
    }
  };

  const loadPackages = async () => {
    try {
      const res = await fetch(`${API_BASE}/packages`);
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
        if (data.length > 0) setSelectedPackage(data[1]);
      } else {
        setPackages(defaultPackages);
        setSelectedPackage(defaultPackages[1]);
      }
    } catch (e) {
      setPackages(defaultPackages);
      setSelectedPackage(defaultPackages[1]);
    }
  };

  const loadAdminDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard`);
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
      } else {
        setAdminStats(defaultAdminStats);
      }
    } catch (e) {
      setAdminStats(defaultAdminStats);
    }
  };

  const loadPartnerDashboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/partner/dashboard`);
      if (res.ok) {
        const data = await res.json();
        setPartnerStats(data);
      } else {
        setPartnerStats(defaultPartnerStats);
      }
    } catch (e) {
      setPartnerStats(defaultPartnerStats);
    }
  };

  useEffect(() => {
    loadPartners();
    loadPackages();
    loadAdminDashboard();
    loadPartnerDashboard();
  }, []);

  // Quick Role Switcher
  const handleSwitchRole = (role) => {
    setActiveRole(role);
    if (role === 'admin') {
      setCurrentUser({
        id: 99,
        full_name: 'Maanmitra Administrator',
        email: 'admin@maanmitra.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      });
      setCurrentScreen('admin_dashboard');
      setActiveTab('dashboard');
    } else if (role === 'partner') {
      setCurrentUser({
        id: 2,
        full_name: 'Priya Sharma',
        email: 'priya@example.com',
        role: 'maanmitra_partner',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
      });
      setCurrentScreen('partner_dashboard');
      setActiveTab('home');
    } else if (role === 'user') {
      setCurrentUser({
        id: 1,
        full_name: 'Amit Kumar',
        email: 'amit@example.com',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'
      });
      setCurrentScreen('browse');
      setActiveTab('explore');
    } else if (role === 'public') {
      setCurrentScreen('public_home');
    }
  };

  // Camera stream initialization for call
  useEffect(() => {
    if (callActive && localVideoRef.current) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        })
        .catch(() => {
          console.log('Using simulated camera fallback stream');
        });
    }
  }, [callActive]);

  const handleStartCall = (bookingOrPartner, mode = 'video') => {
    setActiveBooking(bookingOrPartner);
    setCallActive(true);
    setCallTimer(0);
    setCurrentScreen('call_screen');
    showToast(`Connecting ${mode.toUpperCase()} call with ${bookingOrPartner.display_name || bookingOrPartner.partner_name || 'Partner'}...`);
  };

  const handleEndCall = () => {
    setCallActive(false);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    showToast('Call ended. Thank you for your conversation!');
    if (activeRole === 'partner') {
      setCurrentScreen('partner_dashboard');
    } else {
      setCurrentScreen('user_dashboard');
    }
  };

  const handleSendCallMessage = () => {
    if (!newMessageText.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: currentUser.full_name,
      text: newMessageText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setCallMessages(prev => [...prev, newMsg]);
    setNewMessageText('');
  };

  const handleProcessPayment = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setLoading(false);
        showToast('Payment of ₹' + (selectedPackage?.price || 299) + ' Verified Successfully via Razorpay!');
        setCurrentScreen('call_screen');
        setCallActive(true);
      }, 1200);
    } catch (e) {
      setLoading(false);
      showToast('Payment confirmed.');
    }
  };

  // Shared props bundle
  const screenProps = {
    activeRole,
    currentScreen,
    setCurrentScreen,
    partners,
    selectedPartner,
    setSelectedPartner,
    packages,
    selectedPackage,
    setSelectedPackage,
    currentUser,
    handleStartCall,
    handleEndCall,
    callActive,
    callTimer,
    formatTimer,
    micMuted,
    setMicMuted,
    videoOff,
    setVideoOff,
    chatDrawerOpen,
    setChatDrawerOpen,
    callMessages,
    newMessageText,
    setNewMessageText,
    handleSendCallMessage,
    localVideoRef,
    partnerOnline,
    setPartnerOnline,
    partnerApprovalStatus,
    setPartnerApprovalStatus,
    adminStats,
    handleProcessPayment,
    showToast,
    loading,
    handleSwitchRole,
    activeTab,
    setActiveTab
  };

  const isDesktopAuthenticated =
    viewMode === 'responsive' &&
    activeRole !== 'public' &&
    !['admin_splash', 'admin_login', 'partner_welcome', 'partner_register', 'partner_verification', 'partner_login', 'user_welcome', 'user_auth', 'call_screen'].includes(currentScreen);

  return (
    <div className="mm-app-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--mm-plum)',
          color: '#fff',
          padding: '10px 24px',
          borderRadius: '9999px',
          zIndex: 9999,
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          border: '1px solid var(--mm-gold)'
        }}>
          <Sparkles size={16} color="var(--mm-gold)" />
          {toastMessage}
        </div>
      )}

      {/* Top Master Header Bar */}
      <header className="mm-master-header">
        <div className="mm-master-logo-group" onClick={() => handleSwitchRole('public')} style={{ cursor: 'pointer' }}>
          <ManmitraSymbol size={36} color="gold" />
          <div className="mm-master-title">
            <span>MAANMITRA</span>
            <span className="mm-master-tagline">A Listening Friend, Always With You</span>
          </div>
        </div>

        {/* Center: Brand Trust Badges */}
        <div className="mm-badge-row" style={{ display: window.innerWidth < 1100 ? 'none' : 'flex' }}>
          <div className="mm-top-badge"><ShieldCheck size={14} color="#22A447" /> Safe & Secure</div>
          <div className="mm-top-badge"><UserCheck size={14} color="var(--mm-gold)" /> Verified Partners</div>
          <div className="mm-top-badge"><Lock size={14} color="var(--mm-rose)" /> Private Chat & Call</div>
          <div className="mm-top-badge"><Heart size={14} color="var(--mm-rose)" /> Meaningful Connections</div>
        </div>

        {/* Right Controls: View Mode & 3 Roles Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* View Mode Switcher */}
          <div className="mm-mode-switcher">
            <button
              className={`mm-mode-btn ${viewMode === 'responsive' ? 'active' : ''}`}
              onClick={() => setViewMode('responsive')}
              title="Standard Responsive Web App View"
            >
              <Monitor size={13} /> Desktop / Web
            </button>
            <button
              className={`mm-mode-btn ${viewMode === 'phone' ? 'active' : ''}`}
              onClick={() => setViewMode('phone')}
              title="Mobile Responsive Screen View (390px)"
            >
              <Smartphone size={13} /> Mobile View
            </button>
            <button
              className={`mm-mode-btn ${viewMode === 'poster' ? 'active' : ''}`}
              onClick={() => setViewMode('poster')}
              title="Complete 24-Screen Reference Flow Poster"
            >
              <Eye size={13} /> Flow Poster
            </button>
          </div>

          {/* Role Pill Switcher */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.2)', padding: '3px', borderRadius: '9999px' }}>
            <button
              className={`mm-role-pill-btn ${activeRole === 'public' ? 'active' : ''}`}
              onClick={() => handleSwitchRole('public')}
            >
              Public
            </button>
            <button
              className={`mm-role-pill-btn ${activeRole === 'user' ? 'active' : ''}`}
              onClick={() => handleSwitchRole('user')}
            >
               User
            </button>
            <button
              className={`mm-role-pill-btn ${activeRole === 'partner' ? 'active' : ''}`}
              onClick={() => handleSwitchRole('partner')}
            >
               Partner
            </button>
            <button
              className={`mm-role-pill-btn ${activeRole === 'admin' ? 'active' : ''}`}
              onClick={() => handleSwitchRole('admin')}
            >
               Admin
            </button>
          </div>
        </div>
      </header>

      {/* Viewport Render Routing */}
      {viewMode === 'poster' ? (
        <PosterWalkthroughView
          onSelectScreen={(role, screenId) => {
            handleSwitchRole(role);
            setCurrentScreen(screenId);
            setViewMode('phone');
          }}
          partners={partners}
        />
      ) : viewMode === 'phone' ? (
        /* Mobile Device Frame View */
        <div className="mm-emulator-stage">
          <div className="mm-phone-shell">
            {/* Phone Status Bar */}
            <div className={`mm-phone-status-bar ${['admin_splash', 'call_screen', 'user_welcome'].includes(currentScreen) ? 'dark' : ''}`}>
              <span>9:41</span>
              <div className="mm-phone-notch">
                <div className="mm-phone-speaker" />
                <div className="mm-phone-camera" />
              </div>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <span>5G</span>
                <span style={{ fontSize: '0.65rem' }}>100%</span>
              </div>
            </div>

            {/* Scrollable Viewport */}
            <div className="mm-phone-viewport">
              {renderScreen(screenProps)}
            </div>

            {/* Mobile Bottom Navigation */}
            {shouldShowBottomNav(currentScreen) && (
              <div className="mm-bottom-nav">
                {renderBottomNavTabs(activeRole, activeTab, setActiveTab, setCurrentScreen)}
              </div>
            )}

            {/* Bottom Swipe Indicator */}
            <div className="mm-phone-bottom-indicator">
              <div className="mm-phone-home-indicator" />
            </div>
          </div>
        </div>
      ) : (
        /* Fullscreen Desktop / Responsive Layout */
        <div>
          {isDesktopAuthenticated ? (
            <div className="mm-desktop-dashboard-layout">
              {/* Desktop Left Sidebar */}
              <aside className="mm-desktop-sidebar">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <ManmitraSymbol size={32} color="gold" />
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 800 }}>MAANMITRA</div>
                      <div style={{ fontSize: '0.7rem', color: '#F8C3D9' }}>{activeRole.toUpperCase()} PORTAL</div>
                    </div>
                  </div>

                  <nav className="mm-desktop-sidebar-nav">
                    {renderDesktopSidebarNav(activeRole, currentScreen, setCurrentScreen)}
                  </nav>
                </div>

                {/* User info & Logout at bottom of sidebar */}
                <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <img src={currentUser.avatar} alt={currentUser.full_name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{currentUser.full_name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#F8C3D9' }}>{currentUser.email}</div>
                    </div>
                  </div>

                  <button
                    className="mm-btn-secondary"
                    onClick={() => handleSwitchRole('public')}
                    style={{ width: '100%', fontSize: '0.78rem', padding: '8px 12px', background: 'rgba(255,255,255,0.06)', color: '#fff', borderColor: 'rgba(255,255,255,0.15)' }}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </aside>

              {/* Desktop Main Content Area */}
              <main className="mm-desktop-content-area">
                {renderScreen(screenProps)}
              </main>
            </div>
          ) : (
            /* Public Responsive Layout */
            <div style={{ minHeight: 'calc(100vh - 70px)', background: 'var(--mm-blush)' }}>
              {renderScreen(screenProps)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// =============================================================================
// DESKTOP SIDEBAR NAVIGATION ITEMS
// =============================================================================
function renderDesktopSidebarNav(role, currentScreen, setCurrentScreen) {
  if (role === 'admin') {
    return (
      <>
        <button
          className={`mm-desktop-sidebar-btn ${currentScreen === 'admin_dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('admin_dashboard')}
        >
          <TrendingUp size={18} /> Dashboard Overview
        </button>
        <button
          className={`mm-desktop-sidebar-btn ${currentScreen === 'admin_partners' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('admin_partners')}
        >
          <Award size={18} /> Manage Partners
        </button>
        <button
          className={`mm-desktop-sidebar-btn ${currentScreen === 'admin_users' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('admin_users')}
        >
          <Users size={18} /> Manage Users
        </button>
        <button
          className={`mm-desktop-sidebar-btn ${currentScreen === 'admin_bookings' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('admin_bookings')}
        >
          <Calendar size={18} /> Manage Bookings
        </button>
        <button
          className={`mm-desktop-sidebar-btn ${currentScreen === 'admin_payments' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('admin_payments')}
        >
          <DollarSign size={18} /> Payments & Reports
        </button>
        <button
          className={`mm-desktop-sidebar-btn ${currentScreen === 'admin_settings' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('admin_settings')}
        >
          <Settings size={18} /> Platform Settings
        </button>
      </>
    );
  }

  if (role === 'partner') {
    return (
      <>
        <button
          className={`mm-desktop-sidebar-btn ${currentScreen === 'partner_dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('partner_dashboard')}
        >
          <Heart size={18} /> Partner Dashboard
        </button>
        <button
          className={`mm-desktop-sidebar-btn ${currentScreen === 'partner_bookings' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('partner_bookings')}
        >
          <Calendar size={18} /> Booking Requests
        </button>
        <button
          className={`mm-desktop-sidebar-btn ${currentScreen === 'partner_verification' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('partner_verification')}
        >
          <ShieldCheck size={18} /> Document Verification
        </button>
        <button
          className={`mm-desktop-sidebar-btn ${currentScreen === 'partner_approval_status' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('partner_approval_status')}
        >
          <Clock size={18} /> Approval Status
        </button>
      </>
    );
  }

  // User Dashboard
  return (
    <>
      <button
        className={`mm-desktop-sidebar-btn ${currentScreen === 'browse' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('browse')}
      >
        <Search size={18} /> Browse Partners
      </button>
      <button
        className={`mm-desktop-sidebar-btn ${currentScreen === 'user_dashboard' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('user_dashboard')}
      >
        <Heart size={18} /> My Dashboard
      </button>
    </>
  );
}


// =============================================================================
// SUB-ROUTER
// =============================================================================
function renderScreen(props) {
  const { currentScreen } = props;

  // Admin
  if (currentScreen === 'admin_splash') return <AdminSplashScreen {...props} />;
  if (currentScreen === 'admin_login') return <AdminLoginScreen {...props} />;
  if (currentScreen === 'admin_dashboard') return <AdminDashboardScreen {...props} />;
  if (currentScreen === 'admin_partners') return <AdminManagePartnersScreen {...props} />;
  if (currentScreen === 'admin_users') return <AdminManageUsersScreen {...props} />;
  if (currentScreen === 'admin_bookings') return <AdminManageBookingsScreen {...props} />;
  if (currentScreen === 'admin_payments') return <AdminPaymentsScreen {...props} />;
  if (currentScreen === 'admin_settings') return <AdminSettingsScreen {...props} />;

  // Partner
  if (currentScreen === 'partner_welcome') return <PartnerWelcomeScreen {...props} />;
  if (currentScreen === 'partner_register') return <PartnerRegisterScreen {...props} />;
  if (currentScreen === 'partner_verification') return <PartnerDocumentVerificationScreen {...props} />;
  if (currentScreen === 'partner_approval_status') return <PartnerApprovalStatusScreen {...props} />;
  if (currentScreen === 'partner_login') return <PartnerLoginScreen {...props} />;
  if (currentScreen === 'partner_dashboard') return <PartnerDashboardScreen {...props} />;
  if (currentScreen === 'partner_bookings') return <PartnerBookingsScreen {...props} />;

  // User
  if (currentScreen === 'user_welcome') return <UserWelcomeScreen {...props} />;
  if (currentScreen === 'user_auth') return <UserAuthScreen {...props} />;
  if (currentScreen === 'browse') return <UserBrowsePartnersScreen {...props} />;
  if (currentScreen === 'partner_profile') return <UserPartnerProfileScreen {...props} />;
  if (currentScreen === 'select_package') return <UserSelectPackageScreen {...props} />;
  if (currentScreen === 'payment') return <UserPaymentScreen {...props} />;
  if (currentScreen === 'user_dashboard') return <UserDashboardScreen {...props} />;

  // Shared Call
  if (currentScreen === 'call_screen') return <LiveCallScreen {...props} />;

  // Public Home
  if (currentScreen === 'public_home') return <PublicHomeScreen {...props} />;

  return <UserBrowsePartnersScreen {...props} />;
}

function shouldShowBottomNav(screen) {
  const hiddenScreens = [
    'admin_splash', 'admin_login', 'partner_welcome', 'partner_register',
    'partner_verification', 'partner_approval_status', 'partner_login',
    'user_welcome', 'user_auth', 'call_screen', 'payment', 'select_package',
    'public_home'
  ];
  return !hiddenScreens.includes(screen);
}

function renderBottomNavTabs(role, activeTab, setActiveTab, setCurrentScreen) {
  if (role === 'admin') {
    return (
      <>
        <button
          className={`mm-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => { setActiveTab('dashboard'); setCurrentScreen('admin_dashboard'); }}
        >
          <TrendingUp size={18} />
          <span>Dashboard</span>
        </button>
        <button
          className={`mm-nav-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => { setActiveTab('users'); setCurrentScreen('admin_users'); }}
        >
          <Users size={18} />
          <span>Users</span>
        </button>
        <button
          className={`mm-nav-tab ${activeTab === 'partners' ? 'active' : ''}`}
          onClick={() => { setActiveTab('partners'); setCurrentScreen('admin_partners'); }}
        >
          <Award size={18} />
          <span>Partners</span>
        </button>
        <button
          className={`mm-nav-tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => { setActiveTab('bookings'); setCurrentScreen('admin_bookings'); }}
        >
          <Calendar size={18} />
          <span>Bookings</span>
        </button>
        <button
          className={`mm-nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => { setActiveTab('settings'); setCurrentScreen('admin_settings'); }}
        >
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </>
    );
  }

  if (role === 'partner') {
    return (
      <>
        <button
          className={`mm-nav-tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => { setActiveTab('home'); setCurrentScreen('partner_dashboard'); }}
        >
          <Heart size={18} />
          <span>Home</span>
        </button>
        <button
          className={`mm-nav-tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => { setActiveTab('bookings'); setCurrentScreen('partner_bookings'); }}
        >
          <Calendar size={18} />
          <span>Bookings</span>
        </button>
        <button
          className={`mm-nav-tab ${activeTab === 'earnings' ? 'active' : ''}`}
          onClick={() => { setActiveTab('earnings'); setCurrentScreen('partner_dashboard'); }}
        >
          <DollarSign size={18} />
          <span>Earnings</span>
        </button>
        <button
          className={`mm-nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => { setActiveTab('profile'); setCurrentScreen('partner_dashboard'); }}
        >
          <Settings size={18} />
          <span>Profile</span>
        </button>
      </>
    );
  }

  return (
    <>
      <button
        className={`mm-nav-tab ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => { setActiveTab('home'); setCurrentScreen('user_dashboard'); }}
      >
        <Heart size={18} />
        <span>Home</span>
      </button>
      <button
        className={`mm-nav-tab ${activeTab === 'explore' ? 'active' : ''}`}
        onClick={() => { setActiveTab('explore'); setCurrentScreen('browse'); }}
      >
        <Search size={18} />
        <span>Explore</span>
      </button>
      <button
        className={`mm-nav-tab ${activeTab === 'bookings' ? 'active' : ''}`}
        onClick={() => { setActiveTab('bookings'); setCurrentScreen('user_dashboard'); }}
      >
        <Calendar size={18} />
        <span>Bookings</span>
      </button>
      <button
        className={`mm-nav-tab ${activeTab === 'chats' ? 'active' : ''}`}
        onClick={() => { setActiveTab('chats'); setCurrentScreen('user_dashboard'); }}
      >
        <MessageSquare size={18} />
        <span>Chats</span>
      </button>
      <button
        className={`mm-nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => { setActiveTab('profile'); setCurrentScreen('user_dashboard'); }}
      >
        <Settings size={18} />
        <span>Profile</span>
      </button>
    </>
  );
}


// =============================================================================
// SCREEN 1: ADMIN SPLASH
// =============================================================================
function AdminSplashScreen({ setCurrentScreen }) {
  return (
    <div style={{
      height: '100%',
      minHeight: '680px',
      background: 'linear-gradient(180deg, #4A154B 0%, #29082A 100%)',
      color: '#fff',
      padding: '36px 24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <div style={{ marginTop: '30px' }}>
        <ManmitraSymbol size={70} color="gold" />
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '16px', letterSpacing: '-0.02em' }}>
          Maanmitra
        </h1>
        <p style={{ color: '#F7C6D9', fontSize: '0.85rem', marginTop: '6px' }}>
          A Listening Friend, Always With You
        </p>
      </div>

      <div style={{
        width: '240px',
        height: '240px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid rgba(212, 175, 119, 0.4)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        position: 'relative'
      }}>
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80"
          alt="Connection"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(74, 21, 75, 0.75), transparent)' }} />
      </div>

      <div style={{ width: '100%', marginBottom: '20px' }}>
        <button
          className="mm-btn-primary"
          onClick={() => setCurrentScreen('admin_login')}
        >
          Get Started <ChevronRight size={18} />
        </button>
        <p style={{ fontSize: '0.72rem', color: '#BBAAB7', marginTop: '14px' }}>
          Platform Operations & Administration Portal
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// SCREEN 2: ADMIN LOGIN
// =============================================================================
function AdminLoginScreen({ setCurrentScreen, showToast }) {
  const [email, setEmail] = useState('admin@maanmitra.com');
  const [password, setPassword] = useState('Admin@12345');

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Admin authenticated successfully');
    setCurrentScreen('admin_dashboard');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '420px', margin: '40px auto' }}>
      <button
        onClick={() => setCurrentScreen('admin_splash')}
        style={{ border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--mm-text-secondary)', cursor: 'pointer', marginBottom: '20px' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <ManmitraSymbol size={50} color="var(--mm-rose)" />
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '12px', color: 'var(--mm-plum)' }}>
          Admin Login
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--mm-text-secondary)', marginTop: '4px' }}>
          Secure access to Maanmitra management
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--mm-text-secondary)', marginBottom: '6px', display: 'block' }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mm-search-input"
            style={{ paddingLeft: '16px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--mm-text-secondary)', marginBottom: '6px', display: 'block' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mm-search-input"
            style={{ paddingLeft: '16px' }}
          />
        </div>

        <button type="submit" className="mm-btn-primary" style={{ marginTop: '10px' }}>
          Login to Dashboard
        </button>
      </form>
    </div>
  );
}

// =============================================================================
// SCREEN 3: ADMIN DASHBOARD
// =============================================================================
function AdminDashboardScreen({ adminStats }) {
  const stats = adminStats?.summary || {
    total_users: 12450,
    total_partners: 568,
    total_bookings: 2389,
    total_revenue: 245780
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mm-plum)' }}>Admin Dashboard</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--mm-text-muted)' }}>Platform Metrics & Operations</p>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--mm-rose-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={20} color="var(--mm-rose)" />
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="mm-card" style={{ padding: '18px', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--mm-plum)', marginBottom: '6px' }}>
            <Users size={18} />
            <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>Total Users</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--mm-text-primary)' }}>
            {stats.total_users.toLocaleString()}
          </div>
        </div>

        <div className="mm-card" style={{ padding: '18px', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--mm-rose)', marginBottom: '6px' }}>
            <Award size={18} />
            <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>Maanmitra Partners</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--mm-text-primary)' }}>
            {stats.total_partners.toLocaleString()}
          </div>
        </div>

        <div className="mm-card" style={{ padding: '18px', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D9822B', marginBottom: '6px' }}>
            <Calendar size={18} />
            <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>Total Bookings</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--mm-text-primary)' }}>
            {stats.total_bookings.toLocaleString()}
          </div>
        </div>

        <div className="mm-card" style={{ padding: '18px', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22A447', marginBottom: '6px' }}>
            <DollarSign size={18} />
            <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>Platform Revenue</span>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#22A447' }}>
            ₹{stats.total_revenue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--mm-plum)', marginBottom: '14px' }}>
        Live Activity Feed
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="mm-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80" alt="Pooja" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Pooja Verma registered as Partner</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--mm-text-muted)' }}>2 mins ago - Spoken: Hindi, Punjabi - ₹299/30m Audio</div>
          </div>
          <span className="mm-pill-badge mm-pill-online">Online</span>
        </div>

        <div className="mm-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--mm-rose-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Phone size={20} color="var(--mm-rose)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>New booking from Amit Kumar</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--mm-text-muted)' }}>18 mins ago - 30-min Audio with Priya Sharma</div>
          </div>
          <span className="mm-pill-badge mm-pill-rose">Paid ₹299</span>
        </div>

        <div className="mm-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#EAF8EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={20} color="#22A447" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Payment Received via Razorpay</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--mm-text-muted)' }}>15 mins ago - Transaction ID #MM-TXN-82910</div>
          </div>
          <span className="mm-pill-badge" style={{ background: '#EAF8EE', color: '#22A447' }}>Captured</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SCREEN 4: ADMIN MANAGE PARTNERS
// =============================================================================
function AdminManagePartnersScreen({ partners, showToast }) {
  const [search, setSearch] = useState('');
  const [partnerList, setPartnerList] = useState(partners);

  useEffect(() => {
    setPartnerList(partners);
  }, [partners]);

  const handleApprove = (id) => {
    setPartnerList(prev => prev.map(p => p.id === id ? { ...p, verification_status: 'approved' } : p));
    showToast('Partner Approved Successfully');
  };

  const handleReject = (id) => {
    setPartnerList(prev => prev.map(p => p.id === id ? { ...p, verification_status: 'rejected' } : p));
    showToast('Partner Application Rejected');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mm-plum)' }}>Manage Partners</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--mm-text-muted)' }}>Review Applications & Verify Companion Profiles</p>
        </div>
      </div>

      <div className="mm-search-wrap" style={{ maxWidth: '420px', marginBottom: '18px' }}>
        <Search size={16} className="mm-search-icon" />
        <input
          type="text"
          placeholder="Search partners by name or language..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mm-search-input"
        />
      </div>

      <div className="mm-data-table-wrap">
        <table className="mm-data-table">
          <thead>
            <tr>
              <th>Partner</th>
              <th>Languages</th>
              <th>Rates</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partnerList.map(p => (
              <tr key={p.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={p.profile_photo_url} alt={p.display_name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.display_name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--mm-text-muted)' }}>ID #{p.id}</div>
                    </div>
                  </div>
                </td>
                <td>{p.languages?.join(', ')}</td>
                <td>Chat: ₹{p.rate_chat_15m || 99} | Audio: ₹{p.rate_audio_30m || 299}</td>
                <td>* {p.rating_average || 4.8} ({p.review_count || 120})</td>
                <td>
                  {p.verification_status === 'approved' ? (
                    <span className="mm-pill-badge mm-pill-online">Approved</span>
                  ) : (
                    <span className="mm-pill-badge mm-pill-pending">Under Review</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {p.verification_status !== 'approved' ? (
                      <button className="mm-btn-primary mm-btn-sm" style={{ background: '#22A447' }} onClick={() => handleApprove(p.id)}>
                        Approve
                      </button>
                    ) : (
                      <button className="mm-btn-primary mm-btn-sm" style={{ background: '#DC2626' }} onClick={() => handleReject(p.id)}>
                        Suspend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================================================================
// SCREEN 5: ADMIN MANAGE USERS
// =============================================================================
function AdminManageUsersScreen({ showToast }) {
  const [users, setUsers] = useState([
    { id: 1, name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 9876543210', status: 'Active', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' },
    { id: 2, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543211', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
    { id: 3, name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 9876543213', status: 'Blocked', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80' },
    { id: 4, name: 'Suresh Patil', email: 'suresh@example.com', phone: '+91 9876543212', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
  ]);

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const next = u.status === 'Active' ? 'Blocked' : 'Active';
        showToast(`User ${u.name} is now ${next}`);
        return { ...u, status: next };
      }
      return u;
    }));
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mm-plum)' }}>Manage Users</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--mm-text-muted)' }}>Registered Client Accounts & Status Management</p>
      </div>

      <div className="mm-data-table-wrap">
        <table className="mm-data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={u.avatar} alt={u.name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 700 }}>{u.name}</span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <span className={`mm-pill-badge ${u.status === 'Active' ? 'mm-pill-online' : ''}`} style={u.status === 'Blocked' ? { background: '#FEECEE', color: '#DC2626' } : {}}>
                    {u.status}
                  </span>
                </td>
                <td>
                  <button className="mm-btn-secondary mm-btn-sm" onClick={() => toggleStatus(u.id)}>
                    {u.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================================================================
// SCREEN 6: ADMIN MANAGE BOOKINGS
// =============================================================================
function AdminManageBookingsScreen() {
  const bookings = [
    { id: 1, code: 'MM-BKG-2026-001', user: 'Amit Kumar', partner: 'Priya Sharma', time: '10:00 AM - 10:30 AM', type: 'Video Call', status: 'Confirmed', amount: 499 },
    { id: 2, code: 'MM-BKG-2026-002', user: 'Rahul Sharma', partner: 'Neha Patil', time: '12:00 PM - 12:30 PM', type: 'Audio Call', status: 'Ongoing', amount: 299 },
    { id: 3, code: 'MM-BKG-2026-003', user: 'Suresh Patil', partner: 'Sneha Verma', time: '02:00 PM - 02:30 PM', type: 'Audio Call', status: 'Completed', amount: 299 }
  ];

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mm-plum)' }}>Manage Bookings</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--mm-text-muted)' }}>Live Sessions & Conversation Schedules</p>
      </div>

      <div className="mm-data-table-wrap">
        <table className="mm-data-table">
          <thead>
            <tr>
              <th>Booking Code</th>
              <th>User</th>
              <th>Partner</th>
              <th>Communication</th>
              <th>Time Slot</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td><strong>{b.code}</strong></td>
                <td>{b.user}</td>
                <td>{b.partner}</td>
                <td>{b.type}</td>
                <td>{b.time}</td>
                <td>₹{b.amount}</td>
                <td><span className="mm-pill-badge mm-pill-online">{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================================================================
// SCREEN 7: ADMIN PAYMENTS & REPORTS
// =============================================================================
function AdminPaymentsScreen() {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mm-plum)' }}>Payments & Revenue Reports</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--mm-text-muted)' }}>Financial Ledger & Partner Commission</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="mm-card" style={{ background: 'linear-gradient(135deg, #4A154B 0%, #29082A 100%)', color: '#fff', padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: '#F7C6D9' }}>Total Gross Revenue</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--mm-gold)', marginTop: '4px' }}>₹2,45,780</div>
        </div>

        <div className="mm-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--mm-text-muted)' }}>Platform Cut (20%)</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--mm-plum)', marginTop: '4px' }}>₹1,22,390</div>
        </div>

        <div className="mm-card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--mm-text-muted)' }}>Partner Payouts Disbursed</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#22A447', marginTop: '4px' }}>₹98,320</div>
        </div>
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--mm-plum)', marginBottom: '12px' }}>
        Recent Transactions
      </h3>

      <div className="mm-data-table-wrap">
        <table className="mm-data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Method</th>
              <th>Gross Amount</th>
              <th>Partner Share</th>
              <th>Platform Commission</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'MM-ORD-9182', name: 'Amit Kumar', method: 'Razorpay UPI', gross: 499, share: 399, comm: 100 },
              { id: 'MM-ORD-9183', name: 'Rahul Sharma', method: 'Credit Card', gross: 299, share: 239, comm: 60 },
              { id: 'MM-ORD-9184', name: 'Suresh Patil', method: 'Net Banking', gross: 299, share: 239, comm: 60 }
            ].map(t => (
              <tr key={t.id}>
                <td><strong>{t.id}</strong></td>
                <td>{t.name}</td>
                <td>{t.method}</td>
                <td>₹{t.gross}</td>
                <td>₹{t.share}</td>
                <td>₹{t.comm}</td>
                <td><span className="mm-pill-badge" style={{ background: '#EAF8EE', color: '#22A447' }}>Captured</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================================================================
// SCREEN 8: ADMIN SETTINGS
// =============================================================================
function AdminSettingsScreen({ handleSwitchRole, showToast }) {
  const [comm, setComm] = useState('20');

  return (
    <div style={{ maxWidth: '640px' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mm-plum)', marginBottom: '16px' }}>
        Platform Settings
      </h2>

      <div className="mm-card" style={{ padding: '20px', marginBottom: '18px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>Commission Settings</h3>
        <label style={{ fontSize: '0.8rem', color: 'var(--mm-text-secondary)', display: 'block', marginBottom: '8px' }}>
          Platform Fee Percentage (%)
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="number"
            value={comm}
            onChange={e => setComm(e.target.value)}
            className="mm-search-input"
            style={{ width: '120px', paddingLeft: '14px' }}
          />
          <button className="mm-btn-primary" style={{ width: 'auto' }} onClick={() => showToast('Commission settings saved')}>
            Save
          </button>
        </div>
      </div>

      <button className="mm-btn-secondary" onClick={() => handleSwitchRole('public')} style={{ color: '#DC2626' }}>
        <LogOut size={16} /> Exit Admin Portal
      </button>
    </div>
  );
}


// =============================================================================
// MAANMITRA PARTNER JOURNEY SCREENS
// =============================================================================

function PartnerWelcomeScreen({ setCurrentScreen }) {
  return (
    <div style={{ padding: '36px 24px', maxWidth: '540px', margin: '0 auto', textAlign: 'center' }}>
      <ManmitraSymbol size={50} color="var(--mm-rose)" />
      <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'var(--mm-plum)', marginTop: '12px' }}>
        Become a Maanmitra Partner
      </h2>
      <p style={{ fontSize: '0.88rem', color: 'var(--mm-text-secondary)', marginTop: '4px', marginBottom: '24px' }}>
        Share meaningful conversations, connect with people & earn flexibly
      </p>

      <div style={{ borderRadius: '24px', overflow: 'hidden', height: '240px', marginBottom: '24px', boxShadow: 'var(--mm-shadow-card)' }}>
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85"
          alt="Partner"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', textAlign: 'left', marginBottom: '28px' }}>
        {['Earn from Conversations', 'Talk to New People', 'Flexible Timings', 'Work from Anywhere'].map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--mm-plum)' }}>
            <Check size={14} color="var(--mm-rose)" /> {b}
          </div>
        ))}
      </div>

      <button className="mm-btn-primary" onClick={() => setCurrentScreen('partner_register')}>
        Start Registration
      </button>
    </div>
  );
}

function PartnerRegisterScreen({ setCurrentScreen }) {
  return (
    <div style={{ padding: '24px', maxWidth: '440px', margin: '20px auto' }}>
      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--mm-plum)', marginBottom: '4px' }}>
        Partner Registration
      </h2>
      <p style={{ fontSize: '0.8rem', color: 'var(--mm-text-muted)', marginBottom: '20px' }}>
        Step 1: Personal Profile
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mm-text-secondary)', display: 'block', marginBottom: '4px' }}>Full Name</label>
          <input type="text" defaultValue="Priya Sharma" className="mm-search-input" style={{ paddingLeft: '14px' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mm-text-secondary)', display: 'block', marginBottom: '4px' }}>Email</label>
          <input type="email" defaultValue="priya@example.com" className="mm-search-input" style={{ paddingLeft: '14px' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mm-text-secondary)', display: 'block', marginBottom: '4px' }}>Mobile Number</label>
          <input type="tel" defaultValue="+91 9876543210" className="mm-search-input" style={{ paddingLeft: '14px' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mm-text-secondary)', display: 'block', marginBottom: '4px' }}>Password</label>
          <input type="password" defaultValue="--------" className="mm-search-input" style={{ paddingLeft: '14px' }} />
        </div>
        <button className="mm-btn-primary" onClick={() => setCurrentScreen('partner_verification')} style={{ marginTop: '16px' }}>
          Continue to Document Verification
        </button>
      </div>
    </div>
  );
}

function PartnerDocumentVerificationScreen({ setCurrentScreen, showToast }) {
  const [doc, setDoc] = useState('aadhaar');

  return (
    <div style={{ padding: '24px', maxWidth: '440px', margin: '20px auto' }}>
      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--mm-plum)', marginBottom: '4px' }}>
        Identity Verification
      </h2>
      <p style={{ fontSize: '0.8rem', color: 'var(--mm-text-muted)', marginBottom: '20px' }}>
        Upload Government ID for Partner Approval
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {['Aadhaar Card', 'PAN Card', 'Driving License'].map((label, idx) => (
          <label key={idx} className="mm-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="radio" name="docSelect" defaultChecked={idx === 0} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{label}</span>
          </label>
        ))}
      </div>

      <div style={{ border: '2px dashed var(--mm-rose)', borderRadius: '16px', padding: '24px', textAlign: 'center', background: 'rgba(233, 30, 99, 0.04)', marginBottom: '24px' }}>
        <Camera size={32} color="var(--mm-rose)" style={{ margin: '0 auto 8px' }} />
        <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Upload Front Side</div>
        <div style={{ fontSize: '0.74rem', color: 'var(--mm-text-muted)', marginTop: '4px' }}>PNG, JPG or PDF up to 5MB</div>
      </div>

      <button className="mm-btn-primary" onClick={() => { showToast('Documents submitted for verification'); setCurrentScreen('partner_approval_status'); }}>
        Submit for Verification
      </button>
    </div>
  );
}

function PartnerApprovalStatusScreen({ setCurrentScreen }) {
  return (
    <div style={{ padding: '40px 24px', maxWidth: '440px', margin: '30px auto', textAlign: 'center' }}>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '3px solid #FFE0B2' }}>
        <Clock size={40} color="#F59E0B" />
      </div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mm-plum)' }}>Approval Pending</h2>
      <p style={{ fontSize: '0.88rem', color: 'var(--mm-rose)', fontWeight: 700, margin: '6px 0 16px' }}>Your profile is under review</p>
      <p style={{ fontSize: '0.82rem', color: 'var(--mm-text-secondary)', lineHeight: 1.5, marginBottom: '28px' }}>
        Our verification team reviews all companion documents to ensure safety and quality. You will be notified via SMS.
      </p>
      <button className="mm-btn-primary" onClick={() => setCurrentScreen('partner_dashboard')}>
        View Dashboard Preview
      </button>
    </div>
  );
}

function PartnerLoginScreen({ setCurrentScreen }) {
  return (
    <div style={{ padding: '24px', maxWidth: '400px', margin: '40px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <ManmitraSymbol size={44} color="var(--mm-rose)" />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mm-plum)', marginTop: '8px' }}>Partner Login</h2>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); setCurrentScreen('partner_dashboard'); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <input type="email" defaultValue="priya@example.com" className="mm-search-input" style={{ paddingLeft: '14px' }} />
        <input type="password" defaultValue="Partner@12345" className="mm-search-input" style={{ paddingLeft: '14px' }} />
        <button type="submit" className="mm-btn-primary" style={{ marginTop: '8px' }}>Login</button>
      </form>
    </div>
  );
}

function PartnerDashboardScreen({ setCurrentScreen, partnerOnline, setPartnerOnline, showToast }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=85" alt="Priya" style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--mm-rose)' }} />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--mm-plum)' }}>Priya Sharma</h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--mm-text-muted)' }}>Maanmitra Partner - 4.8* (236 reviews)</div>
          </div>
        </div>

        <button
          onClick={() => {
            setPartnerOnline(!partnerOnline);
            showToast(partnerOnline ? 'Status changed to Offline' : 'Status changed to Online');
          }}
          className={`mm-pill-badge ${partnerOnline ? 'mm-pill-online' : ''}`}
          style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '0.8rem' }}
        >
          {partnerOnline ? ' Online' : ' Offline'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
        <div className="mm-card" style={{ padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mm-plum)' }}>568</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--mm-text-muted)', marginTop: '2px' }}>Total Chats</div>
        </div>
        <div className="mm-card" style={{ padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mm-rose)' }}>324</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--mm-text-muted)', marginTop: '2px' }}>Calls Completed</div>
        </div>
        <div className="mm-card" style={{ padding: '18px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22A447' }}>₹24,580</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--mm-text-muted)', marginTop: '2px' }}>Net Earnings</div>
        </div>
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--mm-plum)', marginBottom: '12px' }}>
        Upcoming Conversations
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="mm-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>Amit Kumar</div>
            <div style={{ fontSize: '0.76rem', color: 'var(--mm-text-muted)' }}>10:00 AM - 10:30 AM - 30-min Video Call</div>
          </div>
          <button className="mm-btn-primary mm-btn-sm" onClick={() => setCurrentScreen('call_screen')}>
            Join Call
          </button>
        </div>
      </div>
    </div>
  );
}

function PartnerBookingsScreen({ handleStartCall }) {
  return (
    <div>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mm-plum)', marginBottom: '16px' }}>
        My Bookings
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { id: 1, user: 'Amit Kumar', time: '10:00 AM - 10:30 AM', status: 'Paid Session', type: 'video' },
          { id: 2, user: 'Rahul S.', time: '12:00 PM - 12:30 PM', status: 'Upcoming', type: 'audio' }
        ].map(b => (
          <div key={b.id} className="mm-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{b.user}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--mm-text-muted)' }}>{b.time}</div>
              <span className="mm-pill-badge mm-pill-online" style={{ marginTop: '6px' }}>{b.status}</span>
            </div>
            <button className="mm-btn-primary mm-btn-sm" onClick={() => handleStartCall(b, b.type)}>
              Join Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}


// =============================================================================
// USER JOURNEY SCREENS
// =============================================================================

function UserWelcomeScreen({ setCurrentScreen }) {
  return (
    <div style={{ padding: '40px 24px', maxWidth: '520px', margin: '0 auto', textAlign: 'center' }}>
      <ManmitraSymbol size={54} color="var(--mm-rose)" />
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--mm-plum)', marginTop: '14px' }}>
        Find a Friend. Share a Smile. Feel Connected.
      </h2>
      <p style={{ fontSize: '0.88rem', color: 'var(--mm-text-secondary)', marginTop: '8px', lineHeight: 1.5, marginBottom: '28px' }}>
        Connect with friendly Maanmitra Partners for warm conversations, everyday discussions, and moments of connection.
      </p>

      <button className="mm-btn-primary" onClick={() => setCurrentScreen('user_auth')}>
        Get Started
      </button>
    </div>
  );
}

function UserAuthScreen({ setCurrentScreen }) {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div style={{ padding: '24px', maxWidth: '420px', margin: '20px auto' }}>
      <div style={{ display: 'flex', background: 'rgba(74, 21, 75, 0.08)', padding: '4px', borderRadius: '9999px', marginBottom: '24px' }}>
        <button
          onClick={() => setIsRegister(false)}
          style={{ flex: 1, padding: '8px', borderRadius: '9999px', border: 'none', background: !isRegister ? 'var(--mm-rose)' : 'transparent', color: !isRegister ? '#fff' : 'var(--mm-text-secondary)', fontWeight: 700 }}
        >
          Login
        </button>
        <button
          onClick={() => setIsRegister(true)}
          style={{ flex: 1, padding: '8px', borderRadius: '9999px', border: 'none', background: isRegister ? 'var(--mm-rose)' : 'transparent', color: isRegister ? '#fff' : 'var(--mm-text-secondary)', fontWeight: 700 }}
        >
          Register
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setCurrentScreen('browse'); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {isRegister && (
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mm-text-secondary)', display: 'block', marginBottom: '4px' }}>Full Name</label>
            <input type="text" defaultValue="Amit Kumar" className="mm-search-input" style={{ paddingLeft: '14px' }} />
          </div>
        )}
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mm-text-secondary)', display: 'block', marginBottom: '4px' }}>Email</label>
          <input type="email" defaultValue="amit@example.com" className="mm-search-input" style={{ paddingLeft: '14px' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--mm-text-secondary)', display: 'block', marginBottom: '4px' }}>Password</label>
          <input type="password" defaultValue="User@12345" className="mm-search-input" style={{ paddingLeft: '14px' }} />
        </div>
        <button type="submit" className="mm-btn-primary" style={{ marginTop: '10px' }}>
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
    </div>
  );
}

function UserBrowsePartnersScreen({ partners, setSelectedPartner, setCurrentScreen }) {
  const [search, setSearch] = useState('');
  const [chip, setChip] = useState('all');

  const filtered = partners.filter(p => {
    if (search && !p.display_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (chip === 'online' && p.availability_status !== 'online') return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--mm-plum)' }}>Browse Partners</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--mm-text-muted)' }}>Choose your companion for a warm conversation</p>
        </div>
      </div>

      <div className="mm-search-wrap" style={{ maxWidth: '420px', marginBottom: '14px' }}>
        <Search size={16} className="mm-search-icon" />
        <input
          type="text"
          placeholder="Search by companion name, language..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mm-search-input"
        />
      </div>

      <div className="mm-filter-chips" style={{ marginBottom: '20px' }}>
        {['All', 'Online', 'Popular', 'New'].map(c => (
          <button
            key={c}
            className={`mm-chip ${chip === c.toLowerCase() ? 'active' : ''}`}
            onClick={() => setChip(c.toLowerCase())}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Responsive Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filtered.map(p => (
          <div
            key={p.id}
            className="mm-card mm-card-interactive"
            onClick={() => {
              setSelectedPartner(p);
              setCurrentScreen('partner_profile');
            }}
            style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <div style={{ position: 'relative' }}>
                <img src={p.profile_photo_url} alt={p.display_name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                {p.availability_status === 'online' && (
                  <span style={{ position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', background: '#22A447', borderRadius: '50%', border: '2px solid #fff' }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--mm-plum)' }}>{p.display_name}</span>
                  <Heart size={16} color="var(--mm-rose)" fill="var(--mm-rose)" />
                </div>
                <div style={{ fontSize: '0.76rem', color: '#D9822B', fontWeight: 700 }}>
                  * {p.rating_average || 4.8} ({p.review_count || 120})
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--mm-text-muted)', marginTop: '2px' }}>
                  {p.languages?.join(', ')}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--mm-text-secondary)', lineHeight: 1.4, marginBottom: '14px' }}>
              {p.bio?.slice(0, 85)}...
            </p>

            <button
              className="mm-btn-primary mm-btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPartner(p);
                setCurrentScreen('select_package');
              }}
            >
              Chat Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserPartnerProfileScreen({ selectedPartner, setCurrentScreen }) {
  const p = selectedPartner || defaultPartners[0];

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--mm-shadow-card)' }}>
      <div style={{ height: '280px', position: 'relative' }}>
        <img src={p.profile_photo_url} alt={p.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <button
          onClick={() => setCurrentScreen('browse')}
          style={{ position: 'absolute', top: '16px', left: '16px', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--mm-plum)' }}>{p.display_name}</h2>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#D9822B' }}>* 4.8 (236 reviews)</div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--mm-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
          {p.bio || "Warm, empathetic listener. Ready to chat about your day, dreams, or anything on your mind with zero judgment."}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
          <div className="mm-card" style={{ padding: '12px', textAlign: 'center' }}>
            <MessageSquare size={20} color="var(--mm-rose)" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>Chat</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--mm-plum)' }}>₹99/15m</div>
          </div>
          <div className="mm-card" style={{ padding: '12px', textAlign: 'center' }}>
            <Phone size={20} color="var(--mm-rose)" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>Audio Call</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--mm-plum)' }}>₹299/30m</div>
          </div>
          <div className="mm-card" style={{ padding: '12px', textAlign: 'center' }}>
            <Video size={20} color="var(--mm-rose)" style={{ margin: '0 auto 4px' }} />
            <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>Video Call</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--mm-plum)' }}>₹499/30m</div>
          </div>
        </div>

        <button className="mm-btn-primary" onClick={() => setCurrentScreen('select_package')}>
          Book Conversation Now
        </button>
      </div>
    </div>
  );
}

function UserSelectPackageScreen({ selectedPartner, packages, selectedPackage, setSelectedPackage, setCurrentScreen }) {
  const p = selectedPartner || defaultPartners[0];
  const pkgs = packages?.length > 0 ? packages : defaultPackages;

  return (
    <div style={{ maxWidth: '520px', margin: '20px auto' }}>
      <button
        onClick={() => setCurrentScreen('partner_profile')}
        style={{ border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--mm-text-secondary)', cursor: 'pointer', marginBottom: '14px' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <img src={p.profile_photo_url} alt={p.display_name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--mm-plum)' }}>Choose a Package</h2>
          <div style={{ fontSize: '0.82rem', color: 'var(--mm-rose)', fontWeight: 600 }}>with {p.display_name}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {pkgs.map(pkg => (
          <label
            key={pkg.id}
            className="mm-card"
            style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: selectedPackage?.id === pkg.id ? '2px solid var(--mm-rose)' : '1px solid var(--mm-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="radio"
                name="packageSelect"
                checked={selectedPackage?.id === pkg.id}
                onChange={() => setSelectedPackage(pkg)}
              />
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{pkg.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--mm-text-muted)' }}>{pkg.duration_minutes} Minutes</div>
              </div>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--mm-plum)' }}>₹{pkg.price}</div>
          </label>
        ))}
      </div>

      <button className="mm-btn-primary" onClick={() => setCurrentScreen('payment')}>
        Proceed to Pay
      </button>
    </div>
  );
}

function UserPaymentScreen({ selectedPartner, selectedPackage, handleProcessPayment, setCurrentScreen, loading }) {
  const p = selectedPartner || defaultPartners[0];
  const pkg = selectedPackage || defaultPackages[1];

  return (
    <div style={{ maxWidth: '480px', margin: '20px auto' }}>
      <button
        onClick={() => setCurrentScreen('select_package')}
        style={{ border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--mm-text-secondary)', cursor: 'pointer', marginBottom: '14px' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--mm-plum)', marginBottom: '16px' }}>
        Order Summary & Checkout
      </h2>

      <div className="mm-card" style={{ padding: '18px', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--mm-text-muted)' }}>Package Selected</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <span style={{ fontSize: '1rem', fontWeight: 700 }}>{pkg.name}</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--mm-rose)' }}>₹{pkg.price}</span>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--mm-text-secondary)', marginTop: '4px' }}>
          Maanmitra Partner: {p.display_name} - 100% Confidential
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {['Razorpay (UPI, Cards, Wallet)', 'Credit / Debit Card', 'UPI (GPay, PhonePe, Paytm)', 'Net Banking'].map((m, idx) => (
          <label key={idx} className="mm-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input type="radio" name="payMethod" defaultChecked={idx === 0} />
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{m}</span>
          </label>
        ))}
      </div>

      <button className="mm-btn-primary" onClick={handleProcessPayment} disabled={loading}>
        {loading ? 'Verifying with Razorpay...' : `Pay ₹${pkg.price}`}
      </button>
    </div>
  );
}

function UserDashboardScreen({ currentUser, setCurrentScreen, handleSwitchRole }) {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <img src={currentUser.avatar} alt={currentUser.full_name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--mm-plum)' }}>Hello, {currentUser.full_name}</h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--mm-text-muted)' }}>Welcome to your listening community</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { label: 'My Bookings', icon: Calendar, screen: 'browse' },
          { label: 'My Chats', icon: MessageSquare, screen: 'call_screen' },
          { label: 'My Payments', icon: DollarSign, screen: 'browse' },
          { label: 'Saved Partners', icon: Heart, screen: 'browse' },
          { label: 'Settings', icon: Settings, screen: 'browse' },
          { label: 'Help & Support', icon: HelpCircle, screen: 'browse' }
        ].map((item, idx) => (
          <div
            key={idx}
            className="mm-card"
            onClick={() => setCurrentScreen(item.screen)}
            style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <item.icon size={20} color="var(--mm-plum)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.label}</span>
            </div>
            <ChevronRight size={18} color="var(--mm-text-muted)" />
          </div>
        ))}

        <button className="mm-btn-secondary" onClick={() => handleSwitchRole('public')} style={{ color: '#DC2626', marginTop: '14px' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}


// =============================================================================
// LIVE WEBRTC CALL & REAL-TIME CHAT SCREEN
// =============================================================================
function LiveCallScreen({
  selectedPartner,
  handleEndCall,
  callTimer,
  formatTimer,
  micMuted,
  setMicMuted,
  videoOff,
  setVideoOff,
  chatDrawerOpen,
  setChatDrawerOpen,
  callMessages,
  newMessageText,
  setNewMessageText,
  handleSendCallMessage,
  localVideoRef
}) {
  const p = selectedPartner || defaultPartners[0];

  return (
    <div className="mm-call-screen-wrap" style={{ minHeight: '620px', borderRadius: '24px' }}>
      <div className="mm-remote-video-container">
        <img src={p.profile_photo_url} alt={p.display_name} className="mm-remote-video-feed" />

        {/* Live Timer */}
        <div className="mm-call-timer-pill">
          <Clock size={12} /> {formatTimer(callTimer || 1099)}
        </div>

        {/* Local PiP Preview */}
        <div className="mm-local-pip-video">
          <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {videoOff && (
            <div style={{ position: 'absolute', inset: 0, background: '#2B0D30', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem' }}>
              Cam Off
            </div>
          )}
        </div>

        {/* In-Call Messages Slide-Over */}
        {chatDrawerOpen && (
          <div className="mm-call-chat-drawer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Live In-Call Chat</span>
              <button onClick={() => setChatDrawerOpen(false)} style={{ border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div className="mm-chat-msgs-scroll">
              {callMessages.map(m => (
                <div key={m.id} className={`mm-bubble ${m.isMe ? 'mine' : 'theirs'}`}>
                  {m.text}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessageText}
                onChange={e => setNewMessageText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendCallMessage()}
                style={{ flex: 1, padding: '6px 12px', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.8rem' }}
              />
              <button onClick={handleSendCallMessage} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--mm-rose)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Floating Call Controls */}
        <div className="mm-call-floating-bar">
          <button className={`mm-call-ctrl-btn ${micMuted ? 'active-off' : ''}`} onClick={() => setMicMuted(!micMuted)}>
            {micMuted ? <MicOff size={18} /> : <Mic size={18} />}
            <span>Mic</span>
          </button>
          <button className={`mm-call-ctrl-btn ${videoOff ? 'active-off' : ''}`} onClick={() => setVideoOff(!videoOff)}>
            {videoOff ? <VideoOff size={18} /> : <Video size={18} />}
            <span>Video</span>
          </button>
          <button className="mm-call-ctrl-btn end-call" onClick={handleEndCall}>
            <Phone size={22} style={{ transform: 'rotate(135deg)' }} />
            <span>End</span>
          </button>
          <button className="mm-call-ctrl-btn" onClick={() => setChatDrawerOpen(!chatDrawerOpen)}>
            <MessageSquare size={18} />
            <span>Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}


// =============================================================================
// PUBLIC WEBSITE HOME
// =============================================================================
function PublicHomeScreen({ setCurrentScreen }) {
  return (
    <div style={{ padding: '48px 24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
        <ManmitraSymbol size={64} color="var(--mm-rose)" />
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--mm-plum)', marginTop: '18px', lineHeight: 1.2 }}>
          Find a Friend. Share a Smile. Feel Connected.
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--mm-text-secondary)', marginTop: '14px', lineHeight: 1.6 }}>
          Connect with friendly Maanmitra Partners for meaningful conversations, everyday discussions, and moments of genuine companionship.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '28px' }}>
          <button className="mm-btn-primary" style={{ width: 'auto', padding: '14px 32px' }} onClick={() => setCurrentScreen('browse')}>
            Find Your Companion
          </button>
          <button className="mm-btn-secondary" onClick={() => setCurrentScreen('partner_welcome')}>
            Become a Maanmitra Partner
          </button>
        </div>
      </div>

      {/* 3 Step How It Works */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        <div className="mm-card" style={{ padding: '28px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--mm-rose-light)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={26} color="var(--mm-rose)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--mm-plum)' }}>1. Choose a Partner</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--mm-text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
            Browse verified profiles, ratings, spoken languages, and real-time online status.
          </p>
        </div>

        <div className="mm-card" style={{ padding: '28px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--mm-rose-light)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Phone size={26} color="var(--mm-rose)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--mm-plum)' }}>2. Select Communication</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--mm-text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
            Pick friendly text chat, private audio call, or video conversation with clear rates.
          </p>
        </div>

        <div className="mm-card" style={{ padding: '28px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--mm-rose-light)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={26} color="var(--mm-rose)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--mm-plum)' }}>3. Enjoy Conversation</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--mm-text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
            Share your day or unwind in a safe, judgment-free, and private listening space.
          </p>
        </div>
      </div>
    </div>
  );
}


// =============================================================================
// POSTER WALKTHROUGH VIEW (24-SCREEN FLOW REFERENCE REPRODUCTION)
// =============================================================================
function PosterWalkthroughView({ onSelectScreen }) {
  return (
    <div className="mm-poster-layout">
      <div className="mm-poster-top-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ManmitraSymbol size={44} color="gold" />
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Maanmitra</h1>
              <p style={{ fontSize: '0.85rem', color: '#F8C3D9', margin: '2px 0 0' }}>A Listening Friend, Always With You</p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 800 }}>Complete Mobile App Flow</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--mm-gold)', fontWeight: 600 }}>3 Roles - Admin | Maanmitra Partner | User</div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="mm-top-badge"><ShieldCheck size={13} /> Safe & Secure</span>
          <span className="mm-top-badge"><UserCheck size={13} /> Verified</span>
          <span className="mm-top-badge"><Lock size={13} /> Private</span>
        </div>
      </div>

      <div className="mm-poster-journey-grid">
        {/* Admin Journey Column */}
        <div className="mm-journey-column">
          <div className="mm-journey-header admin">
            <Users size={20} />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>1. Admin Journey</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Manage Platform, Partners, Users and Earnings</div>
            </div>
          </div>

          <div className="mm-journey-screens-list">
            {[
              { num: '1. Splash Screen', id: 'admin_splash', title: 'Splash Screen' },
              { num: '2. Admin Login', id: 'admin_login', title: 'Admin Login' },
              { num: '3. Dashboard', id: 'admin_dashboard', title: 'Dashboard' },
              { num: '4. Manage Partners', id: 'admin_partners', title: 'Manage Partners' },
              { num: '5. Manage Users', id: 'admin_users', title: 'Manage Users' },
              { num: '6. Manage Bookings', id: 'admin_bookings', title: 'Manage Bookings' },
              { num: '7. Payments & Reports', id: 'admin_payments', title: 'Payments & Reports' },
              { num: '8. Settings', id: 'admin_settings', title: 'Settings' }
            ].map(s => (
              <div key={s.id} className="mm-screen-thumb-card" onClick={() => onSelectScreen('admin', s.id)}>
                <div className="mm-screen-thumb-preview" style={{ background: '#350C36', color: '#fff', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <ManmitraSymbol size={28} color="gold" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: '8px', textAlign: 'center' }}>{s.title}</span>
                  <span style={{ fontSize: '0.65rem', color: '#F7C6D9', marginTop: '4px' }}>Click to Test</span>
                </div>
                <div className="mm-screen-thumb-caption">
                  <span className="mm-screen-thumb-number">{s.num}</span>
                  <Play size={12} color="var(--mm-rose)" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Journey Column */}
        <div className="mm-journey-column">
          <div className="mm-journey-header partner">
            <Award size={20} />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>2. Maanmitra Partner Journey</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Register, Get Approved and Connect with Users</div>
            </div>
          </div>

          <div className="mm-journey-screens-list">
            {[
              { num: '1. Partner Welcome', id: 'partner_welcome', title: 'Partner Welcome' },
              { num: '2. Registration', id: 'partner_register', title: 'Registration' },
              { num: '3. Document Verification', id: 'partner_verification', title: 'Document Verification' },
              { num: '4. Approval Status', id: 'partner_approval_status', title: 'Approval Status' },
              { num: '5. Partner Login', id: 'partner_login', title: 'Partner Login' },
              { num: '6. Partner Dashboard', id: 'partner_dashboard', title: 'Partner Dashboard' },
              { num: '7. My Bookings', id: 'partner_bookings', title: 'My Bookings' },
              { num: '8. Chat / Call Screen', id: 'call_screen', title: 'Chat / Call Screen' }
            ].map(s => (
              <div key={s.id} className="mm-screen-thumb-card" onClick={() => onSelectScreen('partner', s.id)}>
                <div className="mm-screen-thumb-preview" style={{ background: '#FFF0F5', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Heart size={26} color="var(--mm-rose)" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: '8px', color: 'var(--mm-plum)', textAlign: 'center' }}>{s.title}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--mm-rose)', marginTop: '4px' }}>Click to Test</span>
                </div>
                <div className="mm-screen-thumb-caption">
                  <span className="mm-screen-thumb-number">{s.num}</span>
                  <Play size={12} color="var(--mm-rose)" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Journey Column */}
        <div className="mm-journey-column">
          <div className="mm-journey-header user">
            <Heart size={20} />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>3. User Journey</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Chat, Call and Make Meaningful Connections</div>
            </div>
          </div>

          <div className="mm-journey-screens-list">
            {[
              { num: '1. Welcome', id: 'user_welcome', title: 'Welcome' },
              { num: '2. Registration', id: 'user_auth', title: 'User Registration' },
              { num: '3. Browse Partners', id: 'browse', title: 'Browse Partners' },
              { num: '4. Partner Profile', id: 'partner_profile', title: 'Partner Profile' },
              { num: '5. Select Package', id: 'select_package', title: 'Select Package' },
              { num: '6. Payment', id: 'payment', title: 'Payment' },
              { num: '7. Live Chat / Call', id: 'call_screen', title: 'Live Chat / Call' },
              { num: '8. User Dashboard', id: 'user_dashboard', title: 'User Dashboard' }
            ].map(s => (
              <div key={s.id} className="mm-screen-thumb-card" onClick={() => onSelectScreen('user', s.id)}>
                <div className="mm-screen-thumb-preview" style={{ background: '#FFF1F5', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <ManmitraSymbol size={26} color="var(--mm-rose)" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: '8px', color: 'var(--mm-plum)', textAlign: 'center' }}>{s.title}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--mm-rose)', marginTop: '4px' }}>Click to Test</span>
                </div>
                <div className="mm-screen-thumb-caption">
                  <span className="mm-screen-thumb-number">{s.num}</span>
                  <Play size={12} color="var(--mm-rose)" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Fallback Mock Datasets
const defaultPartners = [
  {
    id: 1,
    display_name: 'Priya Sharma',
    profile_photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=85',
    languages: ['Hindi', 'English'],
    availability_status: 'online',
    verification_status: 'approved',
    rating_average: 4.8,
    review_count: 236,
    bio: 'Warm, empathetic listener. Ready to chat about your day, dreams, or anything on your mind with zero judgment.',
    rate_chat_15m: 99,
    rate_audio_30m: 299,
    rate_video_30m: 499
  },
  {
    id: 2,
    display_name: 'Pooja',
    profile_photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=85',
    languages: ['Hindi', 'English', 'Punjabi'],
    availability_status: 'online',
    verification_status: 'approved',
    rating_average: 4.7,
    review_count: 142,
    bio: 'Friendly companion who loves deep conversations, storytelling, and sharing positive energy.',
    rate_chat_15m: 99,
    rate_audio_30m: 299,
    rate_video_30m: 499
  },
  {
    id: 3,
    display_name: 'Molina',
    profile_photo_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=85',
    languages: ['Bengali', 'Hindi', 'English'],
    availability_status: 'online',
    verification_status: 'approved',
    rating_average: 4.9,
    review_count: 189,
    bio: 'Patient listener and gentle guide. Here whenever you need a calm ear after a long hectic day.',
    rate_chat_15m: 99,
    rate_audio_30m: 299,
    rate_video_30m: 499
  },
  {
    id: 4,
    display_name: 'Neha',
    profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85',
    languages: ['Marathi', 'Hindi', 'English'],
    availability_status: 'online',
    verification_status: 'approved',
    rating_average: 4.8,
    review_count: 95,
    bio: 'Cheerful spirit, great listener, and passionate about arts and books. Let\'s share a smile!',
    rate_chat_15m: 99,
    rate_audio_30m: 299,
    rate_video_30m: 499
  }
];

const defaultPackages = [
  { id: 1, name: '15 Minutes Text Chat', duration_minutes: 15, price: 99, communication_type: 'chat' },
  { id: 2, name: '30 Minutes Audio Call', duration_minutes: 30, price: 299, communication_type: 'audio' },
  { id: 3, name: '30 Minutes Video Call', duration_minutes: 30, price: 499, communication_type: 'video' },
  { id: 4, name: 'Extended Friendly Talk', duration_minutes: 60, price: 599, communication_type: 'audio' }
];

const defaultAdminStats = {
  summary: {
    total_users: 12450,
    total_partners: 568,
    total_bookings: 2389,
    total_revenue: 245780
  }
};

const defaultPartnerStats = {
  statistics: {
    total_chats: 568,
    total_calls: 324,
    total_earnings: 24580
  }
};
