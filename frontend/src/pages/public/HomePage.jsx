import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Sparkles, Compass, Laptop, Headphones,
  ShieldCheck, Lock, Calendar, Users, ArrowRight,
  Play, Check, Star, Crown, Video, User, X,
  ChevronLeft, ChevronRight, MessageSquare, Phone
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

export default function HomePage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const heroSlides = [
    {
      id: 1,
      badge: 'EMOTIONAL WELLNESS | PERSONAL GROWTH | MEANINGFUL CONNECTIONS',
      headline1: 'Build Meaningful Connections.',
      headline2: 'Discover the Right Guidance.',
      subheading: 'Connect with professionals and explore opportunities to grow with MAANMITRA.',
      primaryBtnText: 'Explore Services',
      primaryBtnLink: '/services',
      secondaryBtnText: 'Become a Professional',
      secondaryBtnLink: '/become-a-partner',
      secondaryIcon: Users,
      image: '/hero_slide_1.jpg',
      imageAlt: 'Professional discovering guidance and meaningful connections with MAANMITRA',
      features: [
        { icon: ShieldCheck, title: 'Trusted', sub: 'Connections' },
        { icon: Users, title: 'Professional', sub: 'Guidance' },
        { icon: Star, title: 'Flexible', sub: 'Opportunities' },
      ],
    },
    {
      id: 2,
      badge: 'VERIFIED MENTORS | 100% CONFIDENTIAL | REAL-TIME SESSIONS',
      headline1: 'Your Companion for Wellness.',
      headline2: 'Talk Freely, Heal Deeply.',
      subheading: 'Instant live Chat, Voice Call, or HD Video with empathetic certified counsellors. Transparent per-minute billing.',
      primaryBtnText: 'Find Counsellors',
      primaryBtnLink: '/counselling',
      secondaryBtnText: 'Get Access – ₹499',
      secondaryBtnLink: '/user/subscribe',
      secondaryIcon: ShieldCheck,
      image: '/hero_slide_2.jpg',
      imageAlt: 'Empathetic verified counsellor ready for private confidential session',
      features: [
        { icon: Lock, title: '100% Safe', sub: '& Confidential' },
        { icon: Headphones, title: 'Instant Voice', sub: '& Video Calling' },
        { icon: MessageSquare, title: 'Live Chat', sub: '₹5 / Minute' },
      ],
    },
    {
      id: 3,
      badge: 'RELATIONSHIP GUIDANCE | LIFE COACHING | KUNDALI',
      headline1: 'Navigate Life’s Crossroads.',
      headline2: 'With Clarity & Peace of Mind.',
      subheading: 'From modern relationship dynamics to personal growth and astrology guidance, find the answers you need.',
      primaryBtnText: 'Discover Services',
      primaryBtnLink: '/services',
      secondaryBtnText: 'How It Works',
      secondaryBtnLink: '/how-it-works',
      secondaryIcon: Play,
      image: '/hero_slide_3.jpg',
      imageAlt: 'Harmonious relationship guidance and holistic emotional wellness',
      features: [
        { icon: Sparkles, title: 'Astrology', sub: '& Kundali' },
        { icon: Heart, title: 'Couples', sub: 'Guidance' },
        { icon: Crown, title: 'Personal', sub: 'Life Coaching' },
      ],
    },
  ];

  // 5-second auto-transition
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, heroSlides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  // Mobile swipe handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

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
            2. HERO SECTION — Auto-playing 3-Slide Carousel
            ========================================================= */}
        <section
          style={{
            position: 'relative',
            padding: '28px 24px 34px',
            maxWidth: '1280px',
            margin: '0 auto',
            overflow: 'hidden',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-label="MAANMITRA Highlights Carousel"
        >
          {/* Subtle Ambient Floating Petals / Decorative Accents */}
          <div aria-hidden="true" style={{ position: 'absolute', top: '15%', left: '3%', pointerEvents: 'none', opacity: 0.7 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 15 8 18 10C21 12 23 15 20 18C17 21 13 20 10 18C7 16 5 13 6 10C7 7 12 2 12 2Z" fill="#F8D3DC" opacity="0.85" />
            </svg>
          </div>
          <div aria-hidden="true" style={{ position: 'absolute', top: '65%', left: '46%', pointerEvents: 'none', opacity: 0.6 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 15 8 18 10C21 12 23 15 20 18C17 21 13 20 10 18C7 16 5 13 6 10C7 7 12 2 12 2Z" fill="#F4E2C7" opacity="0.85" />
            </svg>
          </div>
          <div aria-hidden="true" style={{ position: 'absolute', top: '10%', right: '4%', pointerEvents: 'none', opacity: 0.7 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 2 15 8 18 10C21 12 23 15 20 18C17 21 13 20 10 18C7 16 5 13 6 10C7 7 12 2 12 2Z" fill="#F8D3DC" opacity="0.85" />
            </svg>
          </div>

          {/* Previous Slide Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            style={{
              position: 'absolute',
              left: '6px',
              top: '46%',
              transform: 'translateY(-50%)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1.5px solid #EEDBCF',
              boxShadow: '0 4px 16px rgba(74, 21, 75, 0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4A154B',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#4A154B';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#EEDBCF';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft size={22} />
          </button>

          {/* Next Slide Arrow */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            style={{
              position: 'absolute',
              right: '6px',
              top: '46%',
              transform: 'translateY(-50%)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1.5px solid #EEDBCF',
              boxShadow: '0 4px 16px rgba(74, 21, 75, 0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4A154B',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#4A154B';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#EEDBCF';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight size={22} />
          </button>

          {/* Carousel Slide Stage */}
          <div style={{ position: 'relative', minHeight: '460px' }}>
            {heroSlides.map((slide, idx) => {
              const isActive = idx === currentSlide;
              const isPast = idx < currentSlide;

              return (
                <div
                  key={slide.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.08fr 0.92fr',
                    alignItems: 'center',
                    gap: '36px',
                    width: '100%',
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? 'translateX(0)'
                      : isPast
                      ? 'translateX(-35px)'
                      : 'translateX(35px)',
                    transition: 'opacity 0.65s cubic-bezier(0.25, 1, 0.5, 1), transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
                    pointerEvents: isActive ? 'auto' : 'none',
                    position: isActive ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: isActive ? 2 : 1,
                  }}
                  className="mm-hero-grid"
                >
                  {/* Left Column: Headings & CTAs */}
                  <div style={{ zIndex: 3, padding: '10px 0 10px 20px' }}>
                    {/* Badge Pill */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        border: '1px solid #EAD8C7',
                        background: 'rgba(255, 255, 255, 0.85)',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        color: '#4A154B',
                        letterSpacing: '1px',
                        marginBottom: '16px',
                        boxShadow: '0 2px 8px rgba(74, 21, 75, 0.04)',
                      }}
                    >
                      {slide.badge}
                    </div>

                    {/* Headline */}
                    <h1
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(2.1rem, 3.8vw, 3.3rem)',
                        fontWeight: 800,
                        lineHeight: 1.15,
                        margin: '0 0 16px',
                        letterSpacing: '-0.5px',
                      }}
                    >
                      <span style={{ display: 'block', color: '#4A154B' }}>{slide.headline1}</span>
                      <span style={{ display: 'block', color: '#C49A45' }}>{slide.headline2}</span>
                    </h1>

                    {/* Subheading */}
                    <p
                      style={{
                        fontSize: '1.05rem',
                        color: '#554252',
                        lineHeight: 1.6,
                        maxWidth: '480px',
                        marginBottom: '26px',
                      }}
                    >
                      {slide.subheading}
                    </p>

                    {/* Action Buttons Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        flexWrap: 'wrap',
                        marginBottom: '32px',
                      }}
                    >
                      <Link
                        to={slide.primaryBtnLink}
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
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#3B0E3C';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#4A154B';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <span>{slide.primaryBtnText}</span>
                        <ArrowRight size={16} />
                      </Link>

                      <Link
                        to={slide.secondaryBtnLink}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 24px',
                          borderRadius: '9999px',
                          background: '#FFFFFF',
                          color: '#4A154B',
                          border: '1.5px solid #4A154B',
                          fontWeight: 600,
                          fontSize: '0.94rem',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#FAF2F7';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#FFFFFF';
                        }}
                      >
                        <slide.secondaryIcon size={16} color="#4A154B" />
                        <span>{slide.secondaryBtnText}</span>
                      </Link>
                    </div>

                    {/* Trust Indicators Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        paddingTop: '20px',
                        borderTop: '1px solid #EFE4DC',
                        flexWrap: 'wrap',
                      }}
                    >
                      {slide.features.map((feat, fIdx) => (
                        <React.Fragment key={feat.title}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '10px',
                                background: '#FAF2EC',
                                border: '1px solid #EEDBCF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <feat.icon size={18} color="#C49A45" />
                            </div>
                            <div style={{ fontSize: '0.85rem', lineHeight: 1.25 }}>
                              <div style={{ fontWeight: 700, color: '#4A154B' }}>{feat.title}</div>
                              <div style={{ color: '#6A5766' }}>{feat.sub}</div>
                            </div>
                          </div>
                          {fIdx < slide.features.length - 1 && (
                            <div
                              style={{ width: '1px', height: '28px', background: '#E2D1C5' }}
                              className="mm-trust-divider"
                            />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Hero Visual Graphic with Framing Wave Ribbons */}
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '10px',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '540px',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 48px rgba(74, 21, 75, 0.14)',
                        background: '#FFFFFF',
                      }}
                    >
                      <img
                        src={slide.image}
                        alt={slide.imageAlt}
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                          objectFit: 'cover',
                          maxHeight: '430px',
                        }}
                      />

                      {/* Sweeping Gold & Plum Wave Ribbon Graphic matching the design reference */}
                      <svg
                        viewBox="0 0 500 110"
                        fill="none"
                        preserveAspectRatio="none"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '75px',
                          pointerEvents: 'none',
                        }}
                      >
                        {/* Upper Gold Wave Ribbon */}
                        <path
                          d="M0 110 C 130 65, 270 100, 500 15 L 500 110 L 0 110 Z"
                          fill="url(#heroGoldGradient)"
                          opacity="0.9"
                        />
                        {/* Lower Deep Plum Wave Ribbon */}
                        <path
                          d="M0 110 C 160 85, 300 115, 500 45 L 500 110 L 0 110 Z"
                          fill="#4A154B"
                          opacity="0.95"
                        />
                        <defs>
                          <linearGradient id="heroGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#C49A45" />
                            <stop offset="50%" stopColor="#DFBF75" />
                            <stop offset="100%" stopColor="#B8860B" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clickable Pagination Indicators (3 Dots) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '28px',
            }}
          >
            {heroSlides.map((_, idx) => {
              const isCurrent = idx === currentSlide;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  style={{
                    cursor: 'pointer',
                    padding: 0,
                    width: isCurrent ? '26px' : '9px',
                    height: '9px',
                    borderRadius: '9999px',
                    background: isCurrent ? '#4A154B' : '#FFFFFF',
                    border: isCurrent ? 'none' : '1.5px solid #D4AF77',
                    transition: 'all 0.3s ease',
                    boxShadow: isCurrent ? '0 2px 8px rgba(74, 21, 75, 0.35)' : 'none',
                  }}
                />
              );
            })}
          </div>

          {/* Responsive CSS Helper for Hero */}
          <style>{`
            @media (max-width: 900px) {
              .mm-hero-grid {
                grid-template-columns: 1fr !important;
                gap: 24px !important;
              }
              .mm-trust-divider {
                display: none !important;
              }
            }
          `}</style>
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
