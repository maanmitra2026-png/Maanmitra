import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Heart,
  MessageCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Compass,
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import api from '../../apiConfig';

export default function MeetANewFriendPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProfiles = async () => {
      try {
        const res = await api.get('/partners?limit=6');
        const data = res.data?.partners || res.data || [];
        setProfiles(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (err) {
        console.warn('Could not load real profiles:', err);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const steps = [
    { num: '01', title: 'Create Your Profile', desc: 'Sign up in 60 seconds with your interests, conversational preferences, and personality traits.' },
    { num: '02', title: 'Discover People', desc: 'Browse verified members who share your passions, hobbies, or life stages.' },
    { num: '03', title: 'Send a Connection Request', desc: 'Break the ice with a thoughtful hello in a safe, moderated environment.' },
    { num: '04', title: 'Start a Meaningful Conversation', desc: 'Chat, voice call, or share perspectives with a listening friend.' }
  ];

  const benefits = [
    { title: 'Friendly, Judgement-Free Environment', desc: 'A warm community built for empathetic conversations, shared laughs, and authentic connections.', icon: Heart },
    { title: 'Respectful Communication Protocol', desc: 'Zero tolerance for harassment. Every member is bound by our strict community safety charter.', icon: ShieldCheck },
    { title: 'Privacy-First Experience', desc: 'Your personal phone number and personal coordinates are never shared. You control your profile visibility.', icon: Lock },
    { title: 'Flexible Online Connections', desc: 'Connect at your own pace via real-time text chat, audio calls, or structured virtual meetups.', icon: Compass }
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
              background: '#DBEAFE',
              color: '#1D4ED8',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '18px'
            }}>
              <Users size={16} /> PRIORITY SERVICE 01
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#50164F',
              margin: '0 0 18px'
            }}>
              Every Great Friendship <span style={{ color: '#D8B36A', display: 'block' }}>Starts With a Hello.</span>
            </h1>

            <p style={{
              fontSize: '1.08rem',
              color: '#665365',
              lineHeight: 1.65,
              marginBottom: '32px',
              maxWidth: '520px'
            }}>
              Meet new people, share genuine conversations, discover common interests, and build lasting friendships in a safe, verified Indian community.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <Link
                to="/register"
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
                  boxShadow: '0 6px 20px rgba(80, 22, 79, 0.25)',
                  transition: 'all 0.2s'
                }}
              >
                <span>Find a New Friend</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/counselling"
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
                <span>Browse Verified Profiles</span>
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#2563EB" /> 100% Verified Members
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#2563EB" /> Zero Creep Policy
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#2563EB" /> Safe Voice & Chat
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
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
                alt="Diverse group of friendly Indian adults enjoying genuine conversation"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* SECTION A: DISCOVER NEW FRIENDSHIPS */}
        <section style={{ padding: '60px 20px', background: '#EFF6FF', borderTop: '1px solid #DBEAFE', borderBottom: '1px solid #DBEAFE' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 12px' }}>
                Discover Meaningful Friendships
              </h2>
              <p style={{ color: '#665365', lineHeight: 1.6 }}>
                Whether you moved to a new city, changed careers, or simply crave conversations that go beyond small talk — MAANMITRA is your circle.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              {[
                { title: 'Shared Hobbies & Passions', desc: 'Connect over books, travel, cinema, music, entrepreneurship, or lifestyle goals.', icon: Sparkles },
                { title: 'Empathetic Listeners', desc: 'Sometimes you just need someone to hear your day without unsolicited advice or judgement.', icon: MessageCircle },
                { title: 'New City Companions', desc: 'Find trustworthy local guides and weekend walking partners when relocating.', icon: Compass },
                { title: 'Peer Mentorship', desc: 'Exchange perspectives with individuals navigating similar life and career transitions.', icon: UserPlus }
              ].map((item, idx) => (
                <div key={idx} style={{
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(37, 99, 235, 0.06)',
                  border: '1px solid #BFDBFE'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#DBEAFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <item.icon size={20} color="#1D4ED8" />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#50164F', margin: '0 0 8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: '#665365', lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION B: HOW IT WORKS */}
        <section style={{ padding: '70px 20px', maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D8B36A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Simple & Safe</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.1rem', color: '#50164F', margin: '6px 0 12px' }}>
              How Finding Friends Works
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {steps.map((st) => (
              <div key={st.num} style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '28px 22px',
                border: '1.5px solid #F0E3D7',
                boxShadow: '0 4px 20px rgba(80, 22, 79, 0.04)',
                position: 'relative'
              }}>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: '#D8B36A',
                  lineHeight: 1,
                  marginBottom: '14px'
                }}>
                  {st.num}
                </div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: '#50164F', margin: '0 0 8px' }}>{st.title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#665365', lineHeight: 1.55, margin: 0 }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION C: FRIENDSHIP PROFILES */}
        <section style={{ padding: '60px 20px', background: '#FFFFFF', borderTop: '1px solid #F0E3D7', borderBottom: '1px solid #F0E3D7' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.9rem', color: '#50164F', margin: '0 0 6px' }}>
                  Featured Friendly Companions
                </h2>
                <p style={{ color: '#665365', margin: 0, fontSize: '0.95rem' }}>Verified platform members welcoming respectful conversations.</p>
              </div>
              <Link to="/counselling" style={{ color: '#50164F', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                View All Directory <ArrowRight size={15} />
              </Link>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#665365' }}>Loading verified profiles...</div>
            ) : profiles.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '22px' }}>
                {profiles.map((p) => (
                  <div key={p.id} style={{
                    borderRadius: '18px',
                    border: '1.5px solid #F0E3D7',
                    background: '#FFF9F5',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 14px rgba(80, 22, 79, 0.04)'
                  }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                      <img
                        src={p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name || 'Companion')}&background=50164F&color=fff`}
                        alt={p.full_name}
                        style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#50164F', fontSize: '1.02rem' }}>{p.full_name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#D8B36A', fontWeight: 600 }}>{p.primary_specialization || 'Friendly Listener'}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#665365', lineHeight: 1.5, margin: '0 0 16px', minHeight: '38px' }}>
                      {p.bio ? p.bio.slice(0, 85) + '...' : 'Available for open, friendly conversations and supportive life discussions.'}
                    </p>
                    <Link
                      to={`/partners/${p.id}`}
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
                      Connect with {p.full_name ? p.full_name.split(' ')[0] : 'Friend'}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', background: '#FFF9F5', borderRadius: '16px' }}>
                <p style={{ color: '#665365' }}>Sign in or register to browse live friendship profiles.</p>
                <Link to="/register" style={{ color: '#50164F', fontWeight: 700 }}>Join Now →</Link>
              </div>
            )}
          </div>
        </section>

        {/* SECTION D: BENEFITS */}
        <section style={{ padding: '70px 20px', maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 10px' }}>
              Why Meet Friends on MAANMITRA
            </h2>
            <p style={{ color: '#665365' }}>Built specifically for respectful, wholesome social connections.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '24px',
                border: '1.5px solid #F0E3D7'
              }}>
                <b.icon size={24} color="#50164F" style={{ marginBottom: '14px' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#50164F', margin: '0 0 8px' }}>{b.title}</h3>
                <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.55, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION E: SAFETY GUIDELINES */}
        <section style={{ padding: '60px 20px', background: '#FEF2F2', borderTop: '1px solid #FEE2E2', borderBottom: '1px solid #FEE2E2' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <AlertTriangle size={24} color="#DC2626" />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.65rem', color: '#991B1B', margin: 0 }}>
                Safety & Respect Community Guidelines
              </h2>
            </div>
            <p style={{ color: '#7F1D1D', lineHeight: 1.6, fontSize: '0.94rem', marginBottom: '20px' }}>
              MAANMITRA is strictly a professional, platonic connection platform. We enforce automated & human moderation:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {[
                'Instant 1-Click Blocking & Reporting for any inappropriate behavior.',
                'Zero tolerance for adult solicitations, harassment, or financial scams.',
                'Encrypted communication that shields your phone number and home address.',
                'Periodic profile auditing and immediate account suspension for violations.'
              ].map((guide, idx) => (
                <div key={idx} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '14px', border: '1px solid #FECACA', fontSize: '0.86rem', color: '#7F1D1D' }}>
                  ✓ {guide}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION F: CALL TO ACTION BANNER */}
        <section style={{ padding: '70px 20px', textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', color: '#50164F', margin: '0 0 14px' }}>
            Ready to Connect With Someone New?
          </h2>
          <p style={{ color: '#665365', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Join thousands of individuals across India discovering uplifting conversations and trusted friends every day.
          </p>
          <Link
            to="/register"
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
            <span>Find a New Friend Now</span>
            <ArrowRight size={17} />
          </Link>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

