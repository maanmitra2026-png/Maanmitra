import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  Sliders,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Lock,
  MessageSquare,
  PhoneCall,
  Video,
  UserCheck,
  Clock,
  AlertCircle,
  CreditCard,
  Ban,
  Headphones,
  CheckCircle2,
  Heart,
  PhoneOff
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

export default function HowItWorksPage() {
  const steps = [
    {
      num: 1,
      title: 'Explore & Choose',
      desc: 'Discover available companionship sessions and connect with someone you feel comfortable talking to.',
      icon: <Compass size={24} color="var(--mm-rose)" />
    },
    {
      num: 2,
      title: 'Choose Your Conversation',
      desc: 'Select an available text, audio, or video session and review its duration and price.',
      icon: <Sliders size={24} color="var(--mm-rose)" />
    },
    {
      num: 3,
      title: 'Book Securely',
      desc: 'Complete the existing booking and payment flow using our supported secure payment integration.',
      icon: <CreditCard size={24} color="var(--mm-rose)" />
    },
    {
      num: 4,
      title: 'Connect and Talk',
      desc: 'Join your booked conversation through the communication method supported by the application.',
      icon: <HeartHandshake size={24} color="var(--mm-rose)" />
    }
  ];

  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />

      <main id="main-content">
        {/* Header Hero */}
        <section className="mm-hiw-hero-section" aria-labelledby="hiw-title">
          <div className="mm-container">
            <div className="mm-section-header-center">
              <span className="mm-hero-badge-tag" style={{ display: 'inline-block', marginBottom: '14px' }}>
                SIMPLE 4-STEP PROCESS
              </span>
              <h1 id="hiw-title" className="mm-home-section-title">
                Your Next Conversation Is Just a Few Steps Away.
              </h1>
              <p className="mm-home-section-sub" style={{ maxWidth: '680px', margin: '0 auto 28px' }}>
                Connect with verified Maanmitra Partners for warm, judgment-free conversations whenever you need someone to listen.
              </p>

              <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/register" className="mm-btn-hero-primary">
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/become-partner" className="mm-btn-hero-secondary">
                  <span>Become a Partner</span>
                </Link>
              </div>
            </div>

            {/* 4 Steps Row */}
            <div className="mm-hiw-steps-row" style={{ marginTop: '48px' }}>
              {steps.map((st) => (
                <div key={st.num} className="mm-hiw-card">
                  <div className="mm-hiw-step-circle">{st.num}</div>
                  <h3 className="mm-hiw-card-title">{st.title}</h3>
                  <p className="mm-hiw-card-text">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety, Privacy & Reassurance Section */}
        <section className="mm-section-wrap mm-bg-white">
          <div className="mm-container">
            <div className="mm-section-header-center">
              <span className="mm-pricing-tag">TRUST &amp; SAFETY</span>
              <h2 className="mm-home-section-title">
                Safe, Confidential &amp; Respectful Always
              </h2>
              <p className="mm-home-section-sub">
                We take privacy and emotional well-being seriously. Here is what you can always rely on:
              </p>
            </div>

            <div className="mm-why-grid-4">
              <div className="mm-why-card">
                <div className="mm-why-icon-box" style={{ background: '#EAF8EE' }}>
                  <ShieldCheck size={26} color="#22A447" />
                </div>
                <h3 className="mm-why-card-title">Verified Identities</h3>
                <p className="mm-why-card-text">
                  All companions pass government ID verification (Aadhaar/PAN/DL) before receiving sessions.
                </p>
              </div>

              <div className="mm-why-card">
                <div className="mm-why-icon-box" style={{ background: 'var(--mm-blush)' }}>
                  <PhoneOff size={26} color="var(--mm-rose)" />
                </div>
                <h3 className="mm-why-card-title">Zero Phone Sharing</h3>
                <p className="mm-why-card-text">
                  All conversations run in-browser. Your personal phone number is never disclosed.
                </p>
              </div>

              <div className="mm-why-card">
                <div className="mm-why-icon-box" style={{ background: '#FAF3E8' }}>
                  <Lock size={26} color="var(--mm-gold)" />
                </div>
                <h3 className="mm-why-card-title">Encrypted Rooms</h3>
                <p className="mm-why-card-text">
                  Peer-to-peer WebRTC and WebSocket channels ensure private, unrecorded conversations.
                </p>
              </div>

              <div className="mm-why-card">
                <div className="mm-why-icon-box" style={{ background: '#FEECEE' }}>
                  <Heart size={26} color="var(--mm-rose)" />
                </div>
                <h3 className="mm-why-card-title">Respect &amp; Dignity</h3>
                <p className="mm-why-card-text">
                  Strict community standards protecting both members and companions against inappropriate conduct.
                </p>
              </div>
            </div>

            <div className="mm-companion-notice" style={{ marginTop: '40px', maxWidth: '880px', margin: '40px auto 0' }}>
              <AlertCircle size={22} color="var(--mm-plum)" style={{ flexShrink: 0 }} />
              <div>
                <strong>Scope Notice:</strong> Maanmitra Partners provide active listening and social friendship. Our partners are friendly companions, not licensed psychiatrists, therapists, or medical doctors. If you are experiencing acute distress or thoughts of self-harm, please reach out to professional emergency helplines.
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link to="/register" className="mm-btn-hero-primary" style={{ display: 'inline-flex' }}>
                <span>Get Started</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
