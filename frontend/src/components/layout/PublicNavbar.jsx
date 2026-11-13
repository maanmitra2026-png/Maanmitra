import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Search, ChevronDown, ArrowRight } from 'lucide-react';
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

  const servicesList = [
    { title: 'Relationship Guidance', path: '/counselling' },
    { title: 'Life Coaching', path: '/services' },
    { title: 'Astrology & Kundali', path: '/services' },
    { title: 'Remote Work Opportunities', path: '/become-a-partner' },
    { title: 'Counselling & Support', path: '/counselling' },
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
        padding: '12px 20px',
        transition: 'all 0.25s ease',
        background: scrolled ? 'rgba(253, 251, 249, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}
      role="banner"
    >
      {/* Floating Pill Container matching reference layout */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          background: '#FFFFFF',
          borderRadius: '9999px',
          border: '1.5px solid #F2E6DC',
          boxShadow: scrolled
            ? '0 10px 30px rgba(74, 21, 75, 0.10)'
            : '0 4px 20px rgba(74, 21, 75, 0.05)',
          padding: '8px 18px 8px 24px',
          height: '66px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
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
          <MaanmitraOriginalLogo height={42} />
        </Link>

        {/* 2. Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginLeft: '12px'
          }}
          className="mm-nav-desktop-only"
        >
          {navLinks.map((link) => {
            const active = isActive(link.path);
            if (link.hasDropdown) {
              return (
                <div
                  key={link.label}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <Link
                    to={link.path}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '7px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.88rem',
                      fontWeight: active ? 600 : 500,
                      color: active ? '#FFFFFF' : '#4A154B',
                      background: active ? '#4A154B' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{link.label}</span>
                    <ChevronDown size={14} style={{ opacity: 0.7, transform: servicesDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </Link>

                  {/* Dropdown Menu */}
                  {servicesDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        marginTop: '8px',
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        boxShadow: '0 12px 32px rgba(74, 21, 75, 0.14)',
                        border: '1px solid #F0DCE8',
                        padding: '8px',
                        minWidth: '220px',
                        zIndex: 1010,
                        animation: 'fadeIn 0.2s ease',
                      }}
                    >
                      {servicesList.map((item) => (
                        <Link
                          key={item.title}
                          to={item.path}
                          onClick={() => setServicesDropdownOpen(false)}
                          style={{
                            display: 'block',
                            padding: '9px 14px',
                            borderRadius: '10px',
                            color: '#4A154B',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            textDecoration: 'none',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#FAF2F7'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                to={link.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: active ? '7px 18px' : '7px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#FFFFFF' : '#4A154B',
                  background: active ? '#4A154B' : 'transparent',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
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
            );
          })}
        </nav>

        {/* 3. Desktop Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="mm-nav-desktop-only">
          {/* Circular Search Icon */}
          <Link
            to="/counselling"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              color: '#4A154B',
              textDecoration: 'none',
              background: '#FFFFFF',
              border: '1.5px solid #EEDBCF',
              boxShadow: '0 2px 8px rgba(74, 21, 75, 0.04)',
              transition: 'all 0.2s ease'
            }}
            title="Search Professionals"
            aria-label="Search"
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4A154B'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#EEDBCF'; }}
          >
            <Search size={16} />
          </Link>

          {/* User Auth or Login Pill */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link
                to={getDashboardPath()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: '#4A154B',
                  border: '1.5px solid #4A154B',
                  background: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <User size={14} />
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
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: '1px solid #EEDBCF',
                  background: 'transparent',
                  color: '#4A154B',
                  cursor: 'pointer'
                }}
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 18px',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#4A154B',
                border: '1.5px solid #4A154B',
                background: '#FFFFFF',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FAF2F7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
              }}
            >
              <User size={14} />
              <span>Login</span>
            </Link>
          )}

          {/* Get Access - ₹499 -> Button */}
          <Link
            to="/user/subscribe"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 20px',
              borderRadius: '9999px',
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#FFFFFF',
              background: '#4A154B',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(74, 21, 75, 0.22)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
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
            <ArrowRight size={14} />
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
            padding: '8px',
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
                    fontSize: '0.98rem',
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

      {/* Responsive CSS helper */}
      <style>{`
        @media (max-width: 1040px) {
          .mm-nav-desktop-only { display: none !important; }
          .mm-mobile-menu-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
