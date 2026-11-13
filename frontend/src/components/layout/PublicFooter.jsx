import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Linkedin, Phone, Mail, MapPin } from 'lucide-react';
import { MaanmitraOriginalLogo } from '../../ManmitraLogo';
import { MAANMITRA_SERVICES } from '../../utils/servicesData';

export default function PublicFooter() {
  return (
    <footer style={{
      background: '#50164F',
      color: '#FFFFFF',
      padding: '56px 20px 24px',
      position: 'relative'
    }} role="contentinfo">
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '36px',
        paddingBottom: '40px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        {/* COLUMN 1: BRAND */}
        <div>
          <Link to="/" style={{ display: 'inline-block', marginBottom: '14px', textDecoration: 'none' }} aria-label="MAANMITRA Home">
            <MaanmitraOriginalLogo height={40} />
          </Link>
          <div style={{
            fontSize: '0.84rem',
            color: '#D8B36A',
            fontWeight: 700,
            letterSpacing: '0.02em',
            marginBottom: '10px'
          }}>
            A Listening Friend, Always With You.
          </div>
          <p style={{
            fontSize: '0.84rem',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: 1.6,
            maxWidth: '260px',
            margin: '0 0 16px'
          }}>
            Building meaningful connections, professional guidance and new opportunities. Safe, verified, and respectful.
          </p>
        </div>

        {/* COLUMN 2: QUICK LINKS */}
        <div>
          <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '16px', color: '#FFFFFF' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>Home</Link>
            </li>
            <li>
              <Link to="/counselling" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>Find Professionals</Link>
            </li>
            <li>
              <Link to="/how-it-works" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>How It Works</Link>
            </li>
            <li>
              <Link to="/about" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>About Us</Link>
            </li>
            <li>
              <Link to="/contact" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: OUR SERVICES (EXACT 8-SERVICE ORDER) */}
        <div>
          <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '16px', color: '#D8B36A' }}>Our Services</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {MAANMITRA_SERVICES.map((s) => (
              <li key={s.id}>
                <Link
                  to={s.path}
                  style={{
                    color: s.isPriority ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
                    fontWeight: s.isPriority ? 700 : 400,
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{ color: '#D8B36A', fontSize: '0.74rem' }}>{s.number}.</span>
                  <span>{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 4: SUPPORT */}
        <div>
          <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '16px', color: '#FFFFFF' }}>Support</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <Link to="/faq" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>FAQs</Link>
            </li>
            <li>
              <Link to="/contact" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>Help &amp; Support</Link>
            </li>
            <li>
              <Link to="/privacy" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>Terms &amp; Conditions</Link>
            </li>
            <li>
              <Link to="/refund-policy" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>Refund Policy</Link>
            </li>
          </ul>
        </div>

        {/* COLUMN 5: CONTACT */}
        <div>
          <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '16px', color: '#FFFFFF' }}>Contact</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.86rem' }}>
              <Phone size={15} color="#D8B36A" />
              <span>+91 98765 43210</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.86rem' }}>
              <Mail size={15} color="#D8B36A" />
              <span>support@maanmitra.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.86rem', lineHeight: 1.5 }}>
              <MapPin size={15} color="#D8B36A" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>Bangalore &amp; Mumbai, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: COPYRIGHT & SOCIALS */}
      <div style={{
        maxWidth: '1280px',
        margin: '24px auto 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '0.82rem',
        color: 'rgba(255, 255, 255, 0.65)'
      }}>
        <div>
          © {new Date().getFullYear()} MAANMITRA. All rights reserved. A Listening Friend, Always With You.
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
            { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
            { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
            { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
          ].map((soc) => (
            <a
              key={soc.label}
              href={soc.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={soc.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.2s'
              }}
            >
              <soc.icon size={15} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
