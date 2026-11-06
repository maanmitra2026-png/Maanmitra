import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Lock,
  Headphones,
  Heart,
  MessageSquare,
  Home as HomeIcon,
  HeartHandshake,
  ArrowRight,
  User,
  Calendar,
  Video,
  Sparkles,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import CounsellingBookingModal from '../../components/common/CounsellingBookingModal';
import '../../counselling_services.css';

export default function ServicesPage() {
  const navigate = useNavigate();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState('Relationship Counselling');

  const openBookingWithService = (serviceName) => {
    setSelectedServiceForBooking(serviceName);
    setBookingModalOpen(true);
  };

  const scrollToOfferings = () => {
    const el = document.getElementById('what-we-offer');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mm-cs-page">
      {/* 1. NAVBAR */}
      <PublicNavbar />

      <main id="main-content">
        {/* ===================================================================
            2. HERO SECTION
            =================================================================== */}
        <section className="mm-cs-hero-section" aria-labelledby="services-hero-heading">
          <div className="mm-cs-hero-container">
            {/* Left Content */}
            <div className="mm-cs-hero-left">
              <span className="mm-cs-tag-badge">OUR SERVICES</span>

              <h1 id="services-hero-heading" className="mm-cs-hero-title">
                Comprehensive<br />
                Relationship Support<br />
                for a <span className="highlight">Happier Tomorrow</span>
              </h1>

              <p className="mm-cs-hero-desc">
                Explore our trusted services designed to help you find the right partner, get professional guidance and build stronger relationships.
              </p>

              {/* 4 Icon Highlights Row */}
              <div className="mm-cs-hero-trust-row" aria-label="Key Service Highlights">
                <div className="mm-cs-trust-card">
                  <div className="mm-cs-trust-icon-wrap">
                    <ShieldCheck size={22} />
                  </div>
                  <span className="mm-cs-trust-label">Trusted &amp; Secure Platform</span>
                </div>

                <div className="mm-cs-trust-card">
                  <div className="mm-cs-trust-icon-wrap">
                    <Users size={22} />
                  </div>
                  <span className="mm-cs-trust-label">Verified Professionals</span>
                </div>

                <div className="mm-cs-trust-card">
                  <div className="mm-cs-trust-icon-wrap">
                    <Lock size={22} />
                  </div>
                  <span className="mm-cs-trust-label">Privacy Protected</span>
                </div>

                <div className="mm-cs-trust-card">
                  <div className="mm-cs-trust-icon-wrap">
                    <Headphones size={22} />
                  </div>
                  <span className="mm-cs-trust-label">Support at Every Step</span>
                </div>
              </div>
            </div>

            {/* Right Visual Artwork */}
            <div className="mm-cs-hero-visual">
              <div className="mm-cs-hero-image-wrap">
                <img
                  src="/hd_asset_hero_romantic_couple.jpg"
                  alt="Couple looking at sunset together"
                  className="mm-cs-hero-main-img"
                  loading="eager"
                />

                {/* Handwritten Floating Label */}
                <div className="mm-cs-hero-handwritten" aria-hidden="true">
                  <span>Meaningful Connections Begin Here &#x2661;</span>
                </div>

                {/* Floating Bottom Card */}
                <div className="mm-cs-hero-floating-card">
                  <div className="mm-cs-floating-icon-wrap">
                    <Heart size={18} fill="#E91E63" color="#E91E63" />
                  </div>
                  <span className="mm-cs-floating-text">
                    Guidance Today for Stronger Relationships Tomorrow
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            3. "WHAT WE OFFER" SECTION (4 Core Services Cards)
            =================================================================== */}
        <section id="what-we-offer" className="mm-cs-services-grid-section" aria-labelledby="offer-title">
          <div className="mm-cs-container">
            <div className="mm-cs-section-header">
              <span className="mm-cs-eyebrow">&mdash; OUR SERVICES &mdash;</span>
              <h2 id="offer-title" className="mm-cs-section-title">What We Offer</h2>
              <p className="mm-cs-section-subtitle">
                Wide range of services to support you at every stage of your relationship journey.
              </p>
            </div>

            {/* 4 Cards Grid */}
            <div className="mm-cs-cards-grid-4">
              {/* Card 1: Partner Discovery */}
              <article className="mm-cs-service-card">
                <div className="mm-cs-card-img-wrap">
                  <img
                    src="/card1-clean.jpg"
                    alt="Smiling young couple enjoying moment together"
                    className="mm-cs-card-img"
                    loading="lazy"
                  />
                  <div className="mm-cs-card-icon-pill">
                    <div className="mm-cs-card-icon-inner rose">
                      <Users size={18} />
                    </div>
                  </div>
                </div>

                <div className="mm-cs-card-body">
                  <h3 className="mm-cs-card-title">Partner Discovery</h3>
                  <p className="mm-cs-card-desc">
                    Find compatible people based on your values, interests and lifestyle.
                  </p>
                  <Link to="/register" className="mm-cs-card-link">
                    <span>Learn More</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </article>

              {/* Card 2: Relationship Counselling */}
              <article className="mm-cs-service-card">
                <div className="mm-cs-card-img-wrap">
                  <img
                    src="/hd_asset_card2_counselor_blazer.jpg"
                    alt="Professional female relationship counselor smiling in consultation room"
                    className="mm-cs-card-img"
                    loading="lazy"
                  />
                  <div className="mm-cs-card-icon-pill">
                    <div className="mm-cs-card-icon-inner plum">
                      <MessageSquare size={18} />
                    </div>
                  </div>
                </div>

                <div className="mm-cs-card-body">
                  <h3 className="mm-cs-card-title">Relationship Counselling</h3>
                  <p className="mm-cs-card-desc">
                    Get professional guidance from certified counsellors for a healthier relationship.
                  </p>
                  <Link to="/counselling?category=relationship" className="mm-cs-card-link">
                    <span>Learn More</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </article>

              {/* Card 3: Live-in Relationship Guidance */}
              <article className="mm-cs-service-card">
                <div className="mm-cs-card-img-wrap">
                  <img
                    src="/hd_asset_card3_house_hands.jpg"
                    alt="Hands carefully cupping a wooden house model with red heart"
                    className="mm-cs-card-img"
                    loading="lazy"
                  />
                  <div className="mm-cs-card-icon-pill">
                    <div className="mm-cs-card-icon-inner gold">
                      <HomeIcon size={18} />
                    </div>
                  </div>
                </div>

                <div className="mm-cs-card-body">
                  <h3 className="mm-cs-card-title">Live-in Relationship Guidance</h3>
                  <p className="mm-cs-card-desc">
                    Learn and plan your shared future with the right support and information.
                  </p>
                  <Link to="/counselling?category=livein" className="mm-cs-card-link">
                    <span>Learn More</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </article>

              {/* Card 4: Family Counselling */}
              <article className="mm-cs-service-card">
                <div className="mm-cs-card-img-wrap">
                  <img
                    src="/services_family.jpg"
                    alt="Couple consulting with professional family guidance advisor"
                    className="mm-cs-card-img"
                    loading="lazy"
                  />
                  <div className="mm-cs-card-icon-pill">
                    <div className="mm-cs-card-icon-inner pink">
                      <HeartHandshake size={18} />
                    </div>
                  </div>
                </div>

                <div className="mm-cs-card-body">
                  <h3 className="mm-cs-card-title">Family Counselling</h3>
                  <p className="mm-cs-card-desc">
                    Resolve family concerns and strengthen relationships with expert support.
                  </p>
                  <Link to="/counselling?category=family" className="mm-cs-card-link">
                    <span>Learn More</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ===================================================================
            4. "WHY CHOOSE MAANMITRA?" SECTION
            =================================================================== */}
        <section className="mm-cs-why-section" aria-labelledby="why-title">
          <div className="mm-cs-container">
            <h2 id="why-title" className="mm-cs-section-title" style={{ textAlign: 'center' }}>
              Why Choose MAANMITRA?
            </h2>

            <div className="mm-cs-why-grid">
              <div className="mm-cs-why-card">
                <div className="mm-cs-why-icon-wrap">
                  <ShieldCheck size={22} />
                </div>
                <span className="mm-cs-why-text">Professional &amp; Verified Counsellors</span>
              </div>

              <div className="mm-cs-why-card">
                <div className="mm-cs-why-icon-wrap">
                  <Lock size={20} />
                </div>
                <span className="mm-cs-why-text">Confidential &amp; Safe Sessions</span>
              </div>

              <div className="mm-cs-why-card">
                <div className="mm-cs-why-icon-wrap">
                  <Heart size={20} fill="#E91E63" color="#E91E63" />
                </div>
                <span className="mm-cs-why-text">Personalized Guidance</span>
              </div>

              <div className="mm-cs-why-card">
                <div className="mm-cs-why-icon-wrap">
                  <Users size={20} />
                </div>
                <span className="mm-cs-why-text">Support for Every Relationship Stage</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            5. "HOW IT WORKS" 4-STEP PROCESS
            =================================================================== */}
        <section className="mm-cs-how-section" aria-labelledby="steps-title">
          <div className="mm-cs-container">
            <div className="mm-cs-section-header">
              <span className="mm-cs-eyebrow">&mdash; HOW IT WORKS &mdash;</span>
              <h2 id="steps-title" className="mm-cs-section-title">
                Get the Support You Need in Simple Steps
              </h2>
            </div>

            <div className="mm-cs-steps-row">
              {/* Step 1 */}
              <div className="mm-cs-step-col">
                <div className="mm-cs-step-circle">
                  <User size={24} />
                </div>
                <h3 className="mm-cs-step-title">1. Explore Services</h3>
                <p className="mm-cs-step-desc">
                  Browse our services and choose what you need.
                </p>
              </div>

              <div className="mm-cs-step-arrow" aria-hidden="true">
                <ArrowRight size={22} />
              </div>

              {/* Step 2 */}
              <div className="mm-cs-step-col">
                <div className="mm-cs-step-circle">
                  <Calendar size={24} />
                </div>
                <h3 className="mm-cs-step-title">2. Book a Session</h3>
                <p className="mm-cs-step-desc">
                  Select counsellor, date and session type.
                </p>
              </div>

              <div className="mm-cs-step-arrow" aria-hidden="true">
                <ArrowRight size={22} />
              </div>

              {/* Step 3 */}
              <div className="mm-cs-step-col">
                <div className="mm-cs-step-circle">
                  <Video size={24} />
                </div>
                <h3 className="mm-cs-step-title">3. Connect</h3>
                <p className="mm-cs-step-desc">
                  Join your session online or in-person.
                </p>
              </div>

              <div className="mm-cs-step-arrow" aria-hidden="true">
                <ArrowRight size={22} />
              </div>

              {/* Step 4 */}
              <div className="mm-cs-step-col">
                <div className="mm-cs-step-circle">
                  <Heart size={24} fill="#E91E63" color="#E91E63" />
                </div>
                <h3 className="mm-cs-step-title">4. Get Guidance</h3>
                <p className="mm-cs-step-desc">
                  Receive expert support and take positive steps.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            6. "MORE THAN JUST A PLATFORM" (Split Section)
            =================================================================== */}
        <section className="mm-cs-platform-section" aria-label="Our Supportive Ecosystem">
          <div className="mm-cs-container">
            <div className="mm-cs-platform-banner">
              {/* Left Image */}
              <div className="mm-cs-platform-img-wrap">
                <img
                  src="/services_laptop_couple.jpg"
                  alt="Young couple smiling while browsing together on a laptop"
                  className="mm-cs-platform-img"
                  loading="lazy"
                />
              </div>

              {/* Center Content */}
              <div className="mm-cs-platform-center">
                <h3>More Than Just a Platform</h3>
                <p>
                  MAANMITRA is a service provider focused on creating a supportive ecosystem for meaningful relationships through partner discovery, expert counselling and guided support.
                </p>
                <button
                  type="button"
                  onClick={scrollToOfferings}
                  className="mm-cs-btn-rose"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Right Audience Pills */}
              <div className="mm-cs-platform-list">
                <div className="mm-cs-platform-pill">
                  <Heart size={16} className="pill-icon" fill="#E91E63" />
                  <span>Individuals</span>
                </div>
                <div className="mm-cs-platform-pill">
                  <Users size={16} className="pill-icon" />
                  <span>Couples</span>
                </div>
                <div className="mm-cs-platform-pill">
                  <HomeIcon size={16} className="pill-icon" />
                  <span>Families</span>
                </div>
                <div className="mm-cs-platform-pill">
                  <HeartHandshake size={16} className="pill-icon" />
                  <span>Live-in Couples</span>
                </div>
                <div className="mm-cs-platform-pill">
                  <Sparkles size={16} className="pill-icon" />
                  <span>Personal Growth</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            7. BOTTOM CALL TO ACTION BANNER
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
                  Explore our services and get expert guidance today.
                </p>
                <button
                  type="button"
                  onClick={() => openBookingWithService('Relationship Counselling')}
                  className="mm-cs-btn-white-pill"
                >
                  <span>Book a Session</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Right Sunset Couple Illustration */}
              <div className="mm-cs-cta-right-visual" aria-hidden="true">
                <span className="mm-cs-cta-heart-art">&#x2661;</span>
                <img
                  src="/cta-couple-clean.png"
                  alt=""
                  className="mm-cs-cta-img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. FOOTER */}
      <PublicFooter />

      {/* 9. INTERACTIVE BOOKING MODAL */}
      <CounsellingBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialCategory={selectedServiceForBooking}
      />
    </div>
  );
}

