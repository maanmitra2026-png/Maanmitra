import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { ManmitraSymbol } from '../../ManmitraLogo';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { API_BASE } from '../../apiConfig';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(`${API_BASE}/auth/forgot-password?email=${encodeURIComponent(email.trim())}`, {
        method: 'POST'
      });
    } catch (err) {
      console.warn('Fallback confirmation on reset request:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />

      <div className="mm-auth-container">
        <div className="mm-auth-card">
          <div className="mm-auth-header">
            <ManmitraSymbol size={48} color="var(--mm-rose)" />
            <h1 className="mm-auth-title">Reset Your Password</h1>
            <p className="mm-auth-subtitle">Enter your registered email address to receive password reset instructions</p>
          </div>

          {submitted ? (
            <div className="mm-alert mm-alert-success" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600 }}>
                <CheckCircle2 size={18} /> Password Reset Email Sent
              </div>
              <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                If an account exists for <strong>{email}</strong>, you will receive an email shortly with instructions to reset your password.
              </p>
              <Link to="/login" className="mm-btn-primary mm-btn-sm" style={{ marginTop: '14px' }}>
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mm-auth-form">
              <div className="mm-form-group">
                <label className="mm-form-label">Email Address</label>
                <div className="mm-input-icon-wrap">
                  <Mail size={18} color="var(--mm-secondary-text)" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mm-input"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mm-btn-primary mm-btn-block mm-btn-lg"
                style={{ marginTop: '12px' }}
              >
                {loading ? 'Sending Instructions...' : 'Send Password Reset Link'}
              </button>
            </form>
          )}

          <div className="mm-auth-footer">
            <Link to="/login" style={{ color: 'var(--mm-rose)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
