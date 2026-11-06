import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Linkedin, Phone, Mail, Heart } from 'lucide-react';
import { MaanmitraOriginalLogo } from '../../ManmitraLogo';

export default function PublicFooter() {
  return (
    <footer style={{
      background: '#4A154B',
      color: '#FFFFFF',
      padding: '48px 20px 24px',
      position: 'relative'
    }} role="contentinfo">
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '36px',
        paddingBottom: '36px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        {/* Column 1: Brand & Tagline */}
        <div>
          <Link to="/" style={{ display: 'inline-block', marginBottom: '14px', textDecoration: 'none' }} aria-label="MAANMITRA">
            <MaanmitraOriginalLogo height={42} />
          </Link>
          <p style={{
            fontSize: '0.84rem',
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: 1.6,
            maxWidth: '240px',
            margin: '0 0 16px'
          }}>
            A Listening Friend, Always With You. Confidential, empathetic emotional companionship and personal guidance.
          </p>
        </div>

        {/* Column 2: Quick Links */}
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
              <Link to="/services" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>Services</Link>
            </li>
            <li>
              <Link to="/about" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>About</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '16px', color: '#FFFFFF' }}>Support</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <Link to="/faq" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>FAQs</Link>
            </li>
            <li>
              <Link to="/privacy" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>Terms &amp; Conditions</Link>
            </li>
            <li>
              <Link to="/become-a-partner" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '0.86rem' }}>Become a Partner</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Get in Touch */}
        <div>
          <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '16px', color: '#FFFFFF' }}>Get in Touch</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.86rem' }}>
              <Phone size={15} color="#D4AF77" />
              <span>+91 98765 43210</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.86rem' }}>
              <Mail size={15} color="#D4AF77" />
              <span>support@maanmitra.com</span>
            </div>
          </div>
        </div>

        {/* Column 5: Follow Us */}
        <div>
          <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '16px', color: '#FFFFFF' }}>Follow Us</h4>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
              { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
              { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
            ].map((soc, i) => {
              const Icon = soc.icon;
              return (
                <a
                  key={i}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={soc.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        paddingTop: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.82rem',
        color: 'rgba(255, 255, 255, 0.7)'
      }}>
        <span>(c) {new Date().getFullYear()} MAANMITRA. All Rights Reserved.</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>A Safe - Supportive - Professional Platform</span>
          <Heart size={14} color="#D4AF77" fill="#D4AF77" />
        </div>
      </div>
    </footer>
  );
}
