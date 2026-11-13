import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, CheckCircle2, Clock, AlertCircle,
  ArrowRight, User, Mail, Phone, Lock, Sparkles,
  Heart, Globe, MessageSquare, Video, CreditCard,
  Zap, Star, BadgeCheck, IndianRupee, XCircle
} from 'lucide-react';
import { ManmitraSymbol } from '../../ManmitraLogo';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../apiConfig';

// ---------------------------------------------------------------------------
// 1. PARTNER REGISTRATION PAGE (/partner/register)
// ---------------------------------------------------------------------------

const BIO_TEMPLATES = [
  {
    title: 'Warm & Empathetic Listener',
    text: 'Warm and empathetic listener passionate about meaningful conversations, daily mindfulness, and personal growth. I offer a patient, calm, and completely judgment-free space for you to talk freely.'
  },
  {
    title: 'Friendly & Cheerful Companion',
    text: 'Friendly and upbeat conversationalist ready to hear about your day, share lighthearted laughs, and talk through life experiences, hobbies, books, and everyday lifestyle in a warm, welcoming environment.'
  },
  {
    title: 'Mindful Life & Relationship Companion',
    text: 'Attentive and thoughtful listener who loves discussing relationship harmony, career routines, and everyday wellness. Here to support you with kind words and genuine human companionship.'
  },
  {
    title: 'Calm & Comforting Presence',
    text: 'Calm and caring listener offering a safe haven to unwind, destress after a hectic day, or talk about anything on your mind. Always respectful, patient, and understanding.'
  }
];

