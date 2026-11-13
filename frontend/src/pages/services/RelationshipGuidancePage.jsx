import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Calendar,
  Sparkles
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import api from '../../apiConfig';

export default function RelationshipGuidancePage() {
  const [mentors, setMentors] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMentors = async () => {
      try {
        const res = await api.get('/partners?limit=4');
        const data = res.data?.partners || res.data || [];
        setMentors(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        console.warn('Could not load mentors:', err);
      }
    };
    fetchMentors();
  }, []);

  const challenges = [
    { title: 'Frequent Misunderstandings', desc: 'When well-intended comments get misunderstood and spiral into recurring arguments.' },
    { title: 'Trust Deficits & Insecurities', desc: 'Healing from emotional breaches or building foundational confidence together.' },
    { title: 'Emotional Distance & Burnout', desc: 'Re-establishing tenderness, empathy, and intimacy when busy routines take over.' },
    { title: 'Cross-Cultural & Family Strains', desc: 'Managing external family pressures and cultural divergences constructively.' }
  ];

  const faqs = [
    { q: 'Who should seek relationship guidance?', a: 'Any individual or couple wanting to communicate more constructively, heal emotional misunderstandings, or build deeper intimacy.' },
    { q: 'What happens in a first session?', a: 'Your mentor listens without taking sides, helps map root dynamics, and provides practical conversational tools you can practice immediately.' },
    { q: 'Can I speak completely anonymously?', a: 'Yes. You can use audio-only calls or chat sessions without turning on video or using your full legal name.' }
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
              background: '#FBE8F8',
              color: '#50164F',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '18px'
            }}>
              <Heart size={16} /> SERVICE 04
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#50164F',
              margin: '0 0 18px'
            }}>
              Build Healthier Relationships <span style={{ color: '#D8B36A', display: 'block' }}>With Better Understanding.</span>
            </h1>

            <p style={{
              fontSize: '1.08rem',
              color: '#665365',
              lineHeight: 1.65,
              marginBottom: '32px',
              maxWidth: '520px'
            }}>
              Get empathetic guidance from certified relationship experts to navigate challenges, deepen trust, and communicate openly with dignity.
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
                <span>Book Guidance Session</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#50164F" /> Accredited Experts
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#50164F" /> Private Video & Audio
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#50164F" /> Transparent Rates
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
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80"
                alt="Supportive relationship guidance consultation"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* COMMON CHALLENGES */}
        <section style={{ padding: '60px 20px', background: '#FDF4FB', borderTop: '1px solid #F3D2EE', borderBottom: '1px solid #F3D2EE' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 10px' }}>
                Common Challenges We Resolve
              </h2>
              <p style={{ color: '#665365' }}>Guidance crafted for the complexities of modern companionship.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
              {challenges.map((c, idx) => (
                <div key={idx} style={{ background: '#FFFFFF', borderRadius: '18px', padding: '24px', border: '1px solid #F3D2EE' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#50164F', margin: '0 0 8px' }}>{c.title}</h3>
                  <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.5, margin: 0 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GUIDANCE PROFESSIONALS */}
        <section style={{ padding: '70px 20px', maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 10px' }}>
              Available Relationship Mentors
            </h2>
            <p style={{ color: '#665365' }}>Book private 1-on-1 sessions with empathetic verified guides.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
            {mentors.map((m) => (
              <div key={m.id} style={{
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
                    src={m.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.full_name || 'Mentor')}&background=50164F&color=fff`}
                    alt={m.full_name}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' }}
                  />
                  <div style={{ fontWeight: 700, color: '#50164F', fontSize: '1.05rem' }}>{m.full_name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#D8B36A', fontWeight: 600, marginBottom: '10px' }}>{m.primary_specialization || 'Relationship Guide'}</div>
                  <p style={{ fontSize: '0.84rem', color: '#665365', lineHeight: 1.5, margin: '0 0 16px' }}>
                    {m.bio ? m.bio.slice(0, 90) + '...' : 'Specialized in communication repair, emotional safety, and conflict resolution.'}
                  </p>
                </div>
                <Link
                  to={`/partners/${m.id}`}
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
                  Book Session
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQS & CTA */}
        <section style={{ padding: '60px 20px', background: '#FFFFFF', borderTop: '1px solid #F0E3D7' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', textAlign: 'center', margin: '0 0 32px' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
              {faqs.map((f, i) => (
                <div key={i} style={{ border: '1px solid #F0E3D7', borderRadius: '14px', background: '#FFF9F5', padding: '16px' }}>
                  <div style={{ fontWeight: 700, color: '#50164F', marginBottom: '6px' }}>{f.q}</div>
                  <div style={{ fontSize: '0.88rem', color: '#665365', lineHeight: 1.55 }}>{f.a}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
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
                <span>Book Relationship Guidance</span>
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

