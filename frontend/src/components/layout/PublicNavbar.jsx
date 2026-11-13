import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, User, LogOut, Search, ChevronDown, ArrowRight,
  Users, HeartHandshake, Compass, Heart, Target, Sparkles, Briefcase, Headphones
} from 'lucide-react';
import { MaanmitraOriginalLogo } from '../../ManmitraLogo';
import { useAuth } from '../../context/AuthContext';
import { MAANMITRA_SERVICES } from '../../utils/servicesData';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll listener for sticky shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'maanmitra_partner') return '/partner/dashboard';
    return '/user/dashboard';
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Find Professionals', path: '/counselling' },
    { label: 'Services', path: '/services', hasDropdown: true },
    { label: 'Remote Opportunities', path: '/become-a-partner' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const top3Services = MAANMITRA_SERVICES.slice(0, 3);
  const remaining5Services = MAANMITRA_SERVICES.slice(3);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '10px 16px',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'all 0.25s ease',
        background: scrolled ? 'rgba(255, 249, 245, 0.98)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}
      role="banner"
    >
      {/* Floating Pill Container */}
      <div
        style={{
          maxWidth: '1280px',
          width: '95%',
          margin: '0 auto',
          background: '#FFFFFF',
          borderRadius: '9999px',
          border: '1.5px solid #F0E3D7',
          boxShadow: scrolled
            ? '0 10px 30px rgba(80, 22, 79, 0.10)'
            : '0 4px 20px rgba(80, 22, 79, 0.05)',
          padding: '6px 16px 6px 20px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        {/* 1. Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            flexShrink: 0
          }}
          aria-label="MAANMITRA Home"
        >
          <MaanmitraOriginalLogo height={38} />
        </Link>

        {/* 2. Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
          className="mm-nav-desktop-only"
        >
          {navLinks.map((link) => {
            const active = isActive(link.path);

            if (link.hasDropdown) {
              return (
                <div
                  key={link.label}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <Link
                    to={link.path}
                    className="mm-header-nav-link"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.84rem',
                      fontWeight: (active || servicesDropdownOpen) ? 600 : 500,
                      color: '#50164F',
                      background: servicesDropdownOpen ? '#FDF2F8' : (active ? '#FDF2F8' : 'transparent'),
                      border: servicesDropdownOpen ? '1px solid #EEDBCF' : '1px solid transparent',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ color: '#50164F' }}>{link.label}</span>
                    <ChevronDown
                      size={13}
                      style={{
                        opacity: 0.75,
                        transform: servicesDropdownOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease',
                        color: '#50164F'
                      }}
                    />
                  </Link>

                  {/* Indicator notch underneath Services when active/open */}
                  {servicesDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-7px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px',
                        height: '2.5px',
                        background: '#D8B36A',
                        borderRadius: '2px',
                      }}
                    />
                  )}

                  {/* 8-Service Mega-Menu Dropdown */}
                  {servicesDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '12px',
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        boxShadow: '0 24px 60px rgba(80, 22, 79, 0.18)',
                        border: '1.5px solid #F0DCE8',
                        padding: '18px 20px',
                        width: '680px',
                        zIndex: 1020,
                        animation: 'fadeIn 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                    >
                      {/* Top Arrow Pointer Notch */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '-9px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 0,
                          height: 0,
                          borderLeft: '10px solid transparent',
                          borderRight: '10px solid transparent',
                          borderBottom: '10px solid #FFFFFF',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '-11px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 0,
                          height: 0,
                          borderLeft: '11px solid transparent',
                          borderRight: '11px solid transparent',
                          borderBottom: '11px solid #F0DCE8',
                          zIndex: -1
                        }}
                      />

                      {/* Header: — Top Priority Services — */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#D8B36A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          ★ Top Priority Services
                        </span>
                        <Link to="/services" onClick={() => setServicesDropdownOpen(false)} style={{ fontSize: '0.78rem', color: '#50164F', fontWeight: 700, textDecoration: 'none' }}>
                          View All 8 Services →
                        </Link>
                      </div>

                      {/* Row 1: Top 3 Featured Services */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                        {top3Services.map((card) => {
                          const IconComp = card.icon;
                          return (
                            <Link
                              key={card.id}
                              to={card.path}
                              onClick={() => setServicesDropdownOpen(false)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '12px 10px',
                                borderRadius: '14px',
                                background: card.theme.bgLight,
                                border: `1.5px solid ${card.theme.borderLight}`,
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(80, 22, 79, 0.08)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  background: '#FFFFFF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <IconComp size={16} color={card.theme.accent} />
                                </div>
                                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: card.theme.tagColor }}>
                                  {card.number}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#50164F', marginBottom: '4px' }}>
                                {card.title}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#665365', lineHeight: 1.35 }}>
                                {card.cardDescription}
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Sub-Header: Other Specialized Services */}
                      <div style={{ borderTop: '1px solid #F0E3D7', paddingTop: '12px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#665365', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Specialized Guidance &amp; Growth
                        </span>
                      </div>

                      {/* Row 2: Remaining 5 Services */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                        {remaining5Services.map((card) => {
                          const IconComp = card.icon;
                          return (
                            <Link
                              key={card.id}
                              to={card.path}
                              onClick={() => setServicesDropdownOpen(false)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: '10px 4px 8px',
                                borderRadius: '12px',
                                background: '#FFFFFF',
                                border: '1px solid #F0E3D7',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.borderColor = '#D8B36A';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.borderColor = '#F0E3D7';
                              }}
                            >
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: card.theme.bgLight,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '6px'
                              }}>
                                <IconComp size={16} color={card.theme.accent} />
                              </div>
                              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#50164F', lineHeight: 1.25 }}>
                                {card.title}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={link.label}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Link
                  to={link.path}
                  className="mm-header-nav-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: active ? '6px 16px' : '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.84rem',
                    fontWeight: active ? 600 : 500,
                    color: active ? '#FFFFFF' : '#50164F',
                    background: active ? '#50164F' : 'transparent',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    boxShadow: active ? '0 2px 8px rgba(80, 22, 79, 0.20)' : 'none',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = '#FAF2F7';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ color: active ? '#FFFFFF' : '#50164F', fontWeight: active ? 600 : 500 }}>
                    {link.label}
                  </span>
                </Link>

                {/* Subtle Indicator Notch for Home */}
                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-7px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '18px',
                      height: '2.5px',
                      background: '#D8B36A',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* 3. Desktop Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }} className="mm-nav-desktop-only">
          {/* Circular Search Icon */}
          <Link
            to="/counselling"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              color: '#50164F',
              textDecoration: 'none',
              background: '#FFFFFF',
              border: '1.5px solid #EEDBCF',
              boxShadow: '0 2px 6px rgba(80, 22, 79, 0.04)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            title="Search Professionals"
            aria-label="Search"
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#50164F'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#EEDBCF'; }}
          >
            <Search size={15} />
          </Link>

          {/* User Auth or Login Pill */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link
                to={getDashboardPath()}
                className="mm-header-btn-login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#50164F',
                  border: '1.5px solid #50164F',
                  background: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                <User size={13} />
                <span>
                  {user.role === 'admin' ? 'Admin' : user.role === 'maanmitra_partner' ? 'Partner' : 'Portal'}
                </span>
              </Link>
              <button
                onClick={() => { logout(); navigate('/'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #EEDBCF',
                  background: 'transparent',
                  color: '#50164F',
                  cursor: 'pointer'
                }}
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="mm-header-btn-login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#50164F',
                border: '1.5px solid #50164F',
                background: '#FFFFFF',
                textDecoration: 'none',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FAF2F7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
              }}
            >
              <User size={13} />
              <span>Login</span>
            </Link>
          )}

          {/* Get Access Button */}
          <Link
            to="/user/subscribe"
            className="mm-header-btn-access"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 18px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#FFFFFF',
              background: '#50164F',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(80, 22, 79, 0.22)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#3A0E39';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#50164F';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span style={{ color: '#FFFFFF' }}>Get Access</span>
            <ArrowRight size={13} color="#FFFFFF" />
          </Link>
        </div>

        {/* 4. Mobile Hamburger Button */}
        <button
          className="mm-mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileMenuOpen}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#50164F',
            cursor: 'pointer',
            padding: '6px',
            display: 'none'
          }}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 5. Mobile Slide-in Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="mm-mobile-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1001
            }}
          />
          <aside
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '320px',
              background: '#FFFFFF',
              zIndex: 1002,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
              overflowY: 'auto'
            }}
            aria-label="Mobile Navigation"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <MaanmitraOriginalLogo height={34} />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#50164F', cursor: 'pointer' }}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  color: isActive('/') ? '#50164F' : '#665365',
                  background: isActive('/') ? '#FDF2F8' : 'transparent',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                Home
              </Link>

              <Link
                to="/counselling"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  color: '#665365',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                Find Professionals
              </Link>

              {/* Mobile Services Accordion */}
              <div>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: mobileServicesOpen ? '#FDF2F8' : 'transparent',
                    color: '#50164F',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <span>Services (All 8)</span>
                  <ChevronDown size={16} style={{ transform: mobileServicesOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </button>

                {mobileServicesOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '14px', marginTop: '6px' }}>
                    {MAANMITRA_SERVICES.map((s) => (
                      <Link
                        key={s.id}
                        to={s.path}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: s.isPriority ? 700 : 500,
                          color: s.isPriority ? '#50164F' : '#665365',
                          padding: '6px 10px',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ color: '#D8B36A', fontSize: '0.75rem', fontWeight: 800 }}>{s.number}</span>
                        <span>{s.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/become-a-partner"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  color: '#665365',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                Remote Opportunities
              </Link>

              <Link
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  color: '#665365',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                How It Works
              </Link>

              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  color: '#665365',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                About Us
              </Link>

              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  color: '#665365',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                Contact
              </Link>
            </nav>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '20px', borderTop: '1px solid #F0DCE8' }}>
              <Link
                to={user ? getDashboardPath() : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1.5px solid #50164F',
                  color: '#50164F',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <User size={16} /> {user ? 'Go to Dashboard' : 'Login'}
              </Link>
              <Link
                to="/user/subscribe"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#50164F',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <span>Get Access</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </aside>
        </>
      )}

      {/* Responsive CSS for Header */}
      <style>{`
        .mm-header-nav-link {
          text-decoration: none !important;
        }
        .mm-header-nav-link span {
          transition: color 0.2s ease;
        }
        @media (max-width: 1280px) {
          .mm-nav-desktop-only { gap: 4px !important; }
          .mm-header-nav-link { padding: 5px 8px !important; font-size: 0.80rem !important; }
          .mm-header-btn-access { padding: 6px 14px !important; font-size: 0.80rem !important; }
          .mm-header-btn-login { padding: 5px 12px !important; font-size: 0.80rem !important; }
        }
        @media (max-width: 1140px) {
          .mm-nav-desktop-only { display: none !important; }
          .mm-mobile-menu-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
