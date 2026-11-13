import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  ShieldCheck,
  BookOpen,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronDown,
  Calendar,
  MessageSquare
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import api from '../../apiConfig';

export default function LivingRelationshipPage() {
  const [counsellors, setCounsellors] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCounsellors = async () => {
      try {
        const res = await api.get('/partners?limit=4');
        const data = res.data?.partners || res.data || [];
        setCounsellors(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        console.warn('Could not load counsellors:', err);
      }
    };
    fetchCounsellors();
  }, []);

  const topics = [
    {
      title: 'Understanding Live-In Dynamics',
      desc: 'Clarity on emotional, legal, and lifestyle implications of cohabitation in modern India without social stigma.'
    },
    {
      title: 'Communication & Healthy Boundaries',
      desc: 'Developing open conversational rituals to articulate needs, personal space, and emotional boundaries with grace.'
    },
    {
      title: 'Mutual Respect & Trust Building',
      desc: 'Constructive strategies for repairing micro-frictions and maintaining an atmosphere of safety and unconditional dignity.'
    },
    {
      title: 'Compatibility & Future Expectations',
      desc: 'Navigating long-term life alignment, family introductions, career ambitions, and shared timelines thoughtfully.'
    },
    {
      title: 'Shared Financial & Daily Responsibilities',
      desc: 'Practical frameworks for dividing household chores, shared living costs, and emergency funds transparently.'
    },
    {
      title: 'Overcoming Relationship Rough Patches',
      desc: 'Conflict de-escalation protocols and guidance on whether to rebuild or separate with maturity and mutual care.'
    }
  ];

  const faqs = [
    {
      q: 'What is living relationship guidance on MAANMITRA?',
      a: 'It is professional, non-judgmental advisory and educational support tailored to couples or individuals considering or navigating live-in and modern partnership dynamics.'
    },
    {
      q: 'Is our consultation confidential?',
      a: 'Absolutely. Every live session on MAANMITRA is strictly confidential under professional privacy standards. We never record calls or disclose client identities.'
    },
    {
      q: 'Can an individual attend without their partner?',
      a: 'Yes. Many individuals consult our specialists solo to gain personal clarity, understand compatibility markers, or learn constructive communication techniques.'
    },
    {
      q: 'How does live per-minute or booked consultation work?',
      a: 'You can book a dedicated 45-minute video consultation or connect instantly via per-minute audio/chat with verified relationship mentors.'
    }
  ];

  return (
    <div style={{ background: '#FFF9F5', minHeight: '100vh', fontFamily: "'Outfit', 'Poppins', sans-serif", color: '#2D162C' }}>
      <PublicNavbar />

      <main>
        {/* HERO SECTION */}
        <section style={{
          padding: '40px 20px 60px',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: '#FCE7F3',
              color: '#9D174D',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '18px'
            }}>
              <HeartHandshake size={16} /> PRIORITY SERVICE 02
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#50164F',
              margin: '0 0 18px'
            }}>
              Understand Relationships. <span style={{ color: '#D8B36A', display: 'block' }}>Build Stronger Connections.</span>
            </h1>

            <p style={{
              fontSize: '1.08rem',
              color: '#665365',
              lineHeight: 1.65,
              marginBottom: '32px',
              maxWidth: '520px'
            }}>
              Explore relationship understanding, communication, compatibility and professional guidance for modern living relationships with empathy, dignity, and zero judgment.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <Link
                to="/counselling"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '13px 28px',
                  borderRadius: '9999px',
                  background: '#50164F',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  textDecoration: 'none',
                  boxShadow: '0 6px 20px rgba(80, 22, 79, 0.25)'
                }}
              >
                <span>Explore Relationship Guidance</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/how-it-works"
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
                <span>How Guidance Works</span>
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#BE185D" /> Certified Relationship Counsellors
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#BE185D" /> 100% Confidential
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#BE185D" /> Non-Judgmental Support
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 20px 48px rgba(80, 22, 79, 0.16)',
              border: '3px solid #FFFFFF'
            }}>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
                alt="Professional counselling and relationship guidance discussion"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* SECTION A: UNDERSTANDING LIVING RELATIONSHIPS */}
        <section style={{ padding: '60px 20px', background: '#FDF2F8', borderTop: '1px solid #FBCFE8', borderBottom: '1px solid #FBCFE8' }}>
          <div style={{ maxWidth: '1040px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 16px' }}>
              Navigating Modern Cohabitation With Dignity & Clarity
            </h2>
            <p style={{ color: '#665365', lineHeight: 1.7, fontSize: '1rem', maxWidth: '780px', margin: '0 auto' }}>
              Living together before or outside formal marital structures has become a reality for thousands of young urban Indians. Yet couples frequently face communication deadlocks, family friction, or unexamined expectations. MAANMITRA provides objective, empathetic frameworks to turn confusion into calm.
            </p>
          </div>
        </section>

        {/* SECTION B: CORE TOPICS */}
        <section style={{ padding: '70px 20px', maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D8B36A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Comprehensive Focus</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.1rem', color: '#50164F', margin: '6px 0 12px' }}>
              Key Guidance Areas We Cover
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {topics.map((t, idx) => (
              <div key={idx} style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '24px',
                border: '1.5px solid #F0E3D7',
                boxShadow: '0 4px 16px rgba(80, 22, 79, 0.04)'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#FCE7F3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#BE185D',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  marginBottom: '14px'
                }}>
                  0{idx + 1}
                </div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: '#50164F', margin: '0 0 8px' }}>{t.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#665365', lineHeight: 1.55, margin: 0 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION C: PROFESSIONAL GUIDANCE */}
        <section style={{ padding: '60px 20px', background: '#FFFFFF', borderTop: '1px solid #F0E3D7', borderBottom: '1px solid #F0E3D7' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 10px' }}>
                Meet Certified Relationship Mentors
              </h2>
              <p style={{ color: '#665365', margin: 0 }}>Experienced professionals ready to guide your partnership journey.</p>
            </div>

            {counsellors.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
                {counsellors.map((c) => (
                  <div key={c.id} style={{
                    borderRadius: '18px',
                    border: '1.5px solid #F0E3D7',
                    background: '#FFF9F5',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <img
                        src={c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name || 'Expert')}&background=50164F&color=fff`}
                        alt={c.full_name}
                        style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', marginBottom: '14px' }}
                      />
                      <div style={{ fontWeight: 700, color: '#50164F', fontSize: '1.05rem' }}>{c.full_name}</div>
                      <div style={{ fontSize: '0.82rem', color: '#D8B36A', fontWeight: 600, marginBottom: '10px' }}>
                        {c.primary_specialization || 'Couples & Living Relationship Counsellor'}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#665365', lineHeight: 1.5, margin: '0 0 16px' }}>
                        {c.bio ? c.bio.slice(0, 95) + '...' : 'Specialized in trust repair, conflict de-escalation, and healthy cohabitation practices.'}
                      </p>
                    </div>
                    <Link
                      to={`/partners/${c.id}`}
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        padding: '10px',
                        borderRadius: '9999px',
                        background: '#50164F',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        textDecoration: 'none'
                      }}
                    >
                      Book Guidance Session
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px' }}>
                <Link to="/counselling" style={{ color: '#50164F', fontWeight: 700 }}>Browse All Available Counsellors →</Link>
              </div>
            )}
          </div>
        </section>

        {/* SECTION D: LEARNING RESOURCES */}
        <section style={{ padding: '70px 20px', maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 10px' }}>
              Relationship Learning Resources
            </h2>
            <p style={{ color: '#665365' }}>Actionable insights prepared by accredited relationship therapists.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { title: 'The Pre-Cohabitation Checklist', desc: '15 essential conversation prompts to discuss before sharing a lease or moving in together.' },
              { title: 'Fair Fighting Rules for Couples', desc: 'How to disagree passionately without attacking character, using contempt, or eroding trust.' },
              { title: 'Managing Family Expectations', desc: 'Communicating your choices to traditional parents with maturity, respect, and calm confidence.' }
            ].map((res, i) => (
              <div key={i} style={{ background: '#FFFFFF', borderRadius: '16px', padding: '22px', border: '1px solid #F0E3D7' }}>
                <BookOpen size={20} color="#BE185D" style={{ marginBottom: '10px' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#50164F', margin: '0 0 8px' }}>{res.title}</h3>
                <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.5, margin: 0 }}>{res.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION E: FAQS */}
        <section style={{ padding: '60px 20px', background: '#FFFFFF', borderTop: '1px solid #F0E3D7' }}>
          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', textAlign: 'center', margin: '0 0 36px' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{
                  border: '1.5px solid #F0E3D7',
                  borderRadius: '14px',
                  background: '#FFF9F5',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: 700,
                      color: '#50164F',
                      fontSize: '0.96rem'
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
                    <div style={{ padding: '0 20px 18px', color: '#665365', fontSize: '0.9rem', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION F: CALL TO ACTION BANNER */}
        <section style={{ padding: '70px 20px', textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', color: '#50164F', margin: '0 0 14px' }}>
            Gain Clarity in Your Relationship Today
          </h2>
          <p style={{ color: '#665365', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Connect with a verified counsellor for confidential, experienced guidance.
          </p>
          <Link
            to="/counselling"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '9999px',
              background: '#50164F',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(80, 22, 79, 0.25)'
            }}
          >
            <span>Explore Relationship Guidance</span>
            <ArrowRight size={17} />
          </Link>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

