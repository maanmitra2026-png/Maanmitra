import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Heart,
  Video,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Compass,
  Lock,
  Headphones,
  Mail,
  ArrowRight,
  Sparkles,
  PhoneCall,
  MessageSquare
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import '../../counselling_services.css';

const faqCategories = [
  { id: 'all', label: 'All Questions', icon: Sparkles },
  { id: 'counselling', label: 'Counselling & Sessions', icon: Heart },
  { id: 'services', label: 'Services & Platform', icon: Compass },
  { id: 'privacy', label: 'Privacy & Safety', icon: Lock },
  { id: 'payments', label: 'Payments & Bookings', icon: CreditCard },
  { id: 'partners', label: 'Becoming a Partner', icon: UserCheck }
];

const faqsData = [
  {
    category: 'counselling',
    q: 'Are the counselling sessions completely confidential?',
    a: 'Yes, absolutely. All sessions adhere to strict clinical confidentiality guidelines and ethical codes. Conversations take place via private, end-to-end encrypted rooms, are never recorded, and personal contact details are never disclosed to third parties.'
  },
  {
    category: 'counselling',
    q: 'What is the difference between individual, couple, and premarital counselling?',
    a: 'Individual counselling focuses on personal emotional grounding and self-growth. Couple counselling addresses relational friction, communication blocks, and restoring emotional trust. Premarital guidance helps partners align their life visions, values, family expectations, and financial boundaries before marriage.'
  },
  {
    category: 'counselling',
    q: 'Can I choose between online video calls, audio, and in-person consultations?',
    a: 'Yes. You can select your preferred session mode directly during booking. Most members choose secure browser-based video or audio calls, but selected verified counsellors also offer in-person clinic visits depending on their location and schedule.'
  },
  {
    category: 'counselling',
    q: 'How long is a counselling session, and what should I expect?',
    a: 'Standard counselling sessions are 45 to 60 minutes. Your counsellor will listen without judgment, help identify core patterns, and collaboratively create practical strategies for emotional harmony and constructive communication.'
  },
  {
    category: 'services',
    q: 'What services does MAANMITRA provide?',
    a: 'MAANMITRA is an integrated relationship support ecosystem offering verified Partner Discovery, certified Relationship & Family Counselling, Live-in Guidance, and emotional well-being mentorship for individuals and couples.'
  },
  {
    category: 'services',
    q: 'How do I choose the right counsellor for my situation?',
    a: 'You can browse our Certified Counsellors directory, filter by specialization (Relationship, Couple, Premarital, Live-in, Family), language (Hindi, English, Marathi, Bengali, Tamil), and view full verified credentials and client ratings before booking.'
  },
  {
    category: 'services',
    q: 'Is MAANMITRA suitable for live-in relationship advice and legal awareness?',
    a: 'Yes. We offer specialized Live-in Relationship Guidance covering legal rights in India, cohabitation expectations, shared domestic agreements, and personal boundary setting with certified behavioral and legal experts.'
  },
  {
    category: 'privacy',
    q: 'Is my phone number or real identity ever revealed?',
    a: 'Never. Your personal phone number is 100% masked. All communication takes place securely inside our browser-based platform without disclosing personal contact numbers or private identifiers.'
  },
  {
    category: 'privacy',
    q: 'Are sessions recorded or monitored by MAANMITRA?',
    a: 'No, never. We enforce a strict zero-recording policy. Video and audio streams are private peer connections with zero surveillance, transcription, or archival.'
  },
  {
    category: 'payments',
    q: 'What payment methods are supported?',
    a: 'We support all major secure payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit & Debit cards (Visa, Mastercard, RuPay), and NetBanking through encrypted, PCI-DSS compliant payment gateways.'
  },
  {
    category: 'payments',
    q: 'Can I reschedule or cancel a session?',
    a: 'Yes. Free rescheduling and cancellations are available up to 4 hours before your scheduled session time directly from your member dashboard.'
  },
  {
    category: 'payments',
    q: 'Will I receive a receipt and booking confirmation?',
    a: 'Yes. Immediately upon reservation, you receive a booking confirmation code, calendar invite, and email receipt with session access links.'
  },
  {
    category: 'partners',
    q: 'Who can apply to become a MAANMITRA Partner or Counsellor?',
    a: 'We welcome qualified Relationship Counsellors, Clinical Psychologists, Life Coaches, Subject Matter Experts (legal & financial relationship advisors), and verified service providers passionate about emotional well-being.'
  },
  {
    category: 'partners',
    q: 'How does the onboarding and credential verification process work?',
    a: 'After submitting your application on the "Become a Partner" page, our credential committee reviews your formal qualifications, license number, and experience within 24 to 48 hours before profile verification and onboarding.'
  }
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndices, setOpenIndices] = useState(new Set([0, 1]));

  const toggleAccordion = (index) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const filteredFaqs = useMemo(() => {
    return faqsData.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchQ = item.q.toLowerCase().includes(query);
        const matchA = item.a.toLowerCase().includes(query);
        if (!matchQ && !matchA) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="mm-cs-page">
      {/* 1. NAVBAR */}
      <PublicNavbar />

      <main id="main-content">
        {/* ===================================================================
            2. HERO SECTION
            =================================================================== */}
        <section className="mm-cs-hero-section" style={{ padding: '48px 0 36px', textAlign: 'center' }}>
          <div className="mm-cs-container" style={{ maxWidth: '820px' }}>
            <span className="mm-cs-tag-badge">HELP &amp; SUPPORT CENTER</span>

            <h1 className="mm-cs-hero-title" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', marginBottom: '14px' }}>
              Frequently Asked <span className="highlight">Questions</span>
            </h1>

            <p className="mm-cs-hero-desc" style={{ maxWidth: '640px', margin: '0 auto 28px' }}>
              Find quick answers to common questions about MAANMITRA services, counselling sessions, privacy, payments, and partner opportunities.
            </p>

            {/* Interactive Search Box */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #F0DCE8',
                borderRadius: '9999px',
                padding: '8px 14px 8px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 12px 36px rgba(74, 21, 75, 0.08)',
                maxWidth: '620px',
                margin: '0 auto'
              }}
            >
              <Search size={20} color="#8E7B89" />
              <input
                type="text"
                placeholder="Search questions by topic, keyword, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.94rem',
                  color: '#4A154B',
                  flex: 1,
                  background: 'transparent'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8E7B89',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    padding: '0 6px'
                  }}
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================================
            3. CATEGORIES FILTER TABS
            =================================================================== */}
        <section style={{ padding: '24px 0 16px', background: '#FFFFFF' }}>
          <div className="mm-cs-container" style={{ maxWidth: '980px' }}>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '10px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              {faqCategories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      background: isActive ? '#E91E63' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#4A154B',
                      border: isActive ? '1px solid #E91E63' : '1px solid #F0DCE8',
                      borderRadius: '9999px',
                      padding: '10px 20px',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: isActive ? '0 6px 18px rgba(233, 30, 99, 0.25)' : '0 2px 8px rgba(74, 21, 75, 0.04)'
                    }}
                  >
                    <Icon size={16} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================================================================
            4. ACCORDION FAQ CARDS LIST
            =================================================================== */}
        <section style={{ padding: '36px 0 68px', background: '#FFFFFF' }}>
          <div className="mm-cs-container" style={{ maxWidth: '920px' }}>
            {filteredFaqs.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  background: '#FFF8FA',
                  borderRadius: '24px',
                  border: '1.5px solid #F0DCE8'
                }}
              >
                <HelpCircle size={44} color="#E91E63" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#4A154B', marginBottom: '8px' }}>
                  No matching questions found
                </h3>
                <p style={{ color: '#634C5F', fontSize: '0.9rem', marginBottom: '18px' }}>
                  Try searching with different keywords or browse all questions.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="mm-cs-btn-rose"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = openIndices.has(idx);
                  return (
                    <article
                      key={idx}
                      style={{
                        background: '#FFFFFF',
                        border: isOpen ? '1.5px solid #E91E63' : '1.5px solid #F0DCE8',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: isOpen ? '0 12px 32px rgba(233, 30, 99, 0.1)' : '0 4px 16px rgba(74, 21, 75, 0.03)',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(idx)}
                        aria-expanded={isOpen}
                        style={{
                          width: '100%',
                          padding: '22px 26px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '1.12rem',
                            fontWeight: 700,
                            color: '#4A154B',
                            lineHeight: 1.35
                          }}
                        >
                          {faq.q}
                        </span>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isOpen ? '#FFE7EF' : '#FFF8FA',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#E91E63',
                            flexShrink: 0,
                            transform: isOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.25s ease'
                          }}
                        >
                          <ChevronDown size={18} />
                        </div>
                      </button>

                      {isOpen && (
                        <div
                          style={{
                            padding: '0 26px 22px',
                            fontSize: '0.92rem',
                            color: '#634C5F',
                            lineHeight: 1.65,
                            borderTop: '1px solid #F6EAF0',
                            paddingTop: '16px'
                          }}
                        >
                          {faq.a}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            {/* ===============================================================
                5. "STILL HAVE QUESTIONS?" SUPPORT CARD
                =============================================================== */}
            <div
              style={{
                marginTop: '56px',
                background: '#FFF8FA',
                border: '1.5px solid #F0DCE8',
                borderRadius: '26px',
                padding: '36px 32px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '24px',
                alignItems: 'center'
              }}
            >
              <div>
                <span className="mm-cs-eyebrow" style={{ marginBottom: '4px' }}>DIRECT ASSISTANCE</span>
                <h3
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#4A154B',
                    margin: '0 0 8px'
                  }}
                >
                  Still Have Questions?
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#634C5F', margin: 0, lineHeight: 1.55 }}>
                  Our caring support team is available 7 days a week to guide you with any questions.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                <Link
                  to="/contact"
                  className="mm-cs-btn-rose"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Headphones size={17} />
                  <span>Contact Support</span>
                </Link>

                <Link
                  to="/counselling"
                  className="mm-cs-btn-white-pill"
                  style={{
                    border: '1.5px solid #E91E63',
                    color: '#E91E63',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Heart size={16} fill="#E91E63" />
                  <span>Explore Counselling</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            6. BOTTOM CALL TO ACTION BANNER
            =================================================================== */}
        <section className="mm-cs-cta-section" aria-label="Book a Session">
          <div className="mm-cs-container">
            <div className="mm-cs-cta-banner">
              <div className="mm-cs-cta-left">
                <h2 className="mm-cs-cta-title">
                  Take the First Step<br />
                  Towards a Happier You
                </h2>
                <p className="mm-cs-cta-sub">
                  Connect with verified professionals and start building healthier relationships today.
                </p>
                <Link to="/counselling" className="mm-cs-btn-white-pill">
                  <span>Book a Session</span>
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Right Sunset Couple Illustration */}
              <div className="mm-cs-cta-right-visual" aria-hidden="true">
                <span className="mm-cs-cta-heart-art">&#x2661;</span>
                <img
                  src="/services_laptop_couple.jpg"
                  alt=""
                  className="mm-cs-cta-img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <PublicFooter />
    </div>
  );
}

