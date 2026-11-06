import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Search, ChevronDown } from 'lucide-react';
import { MaanmitraOriginalLogo } from '../../ManmitraLogo';
import { useAuth } from '../../context/AuthContext';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
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
    { label: 'Resources', path: '/faq' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #F0DCE8',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 12px rgba(74, 21, 75, 0.04)'
    }} role="banner">
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0 20px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} aria-label="MAANMITRA Home">
          <MaanmitraOriginalLogo height={42} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }} className="mm-nav-desktop-only">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.label}
                to={link.path}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: active ? '7px 18px' : '7px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#FFFFFF' : '#4A154B',
                  background: active ? '#4A154B' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{link.label}</span>
                {link.hasDropdown && <ChevronDown size={14} style={{ opacity: 0.7 }} />}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="mm-nav-desktop-only">
          {/* Search Icon */}
          <Link
            to="/counselling"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              color: '#4A154B',
              textDecoration: 'none',
              background: '#FBF5F8'
            }}
            title="Search"
            aria-label="Search"
          >
            <Search size={17} />
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to={getDashboardPath()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: '#4A154B',
                  border: '1.5px solid #4A154B',
                  background: '#FFFFFF',
                  textDecoration: 'none'
                }}
              >
                <User size={15} />
                <span>
                  {user.role === 'admin' ? 'Admin Portal' : user.role === 'maanmitra_partner' ? 'Partner Portal' : 'My Account'}
                </span>
              </Link>
              <button
                onClick={() => { logout(); navigate('/'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '1px solid #F0DCE8',
                  background: 'transparent',
                  color: '#4A154B',
                  cursor: 'pointer'
                }}
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Login Button */}
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 20px',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#4A154B',
                  border: '1.5px solid #4A154B',
                  background: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <User size={14} />
                <span>Login</span>
              </Link>

              {/* Get Access - Rs.499 Button */}
              <Link
                to="/user/subscribe"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  background: '#4A154B',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(74, 21, 75, 0.25)',
                  transition: 'all 0.2s'
                }}
              >
                Get Access -- ₹499
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
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

      {/* Mobile Slide-in Drawer */}
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
              width: '280px',
              background: '#FFFFFF',
              zIndex: 1002,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)'
            }}
            aria-label="Mobile Navigation"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
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

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: isActive(link.path) ? '#E91E63' : '#4A154B',
                    textDecoration: 'none'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '20px', borderTop: '1px solid #F0DCE8' }}>
              <Link
                to="/login"
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
                <User size={16} /> Login
              </Link>
              <Link
                to="/user/subscribe"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#4A154B',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                Get Access -- ₹499
              </Link>
            </div>
          </aside>
        </>
      )}

      {/* Responsive helper for navigation desktop/mobile display */}
      <style>{`
        @media (max-width: 900px) {
          .mm-nav-desktop-only { display: none !important; }
          .mm-mobile-menu-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
