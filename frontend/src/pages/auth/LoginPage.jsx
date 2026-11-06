import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Lock, Mail, ArrowRight, AlertCircle, Heart, Sparkles,
  ShieldCheck, UserCheck, KeyRound
} from 'lucide-react';
import { ManmitraSymbol } from '../../ManmitraLogo';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Check if there is a redirect parameter
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect');

  // Auto-redirect already authenticated users
  useEffect(() => {
    if (user) {
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'maanmitra_partner') {
        if (user.partner_status === 'approved') {
          navigate('/partner/dashboard', { replace: true });
        } else {
          navigate('/partner/status', { replace: true });
        }
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    }
  }, [user, navigate, redirectPath]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const userInfo = await login(email, password);
      if (redirectPath) {
        navigate(redirectPath);
        return;
      }

      // Role-based redirect
      if (userInfo.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (userInfo.role === 'maanmitra_partner') {
        if (userInfo.partner_status === 'approved') {
          navigate('/partner/dashboard');
        } else {
          navigate('/partner/status');
        }
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />

      <div className="mm-auth-container">
        <div className="mm-auth-card">
          {/* Header */}
          <div className="mm-auth-header">
            <ManmitraSymbol size={48} color="var(--mm-rose)" />
            <h1 className="mm-auth-title">Welcome Back</h1>
            <p className="mm-auth-subtitle">Log in to continue your friendly conversation journey</p>
          </div>

          {errorMsg && (
            <div className="mm-alert mm-alert-error">
              <AlertCircle size={18} /> {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="mm-auth-form">
            <div className="mm-form-group">
              <label className="mm-form-label">Email Address</label>
              <div className="mm-input-icon-wrap">
                <Mail size={18} color="var(--mm-secondary-text)" />
                <input
                  type="email"
                  id="login-email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mm-input"
                  required
                />
              </div>
            </div>

            <div className="mm-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="mm-form-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--mm-rose)' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="mm-input-icon-wrap">
                <Lock size={18} color="var(--mm-secondary-text)" />
                <input
                  type="password"
                  id="login-password"
                  placeholder="--------"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mm-input"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="mm-btn-primary mm-btn-block mm-btn-lg"
              style={{ marginTop: '10px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In To Account'}
            </button>
          </form>

          {/* Footers */}
          <div className="mm-auth-footer">
            <p>
              Don't have an account yet?{' '}
              <Link to="/register" style={{ color: 'var(--mm-rose)', fontWeight: 600 }}>
                Sign up as Member
              </Link>
            </p>
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f1e2e9' }}>
              <p style={{ fontSize: '0.85rem' }}>
                Want to listen and earn as a companion?{' '}
                <Link to="/partner/register" style={{ color: 'var(--mm-plum)', fontWeight: 600 }}>
                  Apply as Partner 
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
