import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  TrendingUp, Users, Award, Calendar, DollarSign, Settings,
  LogOut, Heart, Search, MessageSquare, ShieldCheck, Clock,
  Bell, ChevronRight, User, Home, Sparkles, Phone, Video,
  Radio, Wallet, ArrowDownToLine, Gift, Star, HelpCircle,
  Menu, X, Layers, Activity, CheckCircle2
} from 'lucide-react';
import { ManmitraSymbol } from '../../ManmitraLogo';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout({ children, role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDemo = user?.is_demo || user?.email === 'mentor.demo@maanmitra.com' || user?.email?.includes('demo');

  // Sidebar Links config per role
  const getNavSections = () => {
    if (role === 'admin') {
      return [
        {
          title: 'ADMINISTRATION',
          items: [
            { label: 'Dashboard', path: '/admin/dashboard', icon: TrendingUp },
            { label: 'Manage Partners', path: '/admin/partners', icon: Award },
            { label: 'Manage Users', path: '/admin/users', icon: Users },
            { label: 'Manage Bookings', path: '/admin/bookings', icon: Calendar },
            { label: 'Payments & Revenue', path: '/admin/payments', icon: DollarSign },
            { label: 'Manage Packages', path: '/admin/packages', icon: Award },
            { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
          ]
        }
      ];
    }

    if (role === 'partner') {
      return [
        {
          title: 'CORE STUDIO',
          items: [
            { label: 'Overview', path: '/partner/dashboard', icon: Home },
            { label: 'My Profile', path: '/partner/profile', icon: User },
            { label: 'My Expertise', path: '/partner/expertise', icon: Sparkles },
            { label: 'Verification & KYC', path: '/partner/verification', icon: ShieldCheck },
            { label: 'Availability Calendar', path: '/partner/availability', icon: Calendar },
          ]
        },
        {
          title: 'CLIENT SESSIONS',
          items: [
            { label: 'My Sessions', path: '/partner/sessions', icon: Clock },
            { label: 'Chat & Messages', path: '/partner/messages', icon: MessageSquare },
            { label: 'Audio Sessions', path: '/partner/audio-sessions', icon: Phone },
            { label: 'Video Sessions', path: '/partner/video-sessions', icon: Video },
            { label: 'Live Streaming', path: '/partner/live', icon: Radio },
            { label: 'Group Workshops', path: '/partner/workshops', icon: Users },
          ]
        },
        {
          title: 'FINANCE & GROWTH',
          items: [
            { label: 'My Earnings', path: '/partner/earnings', icon: DollarSign },
            { label: 'Wallet', path: '/partner/wallet', icon: Wallet },
            { label: 'Withdrawals', path: '/partner/withdrawals', icon: ArrowDownToLine },
            { label: 'Rank & Performance', path: '/partner/rank', icon: TrendingUp },
            { label: 'Bonuses & Rewards', path: '/partner/bonuses', icon: Gift },
            { label: 'Reviews & Ratings', path: '/partner/reviews', icon: Star },
          ]
        },
        {
          title: 'SUPPORT & ACCOUNT',
          items: [
            { label: 'Notifications', path: '/partner/notifications', icon: Bell },
            { label: 'Help & Support', path: '/partner/support', icon: HelpCircle },
            { label: 'Settings', path: '/partner/settings', icon: Settings },
          ]
        }
      ];
    }

    // User Member
    return [
      {
        title: 'MEMBER HUB',
        items: [
          { label: 'My Dashboard', path: '/user/dashboard', icon: Home },
          { label: 'Discover Matches', path: '/user/discover', icon: Search },
          { label: 'My Matches', path: '/user/matches', icon: Heart },
          { label: 'Guidance & Astrology', path: '/user/content', icon: Star },
          { label: 'AI Relationship Coach', path: '/user/ai', icon: Sparkles },
        ]
      },
      {
        title: 'ACCOUNT & WALLET',
        items: [
          { label: 'My Bookings & Payments', path: '/user/bookings', icon: Calendar },
          { label: 'My Wallet & Top-Up', path: '/user/wallet', icon: Wallet },
          { label: 'Session History', path: '/user/sessions', icon: Clock },
          { label: 'Membership', path: '/user/subscription', icon: ShieldCheck },
          { label: 'My Profile', path: '/user/profile', icon: User },
        ]
      }
    ];
  };

  const navSections = getNavSections();

  // Mobile Bottom Nav Links
  const getBottomNavItems = () => {
    if (role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin/dashboard', icon: TrendingUp },
        { label: 'Partners', path: '/admin/partners', icon: Award },
        { label: 'Users', path: '/admin/users', icon: Users },
        { label: 'Bookings', path: '/admin/bookings', icon: Calendar },
        { label: 'Settings', path: '/admin/settings', icon: Settings },
      ];
    }
    if (role === 'partner') {
      return [
        { label: 'Home', path: '/partner/dashboard', icon: Home },
        { label: 'Sessions', path: '/partner/sessions', icon: Clock },
        { label: 'Messages', path: '/partner/messages', icon: MessageSquare },
        { label: 'Earnings', path: '/partner/earnings', icon: DollarSign },
        { label: 'More', path: '/partner/profile', icon: Settings },
      ];
    }
    // User
    return [
      { label: 'Home', path: '/user/dashboard', icon: Home },
      { label: 'Matches', path: '/user/matches', icon: Heart },
      { label: 'Wallet', path: '/user/wallet', icon: Wallet },
      { label: 'Profile', path: '/user/profile', icon: Settings },
    ];
  };

  const bottomNavItems = getBottomNavItems();

  return (
    <div className="mm-dashboard-root">
      {/* -----------------------------------------------------------
          DESKTOP SIDEBAR
          ----------------------------------------------------------- */}
      <aside className={`mm-dashboard-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Logo & Portal Badge */}
          <div className="mm-sidebar-brand-wrapper">
            <Link to="/" className="mm-sidebar-brand">
              <ManmitraSymbol size={32} color="gold" />
              <div>
                <span className="mm-sidebar-brand-title">MAANMITRA</span>
                <span className="mm-sidebar-role-badge">
                  {role === 'admin' ? 'ADMIN CONSOLE' : role === 'partner' ? 'COUNSELLOR STUDIO' : 'MEMBER DASHBOARD'}
                </span>
              </div>
            </Link>
            {mobileMenuOpen && (
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="mm-sidebar-close-btn"
                title="Close navigation"
              >
                <X size={20} color="#FFFFFF" />
              </button>
            )}
          </div>

          {/* DEMO MODE BADGE (If active) */}
          {isDemo && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 119, 0.25), rgba(233, 30, 99, 0.25))',
              border: '1px solid var(--mm-gold)',
              borderRadius: '8px',
              padding: '8px 12px',
              margin: '0 8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                background: 'var(--mm-gold)',
                color: '#320C33',
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '4px',
                letterSpacing: '0.05em'
              }}>DEMO MODE</span>
              <span style={{ fontSize: '0.72rem', color: '#FFF1F5', fontWeight: 600 }}>Stakeholder Preview</span>
            </div>
          )}

          {/* Nav Items (Categorized with Section Titles) */}
          <nav className="mm-sidebar-nav" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
            {navSections.map((sec, sIdx) => (
              <div key={sIdx} style={{ marginBottom: '14px' }}>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  color: 'rgba(255, 255, 255, 0.45)',
                  padding: '6px 12px',
                  textTransform: 'uppercase'
                }}>
                  {sec.title}
                </div>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`mm-sidebar-link ${isActive ? 'active' : ''}`}
                    >
                      <Icon size={17} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User Card & Logout at bottom */}
          <div className="mm-sidebar-footer" style={{ marginTop: 'auto' }}>
            <div className="mm-sidebar-user-card">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name || 'User'}`}
                alt={user?.full_name || 'User'}
                className="mm-sidebar-avatar"
              />
              <div className="mm-sidebar-user-info" style={{ overflow: 'hidden' }}>
                <span className="mm-sidebar-user-name" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {user?.full_name || 'Companion'}
                </span>
                <span className="mm-sidebar-user-email" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {role === 'partner' ? 'Verified Mentor' : user?.email || ''}
                </span>
              </div>
            </div>
            <button onClick={handleLogout} className="mm-sidebar-logout-btn">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* -----------------------------------------------------------
          MAIN CONTENT AREA & TOPBAR
          ----------------------------------------------------------- */}
      <div className="mm-dashboard-main-wrap">
        {/* Top bar */}
        <header className="mm-dashboard-topbar">
          <div className="mm-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Drawer Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="mm-topbar-mobile-menu-btn"
              title="Open Navigation"
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <Menu size={22} color="var(--mm-plum)" />
            </button>

            <Link to="/" className="mm-topbar-mobile-logo">
              <ManmitraSymbol size={28} color="var(--mm-rose)" />
              <span style={{ fontWeight: 800, color: 'var(--mm-plum)', fontSize: '1.1rem' }}>MAANMITRA</span>
            </Link>
            
            <span className="mm-topbar-greeting">
              Welcome back, <strong>{user?.full_name || 'Friend'}</strong>
            </span>
          </div>

          <div className="mm-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {isDemo && (
              <span style={{
                background: '#FAF3E8',
                color: '#D4AF77',
                border: '1px solid #D4AF77',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4AF77' }}></span>
                DEMO PREVIEW
              </span>
            )}

            {role === 'user' && (
              <Link
                to="/user/wallet"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #FFF1F5 0%, #FFE7EF 100%)',
                  border: '1px solid #F0DCE8',
                  color: '#4A154B',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
                title="Wallet Balance & Top-Up"
              >
                <Wallet size={15} color="#E91E63" />
                <span>₹{user?.wallet_balance_inr || 0}</span>
                <span
                  style={{
                    background: '#E91E63',
                    color: '#FFFFFF',
                    fontSize: '0.68rem',
                    padding: '1px 6px',
                    borderRadius: '6px',
                    fontWeight: 700
                  }}
                >
                  + Top-up
                </span>
              </Link>
            )}

            <Link to="/" className="mm-topbar-public-link" style={{ fontSize: '0.82rem', color: 'var(--mm-rose)', fontWeight: 600, textDecoration: 'none' }}>
              Explore Website 
            </Link>
            
            <Link to={role === 'partner' ? '/partner/notifications' : '#'} className="mm-topbar-bell" title="Notifications">
              <Bell size={18} color="var(--mm-plum)" />
            </Link>

            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name || 'User'}`}
              alt="Avatar"
              className="mm-topbar-avatar"
            />
          </div>
        </header>

        {/* Dashboard Content Outlet */}
        <main className="mm-dashboard-content">
          {children}
        </main>

        {/* -----------------------------------------------------------
            MOBILE BOTTOM NAVIGATION BAR
            ----------------------------------------------------------- */}
        <nav className="mm-dashboard-bottom-nav">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mm-bottom-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

