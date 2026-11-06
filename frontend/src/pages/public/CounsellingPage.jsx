import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Video,
  Heart,
  Users,
  Home as HomeIcon,
  HeartHandshake,
  Search,
  ChevronDown,
  Star,
  GraduationCap,
  MapPin,
  Calendar,
  Phone,
  ArrowRight,
  UserCheck,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import CounsellingBookingModal from '../../components/common/CounsellingBookingModal';
import CounsellorProfileModal from '../../components/common/CounsellorProfileModal';
import '../../counselling_services.css';

// Default Verified Counsellor Profiles matching Reference Image 2
const defaultCounsellors = [
  {
    id: 1,
    name: 'Dr. Ananya Sharma',
    title: 'Relationship Counsellor',
    qualification: 'Ph.D. in Clinical Psychology, M.Phil (NIMHANS)',
    experience_years: 8,
    license_number: 'RCI-PSY-49182',
    avatar_url: '/counselor_ananya.jpg',
    status: 'online',
    rating: 4.9,
    reviews_count: 120,
    languages: ['Hindi', 'English', 'Marathi'],
    primary_category: 'relationship',
    categories: ['relationship', 'emotional', 'communication'],
    specializations: ['Relationships', 'Anxiety', 'Communication'],
    fee_inr: 1200,
    time_slots: ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '06:30 PM'],
    bio: 'Dr. Ananya specializes in relationship dynamics, emotional grounding, anxiety management, and constructive communication protocols for couples and individuals.'
  },
  {
    id: 2,
    name: 'Dr. Rohit Mehta',
    title: 'Couple & Family Counsellor',
    qualification: 'M.Phil Clinical Psychology, Certified Gottman Method Level 2',
    experience_years: 10,
    license_number: 'RCI-PSY-61024',
    avatar_url: '/counselor_rohit.jpg',
    status: 'online',
    rating: 4.8,
    reviews_count: 95,
    languages: ['Hindi', 'English'],
    primary_category: 'couple',
    categories: ['couple', 'family', 'relationship'],
    specializations: ['Couple Therapy', 'Family Support', 'Conflict Resolution'],
    fee_inr: 1400,
    time_slots: ['11:00 AM', '01:00 PM', '03:30 PM', '05:00 PM', '07:00 PM'],
    bio: 'Dr. Rohit helps partners resolve deep-seated conflict, restore emotional trust, and navigate family dynamics with structured therapeutic methods.'
  },
  {
    id: 3,
    name: 'Ms. Priya Desai',
    title: 'Premarital & Relationship Coach',
    qualification: 'M.A. Counseling Psychology, Certified REBT Practitioner',
    experience_years: 6,
    license_number: 'ICF-PCC-88219',
    avatar_url: '/counselor_priya.jpg',
    status: 'busy',
    rating: 4.9,
    reviews_count: 110,
    languages: ['English', 'Hindi', 'Marathi'],
    primary_category: 'premarital',
    categories: ['premarital', 'relationship', 'self_growth'],
    specializations: ['Premarital Guidance', 'Self-Growth', 'Relationship Goals'],
    fee_inr: 1100,
    time_slots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:30 PM'],
    bio: 'Priya helps modern couples prepare for lifelong commitments, align personal and financial values, and foster proactive relationship habits.'
  },
  {
    id: 4,
    name: 'Dr. Karan Kulkarni',
    title: 'Live-in Relationship Expert',
    qualification: 'Ph.D. in Behavioral Sciences, LL.B., M.Sc. Applied Psychology',
    experience_years: 7,
    license_number: 'BPA-IND-3391',
    avatar_url: '/counselor_karan.jpg',
    status: 'online',
    rating: 4.7,
    reviews_count: 80,
    languages: ['Hindi', 'English'],
    primary_category: 'livein',
    categories: ['livein', 'relationship', 'legal_awareness'],
    specializations: ['Live-in Guidance', 'Legal Awareness', 'Life Planning'],
    fee_inr: 1300,
    time_slots: ['10:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'],
    bio: 'Dr. Karan specializes in cohabitation guidance, legal and privacy awareness for live-in couples, mutual expectation setting, and shared life planning.'
  }
];

