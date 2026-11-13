import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  ShieldCheck,
  Compass,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Brain,
  Award
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import api from '../../apiConfig';

export default function LifeCoachingPage() {
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCoaches = async () => {
      try {
        const res = await api.get('/partners?limit=4');
        const data = res.data?.partners || res.data || [];
        setCoaches(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        console.warn('Could not load coaches:', err);
      }
    };
    fetchCoaches();
  }, []);

  const pillars = [
    { title: 'Personal Development', desc: 'Overcome self-sabotage, break procrastination cycles, and engineer habits that stick.', icon: Brain },
    { title: 'Actionable Goal Setting', desc: 'Transform vague ambitions into realistic, measurable quarterly milestones with accountability.', icon: Target },
    { title: 'Confidence & Presence', desc: 'Develop grounded assertiveness for high-stakes interviews, leadership roles, and public speaking.', icon: Award },
    { title: 'Career & Life Direction', desc: 'Align your vocational trajectory with your natural strengths, core values, and financial targets.', icon: TrendingUp }
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
              background: '#FEF3C7',
              color: '#92400E',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '18px'
            }}>
              <Target size={16} /> SERVICE 05
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#50164F',
              margin: '0 0 18px'
            }}>
              Grow With Confidence. <span style={{ color: '#D8B36A', display: 'block' }}>Create Your Own Path.</span>
            </h1>

            <p style={{
              fontSize: '1.08rem',
              color: '#665365',
              lineHeight: 1.65,
              marginBottom: '32px',
              maxWidth: '520px'
            }}>
              Personalized mentoring to unlock clarity, set achievable life milestones, conquer self-doubt, and advance your personal and professional growth.
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
                <span>Find a Life Coach</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#B45309" /> 1-on-1 Mentorship
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#B45309" /> Structured Action Plans
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#B45309" /> Ongoing Accountability
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
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
                alt="Personal development and executive coaching session"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* PILLARS OF GROWTH */}
        <section style={{ padding: '60px 20px', background: '#FFFBEB', borderTop: '1px solid #FDE68A', borderBottom: '1px solid #FDE68A' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 10px' }}>
                Four Pillars of Life Coaching
              </h2>
              <p style={{ color: '#665365' }}>Proven frameworks customized for your personal milestones.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
              {pillars.map((pil, idx) => (
                <div key={idx} style={{ background: '#FFFFFF', borderRadius: '18px', padding: '24px', border: '1px solid #FDE68A' }}>
                  <pil.icon size={24} color="#B45309" style={{ marginBottom: '14px' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#50164F', margin: '0 0 8px' }}>{pil.title}</h3>
                  <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.55, margin: 0 }}>{pil.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AVAILABLE COACHES */}
        <section style={{ padding: '70px 20px', maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 10px' }}>
              Verified Life Coaches
            </h2>
            <p style={{ color: '#665365' }}>Connect with certified practitioners for structured growth consultations.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
            {coaches.map((c) => (
              <div key={c.id} style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '22px',
                border: '1.5px solid #F0E3D7',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <img
                    src={c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name || 'Coach')}&background=50164F&color=fff`}
                    alt={c.full_name}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' }}
                  />
                  <div style={{ fontWeight: 700, color: '#50164F', fontSize: '1.05rem' }}>{c.full_name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#D8B36A', fontWeight: 600, marginBottom: '10px' }}>{c.primary_specialization || 'Personal Growth & Life Coach'}</div>
                  <p style={{ fontSize: '0.84rem', color: '#665365', lineHeight: 1.5, margin: '0 0 16px' }}>
                    {c.bio ? c.bio.slice(0, 90) + '...' : 'Helping individuals build productive habits, self-worth, and career focus.'}
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
                  Book Consultation
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', color: '#50164F', margin: '0 0 14px' }}>
            Step Into Your Highest Potential
          </h2>
          <p style={{ color: '#665365', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Book a conversation with a verified coach and design your roadmap today.
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
            <span>Get Started With a Coach</span>
            <ArrowRight size={17} />
          </Link>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

