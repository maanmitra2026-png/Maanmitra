import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Sparkles, Compass, Laptop, Headphones,
  ShieldCheck, Lock, Calendar, Users, ArrowRight,
  Play, Check, Star, Crown, Video, User, X
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

export default function HomePage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const services = [
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

  const whyFeatures = [
    { label: 'Verified Professionals', icon: ShieldCheck },
    { label: '100% Confidential', icon: Lock },
    { label: 'Flexible Sessions', icon: Calendar },
    { label: 'Safe & Supportive', icon: Users }
  ];

  const howItWorksSteps = [
    { label: 'Create Account', icon: User },
    { label: 'Choose Expert', icon: Calendar },
    { label: 'Book Session', icon: Video }
  ];

  const testimonials = [
    {
      text: 'Helped me build better communication.',
      image: '/testimonial_user_1.jpg',
      rating: 5
    },
    {
      text: 'Gave me clarity in my career and personal life.',
      image: '/testimonial_user_2.jpg',
      rating: 5
    },
    {
      text: 'Supportive and professional guidance.',
      image: '/testimonial_user_3.jpg',
      rating: 5
    }
  ];

  return (
    <div style={{ background: '#FDFBF9', minHeight: '100vh', fontFamily: "'Outfit', 'Poppins', sans-serif" }}>
      {/* 1. Header Navigation */}
      <PublicNavbar />

      <main>
        {/* =========================================================
            2. HERO SECTION
            ========================================================= */}
        <section style={{
          position: 'relative',
          padding: '40px 20px 30px',
          maxWidth: '1240px',
          margin: '0 auto',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '36px'
          }}>
            {/* Left Column: Headings & CTAs */}
            <div style={{ zIndex: 2 }}>
              {/* Category Badges */}
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#4A154B',
                letterSpacing: '1.2px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <span>EMOTIONAL WELLNESS</span>
                <span style={{ color: '#D4AF77', fontWeight: 900 }}>|</span>
                <span>PERSONAL GROWTH</span>
                <span style={{ color: '#D4AF77', fontWeight: 900 }}>|</span>
                <span>MEANINGFUL CONNECTIONS</span>
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                fontWeight: 800,
                lineHeight: 1.18,
                color: '#4A154B',
                margin: '0 0 16px',
                letterSpacing: '-0.5px'
              }}>
                Your Companion for
                <span style={{ display: 'block', color: '#4A154B' }}>
                  Emotional Wellness &amp;
                </span>
                <span style={{ display: 'block', color: '#4A154B' }}>
                  Meaningful Connections
                </span>
              </h1>

              {/* Gold Decorative Squiggle */}
              <svg width="220" height="14" viewBox="0 0 220 14" fill="none" style={{ marginBottom: '18px', display: 'block' }}>
                <path
                  d="M2 9C30 3 60 14 90 8C120 2 150 13 180 7C195 4 210 10 218 6"
                  stroke="#D4AF77"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* Subheading */}
              <p style={{
                fontSize: '1.05rem',
                color: '#554252',
                lineHeight: 1.6,
                maxWidth: '460px',
                marginBottom: '28px'
              }}>
                Expert support for relationships, life, career and personal growth.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <Link
                  to="/user/subscribe"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '13px 26px',
                    borderRadius: '9999px',
                    background: '#4A154B',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.96rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 18px rgba(74, 21, 75, 0.28)',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>Get Access -- ₹499</span>
                  <ArrowRight size={17} />
                </Link>

                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    background: '#FFFFFF',
                    color: '#4A154B',
                    border: '1.5px solid #4A154B',
                    fontWeight: 600,
                    fontSize: '0.94rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#4A154B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Play size={12} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: '2px' }} />
                  </span>
                  <span>How It Works</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Graphic with woman & coffee */}
            <div style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '480px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(74, 21, 75, 0.12)'
              }}>
                <img
                  src="/home_hero_right.jpg"
                  alt="Companion for Emotional Wellness"
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Trailing Gold Heart Outline Flourish */}
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                style={{
                  position: 'absolute',
                  bottom: '-14px',
                  right: '10px',
                  pointerEvents: 'none'
                }}
              >
                <path
                  d="M32 50 C18 38, 6 26, 6 16 C6 8, 14 3, 22 3 C27 3, 31 6, 32 10 C33 6, 37 3, 42 3 C50 3, 58 8, 58 16 C58 26, 46 38, 32 50 Z"
                  stroke="#D4AF77"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* =========================================================
            3. OUR SERVICES SECTION
            ========================================================= */}
        <section style={{ maxWidth: '1240px', margin: '40px auto 30px', padding: '0 20px' }}>
          {/* Section Header with Gold Lines */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{ height: '2px', width: '50px', background: '#D4AF77', borderRadius: '2px' }} />
            <h2 style={{
              color: '#4A154B',
              fontSize: '1.65rem',
              fontWeight: 800,
              margin: 0,
              textAlign: 'center'
            }}>
              Our Services
            </h2>
            <div style={{ height: '2px', width: '50px', background: '#D4AF77', borderRadius: '2px' }} />
          </div>

          {/* 5 Service Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '18px'
          }}>
            {services.map((srv, i) => {
              const Icon = srv.icon;
              return (
                <Link
                  key={i}
                  to={srv.link}
                  style={{
                    background: srv.bg,
                    borderRadius: '20px',
                    padding: '24px 18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'center',
                    textDecoration: 'none',
                    minHeight: '170px',
                    boxShadow: '0 4px 14px rgba(74, 21, 75, 0.04)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(74, 21, 75, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(74, 21, 75, 0.04)';
                  }}
                >
                  {/* Icon */}
                  <div style={{ marginBottom: '14px' }}>
                    <Icon size={32} color={srv.iconColor} />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    color: '#4A154B',
                    fontSize: '1rem',
                    fontWeight: 700,
                    margin: '0 0 16px',
                    lineHeight: 1.3
                  }}>
                    {srv.title}
                  </h3>

                  {/* Circular Button */}
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: '#F6D080',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4A154B'
                  }}>
                    <ArrowRight size={15} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            4. WHY MAANMITRA? SECTION
            ========================================================= */}
        <section style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 20px' }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '28px',
            boxShadow: '0 6px 24px rgba(74, 21, 75, 0.06)',
            border: '1px solid #F0DCE8'
          }}>
            {/* Title Column */}
            <div style={{ paddingRight: '20px', minWidth: '160px' }}>
              <div style={{
                color: '#4A154B',
                fontSize: '1.4rem',
                fontWeight: 800,
                lineHeight: 1.15
              }}>
                Why<br />MAANMITRA?
              </div>
              <svg width="70" height="8" viewBox="0 0 70 8" fill="none" style={{ marginTop: '6px' }}>
                <path d="M1 5C15 2 30 7 45 4C55 2 65 6 69 4" stroke="#D4AF77" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* Vertical Divider */}
            <div style={{ width: '1.5px', height: '50px', background: '#F0DCE8' }} className="mm-hide-mobile" />

            {/* 4 Feature Badges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '24px',
              flex: 1
            }}>
              {whyFeatures.map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                    <div style={{ color: '#4A154B' }}>
                      <Icon size={24} color="#4A154B" />
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#4A154B', lineHeight: 1.3 }}>
                      {feat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            5. HOW IT WORKS SECTION
            ========================================================= */}
        <section style={{ maxWidth: '1240px', margin: '40px auto 30px', padding: '0 20px' }}>
          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{ height: '2px', width: '50px', background: '#D4AF77', borderRadius: '2px' }} />
            <h2 style={{
              color: '#4A154B',
              fontSize: '1.65rem',
              fontWeight: 800,
              margin: 0,
              textAlign: 'center'
            }}>
              How It Works
            </h2>
            <div style={{ height: '2px', width: '50px', background: '#D4AF77', borderRadius: '2px' }} />
          </div>

          {/* Stepper */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            maxWidth: '780px',
            margin: '0 auto'
          }}>
            {howItWorksSteps.map((st, i) => {
              const Icon = st.icon;
              return (
                <React.Fragment key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: '#FDEEF1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#E91E63'
                    }}>
                      <Icon size={22} color="#E91E63" />
                    </div>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#4A154B' }}>
                      {st.label}
                    </span>
                  </div>
                  {i < howItWorksSteps.length - 1 && (
                    <span style={{ color: '#4A154B', fontSize: '1.2rem', fontWeight: 600 }}>&gt;</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            6. PLATFORM ACCESS PASS BANNER
            ========================================================= */}
        <section style={{ maxWidth: '1240px', margin: '40px auto 40px', padding: '0 20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4A154B 0%, #68156B 100%)',
            borderRadius: '24px',
            padding: '28px 36px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 12px 36px rgba(74, 21, 75, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Title & Icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Crown size={26} color="#F6D080" />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, maxWidth: '140px', lineHeight: 1.25 }}>
                Platform<br />Access Pass
              </div>
            </div>

            {/* Vertical Divider */}
            <div style={{ width: '1.5px', height: '60px', background: 'rgba(255, 255, 255, 0.2)' }} className="mm-hide-mobile" />

            {/* Big Price */}
            <div style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: '#F6D080',
              letterSpacing: '-1px'
            }}>
              ₹499
            </div>

            {/* Features Checklist */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, auto)',
              gap: '10px 24px',
              fontSize: '0.88rem'
            }}>
              {[
                'Access All Services',
                'Book Sessions',
                'Chat & Video Support',
                'Guidance & Resources'
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} color="#F6D080" strokeWidth={3} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              to="/user/subscribe"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 26px',
                borderRadius: '9999px',
                background: '#F6D080',
                color: '#4A154B',
                fontWeight: 800,
                fontSize: '0.96rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s'
              }}
            >
              <span>Get Access Now</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        {/* =========================================================
            7. WHAT OUR USERS SAY (TESTIMONIALS)
            ========================================================= */}
        <section style={{ maxWidth: '1240px', margin: '40px auto 60px', padding: '0 20px' }}>
          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{ height: '2px', width: '50px', background: '#D4AF77', borderRadius: '2px' }} />
            <h2 style={{
              color: '#4A154B',
              fontSize: '1.65rem',
              fontWeight: 800,
              margin: 0,
              textAlign: 'center'
            }}>
              What Our Users Say
            </h2>
            <div style={{ height: '2px', width: '50px', background: '#D4AF77', borderRadius: '2px' }} />
          </div>

          {/* 3 Testimonials Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {testimonials.map((test, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  boxShadow: '0 6px 20px rgba(74, 21, 75, 0.05)',
                  border: '1px solid #F0DCE8'
                }}
              >
                {/* User Avatar */}
                <img
                  src={test.image}
                  alt="Maanmitra Member"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                  }}
                />

                {/* Content */}
                <div>
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: 900,
                    color: '#4A154B',
                    lineHeight: 0.8,
                    marginBottom: '4px'
                  }}>
                    &ldquo;
                  </div>
                  <p style={{
                    fontSize: '0.88rem',
                    color: '#4A154B',
                    fontWeight: 600,
                    margin: '0 0 8px',
                    lineHeight: 1.35
                  }}>
                    {test.text}
                  </p>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(test.rating)].map((_, r) => (
                      <Star key={r} size={14} color="#F6D080" fill="#F6D080" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Video Modal */}
      {videoModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '560px',
              width: '100%',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={22} color="#4A154B" />
            </button>
            <h3 style={{ color: '#4A154B', margin: '0 0 12px' }}>Welcome to MAANMITRA</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 20px' }}>
              MAANMITRA is your emotional companion and personal growth platform. Connect with empathetic listeners, certified counsellors, and life guides in a safe, confidential environment.
            </p>
            <Link
              to="/user/subscribe"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '12px',
                background: '#4A154B',
                color: '#FFF',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Get Access -- ₹499 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* 8. Footer */}
      <PublicFooter />

      <style>{`
        @media (max-width: 768px) {
          .mm-hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
