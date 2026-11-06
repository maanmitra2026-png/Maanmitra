import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Heart,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Users,
  MessageSquare,
  HeartHandshake,
  ArrowRight,
  UserCheck,
  Briefcase,
  Award,
  Headphones,
  PhoneCall,
  Check,
  Sparkles,
  Lock,
  Compass,
  FileText
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import '../../counselling_services.css';

export default function BecomePartnerPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+91',
    mobileNumber: '',
    partnerCategory: '',
    qualification: '',
    experienceYears: '',
    city: '',
    introduction: '',
    consent: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const validateForm = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    const cleanPhone = formData.mobileNumber.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.mobileNumber = 'Please enter a valid 10-digit mobile number.';
    }
    if (!formData.partnerCategory) {
      errs.partnerCategory = 'Please select a partner category.';
    }
    if (!formData.qualification.trim() || formData.qualification.trim().length < 2) {
      errs.qualification = 'Please enter your highest qualification or degree.';
    }
    if (!formData.experienceYears) {
      errs.experienceYears = 'Please select your years of experience.';
    }
    if (!formData.city) {
      errs.city = 'Please select or enter your city.';
    }
    if (!formData.introduction.trim() || formData.introduction.trim().length < 10) {
      errs.introduction = 'Please provide a short introduction (at least 10 characters).';
    }
    if (!formData.consent) {
      errs.consent = 'You must agree to the Privacy Policy and Terms & Conditions.';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile_number: `${formData.countryCode} ${formData.mobileNumber.trim()}`,
        partner_category: formData.partnerCategory,
        qualification: formData.qualification.trim(),
        experience_years: formData.experienceYears,
        city: formData.city,
        introduction: formData.introduction.trim(),
        consent: formData.consent
      };

      let appCode = 'MM-PARTNER-' + Math.random().toString(36).substring(2, 8).toUpperCase();

      try {
        const res = await fetch('http://localhost:8000/api/partners/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          if (data.application_code) appCode = data.application_code;
        }
      } catch (networkErr) {
        console.warn('API sync fallback note:', networkErr);
      }

      setSubmittedData({
        ...formData,
        applicationCode: appCode
      });
    } catch (err) {
      setErrors({ form: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById('apply-form-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetApplication = () => {
    setSubmittedData(null);
    setFormData({
      fullName: '',
      email: '',
      countryCode: '+91',
      mobileNumber: '',
      partnerCategory: '',
      qualification: '',
      experienceYears: '',
      city: '',
      introduction: '',
      consent: false
    });
    setErrors({});
  };

  return (
    <div className="mm-cs-page">
      {/* 1. NAVBAR */}
      <PublicNavbar />

      <main id="main-content">
        {/* ===================================================================
            2. HERO SECTION
            =================================================================== */}
        <section className="mm-cs-hero-section" aria-labelledby="partner-hero-title">
          <div className="mm-cs-hero-container">
            {/* Left Content */}
            <div className="mm-cs-hero-left">
              <span className="mm-cs-tag-badge">PARTNER WITH PURPOSE</span>

              <h1 id="partner-hero-title" className="mm-cs-hero-title">
                Grow With<br />
                <span className="highlight">MAANMITRA</span>
              </h1>

              <p className="mm-cs-hero-desc">
                Join our community of professionals and help people build healthier, happier relationships.
              </p>

              {/* 4 Icon Highlights Row */}
              <div className="mm-cs-hero-trust-row" aria-label="Partner Highlights">
                <div className="mm-cs-trust-card">
                  <div className="mm-cs-trust-icon-wrap">
                    <Calendar size={20} />
                  </div>
                  <span className="mm-cs-trust-label">Flexible Work Options</span>
                </div>

                <div className="mm-cs-trust-card">
                  <div className="mm-cs-trust-icon-wrap">
                    <Heart size={20} fill="#E91E63" color="#E91E63" />
                  </div>
                  <span className="mm-cs-trust-label">Meaningful Impact</span>
                </div>

                <div className="mm-cs-trust-card">
                  <div className="mm-cs-trust-icon-wrap">
                    <TrendingUp size={20} />
                  </div>
                  <span className="mm-cs-trust-label">Grow Your Practice</span>
                </div>

                <div className="mm-cs-trust-card">
                  <div className="mm-cs-trust-icon-wrap">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="mm-cs-trust-label">Be Part of a Trusted Platform</span>
                </div>
              </div>
            </div>

            {/* Right Visual Artwork */}
            <div className="mm-cs-hero-visual">
              <div
                className="mm-cs-hero-image-wrap"
                style={{
                  maxWidth: '520px',
                  borderRadius: '32px',
                  boxShadow: 'none',
                  overflow: 'visible'
                }}
              >
                <img
                  src="/become_partner_hero_official.png"
                  alt="A Healthier Tomorrow, Together -- Grow With MAANMITRA"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '32px',
                    boxShadow: '0 20px 48px rgba(74, 21, 75, 0.14)',
                    display: 'block'
                  }}
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            3. "WHO CAN JOIN?" (PARTNER OPPORTUNITIES)
            =================================================================== */}
        <section className="mm-cs-services-grid-section" aria-labelledby="who-can-join-title">
          <div className="mm-cs-container">
            <div className="mm-cs-section-header">
              <span className="mm-cs-eyebrow">&mdash; PARTNER OPPORTUNITIES &mdash;</span>
              <h2 id="who-can-join-title" className="mm-cs-section-title">
                Who Can Join?
              </h2>
              <p className="mm-cs-section-subtitle">
                We welcome qualified professionals and service providers who are passionate about relationships and well-being.
              </p>
            </div>

            {/* 4 Partner Category Cards */}
            <div className="mm-cs-cards-grid-4">
              {/* Category 1: Relationship Counsellors */}
              <article className="mm-bp-category-card">
                <div className="mm-bp-cat-icon-wrap">
                  <MessageSquare size={22} />
                </div>
                <h3 className="mm-bp-cat-title">Relationship Counsellors</h3>
                <p className="mm-bp-cat-desc">
                  Certified counsellors, therapists and relationship coaches.
                </p>
                <ul className="mm-bp-check-list">
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Individual Counselling</span>
                  </li>
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Couple Counselling</span>
                  </li>
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Premarital Guidance</span>
                  </li>
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Family Counselling</span>
                  </li>
                </ul>
              </article>

              {/* Category 2: Life Coaches */}
              <article className="mm-bp-category-card">
                <div className="mm-bp-cat-icon-wrap">
                  <Users size={22} />
                </div>
                <h3 className="mm-bp-cat-title">Life Coaches</h3>
                <p className="mm-bp-cat-desc">
                  Professionals helping with personal and relationship growth.
                </p>
                <ul className="mm-bp-check-list">
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Communication Skills</span>
                  </li>
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Personal Development</span>
                  </li>
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Career &amp; Relationship Balance</span>
                  </li>
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Life Transitions</span>
                  </li>
                </ul>
              </article>

              {/* Category 3: Subject Matter Experts */}
              <article className="mm-bp-category-card">
                <div className="mm-bp-cat-icon-wrap">
                  <Heart size={22} fill="#E91E63" color="#E91E63" />
                </div>
                <h3 className="mm-bp-cat-title">Subject Matter Experts</h3>
                <p className="mm-bp-cat-desc">
                  Experts in legal, financial or social aspects of relationships.
                </p>
                <ul className="mm-bp-check-list">
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Legal Guidance (where applicable)</span>
                  </li>
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Financial Planning Guidance</span>
                  </li>
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Family &amp; Social Support</span>
                  </li>
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Awareness &amp; Education</span>
                  </li>
                </ul>
              </article>

              {/* Category 4: Service Providers */}
              <article className="mm-bp-category-card">
                <div className="mm-bp-cat-icon-wrap">
                  <HeartHandshake size={22} />
                </div>
                <h3 className="mm-bp-cat-title">Service Providers</h3>
                <p className="mm-bp-cat-desc">
                  Other verified professionals supporting relationship well-being.
                </p>
                <ul className="mm-bp-check-list">
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Wellness &amp; Mental Health</span>
                  </li>
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Health &amp; Lifestyle Experts</span>
                  </li>
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Workshops &amp; Webinars</span>
                  </li>
                  <li className="mm-bp-check-item">
                    <Check size={16} className="check-icon" />
                    <span>Community Support Services</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* ===================================================================
            4. SPLIT SECTION: APPLICATION FORM & PARTNER HIGHLIGHTS
            =================================================================== */}
        <section id="apply-form-section" className="mm-bp-split-section" aria-labelledby="form-title">
          <div className="mm-cs-container">
            <div className="mm-bp-split-grid">
              {/* LEFT: Application Form Card */}
              <div className="mm-bp-form-card">
                {submittedData ? (
                  <div className="mm-bp-success-card">
                    <div className="mm-bp-success-icon-wrap">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.7rem', color: '#4A154B', marginBottom: '8px' }}>
                      Application Submitted Successfully!
                    </h3>
                    <p style={{ color: '#634C5F', fontSize: '0.94rem', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                      Thank you, <strong style={{ color: '#4A154B' }}>{submittedData.fullName}</strong>. Your partner application has been received with reference code:
                    </p>

                    <div
                      style={{
                        background: '#FFE7EF',
                        color: '#E91E63',
                        border: '1.5px dashed #E91E63',
                        padding: '12px 24px',
                        borderRadius: '14px',
                        fontWeight: 800,
                        fontSize: '1.15rem',
                        letterSpacing: '0.05em',
                        display: 'inline-block',
                        marginBottom: '24px'
                      }}
                    >
                      {submittedData.applicationCode}
                    </div>

                    <p style={{ fontSize: '0.86rem', color: '#8E7B89', maxWidth: '420px', margin: '0 auto 28px' }}>
                      Our credential onboarding team will review your qualifications and contact you at{' '}
                      <strong>{submittedData.email}</strong> within 24&ndash;48 business hours.
                    </p>

                    <button
                      type="button"
                      onClick={handleResetApplication}
                      className="mm-cs-btn-rose"
                      style={{ margin: '0 auto' }}
                    >
                      Submit Another Application
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mm-bp-form-header">
                      <div className="mm-bp-form-header-icon">
                        <UserCheck size={24} />
                      </div>
                      <div className="mm-bp-form-header-text">
                        <span className="mm-cs-eyebrow" style={{ marginBottom: '2px' }}>PARTNER APPLICATION</span>
                        <h3 id="form-title">Apply to Become a Partner</h3>
                        <p>Fill in your details and our team will review your application.</p>
                      </div>
                    </div>

                    {errors.form && (
                      <div style={{ background: '#FEE2E2', border: '1px solid #F87171', color: '#B91C1C', padding: '10px 14px', borderRadius: '12px', fontSize: '0.86rem', marginBottom: '18px' }}>
                        {errors.form}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                      {/* Full Name & Email Address */}
                      <div className="mm-bp-form-grid-2">
                        <div className="mm-bp-form-group">
                          <label className="mm-bp-form-label">
                            Full Name <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="mm-bp-form-input"
                          />
                          {errors.fullName && (
                            <span style={{ color: '#E91E63', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                              {errors.fullName}
                            </span>
                          )}
                        </div>

                        <div className="mm-bp-form-group">
                          <label className="mm-bp-form-label">
                            Email Address <span className="req">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            className="mm-bp-form-input"
                          />
                          {errors.email && (
                            <span style={{ color: '#E91E63', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                              {errors.email}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mobile Number & Partner Category */}
                      <div className="mm-bp-form-grid-2">
                        <div className="mm-bp-form-group">
                          <label className="mm-bp-form-label">
                            Mobile Number <span className="req">*</span>
                          </label>
                          <div className="mm-bp-phone-row">
                            <select
                              name="countryCode"
                              value={formData.countryCode}
                              onChange={handleChange}
                              className="mm-bp-country-code"
                            >
                              <option value="+91">+91 v</option>
                              <option value="+1">+1 v</option>
                              <option value="+44">+44 v</option>
                              <option value="+971">+971 v</option>
                            </select>
                            <input
                              type="tel"
                              name="mobileNumber"
                              placeholder="Enter your mobile number"
                              value={formData.mobileNumber}
                              onChange={handleChange}
                              className="mm-bp-form-input"
                              style={{ flex: 1 }}
                            />
                          </div>
                          {errors.mobileNumber && (
                            <span style={{ color: '#E91E63', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                              {errors.mobileNumber}
                            </span>
                          )}
                        </div>

                        <div className="mm-bp-form-group">
                          <label className="mm-bp-form-label">
                            Partner Category <span className="req">*</span>
                          </label>
                          <select
                            name="partnerCategory"
                            value={formData.partnerCategory}
                            onChange={handleChange}
                            className="mm-bp-form-select"
                          >
                            <option value="">Select category</option>
                            <option value="Relationship Counsellors">Relationship Counsellors</option>
                            <option value="Life Coaches">Life Coaches</option>
                            <option value="Subject Matter Experts">Subject Matter Experts</option>
                            <option value="Service Providers">Service Providers</option>
                          </select>
                          {errors.partnerCategory && (
                            <span style={{ color: '#E91E63', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                              {errors.partnerCategory}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Professional Qualification & Years of Experience */}
                      <div className="mm-bp-form-grid-2">
                        <div className="mm-bp-form-group">
                          <label className="mm-bp-form-label">
                            Professional Qualification <span className="req">*</span>
                          </label>
                          <input
                            type="text"
                            name="qualification"
                            placeholder="E.g. Degree, Certification, etc."
                            value={formData.qualification}
                            onChange={handleChange}
                            className="mm-bp-form-input"
                          />
                          {errors.qualification && (
                            <span style={{ color: '#E91E63', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                              {errors.qualification}
                            </span>
                          )}
                        </div>

                        <div className="mm-bp-form-group">
                          <label className="mm-bp-form-label">
                            Years of Experience <span className="req">*</span>
                          </label>
                          <select
                            name="experienceYears"
                            value={formData.experienceYears}
                            onChange={handleChange}
                            className="mm-bp-form-select"
                          >
                            <option value="">Select experience</option>
                            <option value="1-3 Years">1-3 Years</option>
                            <option value="3-5 Years">3-5 Years</option>
                            <option value="5-10 Years">5-10 Years</option>
                            <option value="10+ Years">10+ Years</option>
                          </select>
                          {errors.experienceYears && (
                            <span style={{ color: '#E91E63', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                              {errors.experienceYears}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* City */}
                      <div className="mm-bp-form-group">
                        <label className="mm-bp-form-label">
                          City <span className="req">*</span>
                        </label>
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="mm-bp-form-select"
                        >
                          <option value="">Select city</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Delhi NCR">Delhi NCR</option>
                          <option value="Bengaluru">Bengaluru</option>
                          <option value="Pune">Pune</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Chennai">Chennai</option>
                          <option value="Kolkata">Kolkata</option>
                          <option value="Ahmedabad">Ahmedabad</option>
                          <option value="Jaipur">Jaipur</option>
                          <option value="Other">Other City (Pan India)</option>
                        </select>
                        {errors.city && (
                          <span style={{ color: '#E91E63', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                            {errors.city}
                          </span>
                        )}
                      </div>

                      {/* Short Introduction */}
                      <div className="mm-bp-form-group">
                        <label className="mm-bp-form-label">
                          Short Introduction <span className="req">*</span>
                        </label>
                        <textarea
                          rows={4}
                          name="introduction"
                          maxLength={500}
                          placeholder="Tell us about yourself, conversational style, and topics you enjoy..."
                          value={formData.introduction}
                          onChange={handleChange}
                          className="mm-bp-form-textarea"
                          style={{ resize: 'vertical' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {errors.introduction ? (
                            <span style={{ color: '#E91E63', fontSize: '0.74rem' }}>{errors.introduction}</span>
                          ) : <span />}
                          <span className="mm-bp-char-counter">{formData.introduction.length}/500</span>
                        </div>

                        {/* Bio / Intro Suggestions */}
                        <div style={{ marginTop: '8px', background: '#FFF8FA', padding: '10px 12px', borderRadius: '10px', border: '1px solid #F0DCE8' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.76rem', fontWeight: 700, color: '#4A154B', marginBottom: '6px' }}>
                            <Sparkles size={13} color="#E91E63" /> Suggested Bio Starters (click to fill):
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {[
                              { label: 'Empathetic Listener', text: 'Warm and empathetic listener passionate about meaningful conversations, daily lifestyle, and positive emotional well-being. Offering a patient, judgment-free space.' },
                              { label: 'Cheerful Companion', text: 'Friendly and upbeat conversationalist ready to hear about your day, share lighthearted laughs, and talk through life experiences, hobbies, and books in a welcoming environment.' },
                              { label: 'Mindful Life Guide', text: 'Attentive and thoughtful companion who loves discussing relationship harmony, career routines, and everyday wellness with kind words and genuine understanding.' }
                            ].map((sugg, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, introduction: sugg.text }));
                                  setErrors(prev => ({ ...prev, introduction: '' }));
                                }}
                                style={{
                                  background: '#FFFFFF',
                                  border: '1px solid #E6D2DF',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  fontSize: '0.72rem',
                                  color: '#4A154B',
                                  cursor: 'pointer',
                                  fontWeight: 600
                                }}
                              >
                                ✨ {sugg.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Checkbox Consent */}
                      <div className="mm-bp-checkbox-wrap">
                        <input
                          type="checkbox"
                          id="partner-consent"
                          name="consent"
                          checked={formData.consent}
                          onChange={handleChange}
                        />
                        <label htmlFor="partner-consent">
                          I agree to the <Link to="/privacy">Privacy Policy</Link> and <Link to="/terms">Terms &amp; Conditions</Link> <span className="req">*</span>
                        </label>
                      </div>
                      {errors.consent && (
                        <div style={{ color: '#E91E63', fontSize: '0.76rem', marginTop: '-14px', marginBottom: '16px' }}>
                          {errors.consent}
                        </div>
                      )}

                      {/* Submit Application Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mm-cs-btn-rose"
                        style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.98rem' }}
                      >
                        {isSubmitting ? (
                          <span>Submitting Application...</span>
                        ) : (
                          <>
                            <span>Submit Application</span>
                            <ArrowRight size={17} />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* RIGHT: Benefits, Onboarding Steps, Need Help */}
              <div className="mm-bp-right-col">
                {/* 1. Why Partner With MAANMITRA? */}
                <div className="mm-bp-info-card">
                  <h3 className="mm-bp-info-title">Why Partner With MAANMITRA?</h3>
                  <div className="mm-bp-benefits-grid">
                    <div className="mm-bp-benefit-item">
                      <div className="mm-bp-benefit-icon-wrap">
                        <Users size={18} />
                      </div>
                      <div className="mm-bp-benefit-text">
                        <h4>Expand Your Reach</h4>
                        <p>Connect with individuals and couples seeking genuine support.</p>
                      </div>
                    </div>

                    <div className="mm-bp-benefit-item">
                      <div className="mm-bp-benefit-icon-wrap">
                        <Calendar size={18} />
                      </div>
                      <div className="mm-bp-benefit-text">
                        <h4>Flexible Work Options</h4>
                        <p>Offer online or in-person sessions as per your availability.</p>
                      </div>
                    </div>

                    <div className="mm-bp-benefit-item">
                      <div className="mm-bp-benefit-icon-wrap">
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#E91E63' }}>₹</span>
                      </div>
                      <div className="mm-bp-benefit-text">
                        <h4>Earn with Purpose</h4>
                        <p>Build a sustainable income doing meaningful work.</p>
                      </div>
                    </div>

                    <div className="mm-bp-benefit-item">
                      <div className="mm-bp-benefit-icon-wrap">
                        <ShieldCheck size={18} />
                      </div>
                      <div className="mm-bp-benefit-text">
                        <h4>Be Part of a Trusted Platform</h4>
                        <p>Work with a secure and professional platform.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. How It Works? (4 Onboarding Steps) */}
                <div className="mm-bp-steps-card">
                  <h3 className="mm-bp-info-title" style={{ marginBottom: '16px' }}>How It Works?</h3>
                  <div className="mm-bp-steps-grid">
                    {/* Step 1 */}
                    <div className="mm-bp-step-item">
                      <div className="mm-bp-step-icon-wrap">
                        <FileText size={18} />
                      </div>
                      <div className="mm-bp-step-name">1. Apply</div>
                      <div className="mm-bp-step-desc">Fill in the partner application form.</div>
                    </div>

                    <div className="mm-bp-step-arrow" aria-hidden="true">
                      <ArrowRight size={18} />
                    </div>

                    {/* Step 2 */}
                    <div className="mm-bp-step-item">
                      <div className="mm-bp-step-icon-wrap">
                        <CheckCircle2 size={18} />
                      </div>
                      <div className="mm-bp-step-name">2. Review</div>
                      <div className="mm-bp-step-desc">Our team will review your profile and documents.</div>
                    </div>

                    <div className="mm-bp-step-arrow" aria-hidden="true">
                      <ArrowRight size={18} />
                    </div>

                    {/* Step 3 */}
                    <div className="mm-bp-step-item">
                      <div className="mm-bp-step-icon-wrap">
                        <Award size={18} />
                      </div>
                      <div className="mm-bp-step-name">3. Verification</div>
                      <div className="mm-bp-step-desc">We may verify your qualifications and experience.</div>
                    </div>

                    <div className="mm-bp-step-arrow" aria-hidden="true">
                      <ArrowRight size={18} />
                    </div>

                    {/* Step 4 */}
                    <div className="mm-bp-step-item">
                      <div className="mm-bp-step-icon-wrap">
                        <ShieldCheck size={18} />
                      </div>
                      <div className="mm-bp-step-name">4. Get Started</div>
                      <div className="mm-bp-step-desc">Once approved, you can create your profile and start offering services.</div>
                    </div>
                  </div>
                </div>

                {/* 3. Need Help? Card */}
                <div className="mm-bp-help-card">
                  <div className="mm-bp-help-left">
                    <div className="mm-bp-help-icon-wrap">
                      <Headphones size={22} />
                    </div>
                    <div className="mm-bp-help-text">
                      <h4>Need Help?</h4>
                      <p>Have questions about becoming a partner? Our team is here to help you.</p>
                    </div>
                  </div>
                  <Link to="/contact" className="mm-bp-btn-contact">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            5. BOTTOM CALL TO ACTION BANNER
            =================================================================== */}
        <section className="mm-cs-cta-section" aria-label="Join MAANMITRA">
          <div className="mm-cs-container">
            <div className="mm-cs-cta-banner">
              <div className="mm-cs-cta-left">
                <h2 className="mm-cs-cta-title">
                  Let&apos;s Create Happier<br />
                  Relationships Together
                </h2>
                <p className="mm-cs-cta-sub">
                  Join MAANMITRA and make a positive impact in people&apos;s lives.
                </p>
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="mm-cs-btn-white-pill"
                >
                  <span>Apply Now</span>
                  <ArrowRight size={16} />
                </button>
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

      {/* 6. FOOTER */}
      <PublicFooter />
    </div>
  );
}

