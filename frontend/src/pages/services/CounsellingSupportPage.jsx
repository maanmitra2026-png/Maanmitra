import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Headphones,
  ShieldCheck,
  Video,
  Phone,
  MessageSquare,
  Lock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Heart
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import api from '../../apiConfig';

export default function CounsellingSupportPage() {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCounsellors = async () => {
      try {
        const res = await api.get('/partners?limit=6');
        const data = res.data?.partners || res.data || [];
        setCounsellors(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (err) {
        console.warn('Could not load counsellors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounsellors();
  }, []);

  const modalities = [
    { title: 'HD Video Consultations', desc: 'Face-to-face encrypted video sessions scheduled at your convenience from your private room.', icon: Video },
    { title: 'Private Audio Calls', desc: 'When you prefer phone conversations without video presence. No personal phone numbers revealed.', icon: Phone },
    { title: 'Live Chat Support', desc: 'Real-time text chat sessions for reflection, steady communication, and thoughtful check-ins.', icon: MessageSquare },
    { title: '100% Confidential Guarantee', desc: 'Protected by our strict psychological confidentiality protocol and end-to-end data safety.', icon: Lock }
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
              background: '#F3E5F0',
              color: '#50164F',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '18px'
            }}>
              <Headphones size={16} /> SERVICE 08
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#50164F',
              margin: '0 0 18px'
            }}>
              Your Journey Towards <span style={{ color: '#D8B36A', display: 'block' }}>Better Wellbeing Starts Here.</span>
            </h1>

            <p style={{
              fontSize: '1.08rem',
              color: '#665365',
              lineHeight: 1.65,
              marginBottom: '32px',
              maxWidth: '520px'
            }}>
              Connect with verified, empathetic counsellors and mental wellbeing practitioners for confidential guidance in a safe, judgment-free space.
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
                <span>Book a Session</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#50164F" /> Verified Clinical Practitioners
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#50164F" /> Transparent Per-Minute Billing
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#50164F" /> Instant Start Available
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
                src="https://images.unsplash.com/photo-1573497491765-dccce02b29df?auto=format&fit=crop&w=1200&q=80"
                alt="Empathetic licensed therapist providing supportive consultation"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* MODALITIES */}
        <section style={{ padding: '60px 20px', background: '#FAF5F9', borderTop: '1px solid #EBD8E7', borderBottom: '1px solid #EBD8E7' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 10px' }}>
                Consultation Options Built Around You
              </h2>
              <p style={{ color: '#665365' }}>Choose the communication mode you feel most comfortable with.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
              {modalities.map((mod, idx) => (
                <div key={idx} style={{ background: '#FFFFFF', borderRadius: '18px', padding: '24px', border: '1.5px solid #EBD8E7' }}>
                  <mod.icon size={24} color="#50164F" style={{ marginBottom: '14px' }} />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#50164F', margin: '0 0 8px' }}>{mod.title}</h3>
                  <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.55, margin: 0 }}>{mod.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VERIFIED PRACTITIONERS */}
        <section style={{ padding: '70px 20px', maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 6px' }}>
                Verified Counsellors Available Now
              </h2>
              <p style={{ color: '#665365', margin: 0 }}>Accredited professionals holding psychology degrees and verified certifications.</p>
            </div>
            <Link to="/counselling" style={{ color: '#50164F', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Full Directory <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#665365' }}>Loading verified counsellors...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '22px' }}>
              {counsellors.map((c) => (
                <div key={c.id} style={{
                  borderRadius: '18px',
                  border: '1.5px solid #F0E3D7',
                  background: '#FFFFFF',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 14px rgba(80, 22, 79, 0.04)'
                }}>
                  <div>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                      <img
                        src={c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name || 'Counsellor')}&background=50164F&color=fff`}
                        alt={c.full_name}
                        style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#50164F', fontSize: '1.02rem' }}>{c.full_name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#D8B36A', fontWeight: 600 }}>{c.primary_specialization || 'Clinical Counsellor'}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#665365', lineHeight: 1.5, margin: '0 0 16px' }}>
                      {c.bio ? c.bio.slice(0, 90) + '...' : 'Available for empathetic, professional support with emotional balance and personal clarity.'}
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
                    View Profile &amp; Book
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA BANNER */}
        <section style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', color: '#50164F', margin: '0 0 14px' }}>
            Take the First Step Towards Relief
          </h2>
          <p style={{ color: '#665365', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Book a private session or connect live with a verified listener today.
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
            <span>Book a Session Now</span>
            <ArrowRight size={17} />
          </Link>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

