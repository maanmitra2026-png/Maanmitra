import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  HeartHandshake,
  Compass,
  Heart,
  Target,
  Sparkles,
  Briefcase,
  Headphones,
  ShieldCheck,
  Lock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Star,
  User,
  Clock,
  Sparkle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { MAANMITRA_SERVICES } from '../../utils/servicesData';
import api from '../../apiConfig';

export default function HomePage() {
  const [professionals, setProfessionals] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  // Fetch verified professionals from live API
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProfessionals = async () => {
      try {
        const res = await api.get('/partners?limit=4');
        const data = res.data?.partners || res.data || [];
        setProfessionals(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        console.warn('Could not load partners for homepage:', err);
      } finally {
        setLoadingPartners(false);
      }
    };
    fetchProfessionals();
  }, []);

  const top3Services = MAANMITRA_SERVICES.slice(0, 3);
  const remaining5Services = MAANMITRA_SERVICES.slice(3);

  const howItWorksSteps = [
    {
      num: '01',
      title: 'Create Your Account',
      desc: 'Register in seconds and explore the safe, verified MAANMITRA ecosystem.'
    },
    {
      num: '02',
      title: 'Choose Your Service',
      desc: 'Select from our 8 focused avenues — from friendships & group trips to guidance.'
    },
    {
      num: '03',
      title: 'Connect & Grow',
      desc: 'Engage with verified companions, accredited mentors, or flexible opportunities.'
    }
  ];

  const whyChooseBenefits = [
    {
      title: 'Trusted Connections',
      desc: 'Government ID verification and community charters ensure genuine, respectful interactions.',
      icon: ShieldCheck
    },
    {
      title: 'Privacy & Confidentiality',
      desc: 'End-to-end encrypted sessions shield your phone number, identity, and personal coordinates.',
      icon: Lock
    },
    {
      title: 'Flexible Sessions',
      desc: 'Transparent per-minute billing and on-demand scheduling that fit your life.',
      icon: Calendar
    },
    {
      title: 'Professional Support',
      desc: 'Access verified psychologists, certified coaches, and experienced guides anytime.',
      icon: Headphones
    }
  ];

  const faqs = [
    {
      q: '1. What is MAANMITRA?',
      a: 'MAANMITRA is a professional connection, friendship, relationship guidance, personal development, and opportunity platform. We are NOT an escort service or casual dating app; we provide a safe, respectful environment for meaningful human connections and expert guidance.'
    },
    {
      q: '2. How can I meet new friends?',
      a: 'Through our "Meet a New Friend" service, you can browse verified companion profiles, filter by shared interests, and initiate respectful conversations via secure in-app text or audio calling.'
    },
    {
      q: '3. What is Living Relationship guidance?',
      a: 'It is confidential, non-judgmental advisory and learning resources tailored for couples and individuals navigating modern cohabitation, communication dynamics, and mutual expectations.'
    },
    {
      q: '4. How does Stranger Trip work?',
      a: 'Stranger Trips are curated group travel batches for verified travellers. You explore upcoming itineraries, submit your travel interest, join a virtual group orientation, and travel together with on-ground safety support.'
    },
    {
      q: '5. How can I connect with professionals?',
      a: 'Browse our "Find Professionals" directory, review their verified credentials, and book a scheduled video session or connect via instant per-minute calling.'
    },
    {
      q: '6. What is the Platform Access Pass?',
      a: 'The Platform Access Pass is your entry-level unlock to the MAANMITRA ecosystem, granting full access to browse verified profiles, initiate connection requests, explore group trips, and book specialists.'
    },
    {
      q: '7. Are counselling sessions separately charged?',
      a: 'Yes. Platform access pass provides portal membership. Individual consultations with certified counsellors or astrologers are charged separately at transparent, clearly displayed per-session or per-minute rates.'
    },
    {
      q: '8. How can I become a professional?',
      a: 'Click "Become a Professional" to submit your application and qualifications. Our compliance team verifies your credentials and schedules a brief onboarding orientation within 48 hours.'
    },
    {
      q: '9. How do remote work opportunities work?',
      a: 'Approved listeners, certified counsellors, and life mentors can work remotely on MAANMITRA by setting their own availability and earning transparently through verified client sessions.'
    },
    {
      q: '10. How is user privacy protected?',
      a: 'Your personal phone number and personal address are never revealed. All audio, video, and chat interactions happen inside encrypted, secure platform channels with instant blocking & reporting tools.'
    }
  ];

  return (
    <div style={{ background: '#FFF9F5', minHeight: '100vh', fontFamily: "'Outfit', 'Poppins', sans-serif", color: '#2D162C', overflowX: 'hidden' }}>
      {/* 1. HEADER */}
      <PublicNavbar />

      <main>
        {/* =========================================================
            2. HOMEPAGE HERO SECTION (SECTION 5)
            ========================================================= */}
        <section style={{
          padding: '40px 20px 60px',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left Hero Content */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: '#FFFFFF',
              border: '1.5px solid #F0E3D7',
              color: '#50164F',
              fontSize: '0.76rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(80, 22, 79, 0.04)'
            }}>
              <span>MEANINGFUL CONNECTIONS</span>
              <span style={{ color: '#D8B36A' }}>|</span>
              <span>PERSONAL GROWTH</span>
              <span style={{ color: '#D8B36A' }}>|</span>
              <span>NEW OPPORTUNITIES</span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.3rem, 4.2vw, 3.6rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#50164F',
              margin: '0 0 20px',
              letterSpacing: '-0.02em'
            }}>
              Meet New People. <span style={{ display: 'block', color: '#D8B36A' }}>Build Connections.</span> Discover New Possibilities.
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: '#665365',
              lineHeight: 1.65,
              maxWidth: '520px',
              marginBottom: '32px'
            }}>
              Connect with new friends, explore meaningful relationships, discover group trips and access professional guidance with MAANMITRA.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
              <a
                href="#services"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 30px',
                  borderRadius: '9999px',
                  background: '#50164F',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  textDecoration: 'none',
                  boxShadow: '0 6px 20px rgba(80, 22, 79, 0.25)',
                  transition: 'all 0.2s'
                }}
              >
                <span>Explore Our Services</span>
                <ArrowRight size={17} />
              </a>

              <Link
                to="/become-a-partner"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '13px 26px',
                  borderRadius: '9999px',
                  background: '#FFFFFF',
                  color: '#50164F',
                  border: '1.5px solid #50164F',
                  fontWeight: 600,
                  fontSize: '0.96rem',
                  textDecoration: 'none'
                }}
              >
                <User size={16} />
                <span>Become a Professional</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #F0E3D7',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#D8B36A" />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#50164F' }}>Meaningful Connections</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#D8B36A" />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#50164F' }}>Professional Guidance</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="#D8B36A" />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#50164F' }}>Flexible Opportunities</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual with realistic, premium Indian photography */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '30px',
              overflow: 'hidden',
              boxShadow: '0 24px 50px rgba(80, 22, 79, 0.16)',
              border: '4px solid #FFFFFF'
            }}>
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
                alt="Diverse group of friendly Indian adults enjoying genuine conversation"
                style={{ width: '100%', height: '440px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* =========================================================
            3. OUR 8 SERVICES (EXPANDED TO ALL 8 SERVICES)
            ========================================================= */}
        <section
          id="services"
          style={{
            padding: '75px 20px 85px',
            background: '#FFF9F5',
            borderTop: '1px solid #F0E3D7',
            borderBottom: '1px solid #F0E3D7',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
            {/* Header: "Our Services" with gold decorative lines */}
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 46px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '8px' }}>
                <div style={{ height: '1.5px', width: '42px', background: 'linear-gradient(90deg, transparent, #D8B36A)' }} />
                <h2 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2.1rem, 3.4vw, 2.7rem)',
                  fontWeight: 800,
                  color: '#50164F',
                  margin: 0,
                  letterSpacing: '-0.02em'
                }}>
                  Our Services
                </h2>
                <div style={{ height: '1.5px', width: '42px', background: 'linear-gradient(90deg, #D8B36A, transparent)' }} />
              </div>
              <p style={{ color: '#665365', fontSize: '1.02rem', lineHeight: 1.6, margin: 0 }}>
                Explore our 8 specialized pathways designed for authentic connection, guidance, and personal growth.
              </p>
            </div>

            {/* Services Display: All 8 Services using the clean, compact card format */}
            <div style={{ position: 'relative' }}>
              {/* Row 1: Top 3 Priority Services (01, 02, 03) */}
              <div
                className="mm-services-3-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '20px',
                  marginBottom: '20px'
                }}
              >
                {/* 01 Meet a New Friend */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px 20px 22px',
                    border: '1.5px solid #F0E3D7',
                    boxShadow: '0 4px 18px rgba(80, 22, 79, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = '#D8B36A';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(80, 22, 79, 0.09)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = '#F0E3D7';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(80, 22, 79, 0.04)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: '#EFF6FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Users size={20} color="#2563EB" />
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#E67E22' }}>
                        01
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#50164F', margin: '0 0 10px', lineHeight: 1.25 }}>
                      Meet a New Friend
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.55, margin: '0 0 22px', minHeight: '42px' }}>
                      Meet new people, share conversations and build genuine friendships.
                    </p>
                  </div>

                  <Link
                    to="/services/meet-a-new-friend"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '9999px',
                      background: '#FFFDF9',
                      border: '1.2px solid #EEDBCF',
                      color: '#50164F',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FDF2F8';
                      e.currentTarget.style.borderColor = '#D8B36A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFFDF9';
                      e.currentTarget.style.borderColor = '#EEDBCF';
                    }}
                  >
                    <span>Explore Friendships</span>
                    <ArrowRight size={14} color="#D97706" />
                  </Link>
                </div>

                {/* 02 Living Relationship */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px 20px 22px',
                    border: '1.5px solid #F0E3D7',
                    boxShadow: '0 4px 18px rgba(80, 22, 79, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = '#D8B36A';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(80, 22, 79, 0.09)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = '#F0E3D7';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(80, 22, 79, 0.04)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: '#FDF2F8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <HeartHandshake size={20} color="#BE185D" />
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#E67E22' }}>
                        02
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#50164F', margin: '0 0 10px', lineHeight: 1.25 }}>
                      Living Relationship
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.55, margin: '0 0 22px', minHeight: '42px' }}>
                      Understand relationships, communication and meaningful connections.
                    </p>
                  </div>

                  <Link
                    to="/services/living-relationship"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '9999px',
                      background: '#FFFDF9',
                      border: '1.2px solid #EEDBCF',
                      color: '#50164F',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FDF2F8';
                      e.currentTarget.style.borderColor = '#D8B36A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFFDF9';
                      e.currentTarget.style.borderColor = '#EEDBCF';
                    }}
                  >
                    <span>Explore Relationships</span>
                    <ArrowRight size={14} color="#D97706" />
                  </Link>
                </div>

                {/* 03 Stranger Trip */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px 20px 22px',
                    border: '1.5px solid #F0E3D7',
                    boxShadow: '0 4px 18px rgba(80, 22, 79, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = '#D8B36A';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(80, 22, 79, 0.09)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = '#F0E3D7';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(80, 22, 79, 0.04)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: '#F0FDFA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Compass size={20} color="#0D9488" />
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#E67E22' }}>
                        03
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#50164F', margin: '0 0 10px', lineHeight: 1.25 }}>
                      Stranger Trip
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.55, margin: '0 0 22px', minHeight: '42px' }}>
                      Explore group trips, discover new places and meet fellow travellers.
                    </p>
                  </div>

                  <Link
                    to="/services/stranger-trip"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '9999px',
                      background: '#FFFDF9',
                      border: '1.2px solid #EEDBCF',
                      color: '#50164F',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FDF2F8';
                      e.currentTarget.style.borderColor = '#D8B36A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFFDF9';
                      e.currentTarget.style.borderColor = '#EEDBCF';
                    }}
                  >
                    <span>Explore Trips</span>
                    <ArrowRight size={14} color="#D97706" />
                  </Link>
                </div>
              </div>

              {/* Row 2: Secondary Services (04 to 08) */}
              <div
                className="mm-services-5-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(215px, 1fr))',
                  gap: '16px'
                }}
              >
                {/* 04 Relationship Guidance */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px 20px 22px',
                    border: '1.5px solid #F0E3D7',
                    boxShadow: '0 4px 18px rgba(80, 22, 79, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = '#D8B36A';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(80, 22, 79, 0.09)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = '#F0E3D7';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(80, 22, 79, 0.04)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: '#FAF2F7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Heart size={20} color="#50164F" />
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#E67E22' }}>
                        04
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#50164F', margin: '0 0 10px', lineHeight: 1.25 }}>
                      Relationship Guidance
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.55, margin: '0 0 22px', minHeight: '42px' }}>
                      Get guidance for healthier relationships and better communication.
                    </p>
                  </div>

                  <Link
                    to="/services/relationship-guidance"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '9999px',
                      background: '#FFFDF9',
                      border: '1.2px solid #EEDBCF',
                      color: '#50164F',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FDF2F8';
                      e.currentTarget.style.borderColor = '#D8B36A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFFDF9';
                      e.currentTarget.style.borderColor = '#EEDBCF';
                    }}
                  >
                    <span>Explore Guidance</span>
                    <ArrowRight size={14} color="#D97706" />
                  </Link>
                </div>

                {/* 05 Life Coaching */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px 20px 22px',
                    border: '1.5px solid #F0E3D7',
                    boxShadow: '0 4px 18px rgba(80, 22, 79, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = '#D8B36A';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(80, 22, 79, 0.09)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = '#F0E3D7';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(80, 22, 79, 0.04)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: '#FEF7EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Target size={20} color="#B45309" />
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#E67E22' }}>
                        05
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#50164F', margin: '0 0 10px', lineHeight: 1.25 }}>
                      Life Coaching
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.55, margin: '0 0 22px', minHeight: '42px' }}>
                      Build confidence, achieve goals and improve personal growth.
                    </p>
                  </div>

                  <Link
                    to="/services/life-coaching"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '9999px',
                      background: '#FFFDF9',
                      border: '1.2px solid #EEDBCF',
                      color: '#50164F',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FDF2F8';
                      e.currentTarget.style.borderColor = '#D8B36A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFFDF9';
                      e.currentTarget.style.borderColor = '#EEDBCF';
                    }}
                  >
                    <span>Explore Coaching</span>
                    <ArrowRight size={14} color="#D97706" />
                  </Link>
                </div>

                {/* 06 Astrology & Kundali */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px 20px 22px',
                    border: '1.5px solid #F0E3D7',
                    boxShadow: '0 4px 18px rgba(80, 22, 79, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = '#D8B36A';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(80, 22, 79, 0.09)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = '#F0E3D7';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(80, 22, 79, 0.04)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: '#F4ECFA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Sparkles size={20} color="#7C3AED" />
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#E67E22' }}>
                        06
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#50164F', margin: '0 0 10px', lineHeight: 1.25 }}>
                      Astrology &amp; Kundali
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.55, margin: '0 0 22px', minHeight: '42px' }}>
                      Explore astrology, Kundali and personalized guidance.
                    </p>
                  </div>

                  <Link
                    to="/services/astrology-kundali"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '9999px',
                      background: '#FFFDF9',
                      border: '1.2px solid #EEDBCF',
                      color: '#50164F',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FDF2F8';
                      e.currentTarget.style.borderColor = '#D8B36A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFFDF9';
                      e.currentTarget.style.borderColor = '#EEDBCF';
                    }}
                  >
                    <span>Explore Astrology</span>
                    <ArrowRight size={14} color="#D97706" />
                  </Link>
                </div>

                {/* 07 Remote Work Opportunities */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px 20px 22px',
                    border: '1.5px solid #F0E3D7',
                    boxShadow: '0 4px 18px rgba(80, 22, 79, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = '#D8B36A';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(80, 22, 79, 0.09)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = '#F0E3D7';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(80, 22, 79, 0.04)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: '#EFF8FC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Briefcase size={20} color="#0284C7" />
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#E67E22' }}>
                        07
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#50164F', margin: '0 0 10px', lineHeight: 1.25 }}>
                      Remote Work Opportunities
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.55, margin: '0 0 22px', minHeight: '42px' }}>
                      Discover flexible work opportunities and professional connections.
                    </p>
                  </div>

                  <Link
                    to="/services/remote-work"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '9999px',
                      background: '#FFFDF9',
                      border: '1.2px solid #EEDBCF',
                      color: '#50164F',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FDF2F8';
                      e.currentTarget.style.borderColor = '#D8B36A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFFDF9';
                      e.currentTarget.style.borderColor = '#EEDBCF';
                    }}
                  >
                    <span>Explore Work</span>
                    <ArrowRight size={14} color="#D97706" />
                  </Link>
                </div>

                {/* 08 Counselling & Support */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '24px 20px 22px',
                    border: '1.5px solid #F0E3D7',
                    boxShadow: '0 4px 18px rgba(80, 22, 79, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = '#D8B36A';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(80, 22, 79, 0.09)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = '#F0E3D7';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(80, 22, 79, 0.04)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: '#FDF2F4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Headphones size={20} color="#E11D48" />
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#E67E22' }}>
                        08
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#50164F', margin: '0 0 10px', lineHeight: 1.25 }}>
                      Counselling &amp; Support
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.55, margin: '0 0 22px', minHeight: '42px' }}>
                      Connect with suitable professionals for personal guidance and support.
                    </p>
                  </div>

                  <Link
                    to="/services/counselling"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '9999px',
                      background: '#FFFDF9',
                      border: '1.2px solid #EEDBCF',
                      color: '#50164F',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FDF2F8';
                      e.currentTarget.style.borderColor = '#D8B36A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFFDF9';
                      e.currentTarget.style.borderColor = '#EEDBCF';
                    }}
                  >
                    <span>Explore Counselling</span>
                    <ArrowRight size={14} color="#D97706" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <style>{`
            @media (min-width: 1024px) {
              .mm-services-3-grid {
                grid-template-columns: repeat(3, 1fr) !important;
              }
              .mm-services-5-grid {
                grid-template-columns: repeat(5, 1fr) !important;
              }
            }
            @media (max-width: 1023px) and (min-width: 640px) {
              .mm-services-3-grid {
                grid-template-columns: repeat(3, 1fr) !important;
              }
              .mm-services-5-grid {
                grid-template-columns: repeat(3, 1fr) !important;
              }
            }
            @media (max-width: 639px) {
              .mm-services-3-grid, .mm-services-5-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}</style>
        </section>

        {/* =========================================================
            4. PROFESSIONAL PROFILES SECTION (SECTION 8)
            ========================================================= */}
        <section style={{ padding: '70px 20px', background: '#FFFFFF', borderTop: '1px solid #F0E3D7', borderBottom: '1px solid #F0E3D7' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D8B36A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Verified Experts</span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.1rem', color: '#50164F', margin: '4px 0 0' }}>
                  Meet Verified Professionals
                </h2>
              </div>
              <Link to="/counselling" style={{ color: '#50164F', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                View Full Directory <ArrowRight size={15} />
              </Link>
            </div>

            {loadingPartners ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#665365' }}>Loading verified professionals...</div>
            ) : professionals.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '24px' }}>
                {professionals.map((p) => (
                  <div key={p.id} style={{
                    borderRadius: '20px',
                    border: '1.5px solid #F0E3D7',
                    background: '#FFF9F5',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(80, 22, 79, 0.04)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                        <img
                          src={p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name || 'Expert')}&background=50164F&color=fff`}
                          alt={p.full_name}
                          style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#50164F', fontSize: '1.05rem' }}>{p.full_name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#D8B36A', fontWeight: 600 }}>{p.primary_specialization || 'Certified Companion / Mentor'}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.5, margin: '0 0 16px' }}>
                        {p.bio ? p.bio.slice(0, 95) + '...' : 'Available for empathetic listening, life mentoring, and confidential guidance.'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link
                        to={`/partners/${p.id}`}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '10px',
                          borderRadius: '9999px',
                          border: '1.5px solid #50164F',
                          color: '#50164F',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          textDecoration: 'none'
                        }}
                      >
                        View Profile
                      </Link>
                      <Link
                        to={`/partners/${p.id}`}
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          padding: '10px',
                          borderRadius: '9999px',
                          background: '#50164F',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          textDecoration: 'none'
                        }}
                      >
                        Connect / Book
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                <Link to="/counselling" style={{ color: '#50164F', fontWeight: 700 }}>Browse All Available Professionals →</Link>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================
            5. HOW IT WORKS (SECTION 9)
            ========================================================= */}
        <section style={{ padding: '80px 20px', maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D8B36A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Simple &amp; Transparent</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#50164F', margin: '6px 0 12px' }}>
              How MAANMITRA Works
            </h2>
            <p style={{ color: '#665365' }}>Three straightforward steps to finding connection and guidance.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {howItWorksSteps.map((st) => (
              <div key={st.num} style={{
                background: '#FFFFFF',
                borderRadius: '22px',
                padding: '32px 24px',
                border: '1.5px solid #F0E3D7',
                boxShadow: '0 4px 20px rgba(80, 22, 79, 0.04)'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#D8B36A', marginBottom: '14px', lineHeight: 1 }}>
                  {st.num}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#50164F', margin: '0 0 10px' }}>{st.title}</h3>
                <p style={{ fontSize: '0.9rem', color: '#665365', lineHeight: 1.55, margin: 0 }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            6. WHY CHOOSE MAANMITRA (SECTION 10)
            ========================================================= */}
        <section style={{ padding: '70px 20px', background: '#FFFFFF', borderTop: '1px solid #F0E3D7', borderBottom: '1px solid #F0E3D7' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#50164F', margin: '0 0 10px' }}>
                Why Choose MAANMITRA
              </h2>
              <p style={{ color: '#665365' }}>A safe haven built for genuine human support and opportunities.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '22px' }}>
              {whyChooseBenefits.map((b, idx) => (
                <div key={idx} style={{
                  background: '#FFF9F5',
                  borderRadius: '20px',
                  padding: '28px 22px',
                  border: '1.5px solid #F0E3D7'
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#FFFFFF',
                    border: '1px solid #F0E3D7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <b.icon size={22} color="#50164F" />
                  </div>
                  <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: '#50164F', margin: '0 0 8px' }}>{b.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#665365', lineHeight: 1.55, margin: 0 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            7. PLATFORM ACCESS PASS BANNER (SECTION 11)
            ========================================================= */}
        <section style={{ maxWidth: '1240px', margin: '50px auto', padding: '0 20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #50164F 0%, #6E1A6D 100%)',
            borderRadius: '26px',
            padding: '32px 40px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 16px 40px rgba(80, 22, 79, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Left: Crown & Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={28} color="#D8B36A" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#D8B36A', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Entry-Level Platform Access
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.2 }}>
                  MAANMITRA Platform Access Pass
                </div>
              </div>
            </div>

            {/* Middle: Checklist */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, auto)',
              gap: '10px 28px',
              fontSize: '0.90rem',
              flex: '1 1 auto',
              justifyContent: 'center',
              padding: '0 16px'
            }}>
              {[
                'Access All Services',
                'Chat & Video Support',
                'Book Sessions',
                'Guidance & Resources'
              ].map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                  <CheckCircle2 size={16} color="#D8B36A" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <Link
                to="/user/subscribe"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 30px',
                  borderRadius: '9999px',
                  background: '#D8B36A',
                  color: '#50164F',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.15)';
                }}
              >
                <span>Get Access</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================
            8. WHAT OUR USERS SAY (SECTION 12)
            ========================================================= */}
        <section style={{ padding: '70px 20px', maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D8B36A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Community Feedback</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#50164F', margin: '6px 0 10px' }}>
              What Our Users Say
            </h2>
            <p style={{ color: '#665365' }}>Sample community feedback recorded during early platform onboarding.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              {
                text: 'Moving to Bangalore alone was overwhelming. Meeting verified friends through MAANMITRA helped me build a weekend community without any awkwardness.',
                author: 'Priya S.',
                role: 'Product Designer, Bangalore',
                service: 'Meet a New Friend'
              },
              {
                text: 'The living relationship guidance helped us align our expectations about finances and family before moving in together. Professional, respectful, and so grounding.',
                author: 'Rohan & Ananya',
                role: 'Couple Consultation, Mumbai',
                service: 'Living Relationship'
              },
              {
                text: 'Stranger Trip to Kasol was unforgettable! Balanced group, verified travellers, and zero stress about arrangements. Made lifelong friends.',
                author: 'Aditya K.',
                role: 'Solo Explorer, Delhi',
                service: 'Stranger Trip'
              }
            ].map((t, idx) => (
              <div key={idx} style={{
                background: '#FFFFFF',
                borderRadius: '22px',
                padding: '28px',
                border: '1.5px solid #F0E3D7',
                boxShadow: '0 4px 18px rgba(80, 22, 79, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#D8B36A" color="#D8B36A" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#50164F', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 18px' }}>
                    "{t.text}"
                  </p>
                </div>
                <div style={{ borderTop: '1px solid #FFF9F5', paddingTop: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#50164F', fontSize: '0.95rem' }}>{t.author}</div>
                  <div style={{ fontSize: '0.78rem', color: '#665365' }}>{t.role}</div>
                  <div style={{ fontSize: '0.74rem', color: '#D8B36A', fontWeight: 700, marginTop: '2px' }}>• {t.service}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            9. FAQ SECTION (SECTION 13 - 10 ACCORDION QUESTIONS)
            ========================================================= */}
        <section style={{ padding: '70px 20px', background: '#FFFFFF', borderTop: '1px solid #F0E3D7' }}>
          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D8B36A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Help &amp; Transparency</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#50164F', margin: '6px 0 10px' }}>
                Frequently Asked Questions
              </h2>
              <p style={{ color: '#665365' }}>Clear answers to the most common questions about MAANMITRA.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{
                  border: '1.5px solid #F0E3D7',
                  borderRadius: '16px',
                  background: '#FFF9F5',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 22px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: 700,
                      color: '#50164F',
                      fontSize: '0.98rem'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} style={{
                      transform: openFaq === idx ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                      marginLeft: '12px'
                    }} />
                  </button>
                  {openFaq === idx && (
                    <div style={{ padding: '0 22px 20px', color: '#665365', fontSize: '0.9rem', lineHeight: 1.65 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 10. COMPLETE FOOTER (SECTION 14) */}
      <PublicFooter />
    </div>
  );
}
