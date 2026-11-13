import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Moon,
  Sun,
  Compass,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Star
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import api from '../../apiConfig';

export default function AstrologyKundaliPage() {
  const [astrologers, setAstrologers] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAstrologers = async () => {
      try {
        const res = await api.get('/partners?limit=4');
        const data = res.data?.partners || res.data || [];
        setAstrologers(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        console.warn('Could not load astrologers:', err);
      }
    };
    fetchAstrologers();
  }, []);

  const offerings = [
    { title: 'Vedic Kundali Matching', desc: 'Ashtakoot Guna Milan, Dosha analysis (Manglik/Nadi), and holistic compatibility checks for prospective partnerships.', icon: Moon },
    { title: 'Birth Chart (Janam Kundali) Reading', desc: 'Detailed planetary house breakdown covering planetary transits (Dasha, Sade Sati) and karmic directions.', icon: Sun },
    { title: 'Career & Financial Timing Guidance', desc: 'Identify auspicious periods (Muhurta) for business launches, job switches, and major real estate or asset investments.', icon: Star },
    { title: 'Remedies & Gemstone Advisory', desc: 'Sattvic, grounded recommendations emphasizing mantras, mindfulness, and certified gemstone advice without fear-mongering.', icon: Sparkles }
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
              background: '#F3E8FF',
              color: '#6D28D9',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '18px'
            }}>
              <Sparkles size={16} /> SERVICE 06
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#50164F',
              margin: '0 0 18px'
            }}>
              Explore Astrology. <span style={{ color: '#D8B36A', display: 'block' }}>Discover Personalized Guidance.</span>
            </h1>

            <p style={{
              fontSize: '1.08rem',
              color: '#665365',
              lineHeight: 1.65,
              marginBottom: '32px',
              maxWidth: '520px'
            }}>
              Ancient Vedic astrology, birth chart interpretation, and compatibility guidance delivered with scientific precision, cultural reverence, and zero superstitions.
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
                <span>Consult Astrologers</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#7C3AED" /> Certified Vedic Scholars
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#7C3AED" /> 100% Confidential
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#7C3AED' }}>
                <CheckCircle2 size={16} color="#7C3AED" /> No Superstitious Threats
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
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
                alt="Celestial astrology charts and meditative guidance"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* OFFERINGS */}
        <section style={{ padding: '60px 20px', background: '#FAF5FF', borderTop: '1px solid #E9D5FF', borderBottom: '1px solid #E9D5FF' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 10px' }}>
                Vedic Astrology Consultations
              </h2>
              <p style={{ color: '#665365' }}>Clarity on compatibility, career timing, and emotional equilibrium.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
              {offerings.map((off, idx) => (
                <div key={idx} style={{ background: '#FFFFFF', borderRadius: '18px', padding: '24px', border: '1px solid #E9D5FF' }}>
                  <off.icon size={24} color="#7C3AED" style={{ marginBottom: '14px' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#50164F', margin: '0 0 8px' }}>{off.title}</h3>
                  <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.55, margin: 0 }}>{off.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VERIFIED ASTROLOGERS */}
        <section style={{ padding: '70px 20px', maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 10px' }}>
              Available Vedic Practitioners
            </h2>
            <p style={{ color: '#665365' }}>Book private 1-on-1 sessions with verified traditional scholars.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
            {astrologers.map((a) => (
              <div key={a.id} style={{
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
                    src={a.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.full_name || 'Acharya')}&background=50164F&color=fff`}
                    alt={a.full_name}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' }}
                  />
                  <div style={{ fontWeight: 700, color: '#50164F', fontSize: '1.05rem' }}>{a.full_name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#D8B36A', fontWeight: 600, marginBottom: '10px' }}>{a.primary_specialization || 'Vedic Astrologer & Kundali Expert'}</div>
                  <p style={{ fontSize: '0.84rem', color: '#665365', lineHeight: 1.5, margin: '0 0 16px' }}>
                    {a.bio ? a.bio.slice(0, 90) + '...' : 'Specializing in Kundali Milan, career Muhurta, and birth chart analysis.'}
                  </p>
                </div>
                <Link
                  to={`/partners/${a.id}`}
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
                  Consult Astrologer
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', color: '#50164F', margin: '0 0 14px' }}>
            Discover What the Stars Align For You
          </h2>
          <p style={{ color: '#665365', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Gain perspective on life seasons with authentic, verified Vedic consultations.
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
            <span>Book Kundali Consultation</span>
            <ArrowRight size={17} />
          </Link>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

