import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, ShieldCheck, Sparkles, CheckCircle2, HelpCircle,
  Mail, Phone, MapPin, ArrowRight, Clock, Star, MessageSquare,
  Lock, AlertTriangle, Users, Award, Check, Video, Headphones,
  Calendar, DollarSign, UserCheck, Shield, ChevronDown
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

// ---------------------------------------------------------------------------
// 1. ABOUT PAGE
// ---------------------------------------------------------------------------
export function AboutPage() {
  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />
      <div className="mm-static-hero">
        <div className="mm-container">
          <div className="mm-badge-gold"><Heart size={14} /> Our Mission</div>
          <h1 className="mm-static-title">A Warm Listening Friend In Every Moment</h1>
          <p className="mm-static-subtitle">
            MAANMITRA was born out of a simple, profound truth: in today's busy world, everyone deserves a kind, attentive companion to talk to without fear of judgment.
          </p>
        </div>
      </div>

      <div className="mm-container" style={{ padding: '40px 16px 80px' }}>
        <div className="mm-content-card">
          <h2>Who We Are</h2>
          <p>
            MAANMITRA is India's dedicated emotional companionship and friendly listening platform. We connect members with verified female companions--our <strong>Maanmitra Partners</strong>--for heartfelt conversations, sharing thoughts about everyday routine, books, passions, and life experiences.
          </p>

          <div className="mm-grid-3" style={{ marginTop: '30px' }}>
            <div className="mm-feature-box">
              <ShieldCheck size={28} color="var(--mm-rose)" />
              <h3>Safe & Confidential</h3>
              <p>Every conversation is end-to-end encrypted and completely confidential. Your identity and phone numbers are never disclosed.</p>
            </div>
            <div className="mm-feature-box">
              <CheckCircle2 size={28} color="var(--mm-success)" />
              <h3>Verified Partners</h3>
              <p>Every Maanmitra Partner undergoes government ID verification, background screening, and conversational onboarding.</p>
            </div>
            <div className="mm-feature-box">
              <Heart size={28} color="var(--mm-plum)" />
              <h3>Zero Judgment</h3>
              <p>A welcoming space where you can share your thoughts, relieve daily stress, and be your authentic self.</p>
            </div>
          </div>

          <div className="mm-companion-notice" style={{ marginTop: '40px' }}>
            <AlertTriangle size={20} color="var(--mm-plum)" />
            <div>
              <strong>Important Scope Boundary:</strong> Maanmitra Partners provide active listening and social friendship. Our partners are companions, not licensed psychiatrists, doctors, or therapists. For medical emergencies or acute psychological crises, please contact emergency helplines.
            </div>
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. CONVERSATION PACKAGES / PRICING PAGE
// ---------------------------------------------------------------------------
export function PricingPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const packages = [
    {
      id: 'chat_15',
      name: '15-Minute Friendly Chat',
      type: 'Chat',
      badge: 'Affordable',
      icon: <MessageSquare size={24} color="var(--mm-rose)" />,
      description: 'Fast and friendly real-time text chat session with your companion.',
      price: 99,
      duration: '15 Minutes Duration',
      features: [
        '15 Minutes Duration',
        'Text Chat',
        'Private & Secure',
        'KYC Verified Partner'
      ]
    },
    {
      id: 'audio_30',
      name: '30-Minute Audio Conversation',
      type: 'Audio Call',
      badge: 'Most Popular',
      highlight: true,
      icon: <Headphones size={24} color="var(--mm-rose)" />,
      description: 'Heart-to-heart voice call with a listening friend. High clarity and private.',
      price: 299,
      duration: '30 Minutes Duration',
      features: [
        '30 Minutes Duration',
        'Audio Call',
        'Private & Secure',
        'KYC Verified Partner'
      ]
    },
    {
      id: 'video_30',
      name: '30-Minute Video Conversation',
      type: 'Video Call',
      badge: 'Best Value',
      icon: <Video size={24} color="var(--mm-rose)" />,
      description: 'Face-to-face friendly video conversation with warm smiles and genuine connection.',
      price: 499,
      duration: '30 Minutes Duration',
      features: [
        '30 Minutes Duration',
        'Video Call',
        'Private & Secure',
        'KYC Verified Partner'
      ]
    },
    {
      id: 'extended_60',
      name: 'Extended Friendly Talk',
      type: 'Deep Talk',
      badge: 'Deep Talk',
      icon: <Heart size={24} color="var(--mm-rose)" />,
      description: 'Unwind and talk freely with an extended 60-minute conversational session.',
      price: 599,
      duration: '60 Minutes Duration',
      features: [
        '60 Minutes Duration',
        'Chat / Audio / Video (As per availability)',
        'Private & Secure',
        'KYC Verified Partner'
      ]
    }
  ];

  const filteredPackages = packages.filter(pkg => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Chat') return pkg.type === 'Chat';
    if (selectedFilter === 'Audio Call') return pkg.type === 'Audio Call';
    if (selectedFilter === 'Video Call') return pkg.type === 'Video Call';
    return true;
  });

  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />

      <main id="main-content">
        <section className="mm-pricing-hero-wrap">
          <div className="mm-container">
            <div className="mm-section-header-center">
              <span className="mm-pricing-tag">TRANSPARENT PRICING</span>
              <h1 className="mm-packages-heading">Conversation Packages</h1>
              <p className="mm-packages-sub">
                Simple, affordable and meaningful conversations.
              </p>

              {/* Filter Pills */}
              <div className="mm-pricing-filter-pills" role="tablist" aria-label="Filter packages by type">
                {['All Packages', 'Chat', 'Audio Call', 'Video Call'].map((tab) => {
                  const filterVal = tab === 'All Packages' ? 'All' : tab;
                  const active = selectedFilter === filterVal;
                  return (
                    <button
                      key={tab}
                      onClick={() => setSelectedFilter(filterVal)}
                      className={`mm-pricing-pill-btn ${active ? 'active' : ''}`}
                      role="tab"
                      aria-selected={active}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4 Balanced Pricing Cards */}
            <div className="mm-packages-grid-4">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`mm-package-card ${pkg.highlight ? 'popular-card' : ''}`}
                >
                  <div className="mm-card-top-badge-row">
                    <span className={`mm-pkg-pill-badge ${pkg.highlight ? 'highlight' : ''}`}>
                      {pkg.badge}
                    </span>
                  </div>

                  <div className="mm-pkg-icon-box">
                    {pkg.icon}
                  </div>

                  <h3 className="mm-pkg-card-title">{pkg.name}</h3>
                  <p className="mm-pkg-card-desc">{pkg.description}</p>

                  <div className="mm-pkg-price-row">
                    <span className="mm-pkg-currency">₹</span>
                    <span className="mm-pkg-price-num">{pkg.price}</span>
                    <span className="mm-pkg-price-period">/ session</span>
                  </div>

                  <div className="mm-pkg-features-list">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="mm-pkg-feat-item">
                        {feat.includes('Duration') ? (
                          <Clock size={15} color="var(--mm-rose)" />
                        ) : (
                          <Check size={15} color="var(--mm-success)" />
                        )}
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mm-pkg-btn-wrap">
                    <Link
                      to="/explore"
                      className={`mm-btn-package-cta ${pkg.highlight ? 'highlight' : ''}`}
                    >
                      Choose a Companion
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Compare Packages Table */}
            <div className="mm-compare-section">
              <div className="mm-section-header-center">
                <h2 className="mm-compare-title">Compare Packages</h2>
                <p className="mm-compare-sub">
                  Find the right conversation package for your needs.
                </p>
              </div>

              <div className="mm-compare-table-wrap">
                <table className="mm-compare-table" aria-label="Compare conversation packages">
                  <thead>
                    <tr>
                      <th scope="col" className="text-left">Features</th>
                      <th scope="col">15-Min Chat</th>
                      <th scope="col">30-Min Audio</th>
                      <th scope="col">30-Min Video</th>
                      <th scope="col">60-Min Extended</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="feature-name">Session Duration</td>
                      <td>15 Minutes</td>
                      <td>30 Minutes</td>
                      <td>30 Minutes</td>
                      <td>60 Minutes</td>
                    </tr>
                    <tr>
                      <td className="feature-name">Text Chat</td>
                      <td><Check size={18} color="var(--mm-success)" /></td>
                      <td><Check size={18} color="var(--mm-success)" /></td>
                      <td><span className="dash">--</span></td>
                      <td><Check size={18} color="var(--mm-success)" /></td>
                    </tr>
                    <tr>
                      <td className="feature-name">Audio Call</td>
                      <td><span className="dash">--</span></td>
                      <td><Check size={18} color="var(--mm-success)" /></td>
                      <td><span className="dash">--</span></td>
                      <td><span className="optional-tag"><Check size={15} color="var(--mm-success)" /> (optional)</span></td>
                    </tr>
                    <tr>
                      <td className="feature-name">Video Call</td>
                      <td><span className="dash">--</span></td>
                      <td><span className="dash">--</span></td>
                      <td><Check size={18} color="var(--mm-success)" /></td>
                      <td><span className="optional-tag"><Check size={15} color="var(--mm-success)" /> (optional)</span></td>
                    </tr>
                    <tr>
                      <td className="feature-name">Private &amp; Secure</td>
                      <td><Check size={18} color="var(--mm-success)" /></td>
                      <td><Check size={18} color="var(--mm-success)" /></td>
                      <td><Check size={18} color="var(--mm-success)" /></td>
                      <td><Check size={18} color="var(--mm-success)" /></td>
                    </tr>
                    <tr>
                      <td className="feature-name">KYC Verified Partner</td>
                      <td><Check size={18} color="var(--mm-success)" /></td>
                      <td><Check size={18} color="var(--mm-success)" /></td>
                      <td><Check size={18} color="var(--mm-success)" /></td>
                      <td><Check size={18} color="var(--mm-success)" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. BECOME A PARTNER PAGE
// ---------------------------------------------------------------------------
export function BecomePartnerPage() {
  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />

      <main id="main-content">
        {/* Hero Section */}
        <section className="mm-become-hero-section" aria-labelledby="become-heading">
          <div className="mm-container">
            <div className="mm-become-hero-grid">
              {/* Left Column Content */}
              <div className="mm-become-hero-content">
                <span className="mm-become-tag">JOIN OUR COMPANION COMMUNITY</span>
                <h1 id="become-heading" className="mm-become-hero-title">
                  Are You a Patient Listener?
                </h1>
                <p className="mm-become-hero-desc">
                  Join MAANMITRA as a registered female companion. Connect with people through respectful conversations and choose your availability according to the platform's policies.
                </p>

                <div className="mm-become-hero-actions">
                  <Link to="/partner/register" className="mm-btn-hero-primary">
                    <span>Apply as a Companion</span>
                    <ArrowRight size={18} />
                  </Link>
                  <a href="#guidelines" className="mm-btn-hero-secondary">
                    <span>Partner Guidelines</span>
                  </a>
                </div>
              </div>

              {/* Right Column Visual with 4 Floating Feature Pills */}
              <div className="mm-become-visual-col">
                <div className="mm-become-img-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=85"
                    alt="Female companion on laptop"
                    className="mm-become-hero-img"
                  />

                  {/* 4 Feature Badges Around Image */}
                  <div className="mm-badge-float badge-pos-1">
                    <Clock size={16} color="var(--mm-rose)" />
                    <span>Flexible Hours</span>
                  </div>
                  <div className="mm-badge-float badge-pos-2">
                    <Heart size={16} color="var(--mm-rose)" />
                    <span>Work from Home</span>
                  </div>
                  <div className="mm-badge-float badge-pos-3">
                    <ShieldCheck size={16} color="#22A447" />
                    <span>Safe &amp; Verified</span>
                  </div>
                  <div className="mm-badge-float badge-pos-4">
                    <Sparkles size={16} color="var(--mm-gold)" />
                    <span>Support &amp; Guidance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works for Partners */}
        <section className="mm-partner-steps-section" aria-labelledby="steps-heading">
          <div className="mm-container">
            <div className="mm-section-header-center">
              <h2 id="steps-heading" className="mm-home-section-title">
                How It Works for Partners
              </h2>
              <p className="mm-home-section-sub">
                A simple 4-step onboarding journey to get started.
              </p>
            </div>

            <div className="mm-hiw-steps-row">
              <div className="mm-hiw-card">
                <div className="mm-hiw-step-circle">1</div>
                <h3 className="mm-hiw-card-title">Apply</h3>
                <p className="mm-hiw-card-text">
                  Create your profile and submit your background and language details.
                </p>
              </div>

              <div className="mm-hiw-card">
                <div className="mm-hiw-step-circle">2</div>
                <h3 className="mm-hiw-card-title">Verification</h3>
                <p className="mm-hiw-card-text">
                  Complete the required identity verification process safely.
                </p>
              </div>

              <div className="mm-hiw-card">
                <div className="mm-hiw-step-circle">3</div>
                <h3 className="mm-hiw-card-title">Approval</h3>
                <p className="mm-hiw-card-text">
                  Our team reviews your application and activates your public companion profile.
                </p>
              </div>

              <div className="mm-hiw-card">
                <div className="mm-hiw-step-circle">4</div>
                <h3 className="mm-hiw-card-title">Start Connecting</h3>
                <p className="mm-hiw-card-text">
                  Set your availability and start connecting with members through respectful conversations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join MAANMITRA */}
        <section className="mm-why-join-section" aria-labelledby="why-heading">
          <div className="mm-container">
            <div className="mm-section-header-center">
              <h2 id="why-heading" className="mm-home-section-title">
                Why Join MAANMITRA?
              </h2>
              <p className="mm-home-section-sub">
                Empowering companions with respect, autonomy, and security.
              </p>
            </div>

            <div className="mm-why-grid-4">
              <div className="mm-why-card">
                <div className="mm-why-icon-box">
                  <Clock size={24} color="var(--mm-rose)" />
                </div>
                <h3 className="mm-why-card-title">Flexible Schedule</h3>
                <p className="mm-why-card-text">
                  Choose your own working hours and take breaks whenever needed.
                </p>
              </div>

              <div className="mm-why-card">
                <div className="mm-why-icon-box">
                  <ShieldCheck size={24} color="var(--mm-rose)" />
                </div>
                <h3 className="mm-why-card-title">Safe &amp; Secure</h3>
                <p className="mm-why-card-text">
                  Verified users, platform moderation, and zero personal phone disclosure.
                </p>
              </div>

              <div className="mm-why-card">
                <div className="mm-why-icon-box">
                  <DollarSign size={24} color="var(--mm-rose)" />
                </div>
                <h3 className="mm-why-card-title">Transparent Payouts</h3>
                <p className="mm-why-card-text">
                  Receive your session compensation according to the platform's transparent policy.
                </p>
              </div>

              <div className="mm-why-card">
                <div className="mm-why-icon-box">
                  <Heart size={24} color="var(--mm-rose)" />
                </div>
                <h3 className="mm-why-card-title">Support Team</h3>
                <p className="mm-why-card-text">
                  Our companion success team is ready to guide and assist you anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guidelines Anchor Section */}
        <section id="guidelines" className="mm-guidelines-section">
          <div className="mm-container" style={{ maxWidth: '960px' }}>
            <div className="mm-content-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Shield color="var(--mm-rose)" size={24} />
                <h2 style={{ fontSize: '1.4rem', color: 'var(--mm-plum)' }}>Partner Guidelines &amp; Dignity Standards</h2>
              </div>
              <p style={{ color: 'var(--mm-secondary-text)', lineHeight: 1.7, marginBottom: '20px' }}>
                At MAANMITRA, our core philosophy is respectful, active, and dignified listening. Partners engage in conversational friendship, active listening, and social support.
              </p>

              <div className="mm-grid-2" style={{ gap: '20px' }}>
                <div style={{ background: 'var(--mm-blush)', padding: '20px', borderRadius: '14px' }}>
                  <h4 style={{ color: 'var(--mm-plum)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} color="var(--mm-success)" /> What Partners Do
                  </h4>
                  <ul style={{ paddingLeft: '20px', color: 'var(--mm-secondary-text)', lineHeight: 1.6, fontSize: '0.92rem' }}>
                    <li>Listen attentively without judgment or unsolicited criticism.</li>
                    <li>Share friendly perspectives on everyday topics, routine, and hobbies.</li>
                    <li>Maintain strict member privacy and confidentiality.</li>
                  </ul>
                </div>

                <div style={{ background: '#FFF5F5', padding: '20px', borderRadius: '14px' }}>
                  <h4 style={{ color: '#C53030', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} color="#C53030" /> Scope Boundaries
                  </h4>
                  <ul style={{ paddingLeft: '20px', color: 'var(--mm-secondary-text)', lineHeight: 1.6, fontSize: '0.92rem' }}>
                    <li>No psychiatric diagnoses, prescriptions, or clinical treatments.</li>
                    <li>No exchange of personal phone numbers, home addresses, or social media.</li>
                    <li>Zero tolerance for harassment, vulgarity, or non-platonic solicitation.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Banner (Deep Plum) */}
        <section className="mm-become-bottom-banner" aria-labelledby="make-diff-heading">
          <div className="mm-container">
            <div className="mm-become-plum-banner">
              <div className="mm-plum-banner-text">
                <h2 id="make-diff-heading" className="mm-plum-banner-title">
                  <span className="underline-gold">Make a Positive Difference</span> With Your Conversations
                </h2>
                <p className="mm-plum-banner-sub">
                  Be a friendly companion, listen, share meaningful moments, and earn from the comfort of your home.
                </p>
                <div style={{ marginTop: '24px' }}>
                  <Link to="/partner/register" className="mm-btn-banner-gold">
                    <span>Apply as a Companion</span>
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>

              <div className="mm-plum-banner-media">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=85"
                  alt="Friendly smiling partner"
                  className="mm-plum-companion-img"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. FAQ PAGE
// ---------------------------------------------------------------------------
export function FAQPage() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'What is MAANMITRA?',
      a: 'MAANMITRA is an emotional companionship and listening web platform. It connects users with verified female companions for friendly conversations, everyday discussions, and mutual comfort.'
    },
    {
      q: 'Are Maanmitra Partners licensed psychologists or doctors?',
      a: 'No. Maanmitra Partners are empathetic listeners and friendly companions. They are NOT certified medical professionals, psychologists, or crisis counsellors. If you are facing severe depression or self-harm thoughts, please reach out to official crisis numbers.'
    },
    {
      q: 'Is my personal phone number or identity revealed?',
      a: 'Never. All conversations take place inside our secure browser-based WebRTC and WebSocket rooms. Your personal phone number, real name, and contact details are 100% private and masked.'
    },
    {
      q: 'How does payment work?',
      a: 'Payments are processed securely via Razorpay. We support UPI, Credit/Debit cards, and NetBanking. Once payment succeeds, your booking slot is confirmed immediately.'
    },
    {
      q: 'Can I cancel or reschedule a booking?',
      a: 'Yes! You can reschedule or cancel any session up to 2 hours prior to the scheduled start time directly from your Member Dashboard.'
    }
  ];

  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />
      <div className="mm-static-hero">
        <div className="mm-container">
          <div className="mm-badge-gold"><HelpCircle size={14} /> Frequently Asked Questions</div>
          <h1 className="mm-static-title">Common Questions &amp; Answers</h1>
          <p className="mm-static-subtitle">Everything you need to know about MAANMITRA.</p>
        </div>
      </div>

      <div className="mm-container" style={{ padding: '40px 16px 80px', maxWidth: '800px' }}>
        <div className="mm-faq-accordion">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`mm-faq-item ${openIdx === idx ? 'open' : ''}`}>
              <button
                className="mm-faq-question"
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                aria-expanded={openIdx === idx}
              >
                <span>{faq.q}</span>
                <span className="mm-faq-arrow">
                  <ChevronDown size={18} style={{ transform: openIdx === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </span>
              </button>
              {openIdx === idx && (
                <div className="mm-faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 5. CONTACT PAGE
// ---------------------------------------------------------------------------
export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />
      <div className="mm-static-hero">
        <div className="mm-container">
          <div className="mm-badge-gold"><Mail size={14} /> Support &amp; Inquiries</div>
          <h1 className="mm-static-title">We Are Here To Assist You</h1>
          <p className="mm-static-subtitle">Reach out to our customer care and trust team anytime.</p>
        </div>
      </div>

      <div className="mm-container" style={{ padding: '40px 16px 80px' }}>
        <div className="mm-grid-2">
          <div className="mm-content-card">
            <h2>Get In Touch</h2>
            <p>Have questions about your booking, payment verification, or companion partnership?</p>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Mail color="var(--mm-rose)" />
                <div>
                  <strong>Email:</strong> support@maanmitra.com
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Clock color="var(--mm-rose)" />
                <div>
                  <strong>Hours:</strong> Mon - Sun, 9:00 AM - 10:00 PM IST
                </div>
              </div>
            </div>
          </div>

          <div className="mm-content-card">
            {submitted ? (
              <div className="mm-alert mm-alert-success">
                <CheckCircle2 size={20} /> Thank you! Your message has been received. Our team will reply within 24 hours.
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <h3>Send Us A Message</h3>
                <div className="mm-form-group">
                  <label className="mm-form-label">Your Name</label>
                  <input type="text" className="mm-input" required />
                </div>
                <div className="mm-form-group">
                  <label className="mm-form-label">Email Address</label>
                  <input type="email" className="mm-input" required />
                </div>
                <div className="mm-form-group">
                  <label className="mm-form-label">Message</label>
                  <textarea rows="4" className="mm-textarea" required></textarea>
                </div>
                <button type="submit" className="mm-btn-primary mm-btn-block">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. TERMS & CONDITIONS
// ---------------------------------------------------------------------------
export function TermsPage() {
  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />
      <div className="mm-container" style={{ padding: '40px 16px 80px', maxWidth: '860px' }}>
        <h1 className="mm-page-title">Terms &amp; Conditions</h1>
        <p style={{ color: 'var(--mm-secondary-text)', marginBottom: '24px' }}>Last updated: October 2026</p>

        <div className="mm-content-card" style={{ lineHeight: '1.7' }}>
          <h3>1. Platform Scope</h3>
          <p>MAANMITRA is an online service facilitating conversational companionship and active listening. It is explicitly not a dating service, adult entertainment platform, or healthcare consultation provider.</p>

          <h3 style={{ marginTop: '20px' }}>2. Code of Conduct</h3>
          <p>All members and partners agree to treat each other with dignity, mutual courtesy, and respect. Inappropriate, offensive, sexually explicit, abusive, or threatening remarks result in immediate termination of sessions and permanent account suspension without refund.</p>

          <h3 style={{ marginTop: '20px' }}>3. Eligibility</h3>
          <p>Users must be at least 18 years of age to access and use MAANMITRA services.</p>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 7. PRIVACY POLICY
// ---------------------------------------------------------------------------
export function PrivacyPage() {
  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />
      <div className="mm-container" style={{ padding: '40px 16px 80px', maxWidth: '860px' }}>
        <h1 className="mm-page-title">Privacy Policy</h1>
        <p style={{ color: 'var(--mm-secondary-text)', marginBottom: '24px' }}>Last updated: October 2026</p>

        <div className="mm-content-card" style={{ lineHeight: '1.7' }}>
          <h3>1. Information Collected</h3>
          <p>We collect essential information to facilitate secure companionship services, including name, email address, encrypted credentials, and transaction records. Identity documents uploaded by partners are encrypted and held in restricted private storage solely for verification.</p>

          <h3 style={{ marginTop: '20px' }}>2. Data Masking</h3>
          <p>Personal phone numbers and private addresses are NEVER shared between users and partners. All communication occurs over secure WebSockets and WebRTC channels.</p>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 8. REFUND & CANCELLATION POLICY
// ---------------------------------------------------------------------------
export function RefundPolicyPage() {
  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />
      <div className="mm-container" style={{ padding: '40px 16px 80px', maxWidth: '860px' }}>
        <h1 className="mm-page-title">Refund &amp; Cancellation Policy</h1>
        <p style={{ color: 'var(--mm-secondary-text)', marginBottom: '24px' }}>Last updated: October 2026</p>

        <div className="mm-content-card" style={{ lineHeight: '1.7' }}>
          <h3>1. Member Cancellations</h3>
          <p>Bookings cancelled at least 2 hours before the scheduled time slot are eligible for a 100% refund or platform credit.</p>

          <h3 style={{ marginTop: '20px' }}>2. Companion Unavailability</h3>
          <p>If a Maanmitra Partner fails to appear for a confirmed session, the user is automatically credited with a 100% full refund to their original payment method.</p>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}
