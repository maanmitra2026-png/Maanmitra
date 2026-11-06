import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../apiConfig';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mm_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('mm_token') || '';
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate session if token exists
    if (token) {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) return res.json();
          // Stale or expired token: silently clean up local storage
          localStorage.removeItem('mm_token');
          localStorage.removeItem('mm_user');
          setToken('');
          setUser(null);
          return null;
        })
        .then(data => {
          if (!data) return;
          const updated = {
            id: data.id,
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            account_status: data.account_status,
            avatar: data.avatar_url,
            avatar_url: data.avatar_url,
            partner_id: data.partner_id || data.partner_profile?.id,
            partner_status: data.partner_status || data.partner_profile?.verification_status,
            partner_profile: data.partner_profile,
            subscription_paid: !!(data.subscription_paid),
            wallet_balance_inr: data.wallet_balance_inr || 0
          };
          setUser(updated);
          localStorage.setItem('mm_user', JSON.stringify(updated));
        })
        .catch(() => {
          localStorage.removeItem('mm_token');
          localStorage.removeItem('mm_user');
          setToken('');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to login');
    }

    const data = await res.json();
    setToken(data.access_token);
    localStorage.setItem('mm_token', data.access_token);

    const userInfo = {
      id: data.user_id,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      avatar: data.avatar_url,
      avatar_url: data.avatar_url,
      phone: data.phone || '',
      partner_id: data.partner_id,
      partner_status: data.partner_status,
      subscription_paid: !!(data.subscription_paid),
      wallet_balance_inr: data.wallet_balance_inr || 0
    };
    setUser(userInfo);
    localStorage.setItem('mm_user', JSON.stringify(userInfo));
    return userInfo;
  };

  const registerUser = async (formData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }

    const data = await res.json();
    setToken(data.access_token);
    localStorage.setItem('mm_token', data.access_token);

    const userInfo = {
      id: data.user_id,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      avatar: data.avatar_url,
      wallet_balance_inr: data.wallet_balance_inr || 0
    };
    setUser(userInfo);
    localStorage.setItem('mm_user', JSON.stringify(userInfo));
    return userInfo;
  };

  const registerPartner = async (formData) => {
    const res = await fetch(`${API_BASE}/partner/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Partner registration failed');
    }

    const data = await res.json();
    setToken(data.access_token);
    localStorage.setItem('mm_token', data.access_token);

    const userInfo = {
      id: data.user_id,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      partner_id: data.partner_id,
      partner_status: data.partner_status
    };
    setUser(userInfo);
    localStorage.setItem('mm_user', JSON.stringify(userInfo));
    return userInfo;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('mm_token');
    localStorage.removeItem('mm_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, registerUser, registerPartner, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
