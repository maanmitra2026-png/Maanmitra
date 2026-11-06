import React, { useState, useEffect } from 'react';
import {
  Heart,
  Compass,
  Sparkles,
  ShieldCheck,
  Headphones,
  UserCheck,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  HelpCircle,
  MessageCircle,
  Lock,
  PhoneCall,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter
} from 'lucide-react';
import ManmitraLogo from './ManmitraLogo';

export default function CounsellingHub({
  me,
  subscription,
  categories = [],
  counsellors = [],
  appointments = [],
  onNavigate,
  onOpenBooking,
  onOpenReflection,
  onOpenPortal,
  onOpenUpgrade,
  api,
  notify
}) {
  const [triageChoice, setTriageChoice] = useState(() => localStorage.getItem('manmitra_triage_choice') || null);
  const [dismissTriage, setDismissTriage] = useState(() => localStorage.getItem('manmitra_triage_dismissed') === 'true');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const isPremium = subscription?.plan?.code === 'PREMIUM';

  const triageOptions = [
    { id: 'relationships', label: 'My Relationships', icon: '', desc: 'Communication, trust, boundaries & expectations' },
    { id: 'myself', label: 'Understanding Myself', icon: '', desc: 'Self-clarity, emotional needs & personal direction' },
    { id: 'emotional', label: 'Emotional Support', icon: '', desc: 'A safe, respectful space to process difficult emotions' },
    { id: 'marriage', label: 'Marriage & Compatibility', icon: '', desc: 'Cohabitation readiness, values & long-term alignment' },
    { id: 'growth', label: 'Personal Growth', icon: '', desc: 'Confidence, life transitions & goal navigation' },
    { id: 'other', label: 'Something Else', icon: '', desc: 'Explore our open guidance & multidisciplinary directory' },
  ];

  const handleSelectTriage = (option) => {
    setTriageChoice(option.id);
    localStorage.setItem('manmitra_triage_choice', option.id);
    setDismissTriage(false);
    localStorage.setItem('manmitra_triage_dismissed', 'false');
    
    // Map triage option to category slug
    const mapping = {
      relationships: 'relationship',
      myself: 'personal',
      emotional: 'emotional',
      marriage: 'marriage-compatibility',
      growth: 'personal',
      other: 'other-services'
    };
    setSelectedCategory(mapping[option.id] || null);
  };

  const handleSkipTriage = () => {
    setDismissTriage(true);
    localStorage.setItem('manmitra_triage_dismissed', 'true');
    setTriageChoice(null);
    setSelectedCategory(null);
  };

  // Filter counsellors if a category is selected
  const displayCounsellors = selectedCategory
    ? counsellors.filter(c => c.category_slug === selectedCategory || (c.specialization && c.specialization.toLowerCase().includes(selectedCategory)))
    : counsellors;

  return (
    <div className="counselling-hub">
      {/* 1. Header Banner */}
      <section className="counselling-hero-card">
        <div className="counselling-hero-content">
          <div className="counselling-pill">
            <ShieldCheck size={14} color="#36B7A5" />
            <span>CONFIDENTIAL & RESPECTFUL GUIDANCE</span>
          </div>
          <h1>
            Sometimes, One Conversation Can Help You See Things Differently.
          </h1>
          <p className="counselling-hero-sub">
            Explore guidance for relationships, personal growth, emotional challenges, and important life decisions in a respectful, supportive environment.
          </p>

          <div className="counselling-hero-actions">
            <button
              className="btn btn-coral"
              onClick={() => onNavigate('professionals')}
            >
              <UserCheck size={16} /> Find the Right Support
            </button>
            <button
              className="btn-outline counselling-btn-light"
              onClick={onOpenReflection}
            >
              <Sparkles size={16} /> Start Guided Reflection
            </button>
            <button
              className="btn-outline counselling-portal-trigger"
              onClick={onOpenPortal}
              title="Access practitioner workspace or register your practice"
            >
              <Award size={16} /> Counsellor Portal
            </button>
          </div>

          <div className="counselling-gentle-note">
            <em>"Your journey starts with understanding. Choose the kind of support that feels right for you."</em>
          </div>
        </div>

        <div className="counselling-hero-stats">
          <div className="stat-glass-card">
            <span className="stat-icon-wrap teal"><UserCheck size={18} /></span>
            <div>
              <strong>Verified Only</strong>
              <small>Vetted credentials & ethical code</small>
            </div>
          </div>
          <div className="stat-glass-card">
            <span className="stat-icon-wrap coral"><Lock size={18} /></span>
            <div>
              <strong>Confidential</strong>
              <small>End-to-end encrypted notes</small>
            </div>
          </div>
          <div className="stat-glass-card">
            <span className="stat-icon-wrap lavender"><Clock size={18} /></span>
            <div>
              <strong>Zero Waiting</strong>
              <small>Direct slot booking</small>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Triage Section */}
      <section className="counselling-triage-section card card-pad">
        <div className="triage-header">
          <div>
            <div className="eyebrow-teal">START WITH WHERE YOU ARE</div>
            <h2>What would you like support with today?</h2>
            <p className="muted small">
              Select an area to receive tailored recommendations, or skip to explore all services freely without pressure.
            </p>
          </div>
          {!dismissTriage && triageChoice && (
            <button className="text-link" onClick={handleSkipTriage}>
              Clear selection & view all
            </button>
          )}
        </div>

        <div className="triage-options-grid">
          {triageOptions.map((opt) => {
            const isSelected = triageChoice === opt.id && !dismissTriage;
            return (
              <button
                key={opt.id}
                type="button"
                className={`triage-card ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectTriage(opt)}
              >
                <div className="triage-card-icon">{opt.icon}</div>
                <div className="triage-card-body">
                  <strong>{opt.label}</strong>
                  <p>{opt.desc}</p>
                </div>
                {isSelected && (
                  <span className="triage-check">
                    <CheckCircle2 size={16} color="#36B7A5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="triage-footer-row">
          {triageChoice && !dismissTriage ? (
            <div className="triage-active-hint">
              <span>Showing tailored recommendations for: <strong>{triageOptions.find(o => o.id === triageChoice)?.label}</strong></span>
              <button className="btn-small btn-outline" onClick={onOpenReflection}>
                Reflect on this topic with AI <Sparkles size={13} />
              </button>
            </div>
          ) : (
            <div className="triage-skip-prompt">
              <span className="muted small">Not ready to specify? That's completely okay.</span>
              <button className="text-link" onClick={handleSkipTriage}>
                Explore services without pressure 
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Seven Configurable Counselling Categories */}
      <section className="counselling-categories-section">
        <div className="section-header-row">
          <div>
            <div className="eyebrow-teal">CORE SERVICES</div>
            <h2>Explore Counselling Categories</h2>
            <p className="muted small">
              Specialized, structured support designed to assist with communication, personal decisions, and emotional balance.
            </p>
          </div>
          <button className="text-link" onClick={() => onNavigate('professionals')}>
            View all professionals 
          </button>
        </div>

        <div className="counselling-cat-grid">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <div
                key={cat.id || cat.slug}
                className={`counselling-cat-card ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedCategory(isSelected ? null : cat.slug);
                }}
              >
                <div className="cat-card-header">
                  <span className="cat-icon-badge">{cat.icon || ''}</span>
                  {cat.badge && <span className="cat-badge-pill">{cat.badge}</span>}
                </div>
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
                <div className="cat-card-action">
                  <span>{isSelected ? 'Showing matches' : 'Explore category'}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Verified Professionals Spotlight */}
      <section className="counselling-specialists-section card card-pad">
        <div className="section-header-row">
          <div>
            <div className="eyebrow-teal">VERIFIED PRACTITIONERS</div>
            <h2>
              {selectedCategory
                ? `Specialists for ${categories.find(c => c.slug === selectedCategory)?.title || 'Category'}`
                : 'Featured Certified Counsellors'}
            </h2>
            <p className="muted small">
              All practitioners undergo credential validation and adhere to professional ethics standards.
            </p>
          </div>
          <button className="btn-outline" onClick={() => onNavigate('professionals')}>
            Browse Full Directory ({counsellors.length})
          </button>
        </div>

        <div className="practitioner-cards-grid">
          {(displayCounsellors.length ? displayCounsellors.slice(0, 3) : counsellors.slice(0, 3)).map((c) => (
            <div className="practitioner-card" key={c.id}>
              <div className="practitioner-card-top">
                <div className="practitioner-avatar">
                  {c.avatar_url ? (
                    <img src={c.avatar_url} alt={c.name} />
                  ) : (
                    <span>{c.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                  )}
                </div>
                <div className="practitioner-badge-col">
                  {c.verified && (
                    <span className="verified-pill" title="Credentials and qualification verified">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  )}
                  <span className="rating-pill">* {c.rating || '4.9'}</span>
                </div>
              </div>

              <div className="practitioner-body">
                <h3>{c.name}</h3>
                <div className="practitioner-spec">{c.specialization}</div>
                <div className="practitioner-meta">
                  <span>{c.qualification}</span>
                  <span>.</span>
                  <span>{c.experience_years} yrs exp</span>
                </div>
                <p className="practitioner-bio">
                  {c.bio ? c.bio.slice(0, 110) + '...' : 'Specialized counselling supporting clients through healthy communication and self-understanding.'}
                </p>

                <div className="practitioner-languages">
                  {(c.languages || ['English', 'Hindi']).slice(0, 3).map((l) => (
                    <span key={l} className="lang-tag">{l}</span>
                  ))}
                </div>
              </div>

              <div className="practitioner-footer">
                <div className="fee-info">
                  {isPremium ? (
                    <span className="fee-included">Included in Premium</span>
                  ) : (
                    <span className="fee-amount">₹{c.fee_inr || 799} <small>/ session</small></span>
                  )}
                </div>
                <button
                  className="btn btn-small"
                  onClick={() => onOpenBooking(c)}
                >
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Guided AI Self-Reflection Tool Feature Card */}
      <section className="counselling-ai-banner">
        <div className="ai-banner-visual">
          <Sparkles size={36} color="#36B7A5" />
        </div>
        <div className="ai-banner-copy">
          <div className="eyebrow-coral">PRIVATE SELF-REFLECTION</div>
          <h3>Need Clarity Before Speaking With Someone?</h3>
          <p>
            Use our AI-assisted guided self-reflection tool to untangle your thoughts across relationships, boundaries, and emotional triggers. Grounded in respectful inquiry and mindfulness.
          </p>
          <div className="ai-banner-disclaimer">
            <Lock size={13} />
            <small>Not psychotherapy or clinical treatment. Designed for self-reflection and personal insight.</small>
          </div>
        </div>
        <button
          className="btn btn-coral"
          onClick={onOpenReflection}
          style={{ whiteSpace: 'nowrap' }}
        >
          Open Reflection Tool <ArrowUpRight size={14} />
        </button>
      </section>

      {/* 6. Appointments Quick Access Card */}
      {appointments.length > 0 && (
        <section className="card card-pad counselling-upcoming-box">
          <div className="section-header-row">
            <div>
              <div className="eyebrow-teal">YOUR SCHEDULE</div>
              <h3>Upcoming & Active Appointments</h3>
            </div>
            <button className="text-link" onClick={() => onNavigate('appointments')}>
              View all ({appointments.length}) 
            </button>
          </div>

          <div className="upcoming-compact-list">
            {appointments.slice(0, 2).map((a) => (
              <div className="appointment-compact-row" key={a.id}>
                <div className="compact-date">
                  <Calendar size={18} color="#36B7A5" />
                  <div>
                    <strong>{a.appointment_date}</strong>
                    <small>{a.time_slot} ({a.mode})</small>
                  </div>
                </div>
                <div className="compact-counsellor">
                  <span>With <strong>{a.counsellor_name}</strong></span>
                  <small className="muted">{a.category || 'Relationship Counselling'}</small>
                </div>
                <div className="compact-status">
                  <span className={`status-pill ${a.status}`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Safety, Confidentiality & Crisis Support */}
      <section className="counselling-safety-banner">
        <div className="safety-col">
          <div className="safety-head">
            <ShieldCheck size={20} color="#36B7A5" />
            <h4>Our Confidentiality & Care Commitment</h4>
          </div>
          <p>
            MANMITRA maintains strict role-based confidentiality and consent controls. We never sell sensitive session records or share private counselling data with unauthorized third parties.
          </p>
        </div>

        <div className="crisis-col">
          <div className="crisis-head">
            <PhoneCall size={20} color="#F26B6B" />
            <h4>Immediate Crisis & Distress Support</h4>
          </div>
          <p>
            If you or someone you know is in severe distress or acute crisis, please contact verified emergency helplines immediately:
          </p>
          <div className="helpline-badges">
            <span className="helpline-badge">
              <strong>Tele-MANAS (Govt of India):</strong> 14416 / 1800-891-4416 (24x7)
            </span>
            <span className="helpline-badge">
              <strong>Vandrevala Foundation:</strong> +91 9999 666 555
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