export function PartnerRegisterPage() {
  const navigate = useNavigate();
  const { registerPartner } = useAuth();

  const [formData, setFormData] = useState({
    legal_name: '',
    display_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    bio: '',
    languages: 'Hindi, English',
    allows_chat: true,
    allows_audio: true,
    allows_video: false,
    age_confirmed: false,
    agree_terms: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', color: '#DC2626' };
    if (score === 2) return { score: 2, text: 'Fair', color: '#F59E0B' };
    if (score === 3) return { score: 3, text: 'Good', color: '#3B82F6' };
    return { score: 4, text: 'Strong', color: '#22A447' };
  };

  const validateField = (name, value, allData = formData) => {
    let error = '';
    switch (name) {
      case 'legal_name':
        if (!value.trim()) error = 'Legal name as per Government ID is required';
        else if (value.trim().length < 3) error = 'Legal name must be at least 3 characters';
        else if (!/^[A-Za-z\s.'-]+$/.test(value.trim())) error = 'Name can only contain alphabets and spaces';
        break;
      case 'display_name':
        if (!value.trim()) error = 'Public display name is required';
        else if (value.trim().length < 2) error = 'Display name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email address is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) error = 'Please enter a valid email address';
        break;
      case 'phone':
        if (!value.trim()) error = 'Mobile phone number is required';
        else if (!/^[6-9]\d{9}$/.test(value.trim().replace(/\D/g, ''))) error = 'Enter a valid 10-digit Indian phone number (starting with 6-9)';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        else if (!/(?=.*[0-9])|(?=.*[^A-Za-z0-9])/.test(value)) error = 'Include at least one number or symbol';
        break;
      case 'confirm_password':
        if (!value) error = 'Please confirm your password';
        else if (value !== allData.password) error = 'Passwords do not match';
        break;
      case 'languages':
        if (!value.trim()) error = 'Please list at least one spoken language';
        break;
      case 'bio':
        if (!value.trim()) error = 'Introduction / bio is required';
        else if (value.trim().length < 25) error = `Bio is too short (${value.trim().length}/25 characters required)`;
        break;
      case 'age_confirmed':
        if (!value) error = 'You must confirm that you are at least 18 years old';
        break;
      case 'agree_terms':
        if (!value) error = 'You must accept the Partner Code of Conduct and Platform Terms';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    const nextData = {
      ...formData,
      [name]: val
    };

    setFormData(nextData);

    // Validate on change if already touched
    if (touched[name]) {
      const fieldErr = validateField(name, val, nextData);
      setErrors(prev => ({ ...prev, [name]: fieldErr }));
    }

    // Special case for password match
    if (name === 'password' && touched.confirm_password) {
      setErrors(prev => ({ ...prev, confirm_password: validateField('confirm_password', formData.confirm_password, nextData) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErr = validateField(name, val, formData);
    setErrors(prev => ({ ...prev, [name]: fieldErr }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key], formData);
      if (err) newErrors[key] = err;
    });

    if (!formData.allows_chat && !formData.allows_audio && !formData.allows_video) {
      newErrors.formats = 'Please select at least one conversation format';
    }

    setErrors(newErrors);
    // Mark all as touched
    const allTouched = {};
    Object.keys(formData).forEach(k => { allTouched[k] = true; });
    setTouched(allTouched);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateAll()) {
      setErrorMsg('Please resolve all validation errors before proceeding.');
      return;
    }

    setLoading(true);

    try {
      await registerPartner({
        full_name: formData.legal_name.trim(),
        legal_name: formData.legal_name.trim(),
        display_name: formData.display_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim().replace(/\D/g, ''),
        password: formData.password,
        bio: formData.bio.trim(),
        languages: formData.languages.trim(),
        allows_chat: formData.allows_chat,
        allows_audio: formData.allows_audio,
        allows_video: formData.allows_video,
        hourly_rate: 99,
        rate_chat_15m: 99,
        rate_audio_30m: 299,
        rate_video_30m: 499
      });
      navigate('/partner/onboarding');
    } catch (err) {
      setErrorMsg(err.message || 'Partner registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const pwdStrength = getPasswordStrength(formData.password);

  return (
    <div className="mm-page-wrapper" style={{ background: '#FFF1F5', minHeight: '100vh' }}>
      <PublicNavbar />

      <main className="mm-auth-container" style={{ maxWidth: '680px', margin: '40px auto', padding: '0 20px' }}>
        <div className="mm-auth-card" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '40px', boxShadow: '0 12px 36px rgba(74, 21, 75, 0.08)', border: '1px solid #F1DCE5' }}>
          <div className="mm-auth-header" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <img
                src="/maanmitra-original-logo-transparent.png"
                alt="MAANMITRA Logo"
                style={{ height: '48px', objectFit: 'contain' }}
              />
            </div>
            <h1 className="mm-auth-title" style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.9rem', color: '#4A154B', fontWeight: 800, marginBottom: '8px' }}>
              Become a Maanmitra Partner
            </h1>
            <p className="mm-auth-subtitle" style={{ color: '#6E5268', fontSize: '0.94rem', lineHeight: 1.5, maxWidth: '520px', margin: '0 auto' }}>
              Provide empathetic, judgment-free listening in a safe, verified environment with flexible hours and private communication.
            </p>
          </div>

          {errorMsg && (
            <div className="mm-alert mm-alert-error" style={{ background: '#FEECEE', color: '#DC2626', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', border: '1px solid #F87171' }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mm-auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Row 1: Legal Name & Display Name */}
            <div className="mm-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div className="mm-form-group">
                <label className="mm-form-label" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#32152E', marginBottom: '6px' }}>
                  Legal Full Name <span style={{ color: '#E91E63' }}>*</span>
                  <span style={{ fontSize: '0.74rem', color: '#9E8C9B', fontWeight: 400, marginLeft: '6px' }}>(Private, for KYC)</span>
                </label>
                <input
                  type="text"
                  name="legal_name"
                  placeholder="As per Government ID"
                  value={formData.legal_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mm-input ${errors.legal_name && touched.legal_name ? 'error' : ''}`}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: errors.legal_name && touched.legal_name ? '1.5px solid #DC2626' : '1.5px solid #E5D5DE',
                    outline: 'none',
                    fontSize: '0.92rem'
                  }}
                  required
                />
                {errors.legal_name && touched.legal_name && (
                  <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '4px' }}>{errors.legal_name}</p>
                )}
              </div>

              <div className="mm-form-group">
                <label className="mm-form-label" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#32152E', marginBottom: '6px' }}>
                  Public Display Name <span style={{ color: '#E91E63' }}>*</span>
                  <span style={{ fontSize: '0.74rem', color: '#9E8C9B', fontWeight: 400, marginLeft: '6px' }}>(Visible to members)</span>
                </label>
                <input
                  type="text"
                  name="display_name"
                  placeholder="e.g. Priya Sharma"
                  value={formData.display_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mm-input ${errors.display_name && touched.display_name ? 'error' : ''}`}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: errors.display_name && touched.display_name ? '1.5px solid #DC2626' : '1.5px solid #E5D5DE',
                    outline: 'none',
                    fontSize: '0.92rem'
                  }}
                  required
                />
                {errors.display_name && touched.display_name && (
                  <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '4px' }}>{errors.display_name}</p>
                )}
              </div>
            </div>

            {/* Row 2: Email & Phone */}
            <div className="mm-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div className="mm-form-group">
                <label className="mm-form-label" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#32152E', marginBottom: '6px' }}>
                  Email Address <span style={{ color: '#E91E63' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="companion@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mm-input ${errors.email && touched.email ? 'error' : ''}`}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: errors.email && touched.email ? '1.5px solid #DC2626' : '1.5px solid #E5D5DE',
                    outline: 'none',
                    fontSize: '0.92rem'
                  }}
                  required
                />
                {errors.email && touched.email && (
                  <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '4px' }}>{errors.email}</p>
                )}
              </div>

              <div className="mm-form-group">
                <label className="mm-form-label" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#32152E', marginBottom: '6px' }}>
                  Phone Number <span style={{ color: '#E91E63' }}>*</span>
                  <span style={{ fontSize: '0.74rem', color: '#9E8C9B', fontWeight: 400, marginLeft: '6px' }}>(Private, never disclosed)</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mm-input ${errors.phone && touched.phone ? 'error' : ''}`}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: errors.phone && touched.phone ? '1.5px solid #DC2626' : '1.5px solid #E5D5DE',
                    outline: 'none',
                    fontSize: '0.92rem'
                  }}
                  required
                />
                {errors.phone && touched.phone && (
                  <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '4px' }}>{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Row 3: Password & Confirm Password */}
            <div className="mm-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div className="mm-form-group">
                <label className="mm-form-label" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#32152E', marginBottom: '6px' }}>
                  Account Password <span style={{ color: '#E91E63' }}>*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mm-input ${errors.password && touched.password ? 'error' : ''}`}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: errors.password && touched.password ? '1.5px solid #DC2626' : '1.5px solid #E5D5DE',
                    outline: 'none',
                    fontSize: '0.92rem'
                  }}
                  required
                />
                {formData.password && (
                  <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          style={{
                            height: '4px',
                            flex: 1,
                            borderRadius: '2px',
                            background: step <= pwdStrength.score ? pwdStrength.color : '#E5D5DE',
                            transition: 'background 0.3s'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: pwdStrength.color }}>
                      {pwdStrength.text}
                    </span>
                  </div>
                )}
                {errors.password && touched.password && (
                  <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '4px' }}>{errors.password}</p>
                )}
              </div>

              <div className="mm-form-group">
                <label className="mm-form-label" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#32152E', marginBottom: '6px' }}>
                  Confirm Password <span style={{ color: '#E91E63' }}>*</span>
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  placeholder="Re-enter password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mm-input ${errors.confirm_password && touched.confirm_password ? 'error' : ''}`}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: errors.confirm_password && touched.confirm_password ? '1.5px solid #DC2626' : '1.5px solid #E5D5DE',
                    outline: 'none',
                    fontSize: '0.92rem'
                  }}
                  required
                />
                {errors.confirm_password && touched.confirm_password && (
                  <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '4px' }}>{errors.confirm_password}</p>
                )}
              </div>
            </div>

            {/* Row 4: Spoken Languages */}
            <div className="mm-form-group">
              <label className="mm-form-label" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#32152E', marginBottom: '6px' }}>
                Spoken Languages <span style={{ color: '#E91E63' }}>*</span>
              </label>
              <input
                type="text"
                name="languages"
                placeholder="e.g. Hindi, English, Marathi, Bengali, Gujarati"
                value={formData.languages}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mm-input"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: errors.languages && touched.languages ? '1.5px solid #DC2626' : '1.5px solid #E5D5DE',
                  outline: 'none',
                  fontSize: '0.92rem'
                }}
                required
              />
              {errors.languages && touched.languages && (
                <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '4px' }}>{errors.languages}</p>
              )}
            </div>

            {/* Intro / Bio with Suggestions */}
            <div className="mm-form-group">
              <label className="mm-form-label" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#32152E', marginBottom: '6px' }}>
                Short Intro / Bio <span style={{ color: '#E91E63' }}>*</span>
                <span style={{ fontSize: '0.74rem', color: '#9E8C9B', fontWeight: 400, marginLeft: '6px' }}>(At least 25 characters)</span>
              </label>
              <textarea
                name="bio"
                rows="4"
                placeholder="Share your friendly conversational style, the life topics you love discussing, and how you create a warm, comfortable space for people..."
                value={formData.bio}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mm-textarea"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: errors.bio && touched.bio ? '1.5px solid #DC2626' : '1.5px solid #E5D5DE',
                  outline: 'none',
                  fontSize: '0.92rem',
                  resize: 'vertical'
                }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                {errors.bio && touched.bio ? (
                  <p style={{ color: '#DC2626', fontSize: '0.78rem' }}>{errors.bio}</p>
                ) : <span />}
                <span style={{ fontSize: '0.74rem', color: '#9E8C9B' }}>
                  {formData.bio.trim().length} chars
                </span>
              </div>

              {/* Bio Suggestions Box */}
              <div
                style={{
                  marginTop: '10px',
                  background: 'linear-gradient(135deg, #FFF8FA 0%, #FFF1F5 100%)',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid #F0DCE8'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#4A154B',
                    marginBottom: '10px'
                  }}
                >
                  <Sparkles size={16} color="#E91E63" /> Suggested Bio Starters (click any to use):
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '10px'
                  }}
                >
                  {BIO_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, bio: tmpl.text }));
                        setErrors((prev) => ({ ...prev, bio: '' }));
                        setTouched((prev) => ({ ...prev, bio: true }));
                      }}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #E6D2DF',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#E91E63';
                        e.currentTarget.style.background = '#FFF5F8';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E6D2DF';
                        e.currentTarget.style.background = '#FFFFFF';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E91E63', marginBottom: '4px' }}>
                        ✨ {tmpl.title}
                      </div>
                      <div
                        style={{
                          fontSize: '0.74rem',
                          color: '#665063',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {tmpl.text}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Communication formats */}
            <div className="mm-form-group">
              <label className="mm-form-label" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#32152E', marginBottom: '8px' }}>
                Preferred Communication Formats <span style={{ color: '#E91E63' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#4A154B' }}>
                  <input
                    type="checkbox"
                    name="allows_chat"
                    checked={formData.allows_chat}
                    onChange={handleChange}
                    style={{ accentColor: '#E91E63' }}
                  />
                  <span>Text Chat</span>
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#4A154B' }}>
                  <input
                    type="checkbox"
                    name="allows_audio"
                    checked={formData.allows_audio}
                    onChange={handleChange}
                    style={{ accentColor: '#E91E63' }}
                  />
                  <span>Audio Call</span>
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#4A154B' }}>
                  <input
                    type="checkbox"
                    name="allows_video"
                    checked={formData.allows_video}
                    onChange={handleChange}
                    style={{ accentColor: '#E91E63' }}
                  />
                  <span>Video Call</span>
                </label>
              </div>
              {errors.formats && (
                <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '4px' }}>{errors.formats}</p>
              )}
            </div>

            {/* Declarations & Agreements */}
            <div style={{ background: '#FFF8FA', padding: '16px', borderRadius: '12px', border: '1px solid #F0DCE8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.86rem', color: '#4A154B' }}>
                <input
                  type="checkbox"
                  name="age_confirmed"
                  checked={formData.age_confirmed}
                  onChange={handleChange}
                  style={{ accentColor: '#E91E63', marginTop: '3px' }}
                />
                <span>I confirm that I am at least 18 years old and eligible to register as a partner.</span>
              </label>
              {errors.age_confirmed && touched.age_confirmed && (
                <p style={{ color: '#DC2626', fontSize: '0.78rem', marginLeft: '24px' }}>{errors.age_confirmed}</p>
              )}

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.86rem', color: '#4A154B' }}>
                <input
                  type="checkbox"
                  name="agree_terms"
                  checked={formData.agree_terms}
                  onChange={handleChange}
                  style={{ accentColor: '#E91E63', marginTop: '3px' }}
                />
                <span>
                  I agree to the <Link to="/terms" target="_blank" style={{ color: '#E91E63', textDecoration: 'underline' }}>Community Guidelines</Link> and <Link to="/privacy" target="_blank" style={{ color: '#E91E63', textDecoration: 'underline' }}>Partner Policy</Link>. I understand this platform offers active listening and emotional companionship, not clinical or medical therapy.
                </span>
              </label>
              {errors.agree_terms && touched.agree_terms && (
                <p style={{ color: '#DC2626', fontSize: '0.78rem', marginLeft: '24px' }}>{errors.agree_terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="ref-btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                fontSize: '1rem',
                marginTop: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1
              }}
            >
              {loading ? 'Submitting Registration...' : 'Complete Registration & Proceed'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F0DCE8', fontSize: '0.88rem', color: '#6E5268' }}>
            Already registered as a partner?{' '}
            <Link to="/login" style={{ color: '#E91E63', fontWeight: 700 }}>
              Sign in to Partner Portal
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. PARTNER ONBOARDING PAYMENT PAGE (/partner/onboarding)
// ---------------------------------------------------------------------------

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function PartnerOnboardingPaymentPage() {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();

  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/partner/onboarding/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOnboardingStatus(data);
        if (data.verification_status && data.verification_status !== user?.partner_status) {
          const updated = { ...user, partner_status: data.verification_status };
          setUser(updated);
          localStorage.setItem('mm_user', JSON.stringify(updated));
        }
        if (data.verification_status === 'approved') {
          navigate('/partner/dashboard', { replace: true });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, user, setUser, navigate]);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  // Razorpay payment helper — Real Razorpay Checkout
  const doRazorpayPayment = async ({ createUrl, verifyUrl, amountLabel, description }) => {
    setErrorMsg('');
    setPayLoading(true);
    try {
      const orderRes = await fetch(createUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.detail || 'Could not initiate payment order.');
      }
      const order = await orderRes.json();

      const rawOrderId = order.order_id || order.id || '';
      const isRealRazorpayOrder = rawOrderId && String(rawOrderId).startsWith('order_') && !String(rawOrderId).startsWith('order_mock_');

      const rawKey = order.razorpay_key || order.key_id || RAZORPAY_KEY;
      const resolvedKey = (rawKey && !rawKey.includes('mock') && !rawKey.includes('test')) ? rawKey : 'rzp_live_TwgPINXkMnFaPI';

      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded || !window.Razorpay) {
        setErrorMsg('Razorpay payment gateway failed to load. Please check your network connection.');
        setPayLoading(false);
        return;
      }

      const rzpOptions = {
        key: resolvedKey,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'MAANMITRA',
        description,
        image: '/manmitra-app-icon.png',
        handler: async (response) => {
          try {
            const verRes = await fetch(verifyUrl, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || rawOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || ''
              })
            });
            if (verRes.ok) {
              setSuccessMsg(`${amountLabel} confirmed!`);
              await fetchStatus();
              if (verifyUrl.includes('verify-registration-payment')) {
                setTimeout(() => {
                  navigate('/partner/dashboard', { replace: true });
                }, 800);
              }
            } else {
              const err = await verRes.json().catch(() => ({}));
              setErrorMsg(err.detail || 'Payment verification failed. Please contact support.');
            }
          } catch (e) {
            setErrorMsg('Network error verifying payment. Please contact support.');
          } finally {
            setPayLoading(false);
          }
        },
        prefill: { email: user?.email || '', contact: user?.phone || '' },
        theme: { color: '#50164F' },
        modal: {
          ondismiss: () => {
            setPayLoading(false);
            setErrorMsg('Payment cancelled. You can complete it whenever you are ready.');
          }
        }
      };

      if (isRealRazorpayOrder) {
        rzpOptions.order_id = rawOrderId;
      }

      const rzp = new window.Razorpay(rzpOptions);

      rzp.on('payment.failed', function (resp) {
        setPayLoading(false);
        setErrorMsg(resp?.error?.description || 'Payment transaction failed. Please retry.');
      });

      rzp.open();
    } catch (err) {
      setErrorMsg(err.message || 'Payment initiation failed. Please try again.');
      setPayLoading(false);
    }
  };

  const s = onboardingStatus;
  const nextStep = s?.next_step;

  const formatZoomDt = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleString('en-IN', {
        dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Kolkata'
      });
    } catch { return iso; }
  };

  // Step indicators - NO 499 mentioned prematurely
  const steps = [
    { label: 'Registration', sub: '₹99 one-time', done: s?.registration_fee_paid },
    { label: 'Zoom Induction', sub: s?.zoom_meeting_completed ? 'Completed' : s?.zoom_meeting_scheduled ? 'Scheduled' : 'Pending', done: s?.zoom_meeting_completed },
    { label: 'ID Activation', sub: s?.activation_fee_paid ? 'Active' : s?.zoom_meeting_completed ? 'Ready to Activate' : 'Locked', done: s?.activation_fee_paid },
    { label: 'Go Live', sub: 'Accept clients', done: s?.verification_status === 'approved' }
  ];
  const currentStep = !s?.registration_fee_paid ? 0 : !s?.zoom_meeting_completed ? 1 : !s?.activation_fee_paid ? 2 : 3;

  const cardStyle = {
    background: '#FFFFFF', borderRadius: '20px', padding: '28px 32px',
    boxShadow: '0 8px 32px rgba(74,21,75,0.1)', border: '1px solid #F1DCE5', marginBottom: '20px'
  };

  const stepDot = (i) => ({
    width: '34px', height: '34px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '0.85rem', flexShrink: 0,
    background: steps[i]?.done ? '#22A447' : i === currentStep ? '#4A154B' : '#F3E8F5',
    color: (steps[i]?.done || i === currentStep) ? '#FFF' : '#9B7EA8', transition: 'all 0.3s'
  });

  return (
    <div className="mm-page-wrapper" style={{ background: '#FFF1F5', minHeight: '100vh' }}>
      <PublicNavbar />
      <main style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 20px 80px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src="/maanmitra-original-logo-transparent.png" alt="MAANMITRA" style={{ height: '44px', objectFit: 'contain' }} />
          <h1 style={{ color: '#4A154B', fontSize: '1.4rem', fontWeight: '700', margin: '12px 0 4px' }}>Complete Your Registration</h1>
          <p style={{ color: '#756572', fontSize: '0.9rem' }}>Follow the steps to become a MAANMITRA counsellor</p>
        </div>

        {/* Step Bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '28px', gap: '0' }}>
          {steps.map((st, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none', minWidth: '64px' }}>
                <div style={stepDot(i)}>
                  {st.done ? <CheckCircle2 size={17} /> : i + 1}
                </div>
                <div style={{ marginTop: '6px', fontSize: '0.7rem', fontWeight: '600', color: st.done ? '#22A447' : i === currentStep ? '#4A154B' : '#9B7EA8', textAlign: 'center', lineHeight: 1.3 }}>
                  {st.label}
                </div>
                <div style={{ fontSize: '0.63rem', color: '#B4A0B8', textAlign: 'center' }}>{st.sub}</div>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: '2px', background: steps[i]?.done ? '#22A447' : '#E5D0EB', borderRadius: '2px', margin: '17px 4px 0' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Alerts */}
        {successMsg && (
          <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', color: '#16A34A', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ background: '#FEECEE', border: '1px solid #FCA5A5', color: '#DC2626', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
            <XCircle size={18} /> {errorMsg}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="mm-spinner" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#756572' }}>Loading your registration status...</p>
          </div>

        ) : s?.verification_status === 'suspended' ? (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '40px 24px' }}>
            <XCircle size={52} color="#DC2626" style={{ marginBottom: '14px' }} />
            <h2 style={{ color: '#4A154B' }}>Account Suspended</h2>
            <p style={{ color: '#756572' }}>Please contact support for resolution.</p>
            <a href="mailto:support@maanmitra.com" className="mm-btn-secondary">Contact Support</a>
          </div>

        ) : nextStep === 'pay_registration' ? (
          /* == STEP 1: Pay ₹99 == */
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'linear-gradient(135deg,#4A154B,#611E63)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={22} color="#FFF" />
              </div>
              <div>
                <h2 style={{ margin: 0, color: '#4A154B', fontSize: '1.15rem', fontWeight: '700' }}>Step 1 -- Registration Fee</h2>
                <p style={{ margin: '2px 0 0', color: '#756572', fontSize: '0.85rem' }}>Create your counsellor profile on MAANMITRA</p>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg,#4A154B,#320C33)', borderRadius: '16px', padding: '22px', marginBottom: '20px', textAlign: 'center', color: '#FFF' }}>
              <div style={{ fontSize: '0.82rem', opacity: 0.8, marginBottom: '4px' }}>One-time registration fee</div>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-1px' }}>₹99</div>
              <div style={{ fontSize: '0.78rem', opacity: 0.7, marginTop: '4px' }}>Includes profile creation + platform access</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              {['Counsellor profile created instantly', 'Listed in MAANMITRA marketplace', 'Full access to explore Partner Dashboard', 'Zoom induction call scheduled by our team'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: '1px solid #F9EDF3' }}>
                  <CheckCircle2 size={15} color="#22A447" /><span style={{ fontSize: '0.88rem', color: '#32152E' }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#FFF8E6', border: '1px solid #FDE68A', borderRadius: '10px', padding: '10px 14px', marginBottom: '18px', fontSize: '0.82rem', color: '#92400E' }}>
              <strong>What happens after payment?</strong><br />
              Your profile is created. You can immediately access and explore your Partner Dashboard. Our team will schedule a 1-on-1 Zoom induction call with you within 24--48 hours.
            </div>

            <button
              onClick={() => doRazorpayPayment({
                createUrl: `${API_BASE}/partner/onboarding/create-registration-order`,
                verifyUrl: `${API_BASE}/partner/onboarding/verify-registration-payment`,
                amountLabel: '₹99 registration fee',
                description: 'Counsellor Registration Fee'
              })}
              disabled={payLoading}
              style={{
                width: '100%', padding: '15px', background: 'linear-gradient(135deg,#4A154B,#611E63)',
                color: '#FFF', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: '700',
                cursor: payLoading ? 'not-allowed' : 'pointer', opacity: payLoading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: '0 4px 20px rgba(74,21,75,0.3)'
              }}
            >
              <CreditCard size={20} />
              {payLoading ? 'Processing...' : 'Pay ₹99 & Create Profile'}
            </button>
          </div>

        ) : nextStep === 'awaiting_zoom_schedule' ? (
          /* == STEP 2a: Registered, awaiting Zoom schedule == */
          <div>
            <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <CheckCircle2 size={22} color="#22A447" />
              <div>
                <div style={{ fontWeight: '700', color: '#16A34A', fontSize: '0.9rem' }}>Registration Complete</div>
                <div style={{ fontSize: '0.8rem', color: '#166534' }}>Your profile is created. Our team will schedule your Zoom induction call soon.</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#F3E8FF,#E9D5FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Video size={32} color="#7C3AED" />
                </div>
                <h2 style={{ color: '#4A154B', marginBottom: '8px', fontSize: '1.2rem' }}>Zoom Induction Meeting</h2>
                <p style={{ color: '#756572', maxWidth: '420px', margin: '0 auto 20px', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Our team will schedule a <strong>Zoom orientation call</strong> with you within <strong>24--48 hours</strong>. 
                  During the call, we'll walk you through the platform, guidelines, and answer any questions.
                </p>

                <div style={{ background: '#FFF8E6', border: '1px solid #FDE68A', borderRadius: '12px', padding: '14px 18px', textAlign: 'left', marginBottom: '20px' }}>
                  <div style={{ fontWeight: '700', color: '#92400E', fontSize: '0.88rem', marginBottom: '8px' }}> What to expect in the call:</div>
                  {['Platform overview and earning structure', 'Session guidelines and code of conduct', 'Profile setup tips for maximum bookings', 'Q&A with the MAANMITRA team'].map((item, i) => (
                    <div key={i} style={{ fontSize: '0.84rem', color: '#78350F', padding: '3px 0', display: 'flex', gap: '8px' }}>
                      <span>-</span> {item}
                    </div>
                  ))}
                </div>

                <div style={{ background: '#F9F5FF', border: '1px solid #E9D5FF', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', fontSize: '0.85rem', color: '#6D28D9' }}>
                  <strong>Check your registered email</strong> -- we'll send the Zoom link and meeting time there. 
                  You can also check back here once scheduled.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => navigate('/partner/dashboard')}
                    style={{
                      width: '100%', padding: '14px', background: 'linear-gradient(135deg,#4A154B,#611E63)',
                      color: '#FFF', border: 'none', borderRadius: '14px', fontSize: '0.96rem', fontWeight: '700',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: '0 4px 14px rgba(74,21,75,0.2)'
                    }}
                  >
                    Enter Platform & Explore Dashboard <ArrowRight size={18} />
                  </button>

                  <button
                    onClick={fetchStatus}
                    style={{
                      width: '100%', padding: '10px', background: 'transparent',
                      border: '1px solid #D4A8D4', color: '#4A154B', borderRadius: '12px',
                      cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem'
                    }}
                  >
                    Refresh Status
                  </button>
                </div>
              </div>
            </div>
          </div>

        ) : nextStep === 'awaiting_zoom_meeting' ? (
          /* == STEP 2b: Zoom Scheduled -- waiting for meeting == */
          <div>
            <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <CheckCircle2 size={22} color="#22A447" />
              <div>
                <div style={{ fontWeight: '700', color: '#16A34A', fontSize: '0.9rem' }}>Registration Complete</div>
                <div style={{ fontSize: '0.8rem', color: '#166534' }}>Your induction call is scheduled!</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Video size={22} color="#FFF" />
                </div>
                <div>
                  <h2 style={{ margin: 0, color: '#4A154B', fontSize: '1.15rem', fontWeight: '700' }}>Your Zoom Induction Call is Scheduled</h2>
                  <p style={{ margin: '2px 0 0', color: '#756572', fontSize: '0.85rem' }}>Attend the call with our team</p>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', color: '#FFF' }}>
                <div style={{ fontSize: '0.78rem', opacity: 0.85, marginBottom: '6px' }}> Meeting Date & Time (IST)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>
                  {formatZoomDt(s?.zoom_meeting_datetime) || 'Time to be confirmed'}
                </div>
                {s?.zoom_meeting_notes && (
                  <div style={{ fontSize: '0.82rem', opacity: 0.85 }}>{s.zoom_meeting_notes}</div>
                )}
              </div>

              {s?.zoom_meeting_link && (
                <a
                  href={s.zoom_meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    padding: '14px', background: '#2D8CFF', color: '#FFF', borderRadius: '14px',
                    textDecoration: 'none', fontWeight: '700', fontSize: '1rem', marginBottom: '16px',
                    boxShadow: '0 4px 20px rgba(45,140,255,0.3)'
                  }}
                >
                  <Video size={20} /> Join Zoom Meeting
                </a>
              )}

              <div style={{ background: '#FFF8E6', border: '1px solid #FDE68A', borderRadius: '10px', padding: '10px 14px', fontSize: '0.83rem', color: '#92400E', marginBottom: '16px' }}>
                <strong>After the meeting:</strong> Our team will mark your induction as complete, unlocking your account activation immediately.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => navigate('/partner/dashboard')}
                  style={{
                    width: '100%', padding: '14px', background: 'linear-gradient(135deg,#4A154B,#611E63)',
                    color: '#FFF', border: 'none', borderRadius: '14px', fontSize: '0.96rem', fontWeight: '700',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(74,21,75,0.2)'
                  }}
                >
                  Enter Platform & Explore Dashboard <ArrowRight size={18} />
                </button>

                <button
                  onClick={fetchStatus}
                  style={{
                    width: '100%', padding: '10px', background: 'transparent',
                    border: '1px solid #D4A8D4', color: '#4A154B', borderRadius: '12px',
                    cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem'
                  }}
                >
                  Refresh Status
                </button>
              </div>
            </div>
          </div>

        ) : nextStep === 'pay_activation' ? (
          /* == STEP 3: Pay ₹499 (VISIBLE ONLY AFTER ZOOM COMPLETED) == */
          <div>
            <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '14px', padding: '14px 18px', display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <CheckCircle2 size={22} color="#22A447" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: '700', color: '#16A34A', fontSize: '0.9rem' }}>Registration & Induction Complete</div>
                <div style={{ fontSize: '0.8rem', color: '#166534' }}>You've completed your Zoom induction. Activate your account to start accepting clients!</div>
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'linear-gradient(135deg,#E91E63,#D81B60)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={22} color="#FFF" />
                </div>
                <div>
                  <h2 style={{ margin: 0, color: '#4A154B', fontSize: '1.15rem', fontWeight: '700' }}>Step 3 -- ID Activation & Training</h2>
                  <p style={{ margin: '2px 0 0', color: '#756572', fontSize: '0.85rem' }}>Go live and start helping people</p>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg,#E91E63,#D81B60)', borderRadius: '16px', padding: '22px', marginBottom: '20px', textAlign: 'center', color: '#FFF' }}>
                <div style={{ fontSize: '0.82rem', opacity: 0.85, marginBottom: '4px' }}>One-time training & activation fee</div>
                <div style={{ fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-1px' }}>₹499</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.75, marginTop: '4px' }}>Instant activation -- start earning immediately</div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                {['Instant profile activation', 'Start accepting chat, audio & video sessions', 'Priority listing in search results', '70% revenue share on all earnings', 'Dedicated partner support'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: '1px solid #F9EDF3' }}>
                    <Star size={14} color="#D4AF77" fill="#D4AF77" /><span style={{ fontSize: '0.88rem', color: '#32152E' }}>{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => doRazorpayPayment({
                  createUrl: `${API_BASE}/partner/onboarding/create-activation-order`,
                  verifyUrl: `${API_BASE}/partner/onboarding/verify-activation-payment`,
                  amountLabel: '₹499 activation fee',
                  description: 'Training & Activation Fee'
                })}
                disabled={payLoading}
                style={{
                  width: '100%', padding: '15px', background: 'linear-gradient(135deg,#E91E63,#D81B60)',
                  color: '#FFF', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: '700',
                  cursor: payLoading ? 'not-allowed' : 'pointer', opacity: payLoading ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  boxShadow: '0 4px 20px rgba(233,30,99,0.3)'
                }}
              >
                <Zap size={20} />
                {payLoading ? 'Processing...' : 'Pay ₹499 & Activate Now'}
              </button>
            </div>
          </div>

        ) : (
          /* == Done == */
          <div style={{ ...cardStyle, textAlign: 'center', padding: '44px 32px' }}>
            <BadgeCheck size={64} color="#22A447" style={{ marginBottom: '14px' }} />
            <h2 style={{ color: '#4A154B', marginBottom: '8px' }}>You Are Activated!</h2>
            <p style={{ color: '#756572', maxWidth: '400px', margin: '0 auto 24px' }}>
              Your MAANMITRA counsellor profile is live. Start building your profile and accepting clients.
            </p>
            <button
              onClick={() => navigate('/partner/dashboard', { replace: true })}
              style={{ padding: '14px 32px', background: 'linear-gradient(135deg,#4A154B,#611E63)', color: '#FFF', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
            >
              Go to Dashboard <ArrowRight size={18} />
            </button>
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9B7EA8', marginTop: '14px' }}>
          Payments secured by Razorpay. Need help?{' '}
          <a href="mailto:support@maanmitra.com" style={{ color: '#4A154B' }}>Contact Support</a>
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}


// Legacy alias kept for backward-compat routing
export function PartnerVerificationPage() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/partner/onboarding', { replace: true }); }, [navigate]);
  return null;
}

// ---------------------------------------------------------------------------
// 3. APPLICATION STATUS TRACKER (/partner/status)
// ---------------------------------------------------------------------------
export function PartnerStatusPage() {
  const { user, token, setUser } = useAuth();
  const navigate = useNavigate();

  const [onboardingData, setOnboardingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/partner/onboarding/status`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setOnboardingData(data);
          if (data.verification_status && data.verification_status !== user?.partner_status) {
            const updated = { ...user, partner_status: data.verification_status };
            setUser(updated);
            localStorage.setItem('mm_user', JSON.stringify(updated));
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const s = onboardingData;
  const status = s?.verification_status || user?.partner_status || 'payment_pending';
  const regPaid = !!s?.registration_fee_paid;
  const zoomDone = !!s?.zoom_meeting_completed;
  const zoomScheduled = !!s?.zoom_meeting_scheduled;
  const actPaid = !!s?.activation_fee_paid;

  const steps = [
    { label: 'Profile Created', done: true },
    { label: 'Registration Fee (₹99)', done: regPaid },
    { label: 'Zoom Induction Call', done: zoomDone, sub: zoomDone ? 'Completed' : zoomScheduled ? 'Scheduled' : 'Pending' },
    { label: 'ID Activation', done: actPaid, sub: actPaid ? 'Activated' : zoomDone ? 'Ready to Activate' : 'Locked' },
    { label: 'Go Live & Accept Clients', done: status === 'approved' }
  ];

  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />

      <div className="mm-container" style={{ padding: '50px 16px 80px', maxWidth: '680px' }}>
        <div className="mm-content-card" style={{ textAlign: 'center', padding: '40px 24px' }}>

          {status === 'approved' ? (
            <>
              <div className="mm-status-icon-wrap approved">
                <BadgeCheck size={56} color="var(--mm-success)" />
              </div>
              <h1 className="mm-section-title">You Are Live on MAANMITRA!</h1>
              <p style={{ color: 'var(--mm-secondary-text)', maxWidth: '480px', margin: '12px auto 24px' }}>
                Your profile is active. You can now accept clients, manage bookings, and start earning.
              </p>
              <button onClick={() => navigate('/partner/dashboard')} className="mm-btn-primary mm-btn-lg">
                Go to Partner Dashboard <ArrowRight size={18} />
              </button>
            </>
          ) : status === 'suspended' ? (
            <>
              <div className="mm-status-icon-wrap rejected">
                <AlertCircle size={56} color="var(--mm-error)" />
              </div>
              <h1 className="mm-section-title">Account Suspended</h1>
              <p style={{ color: 'var(--mm-secondary-text)', maxWidth: '480px', margin: '12px auto 16px' }}>
                Your account has been suspended. Please contact our support team for resolution.
              </p>
              {s?.suspend_reason && (
                <div style={{ background: '#FEECEE', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px 14px', borderRadius: '12px', fontSize: '0.86rem', maxWidth: '440px', margin: '0 auto 20px', textAlign: 'left' }}>
                  <strong>Admin Note:</strong> {s.suspend_reason}
                </div>
              )}
              <a href="mailto:support@maanmitra.com" className="mm-btn-secondary">Contact Support</a>
            </>
          ) : status === 'rejected' ? (
            <>
              <div className="mm-status-icon-wrap rejected">
                <AlertCircle size={56} color="var(--mm-error)" />
              </div>
              <h1 className="mm-section-title">Application Rejected</h1>
              <p style={{ color: 'var(--mm-secondary-text)', maxWidth: '480px', margin: '12px auto 16px' }}>
                Your application was rejected by admin. Please contact support for clarification.
              </p>
              <a href="mailto:support@maanmitra.com" className="mm-btn-secondary">Contact Support</a>
            </>
          ) : (
            <>
              <div className="mm-status-icon-wrap pending">
                <Clock size={56} color="var(--mm-warning)" />
              </div>
              <h1 className="mm-section-title">
                {regPaid ? 'Account Created -- Induction Pending' : 'Complete Your Registration'}
              </h1>
              <p style={{ color: 'var(--mm-secondary-text)', maxWidth: '480px', margin: '12px auto 24px' }}>
                {regPaid
                  ? 'Your ₹99 registration is verified. You can explore the Partner Dashboard while waiting for your Zoom induction call.'
                  : 'Pay the ₹99 registration fee to create your counsellor profile.'}
              </p>

              {/* Progress Steps */}
              <div className="mm-status-steps" style={{ textAlign: 'left', maxWidth: '420px', margin: '0 auto 24px' }}>
                {steps.map((stepItem, i) => (
                  <div key={i} className={`mm-status-step ${stepItem.done ? 'completed' : ''}`}>
                    <div className="mm-step-circle">{stepItem.done ? 'v' : i + 1}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{stepItem.label}</div>
                      {stepItem.sub && <div style={{ fontSize: '0.75rem', color: '#888' }}>{stepItem.sub}</div>}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {regPaid && (
                  <button onClick={() => navigate('/partner/dashboard')} className="mm-btn-primary mm-btn-lg">
                    Go to Partner Dashboard <ArrowRight size={18} />
                  </button>
                )}
                <button
                  onClick={() => navigate('/partner/onboarding')}
                  className={regPaid ? "mm-btn-secondary mm-btn-lg" : "mm-btn-primary mm-btn-lg"}
                >
                  <CreditCard size={18} /> {regPaid ? 'View Induction Status' : 'Pay ₹99 Registration'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