export default function CounsellingPage() {
  const location = useLocation();

  // Query parameter pre-selection (e.g. /counselling?category=relationship)
  const queryParams = new URLSearchParams(location.search);
  const initialCategoryParam = queryParams.get('category');

  const [counsellorsList, setCounsellorsList] = useState(defaultCounsellors);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (initialCategoryParam === 'relationship') return 'relationship';
    if (initialCategoryParam === 'couple') return 'couple';
    if (initialCategoryParam === 'premarital') return 'premarital';
    if (initialCategoryParam === 'livein') return 'livein';
    if (initialCategoryParam === 'family') return 'family';
    return 'all';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSessionType, setSelectedSessionType] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // Modal states
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeCounsellor, setActiveCounsellor] = useState(null);

  // FAQ Accordion active states
  const [openFaq, setOpenFaq] = useState(0);

  // Fetch real counsellors from backend if available
  useEffect(() => {
    fetch('http://localhost:8000/api/counsellors')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Merge API data with default specializations tags and status
          const merged = data.map((c, idx) => {
            const fallback = defaultCounsellors[idx] || defaultCounsellors[0];
            return {
              ...fallback,
              ...c,
              avatar_url: c.avatar_url || fallback.avatar_url,
              specializations: c.categories && c.categories.length > 0 ? c.categories.slice(0, 3) : fallback.specializations,
              status: idx === 2 ? 'busy' : 'online'
            };
          });
          setCounsellorsList(merged);
        }
      })
      .catch((err) => {
        console.warn('Using default counsellors payload:', err);
      });
  }, []);

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleOpenBooking = (counsellor) => {
    setActiveCounsellor(counsellor);
    setBookingModalOpen(true);
  };

  const handleOpenProfile = (counsellor) => {
    setActiveCounsellor(counsellor);
    setProfileModalOpen(true);
  };

  // Filtered & Sorted counsellors
  const filteredCounsellors = useMemo(() => {
    return counsellorsList
      .filter((c) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = c.name?.toLowerCase().includes(q);
          const matchTitle = c.title?.toLowerCase().includes(q);
          const matchLang = Array.isArray(c.languages)
            ? c.languages.some((l) => l.toLowerCase().includes(q))
            : String(c.languages).toLowerCase().includes(q);
          const matchSpec = (c.specializations || []).some((s) => s.toLowerCase().includes(q));
          if (!matchName && !matchTitle && !matchLang && !matchSpec) return false;
        }

        // Category tab filter
        if (selectedCategory !== 'all') {
          const cat = selectedCategory.toLowerCase();
          const matchCat =
            c.primary_category === cat ||
            (c.categories && c.categories.some((k) => k.toLowerCase().includes(cat))) ||
            c.title.toLowerCase().includes(cat);
          if (!matchCat) return false;
        }

        // Specialization dropdown
        if (selectedSpec !== 'all') {
          const spec = selectedSpec.toLowerCase();
          const matchSpec =
            c.title.toLowerCase().includes(spec) ||
            (c.specializations && c.specializations.some((s) => s.toLowerCase().includes(spec))) ||
            (c.categories && c.categories.some((k) => k.toLowerCase().includes(spec)));
          if (!matchSpec) return false;
        }

        // Language dropdown
        if (selectedLanguage !== 'all') {
          const lang = selectedLanguage.toLowerCase();
          const matchLang = Array.isArray(c.languages)
            ? c.languages.some((l) => l.toLowerCase().includes(lang))
            : String(c.languages).toLowerCase().includes(lang);
          if (!matchLang) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'experience') return (b.experience_years || 0) - (a.experience_years || 0);
        if (sortBy === 'reviews') return (b.reviews_count || 0) - (a.reviews_count || 0);
        return 0;
      });
  }, [counsellorsList, searchQuery, selectedCategory, selectedSpec, selectedLanguage, sortBy]);

  const categoryTabs = [
    { id: 'all', label: 'All Counsellors', icon: Users },
    { id: 'relationship', label: 'Relationship Counselling', icon: Heart },
    { id: 'couple', label: 'Couple Counselling', icon: Users },
    { id: 'premarital', label: 'Premarital Guidance', icon: HeartHandshake },
    { id: 'livein', label: 'Live-in Guidance', icon: HomeIcon },
    { id: 'family', label: 'Family Counselling', icon: Users }
  ];

  return (
    <div className="mm-cs-page">
      {/* 1. NAVBAR */}
      <PublicNavbar />

      <main id="main-content">
        {/* ===================================================================
            2. HERO SECTION
            =================================================================== */}
        <section className="mm-cs-hero-section" aria-labelledby="counselling-hero-title">
          <div className="mm-cs-hero-container">
            {/* Left Content */}
            <div className="mm-cs-hero-left">
              <span className="mm-cs-tag-badge">PROFESSIONAL &amp; CONFIDENTIAL SUPPORT</span>

              <h1 id="counselling-hero-title" className="mm-cs-hero-title">
                Expert<br />
                Relationship <span className="highlight">Counselling</span>
              </h1>

              <p className="mm-cs-hero-desc">
                Get professional guidance to build healthier, happier and more meaningful relationships.
              </p>

              {/* 4 Icon Highlights Row */}
              <div className="mm-cs-hero-trust-row" aria-label="Counselling Highlights">
                <div className="mm-cs-trust-card">
                  <div className="mm-cs-trust-icon-wrap">
                    <ShieldCheck size={22} />
                  </div>
                  <span className="mm-cs-trust-label">Certified Counsellors</span>
                </div>

                <div className="mm-cs-trust-card">
                  <div className="mm-cs-trust-icon-wrap">
                    <Lock size={20} />
                  </div>
                  <span className="mm-cs-trust-label">Private &amp; Confidential</span>
                </div>

                <div className="mm-cs-trust-card">
                  <div className="mm-cs-trust-icon-wrap">
                    <Video size={20} />
                  </div>
                  <span className="mm-cs-trust-label">Online &amp; In-Person Sessions</span>
                </div>

                <div className="mm-cs-trust-card">
                  <div className="mm-cs-trust-icon-wrap">
                    <Heart size={20} fill="#E91E63" color="#E91E63" />
                  </div>
                  <span className="mm-cs-trust-label">Support for Every Relationship Stage</span>
                </div>
              </div>
            </div>

            {/* Right Visual Artwork */}
            <div className="mm-cs-hero-visual">
              <div className="mm-cs-hero-image-wrap">
                <img
                  src="/hd_asset_card2_counselor_indian.jpg"
                  alt="Certified female relationship psychologist smiling in consultation room"
                  className="mm-cs-hero-main-img"
                  loading="eager"
                />

                {/* Handwritten Script Floating Label */}
                <div className="mm-cs-hero-handwritten" aria-hidden="true">
                  <span>A Listening Friend, Always With You &#x2661;</span>
                </div>

                {/* Floating Counselling Offerings List */}
                <div className="mm-cs-counselling-list-card">
                  <div className="mm-cs-counselling-list-item">
                    <Heart size={14} fill="#E91E63" className="dot-heart" />
                    <span>Individual Counselling</span>
                  </div>
                  <div className="mm-cs-counselling-list-item">
                    <Heart size={14} fill="#E91E63" className="dot-heart" />
                    <span>Couple Counselling</span>
                  </div>
                  <div className="mm-cs-counselling-list-item">
                    <Heart size={14} fill="#E91E63" className="dot-heart" />
                    <span>Premarital Guidance</span>
                  </div>
                  <div className="mm-cs-counselling-list-item">
                    <Heart size={14} fill="#E91E63" className="dot-heart" />
                    <span>Live-in Relationship Guidance</span>
                  </div>
                  <div className="mm-cs-counselling-list-item">
                    <Heart size={14} fill="#E91E63" className="dot-heart" />
                    <span>Family Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            3. CATEGORIES FILTER TABS & SEARCH / FILTER BAR
            =================================================================== */}
        <section className="mm-cs-tabs-section" aria-label="Counselling Categories and Search">
          <div className="mm-cs-container">
            {/* Category Filter Pills */}
            <div className="mm-cs-tabs-container" role="tablist">
              {categoryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`mm-cs-category-tab ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search and Filters Bar */}
            <div className="mm-cs-search-filter-card">
              {/* Search text input */}
              <div className="mm-cs-search-input-wrap">
                <Search size={18} color="#8E7B89" />
                <input
                  type="text"
                  placeholder="Search counsellors by name, specialization or language..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search counsellors"
                />
              </div>

              {/* Specialization Dropdown */}
              <select
                className="mm-cs-filter-select"
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
                aria-label="Filter by specialization"
              >
                <option value="all">Specialization v</option>
                <option value="relationship">Relationship Counselling</option>
                <option value="couple">Couple Therapy</option>
                <option value="premarital">Premarital Guidance</option>
                <option value="livein">Live-in Guidance</option>
                <option value="family">Family Support</option>
              </select>

              {/* Language Dropdown */}
              <select
                className="mm-cs-filter-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                aria-label="Filter by language"
              >
                <option value="all">Language v</option>
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
                <option value="marathi">Marathi</option>
                <option value="bengali">Bengali</option>
                <option value="tamil">Tamil</option>
              </select>

              {/* Session Type Dropdown */}
              <select
                className="mm-cs-filter-select"
                value={selectedSessionType}
                onChange={(e) => setSelectedSessionType(e.target.value)}
                aria-label="Filter by session type"
              >
                <option value="all">Session Type v</option>
                <option value="video">Online Video</option>
                <option value="voice">Audio Call</option>
                <option value="in_person">In-Person</option>
              </select>

              {/* Search Trigger Button */}
              <button type="button" className="mm-cs-btn-search">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* ===================================================================
            4. "OUR CERTIFIED COUNSELLORS" GRID
            =================================================================== */}
        <section className="mm-cs-counsellors-section" aria-labelledby="certified-counsellors-title">
          <div className="mm-cs-container">
            {/* Header with Sort By Dropdown */}
            <div className="mm-cs-counsellors-header-row">
              <h2 id="certified-counsellors-title" className="mm-cs-counsellors-title">
                Our Certified Counsellors
              </h2>

              <div className="mm-cs-sort-wrap">
                <span>Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="mm-cs-sort-select"
                  aria-label="Sort counsellors"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="experience">Most Experienced</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>

            {/* Counsellor Cards Grid */}
            {filteredCounsellors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFF8FA', borderRadius: '24px', border: '1px solid #F0DCE8' }}>
                <Users size={44} color="#D81B60" style={{ margin: '0 auto 14px' }} />
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#4A154B', marginBottom: '8px' }}>
                  No Counsellors Match Your Search
                </h3>
                <p style={{ color: '#634C5F', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Try resetting the filters or searching for another language or specialization.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setSelectedSpec('all');
                    setSelectedLanguage('all');
                  }}
                  className="mm-cs-btn-rose"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="mm-cs-cards-grid-4">
                {filteredCounsellors.map((counsellor) => {
                  const isFavorited = favoriteIds.has(counsellor.id);
                  return (
                    <article key={counsellor.id} className="mm-cs-counsellor-card">
                      {/* Image Wrap */}
                      <div className="mm-cs-counsellor-img-wrap">
                        <img
                          src={counsellor.avatar_url || '/counselor_ananya.jpg'}
                          alt={counsellor.name}
                          className="mm-cs-counsellor-img"
                          loading="lazy"
                        />

                        {/* Status Pill: Online / Busy */}
                        <div className={`mm-cs-status-pill ${counsellor.status === 'busy' ? 'busy' : 'online'}`}>
                          <span className="dot" />
                          <span>{counsellor.status === 'busy' ? 'Busy' : 'Online'}</span>
                        </div>

                        {/* Favorite Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(counsellor.id, e)}
                          className={`mm-cs-favorite-btn ${isFavorited ? 'active' : ''}`}
                          aria-label={`Save ${counsellor.name} to favorites`}
                        >
                          <Heart size={15} fill={isFavorited ? '#E91E63' : 'none'} color={isFavorited ? '#E91E63' : '#8E7B89'} />
                        </button>
                      </div>

                      {/* Card Body */}
                      <div className="mm-cs-counsellor-body">
                        {/* Rating Badge */}
                        <div className="mm-cs-rating-badge">
                          <Star size={12} fill="#F59E0B" color="#F59E0B" />
                          <span>{counsellor.rating || 4.9} ({counsellor.reviews_count || 100}+)</span>
                        </div>

                        {/* Counsellor Name */}
                        <h3 className="mm-cs-counsellor-name">{counsellor.name}</h3>
                        <div className="mm-cs-counsellor-role">{counsellor.title}</div>

                        {/* Experience and Languages */}
                        <div className="mm-cs-meta-row">
                          <div className="mm-cs-meta-item">
                            <GraduationCap size={15} color="#8E7B89" />
                            <span>{counsellor.experience_years ? `${counsellor.experience_years}+ Years Experience` : '8+ Years Experience'}</span>
                          </div>
                          <div className="mm-cs-meta-item">
                            <MapPin size={14} color="#E91E63" />
                            <span>{Array.isArray(counsellor.languages) ? counsellor.languages.join(', ') : counsellor.languages}</span>
                          </div>
                        </div>

                        {/* Specialization Tags */}
                        <div className="mm-cs-spec-pills">
                          {(counsellor.specializations || ['Relationships', 'Communication']).map((tag, idx) => (
                            <span key={idx} className="mm-cs-spec-pill">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="mm-cs-card-actions">
                          <button
                            type="button"
                            onClick={() => handleOpenProfile(counsellor)}
                            className="mm-cs-btn-outline"
                          >
                            View Profile
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenBooking(counsellor)}
                            className="mm-cs-btn-solid"
                          >
                            Book Session
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ===================================================================
            5. "WHY CHOOSE MAANMITRA COUNSELLING?" SECTION
            =================================================================== */}
        <section className="mm-cs-why-section" aria-labelledby="why-counselling-title">
          <div className="mm-cs-container">
            <h2 id="why-counselling-title" className="mm-cs-section-title" style={{ textAlign: 'center' }}>
              Why Choose MAANMITRA Counselling?
            </h2>

            <div className="mm-cs-why-grid">
              <div className="mm-cs-why-card">
                <div className="mm-cs-why-icon-wrap">
                  <ShieldCheck size={22} />
                </div>
                <span className="mm-cs-why-text">Certified &amp; Verified Counsellors</span>
              </div>

              <div className="mm-cs-why-card">
                <div className="mm-cs-why-icon-wrap">
                  <Lock size={20} />
                </div>
                <span className="mm-cs-why-text">Safe &amp; Confidential Sessions</span>
              </div>

              <div className="mm-cs-why-card">
                <div className="mm-cs-why-icon-wrap">
                  <Video size={20} />
                </div>
                <span className="mm-cs-why-text">Flexible Session Options (Online/In-Person)</span>
              </div>

              <div className="mm-cs-why-card">
                <div className="mm-cs-why-icon-wrap">
                  <UserCheck size={20} />
                </div>
                <span className="mm-cs-why-text">Personalized Guidance for Your Needs</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            6. "STEPS TO GET STARTED" (Book a Counselling Session in Simple Steps)
            =================================================================== */}
        <section className="mm-cs-how-section" aria-labelledby="counselling-steps-title">
          <div className="mm-cs-container">
            <div className="mm-cs-section-header">
              <span className="mm-cs-eyebrow">&mdash; STEPS TO GET STARTED &mdash;</span>
              <h2 id="counselling-steps-title" className="mm-cs-section-title">
                Book a Counselling Session in Simple Steps
              </h2>
            </div>

            <div className="mm-cs-steps-row">
              {/* Step 1 */}
              <div className="mm-cs-step-col">
                <div className="mm-cs-step-circle">
                  <UserCheck size={24} />
                </div>
                <h3 className="mm-cs-step-title">1. Explore Counsellors</h3>
                <p className="mm-cs-step-desc">
                  Browse profiles and choose the right counsellor.
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
                  Select date, time and session type.
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
                  Receive professional support for a healthier relationship.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            7. BOTTOM CALL TO ACTION BANNER
            =================================================================== */}
        <section className="mm-cs-cta-section" aria-label="Book a Session Today">
          <div className="mm-cs-container">
            <div className="mm-cs-cta-banner">
              <div className="mm-cs-cta-left">
                <h2 className="mm-cs-cta-title">
                  Take the First Step<br />
                  Towards a Healthier Relationship
                </h2>
                <p className="mm-cs-cta-sub">
                  Book a session with our expert counsellors today.
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenBooking(counsellorsList[0])}
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

        {/* ===================================================================
            8. FREQUENTLY ASKED QUESTIONS SECTION
            =================================================================== */}
        <section className="mm-cs-faq-section" aria-labelledby="faq-title">
          <div className="mm-cs-container">
            <div className="mm-cs-faq-header">
              <h2 id="faq-title" className="mm-cs-faq-title">
                Frequently Asked Questions
              </h2>
              <Link to="/faq" className="mm-cs-faq-link">
                <span>View All FAQs</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* 3 Column Accordion Cards */}
            <div className="mm-cs-faq-grid-3">
              {/* Question 1 */}
              <div
                className={`mm-cs-faq-card ${openFaq === 0 ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === 0 ? -1 : 0)}
              >
                <div className="mm-cs-faq-question">
                  <span>Are the counselling sessions confidential?</span>
                  <ChevronDown size={18} className="mm-cs-faq-icon" />
                </div>
                {openFaq === 0 && (
                  <p className="mm-cs-faq-answer">
                    Yes, absolutely. All sessions are conducted under strict clinical confidentiality guidelines. Calls are end-to-end encrypted, never recorded, and personal contact details are never shared with third parties.
                  </p>
                )}
              </div>

              {/* Question 2 */}
              <div
                className={`mm-cs-faq-card ${openFaq === 1 ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === 1 ? -1 : 1)}
              >
                <div className="mm-cs-faq-question">
                  <span>How do I book a session?</span>
                  <ChevronDown size={18} className="mm-cs-faq-icon" />
                </div>
                {openFaq === 1 && (
                  <p className="mm-cs-faq-answer">
                    Booking is quick and simple: browse our certified counsellors, click &quot;Book Session&quot;, select your preferred date, time slot, and communication mode (video call, audio, or in-person), and confirm your reservation.
                  </p>
                )}
              </div>

              {/* Question 3 */}
              <div
                className={`mm-cs-faq-card ${openFaq === 2 ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === 2 ? -1 : 2)}
              >
                <div className="mm-cs-faq-question">
                  <span>Can I choose online or in-person sessions?</span>
                  <ChevronDown size={18} className="mm-cs-faq-icon" />
                </div>
                {openFaq === 2 && (
                  <p className="mm-cs-faq-answer">
                    Yes. Most members prefer convenient, secure online video or audio calls right inside their browser. Selected verified counsellors also offer in-person clinical consultations depending on their clinic location and schedule.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. FOOTER */}
      <PublicFooter />

      {/* 10. MODALS */}
      <CounsellingBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        counsellor={activeCounsellor}
      />

      <CounsellorProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        counsellor={activeCounsellor}
        onOpenBooking={(c) => {
          setActiveCounsellor(c);
          setBookingModalOpen(true);
        }}
      />
    </div>
  );
}

