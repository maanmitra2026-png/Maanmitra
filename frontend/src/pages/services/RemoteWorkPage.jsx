import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Laptop,
  Clock,
  Coins,
  FileText,
  AlertCircle
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

export default function RemoteWorkPage() {
  const roles = [
    {
      title: 'Active Empathetic Listener',
      skills: 'High emotional intelligence, active listening, compassionate conversation, English/Hindi fluency.',
      mode: 'Flexible 10–30 hrs / week',
      desc: 'Be a listening companion for individuals needing friendly, non-judgmental support.'
    },
    {
      title: 'Certified Relationship Counsellor',
      skills: 'MA/MSc in Psychology or verified counselling certification with 1+ year practical guidance experience.',
      mode: 'Flexible Per-Session / Hourly',
      desc: 'Conduct 1-on-1 audio & HD video consultations for couples and individuals.'
    },
    {
      title: 'Personal Development Coach',
      skills: 'ICF or certified coaching credentials, goal-setting methodologies, leadership mentorship background.',
      mode: 'Self-Scheduled Batches',
      desc: 'Guide ambitious professionals in confidence building, habit creation, and career trajectory clarity.'
    },
    {
      title: 'Vedic Astrologer / Consultant',
      skills: 'Traditional Jyotish credentials, birth chart reading mastery, Kundali matching expertise.',
      mode: 'On-Demand / Booked Consultations',
      desc: 'Provide grounded, culturally respectful astrological insights for life milestones.'
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
              background: '#E0F2FE',
              color: '#075985',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '18px'
            }}>
              <Briefcase size={16} /> SERVICE 07
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#50164F',
              margin: '0 0 18px'
            }}>
              Discover Flexible <span style={{ color: '#D8B36A', display: 'block' }}>Work Opportunities.</span>
            </h1>

            <p style={{
              fontSize: '1.08rem',
              color: '#665365',
              lineHeight: 1.65,
              marginBottom: '32px',
              maxWidth: '520px'
            }}>
              Apply your empathy, certified skills, and life wisdom as a verified professional on MAANMITRA. Work flexibly from home with transparent per-minute or booked earnings.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <Link
                to="/become-a-partner"
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
                <span>Register as a Professional</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#0369A1" /> 100% Remote From Home
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#0369A1' }}>
                <CheckCircle2 size={16} color="#0369A1" /> Set Your Own Schedule
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#0369A1' }}>
                <CheckCircle2 size={16} color="#0369A1" /> Weekly Direct Payouts
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
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                alt="Indian professional working remotely on laptop from comfortable home setup"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* ROLES / OPPORTUNITIES */}
        <section style={{ padding: '60px 20px', background: '#F0F9FF', borderTop: '1px solid #BAE6FD', borderBottom: '1px solid #BAE6FD' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 10px' }}>
                Open Partner Categories
              </h2>
              <p style={{ color: '#665365' }}>Connect with users seeking guidance, companionship, or coaching.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
              {roles.map((r, idx) => (
                <div key={idx} style={{
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '24px',
                  border: '1.5px solid #BAE6FD',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0369A1', background: '#E0F2FE', padding: '4px 10px', borderRadius: '9999px', display: 'inline-block', marginBottom: '10px' }}>
                      {r.mode}
                    </span>
                    <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: '#50164F', margin: '0 0 8px' }}>{r.title}</h3>
                    <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.5, margin: '0 0 14px' }}>{r.desc}</p>
                    <div style={{ fontSize: '0.8rem', color: '#4A5568', background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
                      <strong>Key Skills:</strong> {r.skills}
                    </div>
                  </div>
                  <Link
                    to="/become-a-partner"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '10px',
                      borderRadius: '9999px',
                      background: '#0369A1',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      textDecoration: 'none'
                    }}
                  >
                    Apply for this Role
                  </Link>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '32px',
              padding: '16px 20px',
              borderRadius: '14px',
              background: '#FFFFFF',
              border: '1px solid #BAE6FD',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.86rem',
              color: '#075985'
            }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span>
                Transparency Notice: MAANMITRA does not promise guaranteed employment or fixed income. Earnings depend strictly on your approved credentials, client ratings, active session hours, and client engagement.
              </span>
            </div>
          </div>
        </section>

        {/* APPLICATION PROCESS */}
        <section style={{ padding: '70px 20px', maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D8B36A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Simple Onboarding</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.1rem', color: '#50164F', margin: '6px 0 12px' }}>
              How to Become a Verified Partner
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '22px' }}>
            {[
              { num: '01', title: 'Submit Application', desc: 'Share your background, educational documents, and preferred guidance categories.' },
              { num: '02', title: 'Document Verification', desc: 'Our compliance team checks government ID and professional certifications within 48 hours.' },
              { num: '03', title: 'Platform Orientation', desc: 'Brief online walkthrough of communication etiquette, wallet management, and tools.' },
              { num: '04', title: 'Go Live & Connect', desc: 'Toggle your status to available, receive audio/video requests, and build client trust.' }
            ].map(s => (
              <div key={s.num} style={{ background: '#FFFFFF', borderRadius: '18px', padding: '26px 20px', border: '1.5px solid #F0E3D7' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#D8B36A', marginBottom: '12px' }}>{s.num}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#50164F', margin: '0 0 8px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', color: '#50164F', margin: '0 0 14px' }}>
            Join Our Professional Network Today
          </h2>
          <p style={{ color: '#665365', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Help others heal, grow, and connect while building a flexible career from anywhere.
          </p>
          <Link
            to="/become-a-partner"
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
            <span>Register as a Professional</span>
            <ArrowRight size={17} />
          </Link>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

