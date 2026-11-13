import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, User, LogOut, Search, ChevronDown, ArrowRight,
  Heart, Compass, Sparkles, Laptop, Headphones
} from 'lucide-react';
import { MaanmitraOriginalLogo } from '../../ManmitraLogo';
import { useAuth } from '../../context/AuthContext';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll listener for sticky shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
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

  // 5 Rich Service Cards in Mega-Menu (matching reference screenshot)
  const servicesCards = [
    {
      title: 'Relationship Guidance',
      bg: '#FDEEF1',
      iconColor: '#E91E63',
      icon: Heart,
      link: '/counselling'
    },
    {
      title: 'Life Coaching',
      bg: '#FEF7EB',
      iconColor: '#D4AF77',
      icon: Compass,
      link: '/services'
    },
    {
      title: 'Astrology & Kundali',
      bg: '#F4ECFA',
      iconColor: '#8B5CF6',
      icon: Sparkles,
      link: '/services'
    },
    {
      title: 'Remote Work Opportunities',
      bg: '#EFF8F2',
      iconColor: '#22A447',
      icon: Laptop,
      link: '/become-a-partner'
    },
    {
      title: 'Counselling & Support',
      bg: '#FDF0F4',
      iconColor: '#E91E63',
      icon: Headphones,
      link: '/counselling'
    }
  ];

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
        background: scrolled ? 'rgba(253, 251, 249, 0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}
      role="banner"
    >
      {/* Floating Pill Container matching reference layout with NO overflow */}
      <div
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          background: '#FFFFFF',
          borderRadius: '9999px',
          border: '1.5px solid #F2E6DC',
          boxShadow: scrolled
            ? '0 10px 30px rgba(74, 21, 75, 0.10)'
            : '0 4px 20px rgba(74, 21, 75, 0.05)',
          padding: '6px 14px 6px 16px',
          height: '62px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        {/* 1. Brand Logo with NEW Golden Emblem */}
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
          <MaanmitraOriginalLogo height={36} />
        </Link>

        {/* 2. Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            marginLeft: '8px'
          }}
          className="mm-nav-desktop-only"
        >
          {navLinks.map((link) => {
            const active = isActive(link.path);

            if (link.hasDropdown) {
              return (
                <div
                  key={link.label}
                  style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <Link
                    to={link.path}
                    className="mm-nav-link"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 9px',
                      borderRadius: '9999px',
                      fontSize: '0.81rem',
                      fontWeight: (active || servicesDropdownOpen) ? 600 : 500,
                      color: '#4A154B',
                      background: servicesDropdownOpen ? '#FAF0F6' : (active ? '#FAF0F6' : 'transparent'),
                      border: servicesDropdownOpen ? '1px solid #EEDBCF' : '1px solid transparent',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      size={13}
                      style={{
                        opacity: 0.75,
                        transform: servicesDropdownOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </Link>

                  {/* Indicator notch underneath Services when active/open */}
                  {servicesDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-8px',
                        width: '20px',
                        height: '2.5px',
                        background: '#D4AF77',
                        borderRadius: '2px',
                      }}
                    />
                  )}

                  {/* Rich Services Dropdown Mega-Menu Card (matching screenshot) */}
                  {servicesDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '12px',
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        boxShadow: '0 20px 50px rgba(74, 21, 75, 0.16)',
                        border: '1.5px solid #F0DCE8',
                        padding: '16px 18px 18px',
                        width: '610px',
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

                      {/* Header: — Our Services — */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          marginBottom: '14px',
                        }}
                      >
                        <div style={{ height: '2px', width: '32px', background: '#D4AF77', borderRadius: '2px' }} />
                        <span style={{
                          color: '#4A154B',
                          fontSize: '0.94rem',
                          fontWeight: 800,
                          letterSpacing: '0.3px',
                        }}>
                          Our Services
                        </span>
                        <div style={{ height: '2px', width: '32px', background: '#D4AF77', borderRadius: '2px' }} />
                      </div>

                      {/* 5 Cards Row */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(5, 1fr)',
                          gap: '9px',
                        }}
                      >
                        {servicesCards.map((card) => {
                          const IconComp = card.icon;
                          return (
                            <Link
                              key={card.title}
                              to={card.link}
                              onClick={() => setServicesDropdownOpen(false)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px 5px 8px',
                                borderRadius: '12px',
                                background: '#FFFFFF',
                                border: '1px solid #F4E8EE',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                                textAlign: 'center',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 6px 18px rgba(74, 21, 75, 0.08)';
                                e.currentTarget.style.borderColor = '#D4AF77';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = '#F4E8EE';
                              }}
                            >
                              {/* Icon Container */}
                              <div
                                style={{
                                  width: '38px',
                                  height: '38px',
                                  borderRadius: '10px',
                                  background: card.bg,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginBottom: '6px',
                                  flexShrink: 0,
                                }}
                              >
                                <IconComp size={18} color={card.iconColor} />
                              </div>

                              {/* Title */}
                              <div
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: '#4A154B',
                                  lineHeight: 1.25,
                                  minHeight: '26px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {card.title}
                              </div>

                              {/* Small Gold Arrow Button */}
                              <div
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '50%',
                                  background: '#EAC384',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginTop: '6px',
                                }}
                              >
                                <ArrowRight size={9} color="#380C22" />
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
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Link
                  to={link.path}
                  className="mm-nav-link"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: active ? '5px 14px' : '5px 9px',
                    borderRadius: '9999px',
                    fontSize: '0.81rem',
                    fontWeight: active ? 600 : 500,
                    color: active ? '#FFFFFF' : '#4A154B',
                    background: active ? '#4A154B' : 'transparent',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = '#FAF2F7';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span>{link.label}</span>
                </Link>

                {/* Active Indicator Underline for Home */}
                {active && (
                  <div
                    style={{
                      width: '18px',
                      height: '2px',
                      background: '#D4AF77',
                      borderRadius: '2px',
                      marginTop: '2px',
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
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              color: '#4A154B',
              textDecoration: 'none',
              background: '#FFFFFF',
              border: '1.5px solid #EEDBCF',
              boxShadow: '0 2px 6px rgba(74, 21, 75, 0.04)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            title="Search Professionals"
            aria-label="Search"
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4A154B'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#EEDBCF'; }}
          >
            <Search size={15} />
          </Link>

          {/* User Auth or Login Pill */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link
                to={getDashboardPath()}
                className="mm-btn-login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: '#4A154B',
                  border: '1.5px solid #4A154B',
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
                  color: '#4A154B',
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
              className="mm-btn-login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '9999px',
                fontSize: '0.81rem',
                fontWeight: 600,
                color: '#4A154B',
                border: '1.5px solid #4A154B',
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

          {/* Get Access - ₹499 -> Button */}
          <Link
            to="/user/subscribe"
            className="mm-btn-access"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.81rem',
              fontWeight: 700,
              color: '#FFFFFF',
              background: '#4A154B',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(74, 21, 75, 0.22)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#3B0E3C';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#4A154B';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span>Get Access – ₹499</span>
            <ArrowRight size={13} />
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
            color: '#4A154B',
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
              width: '290px',
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
                style={{ background: 'transparent', border: 'none', color: '#4A154B', cursor: 'pointer' }}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '0.96rem',
                    fontWeight: 600,
                    color: isActive(link.path) ? '#4A154B' : '#6B5767',
                    background: isActive(link.path) ? '#FAF2F7' : 'transparent',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none'
                  }}
                >
                  {link.label}
                </Link>
              ))}
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
                  border: '1.5px solid #4A154B',
                  color: '#4A154B',
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
                  background: '#4A154B',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <span>Get Access – ₹499</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </aside>
        </>
      )}

      {/* Responsive CSS for Smooth Sizing and Preventing Overflow */}
      <style>{`
        @media (max-width: 1280px) {
          .mm-nav-desktop-only { gap: 2px !important; }
          .mm-nav-link { padding: 4px 6px !important; font-size: 0.77rem !important; }
          .mm-btn-access { padding: 5px 10px !important; font-size: 0.77rem !important; }
          .mm-btn-login { padding: 4px 9px !important; font-size: 0.77rem !important; }
        }
        @media (max-width: 1080px) {
          .mm-nav-desktop-only { display: none !important; }
          .mm-mobile-menu-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
