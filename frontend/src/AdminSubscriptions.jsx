import React, { useState, useEffect } from 'react';
import {
  Crown,
  ShieldCheck,
  CreditCard,
  SlidersHorizontal,
  BookOpen,
  Filter,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Sparkles,
  Users,
  Settings
} from 'lucide-react';

export default function AdminSubscriptions({ api, notify }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'subscriptions' | 'payments' | 'config' | 'content'
  const [stats, setStats] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [config, setConfig] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  // Load stats & overview
  async function loadAllData() {
    try {
      setLoading(true);
      const [st, sub, pay, cfg, cnt] = await Promise.all([
        api('/admin/subscriptions/stats'),
        api(`/admin/subscriptions${statusFilter ? `?status=${statusFilter}` : ''}`),
        api('/admin/payments'),
        api('/admin/config'),
        api('/content')
      ]);
      setStats(st);
      setSubscriptions(sub.items || []);
      setPayments(pay.items || []);
      setConfig(cfg);
      setContentList(cnt || []);
    } catch (err) {
      notify(err.message || 'Failed to load admin subscription data', true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllData();
  }, [statusFilter]);

  async function handleConfigSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      basic_daily_message_limit: Number(fd.get('basic_daily_message_limit')),
      premium_daily_message_limit: Number(fd.get('premium_daily_message_limit')),
      basic_ai_daily_limit: Number(fd.get('basic_ai_daily_limit')),
      premium_ai_daily_limit: Number(fd.get('premium_ai_daily_limit')),
      premium_included_counselling_monthly: Number(fd.get('premium_included_counselling_monthly'))
    };
    try {
      setSavingConfig(true);
      const res = await api('/admin/config', { method: 'PATCH', body });
      setConfig(res.config);
      notify('System subscription limits successfully updated.');
    } catch (err) {
      notify(err.message || 'Failed to update system config', true);
    } finally {
      setSavingConfig(false);
    }
  }

  async function handleContentToggle(contentId, newAccessLevel) {
    try {
      await api(`/admin/content/${contentId}?access_level=${newAccessLevel}`, { method: 'PATCH' });
      notify(`Content access updated to ${newAccessLevel}`);
      const updated = await api('/content');
      setContentList(updated || []);
    } catch (err) {
      notify(err.message || 'Failed to update content entitlement', true);
    }
  }

  return (
    <div className="admin-subs-wrap">
      {/* Admin Title & Tab Bar */}
      <div className="admin-subs-head">
        <div>
          <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Crown size={14} /> SAAS MANAGEMENT
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '4px 0' }}>
            Subscription & Payment Administration
          </h2>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.88rem' }}>
            Live overview of Basic & Premium memberships, payment logs, and limit configurations.
          </p>
        </div>
        <button
          type="button"
          className="btn-outline refresh-btn"
          onClick={loadAllData}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Data
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-nav-tabs">
        {[
          ['overview', 'Overview & Metrics'],
          ['subscriptions', 'Member Subscriptions'],
          ['payments', 'Payment Transactions'],
          ['config', 'Limit Configuration'],
          ['content', 'Content Entitlements']
        ].map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & METRICS */}
      {activeTab === 'overview' && (
        <div className="admin-tab-content">
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="stat-label">BASIC Members (₹499/mo)</span>
              <span className="stat-value">{stats?.total_basic_members ?? 0}</span>
              <span className="stat-note">Limited matchmaking & messaging</span>
            </div>
            <div className="admin-stat-card stat-card-gold">
              <span className="stat-label">PREMIUM Members (₹999/mo)</span>
              <span className="stat-value">{stats?.total_premium_members ?? 0}</span>
              <span className="stat-note">Full calling, content & counselling</span>
            </div>
            <div className="admin-stat-card">
              <span className="stat-label">Active Subscriptions</span>
              <span className="stat-value" style={{ color: 'var(--success)' }}>
                {stats?.active_subscriptions ?? 0}
              </span>
              <span className="stat-note">
                Expired: {stats?.expired_subscriptions ?? 0} . Cancelled: {stats?.cancelled_subscriptions ?? 0}
              </span>
            </div>
            <div className="admin-stat-card">
              <span className="stat-label">Verified Revenue</span>
              <span className="stat-value">₹{stats?.total_verified_revenue_inr ?? 0}</span>
              <span className="stat-note">From {stats?.total_payments ?? 0} processed payments</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEMBER SUBSCRIPTIONS */}
      {activeTab === 'subscriptions' && (
        <div className="admin-tab-content">
          <div className="filter-bar">
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted)' }}>
              <Filter size={14} style={{ display: 'inline', marginRight: 4 }} /> Filter by Status:
            </span>
            {['', 'active', 'cancelled', 'expired', 'pending'].map((st) => (
              <button
                key={st}
                type="button"
                className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st ? st.toUpperCase() : 'ALL'}
              </button>
            ))}
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Current Period End</th>
                  <th>Started</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.user_name}</strong>
                      <br />
                      <small style={{ color: 'var(--muted)' }}>{s.user_email}</small>
                    </td>
                    <td>
                      <span className={`plan-tag ${s.plan_code === 'PREMIUM' ? 'tag-prem' : 'tag-basic'}`}>
                        {s.plan_name}
                      </span>
                    </td>
                    <td>₹{s.amount_inr} / {s.billing_period}</td>
                    <td>
                      <span className={`status-pill pill-${s.status}`}>{s.status.toUpperCase()}</span>
                    </td>
                    <td>
                      {s.current_period_end
                        ? new Date(s.current_period_end).toLocaleDateString('en-IN')
                        : '--'}
                    </td>
                    <td>{new Date(s.started_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
                {subscriptions.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                      No subscription records found matching this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT TRANSACTIONS */}
      {activeTab === 'payments' && (
        <div className="admin-tab-content">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>User</th>
                  <th>Provider Order ID</th>
                  <th>Payment ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Verified At</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
                    <td>
                      <strong>{p.user_name}</strong>
                      <br />
                      <small style={{ color: 'var(--muted)' }}>{p.user_email}</small>
                    </td>
                    <td>
                      <code>{p.order_id}</code>
                    </td>
                    <td>
                      <code>{p.payment_id || '--'}</code>
                    </td>
                    <td>
                      <strong>₹{p.amount} {p.currency}</strong>
                    </td>
                    <td>
                      <span className={`status-pill pill-${p.status}`}>
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {p.verified_at
                        ? new Date(p.verified_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                        : '--'}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                      No payment transactions recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LIMIT CONFIGURATION */}
      {activeTab === 'config' && (
        <div className="admin-tab-content">
          <div className="config-card">
            <div className="config-card-head">
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                System-wide Subscription Usage Limits
              </h3>
              <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.86rem' }}>
                Changes update the central entitlement engine immediately. No server restart required.
              </p>
            </div>

            <form onSubmit={handleConfigSubmit} className="config-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Basic Plan -- Daily Message Limit</label>
                  <input
                    type="number"
                    name="basic_daily_message_limit"
                    defaultValue={config?.BASIC_DAILY_MESSAGE_LIMIT ?? 20}
                    min="1"
                    max="1000"
                    required
                  />
                  <small>Default: 20 msgs/day per Basic user</small>
                </div>
                <div className="form-group">
                  <label>Premium Plan -- Daily Message Limit</label>
                  <input
                    type="number"
                    name="premium_daily_message_limit"
                    defaultValue={config?.PREMIUM_DAILY_MESSAGE_LIMIT ?? 200}
                    min="10"
                    max="5000"
                    required
                  />
                  <small>Default: 200 msgs/day per Premium user</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Basic Plan -- Daily AI Guidance Limit</label>
                  <input
                    type="number"
                    name="basic_ai_daily_limit"
                    defaultValue={config?.BASIC_AI_DAILY_LIMIT ?? 5}
                    min="1"
                    max="100"
                    required
                  />
                  <small>Default: 5 guidance queries/day</small>
                </div>
                <div className="form-group">
                  <label>Premium Plan -- Daily AI Guidance Limit</label>
                  <input
                    type="number"
                    name="premium_ai_daily_limit"
                    defaultValue={config?.PREMIUM_AI_DAILY_LIMIT ?? 50}
                    min="5"
                    max="500"
                    required
                  />
                  <small>Default: 50 guidance queries/day</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Premium Plan -- Included Counselling Sessions / Month</label>
                  <input
                    type="number"
                    name="premium_included_counselling_monthly"
                    defaultValue={config?.PREMIUM_INCLUDED_COUNSELLING_MONTHLY ?? 1}
                    min="1"
                    max="10"
                    required
                  />
                  <small>Default: 1 session/month per Premium user</small>
                </div>
              </div>

              <div className="form-actions-right">
                <button type="submit" className="btn btn-gold" disabled={savingConfig}>
                  {savingConfig ? 'Saving...' : 'Save Configuration Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: CONTENT ENTITLEMENTS */}
      {activeTab === 'content' && (
        <div className="admin-tab-content">
          <div className="content-manager-head">
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
              Educational Resource Access Classification
            </h3>
            <p style={{ margin: '4px 0 16px', color: 'var(--muted)', fontSize: '0.86rem' }}>
              Control whether astrology guides and relationship resources are FREE for all members or restricted to PREMIUM subscribers.
            </p>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Current Access Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contentList.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.title}</strong>
                      <br />
                      <small style={{ color: 'var(--muted)' }}>{c.summary}</small>
                    </td>
                    <td>
                      <span className="category-pill">{c.category}</span>
                    </td>
                    <td>
                      <span className={`access-pill access-${c.access_level.toLowerCase()}`}>
                        {c.access_level}
                      </span>
                    </td>
                    <td>
                      {c.access_level === 'FREE' ? (
                        <button
                          type="button"
                          className="btn-outline btn-xs"
                          onClick={() => handleContentToggle(c.id, 'PREMIUM')}
                        >
                          Lock as PREMIUM
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn-outline btn-xs"
                          onClick={() => handleContentToggle(c.id, 'FREE')}
                        >
                          Make FREE
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
