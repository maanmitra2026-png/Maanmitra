import React, { useState, useEffect } from 'react';
import {
  Crown,
  ShieldCheck,
  Calendar,
  MessageCircle,
  Headphones,
  Sparkles,
  Phone,
  Video,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  XCircle,
  CreditCard,
  ArrowRight,
  BookOpen,
  X
} from 'lucide-react';
import PricingSection from './PricingSection';

export default function MembershipPage({
  me,
  api,
  notify,
  onOpenUpgrade,
  onInitiateCheckout,
  busy = false,
  onOpenPolicy
}) {
  const [subData, setSubData] = useState(null);
  const [usageData, setUsageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function loadMembershipInfo() {
    try {
      setLoading(true);
      const [s, u] = await Promise.all([
        api('/subscriptions/me'),
        api('/subscriptions/usage')
      ]);
      setSubData(s);
      setUsageData(u);
    } catch (err) {
      notify(err.message || 'Failed to load membership details', true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembershipInfo();
  }, []);

  async function handleCancelSubscription() {
    try {
      setCancelling(true);
      const res = await api('/subscriptions/cancel', { method: 'POST' });
      notify(res.message || 'Subscription cancelled successfully.');
      setCancelModal(false);
      await loadMembershipInfo();
    } catch (err) {
      notify(err.message || 'Failed to cancel subscription', true);
    } finally {
      setCancelling(false);
    }
  }

  const currentPlan = subData?.plan;
  const currentSub = subData?.subscription;
  const isActive = subData?.is_active;
  const planCode = currentPlan?.code; // 'BASIC' | 'PREMIUM' | null

  return (
    <div className="membership-page-wrap">
      {/* Page Title & Status Banner */}
      <div className="membership-header">
        <div className="membership-title-row">
          <div>
            <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} /> MEMBERSHIP & BILLING
            </div>
            <h1 className="page-heading">Your MANMITRA Membership</h1>
            <p className="page-sub">
              Manage your subscription tier, daily communication allowances, and billing history.
            </p>
          </div>
          <button
            type="button"
            className="btn-outline refresh-btn"
            onClick={loadMembershipInfo}
            disabled={loading}
            title="Refresh subscription data"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
          </button>
        </div>

        {/* Current Plan Overview Card */}
        <div className={`current-plan-banner ${planCode === 'PREMIUM' ? 'banner-premium' : (planCode === 'BASIC' ? 'banner-basic' : 'banner-free')}`}>
          <div className="banner-left">
            <div className="plan-badge-row">
              <span className="current-badge">
                <Crown size={14} /> CURRENT PLAN
              </span>
              <span className={`status-pill pill-${currentSub?.status || 'inactive'}`}>
                {currentSub?.status ? currentSub.status.toUpperCase() : 'NO ACTIVE PLAN'}
              </span>
            </div>
            <h2 className="banner-plan-name">
              {currentPlan ? currentPlan.name : 'Free Member Tier'}
            </h2>
            <p className="banner-plan-desc">
              {planCode === 'PREMIUM'
                ? 'Full access to voice & video calling, 200 msgs/day, included counselling, and premium astrology/relationship guidance.'
                : (planCode === 'BASIC'
                  ? 'Access to standard matchmaking, 20 messages/day, free articles, and basic AI guidance.'
                  : 'You are currently on the free visitor tier. Upgrade to send messages and connect with verified members.')}
            </p>
          </div>

          <div className="banner-right">
            {currentPlan && (
              <div className="banner-pricing-block">
                <div className="banner-price">₹{currentPlan.amount_inr}</div>
                <div className="banner-cycle">/ {currentPlan.billing_period || 'month'}</div>
              </div>
            )}
            {currentSub?.current_period_end && (
              <div className="banner-renewal-date">
                <Calendar size={14} />
                <span>
                  {currentSub.status === 'cancelled' ? 'Access ends: ' : 'Renews on: '}
                  <strong>{new Date(currentSub.current_period_end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                </span>
              </div>
            )}

            <div className="banner-actions">
              {planCode !== 'PREMIUM' && (
                <button
                  type="button"
                  className="btn btn-gold banner-upgrade-btn"
                  onClick={() => onInitiateCheckout('PREMIUM')}
                  disabled={busy}
                >
                  <Sparkles size={14} /> Upgrade to Premium (₹999/mo)
                </button>
              )}
              {planCode === 'BASIC' && (
                <button
                  type="button"
                  className="btn-outline banner-action-outline"
                  onClick={() => onInitiateCheckout('BASIC')}
                  disabled={busy}
                >
                  Renew Basic (₹499/mo)
                </button>
              )}
              {isActive && currentSub?.status === 'active' && (
                <button
                  type="button"
                  className="btn-text-danger"
                  onClick={() => setCancelModal(true)}
                >
                  Cancel subscription
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Usage Counters Grid */}
      <div className="usage-counters-section">
        <h3 className="section-title">
          Today's Usage & Included Allowances
        </h3>
        <p className="section-desc">
          Allowances reset daily at midnight server-time (UTC). Included counselling refreshes on every monthly billing renewal.
        </p>

        <div className="usage-cards-grid">
          {/* Daily Messages Allowance */}
          <div className="usage-card">
            <div className="usage-card-top">
              <span className="usage-icon-wrap icon-msg">
                <MessageCircle size={18} />
              </span>
              <span className="usage-label">Daily Text Messages</span>
            </div>
            <div className="usage-metric-wrap">
              <div className="usage-metric">
                <span className="metric-current">{usageData?.messages?.remaining ?? 0}</span>
                <span className="metric-total">/ {usageData?.messages?.limit ?? 20} remaining</span>
              </div>
              <div className="usage-progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, (((usageData?.messages?.limit || 20) - (usageData?.messages?.remaining || 0)) / (usageData?.messages?.limit || 20)) * 100))}%`
                  }}
                />
              </div>
            </div>
            <div className="usage-note">
              Used {usageData?.messages?.used_today ?? 0} today . Resets at midnight UTC
            </div>
            {planCode === 'BASIC' && (
              <div className="usage-upgrade-hint">
                Need more than 20 msgs? <button type="button" onClick={() => onInitiateCheckout('PREMIUM')}>Upgrade to Premium for 200/day</button>
              </div>
            )}
          </div>

          {/* Daily AI Guidance Requests */}
          <div className="usage-card">
            <div className="usage-card-top">
              <span className="usage-icon-wrap icon-ai">
                <Sparkles size={18} />
              </span>
              <span className="usage-label">Daily AI Relationship Guidance</span>
            </div>
            <div className="usage-metric-wrap">
              <div className="usage-metric">
                <span className="metric-current">{usageData?.ai?.remaining ?? 0}</span>
                <span className="metric-total">/ {usageData?.ai?.limit ?? 5} remaining</span>
              </div>
              <div className="usage-progress-bar">
                <div
                  className="progress-fill fill-gold"
                  style={{
                    width: `${Math.min(100, Math.max(0, (((usageData?.ai?.limit || 5) - (usageData?.ai?.remaining || 0)) / (usageData?.ai?.limit || 5)) * 100))}%`
                  }}
                />
              </div>
            </div>
            <div className="usage-note">
              Used {usageData?.ai?.used_today ?? 0} queries today . Mindset & communication advice
            </div>
            {planCode !== 'PREMIUM' && (
              <div className="usage-upgrade-hint">
                Want 50 queries/day? <button type="button" onClick={() => onInitiateCheckout('PREMIUM')}>Upgrade to Premium</button>
              </div>
            )}
          </div>

          {/* Monthly Counselling Session Allowance */}
          <div className="usage-card">
            <div className="usage-card-top">
              <span className="usage-icon-wrap icon-counsel">
                <Headphones size={18} />
              </span>
              <span className="usage-label">Personal Counselling Allowance</span>
            </div>
            <div className="usage-metric-wrap">
              <div className="usage-metric">
                <span className="metric-current">
                  {planCode === 'PREMIUM' ? (usageData?.counselling?.remaining ?? 1) : 0}
                </span>
                <span className="metric-total">
                  / {planCode === 'PREMIUM' ? (usageData?.counselling?.included_sessions ?? 1) : 0} session included this month
                </span>
              </div>
              <div className="usage-progress-bar">
                <div
                  className="progress-fill fill-emerald"
                  style={{
                    width: planCode === 'PREMIUM'
                      ? `${((usageData?.counselling?.booked_this_period || 0) / (usageData?.counselling?.included_sessions || 1)) * 100}%`
                      : '0%'
                  }}
                />
              </div>
            </div>
            <div className="usage-note">
              {planCode === 'PREMIUM'
                ? `${usageData?.counselling?.booked_this_period ?? 0} booked in current billing cycle (20-min session)`
                : '1 session/month included exclusively with MANMITRA Premium'}
            </div>
            {planCode !== 'PREMIUM' && (
              <div className="usage-upgrade-hint">
                <button type="button" onClick={() => onInitiateCheckout('PREMIUM')}>Upgrade to Premium to book counselling</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Plan Selector & Comparison Table */}
      <div className="membership-plans-section">
        <PricingSection
          currentPlanCode={planCode}
          isLoggedIn={true}
          onSelectPlan={(code) => onInitiateCheckout(code)}
          busy={busy}
          onOpenPolicy={onOpenPolicy}
        />
      </div>

      {/* Payment History & Transactions Table */}
      <div className="membership-history-section">
        <div className="section-head-left">
          <h3 className="section-title">
            <CreditCard size={18} style={{ display: 'inline', marginRight: 6 }} />
            Payment History & Invoices
          </h3>
          <p className="section-desc">
            All transactions are securely verified via Razorpay with encrypted server-side signatures.
          </p>
        </div>

        {subData?.transactions && subData.transactions.length > 0 ? (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order ID</th>
                  <th>Payment ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {subData.transactions.map((t) => (
                  <tr key={t.id}>
                    <td>
                      {new Date(t.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <code className="code-snippet">{t.provider_order_id}</code>
                    </td>
                    <td>
                      <code className="code-snippet">{t.provider_payment_id || '--'}</code>
                    </td>
                    <td>
                      <strong>₹{t.amount} {t.currency}</strong>
                    </td>
                    <td>
                      <span className={`status-pill pill-${t.status}`}>
                        {t.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-history-box">
            <p>No transactions found for this account. Select a plan above to activate your membership.</p>
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancelModal && (
        <div className="upgrade-modal-backdrop" onClick={() => setCancelModal(false)}>
          <div className="upgrade-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="upgrade-modal-close"
              onClick={() => setCancelModal(false)}
            >
              <X size={20} />
            </button>
            <div className="upgrade-modal-header">
              <div className="upgrade-modal-badge" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}>
                <AlertTriangle size={14} /> CANCEL SUBSCRIPTION
              </div>
              <h2 className="upgrade-modal-title">Are you sure you want to cancel?</h2>
              <p className="upgrade-modal-reason">
                Your subscription benefits will remain active until the end of your current billing period (
                {currentSub?.current_period_end
                  ? new Date(currentSub.current_period_end).toLocaleDateString('en-IN')
                  : '30 days from start'}
                ). After that date, your account will switch to the free visitor tier.
              </p>
            </div>

            <div className="cancel-policy-summary">
              <strong>What changes after cancellation:</strong>
              <ul>
                <li>You retain full access until your current paid month ends.</li>
                <li>No further automatic monthly charges will be made.</li>
                <li>You can renew or upgrade your plan anytime with a single click.</li>
              </ul>
            </div>

            <div className="upgrade-modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setCancelModal(false)}
                disabled={cancelling}
              >
                Keep my membership
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancelSubscription}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
