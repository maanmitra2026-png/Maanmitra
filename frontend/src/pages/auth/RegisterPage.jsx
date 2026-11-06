import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock, Mail, User, Phone, ArrowRight, AlertCircle,
  CheckCircle2, ShieldCheck, Heart
} from 'lucide-react';
import { ManmitraSymbol } from '../../ManmitraLogo';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser, user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (user.role === 'maanmitra_partner') navigate('/partner/dashboard', { replace: true });
      else navigate('/user/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const pwd = formData.password.trim();
    const confirmPwd = formData.confirm_password.trim();

    if (pwd !== confirmPwd) {
      setErrorMsg('Passwords do not match. Please check both password fields.');
      return;
    }

    if (pwd.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        password: pwd
      });

      // Redirect to Member Dashboard
      navigate('/user/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />

      <div className="mm-auth-container">
        <div className="mm-auth-card">
          <div className="mm-auth-header">
            <ManmitraSymbol size={48} color="var(--mm-rose)" />
            <h1 className="mm-auth-title">Create Member Account</h1>
            <p className="mm-auth-subtitle">Join MAANMITRA to explore verified companions and share friendly conversations</p>
          </div>

          {errorMsg && (
            <div className="mm-alert mm-alert-error">
              <AlertCircle size={18} /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleRegister} className="mm-auth-form">
            <div className="mm-form-group">
              <label className="mm-form-label">Full Name</label>
              <div className="mm-input-icon-wrap">
                <User size={18} color="var(--mm-secondary-text)" />
                <input
                  type="text"
                  name="full_name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="mm-input"
                  required
                />
              </div>
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Email Address</label>
              <div className="mm-input-icon-wrap">
                <Mail size={18} color="var(--mm-secondary-text)" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="mm-input"
                  required
                />
              </div>
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Phone Number (Optional)</label>
              <div className="mm-input-icon-wrap">
                <Phone size={18} color="var(--mm-secondary-text)" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mm-input"
                />
              </div>
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Password</label>
              <div className="mm-input-icon-wrap">
                <Lock size={18} color="var(--mm-secondary-text)" />
                <input
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="mm-input"
                  required
                />
              </div>
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Confirm Password</label>
              <div className="mm-input-icon-wrap">
                <Lock size={18} color="var(--mm-secondary-text)" />
                <input
                  type="password"
                  name="confirm_password"
                  placeholder="Re-enter password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="mm-input"
                  required
                />
              </div>
            </div>

            <div className="mm-auth-terms-note">
              By creating an account, you agree to MAANMITRA's{' '}
              <Link to="/terms" style={{ color: 'var(--mm-rose)' }}>Terms of Service</Link> and{' '}
              <Link to="/privacy" style={{ color: 'var(--mm-rose)' }}>Privacy Policy</Link>.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mm-btn-primary mm-btn-block mm-btn-lg"
              style={{ marginTop: '14px' }}
            >
              {loading ? 'Creating Account...' : 'Register as Member'}
            </button>
          </form>

          <div className="mm-auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--mm-rose)', fontWeight: 600 }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
