import React, { useState } from 'react';
import {
  Check,
  X,
  ShieldCheck,
  Sparkles,
  Crown,
  Headphones,
  MessageCircle,
  Phone,
  Video,
  BookOpen,
  Lock,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Zap,
  CreditCard
} from 'lucide-react';

export default function PricingSection({
  currentPlanCode = null,
  isLoggedIn = false,
  onSelectPlan,
  onOpenAuth,
  busy = false,
  onOpenPolicy
}) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // Configurable monthly billing period

  const plans = [
    {
      code: 'BASIC',
      name: 'MANMITRA Basic',
      price: 499,
      period: 'month',
      badge: null,
      summary: 'Affordable matchmaking, limited communication, free educational content, and basic AI relationship guidance.',
      features: [
        { name: 'Create & edit member profile', included: true },
        { name: 'Browse eligible member profiles & search filters', included: true },
        { name: 'Send connection & interest requests', included: true },
        { name: 'Text messaging with mutual connections', included: true, detail: '20 messages/day included' },
        { name: 'Access to FREE relationship & astrology content', included: true },
        { name: 'Basic AI relationship guidance & self-reflection', included: true, detail: '5 queries/day' },
        { name: 'Voice & video calling', included: false, detail: 'Exclusive to Premium' },
        { name: '1-on-1 Personal Counselling session', included: false, detail: 'Exclusive to Premium' },
        { name: 'PREMIUM content & deep astrology reports', included: false, detail: 'Exclusive to Premium' },
        { name: 'Advanced AI relationship analysis', included: false, detail: 'Exclusive to Premium' },
      ],
      ctaText: currentPlanCode === 'BASIC' ? 'Your Current Plan' : 'Choose Basic',
      highlight: false
    },
    {
      code: 'PREMIUM',
      name: 'MANMITRA Premium',
      price: 999,
      period: 'month',
      badge: 'RECOMMENDED',
      summary: 'Advanced relationship guidance, enhanced communication, and personal counselling for modern live-in companionship.',
      features: [
        { name: 'Everything in Basic plan', included: true },
        { name: 'Enhanced matching filters & compatibility insights', included: true },
        { name: 'Higher daily text messaging allowance', included: true, detail: '200 messages/day included' },
        { name: 'Voice & video calling with accepted connections', included: true, detail: 'Mutual consent enforced' },
        { name: '1 Personal Counselling session included', included: true, detail: '20-min session/month included' },
        { name: 'Full access to ALL FREE & PREMIUM content', included: true, detail: 'Astrology charts & guides' },
        { name: 'Advanced AI guidance & personalised reports', included: true, detail: '50 queries/day' },
        { name: 'Personal growth tracking & wellbeing station', included: true },
        { name: 'Priority member support & trust verification', included: true }
      ],
      ctaText: currentPlanCode === 'PREMIUM' ? 'Your Current Plan' : (currentPlanCode === 'BASIC' ? 'Upgrade to Premium' : 'Choose Premium'),
      highlight: true
    }
  ];

  const comparisonRows = [
    {
      feature: 'Eligible Profile Browsing & Matching',
      basic: 'Standard filters',
      premium: 'Advanced filters & deep compatibility'
    },
    {
      feature: 'Text Messaging Limit',
      basic: '20 messages / day',
      premium: '200 messages / day'
    },
    {
      feature: 'Voice & Video Calling',
      basic: false,
      premium: 'Included (Accepted connections only)'
    },
    {
      feature: 'Educational Content Library',
      basic: 'FREE articles & blogs only',
      premium: 'Full Library (FREE + PREMIUM astrology & guidance)'
    },
    {
      feature: 'AI Relationship Guidance',
      basic: 'Basic (5 queries/day)',
      premium: 'Advanced Analysis (50 queries/day)'
    },
    {
      feature: 'Personal Counselling with Experts',
      basic: false,
      premium: '1 included 20-min session / month'
    },
    {
      feature: 'Growth Tracking & Mutual Habits',
      basic: 'Basic tracking',
      premium: 'Full holistic companion suite'
    },
    {
      feature: 'Billing Period & Transparency',
      basic: '₹499 per month . No hidden fees',
      premium: '₹999 per month . No hidden fees'
    }
  ];

  const handleCta = (plan) => {
    if (plan.code === currentPlanCode) return;
    if (!isLoggedIn) {
      if (onOpenAuth) onOpenAuth('register');
      return;
    }
    if (onSelectPlan) {
      onSelectPlan(plan.code);
    }
  };

  return (
    <div className="pricing-section-container" id="pricing">
      {/* Section Header */}
      <div className="section-head text-center">
        <div className="eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} /> TRANSPARENT MEMBERSHIP PLANS
        </div>
        <h2 className="pricing-main-title">Choose Your MANMITRA Plan</h2>
        <p className="pricing-subtitle">
          Better Relationships Begin With Better Understanding.
        </p>
        <div className="pricing-billing-disclosure">
          <span>All plans billed on a clear <strong>monthly subscription</strong> schedule. Cancel or renew anytime with full control. Prices are in Indian Rupees (₹ INR).</span>
        </div>
      </div>

      {/* Two Plan Cards Grid */}
      <div className="pricing-cards-grid">
        {plans.map((p) => {
          const isCurrent = currentPlanCode === p.code;
          return (
            <div
              key={p.code}
              className={`pricing-card ${p.highlight ? 'pricing-card-recommended' : 'pricing-card-basic'} ${isCurrent ? 'pricing-card-current' : ''}`}
            >
              {p.badge && (
                <div className="pricing-card-badge">
                  <Crown size={13} /> {p.badge}
                </div>
              )}

              <div className="pricing-card-header">
                <div className="plan-identity">
                  <h3 className="plan-name">{p.name}</h3>
                  <p className="plan-summary">{p.summary}</p>
                </div>
                <div className="plan-price-block">
                  <div className="price-currency">₹</div>
                  <div className="price-amount">{p.price}</div>
                  <div className="price-period">/ month</div>
                </div>
                <div className="price-tax-note">Includes applicable taxes . Billed monthly</div>
              </div>

              <div className="pricing-card-cta-wrap">
                <button
                  type="button"
                  className={`btn plan-cta-btn ${p.highlight ? 'btn-gold' : 'btn-outline'} ${isCurrent ? 'btn-current-plan' : ''}`}
                  onClick={() => handleCta(p)}
                  disabled={busy || isCurrent}
                >
                  {isCurrent ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Check size={16} /> Current Plan
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {p.ctaText} <ArrowRight size={16} />
                    </span>
                  )}
                </button>
              </div>

              <div className="pricing-card-divider" />

              <div className="pricing-features-list">
                <div className="features-header">WHAT'S INCLUDED:</div>
                {p.features.map((f, idx) => (
                  <div
                    key={idx}
                    className={`feature-row ${f.included ? 'feature-included' : 'feature-excluded'}`}
                  >
                    <span className="feature-icon">
                      {f.included ? <Check size={15} /> : <X size={15} />}
                    </span>
                    <div className="feature-text">
                      <span className="feature-name">{f.name}</span>
                      {f.detail && <span className="feature-detail"> . {f.detail}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="pricing-comparison-wrap">
        <div className="comparison-head">
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: 'var(--brand-emerald-dark)' }}>
            Detailed Plan Comparison
          </h3>
          <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: '0.92rem' }}>
            Transparent breakdown of every feature available in MANMITRA Basic and Premium.
          </p>
        </div>

        <div className="comparison-table-scroll">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="col-feature">Feature / Entitlement</th>
                <th className="col-basic">MANMITRA Basic (₹499/mo)</th>
                <th className="col-premium">MANMITRA Premium (₹999/mo)</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((r, i) => (
                <tr key={i}>
                  <td className="cell-feature-name">
                    <strong>{r.feature}</strong>
                  </td>
                  <td className="cell-basic">
                    {typeof r.basic === 'boolean' ? (
                      r.basic ? (
                        <span className="pill-yes"><Check size={14} /> Included</span>
                      ) : (
                        <span className="pill-no"><X size={14} /> Not available</span>
                      )
                    ) : (
                      <span>{r.basic}</span>
                    )}
                  </td>
                  <td className="cell-premium">
                    {typeof r.premium === 'boolean' ? (
                      r.premium ? (
                        <span className="pill-yes-gold"><Check size={14} /> Included</span>
                      ) : (
                        <span className="pill-no"><X size={14} /> Not available</span>
                      )
                    ) : (
                      <span className="premium-highlight-text"><Sparkles size={13} style={{ display: 'inline', marginRight: 4 }} />{r.premium}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security & Trust Guarantee */}
      <div className="pricing-trust-banner">
        <div className="trust-icon-wrap">
          <ShieldCheck size={26} color="var(--brand-gold)" />
        </div>
        <div className="trust-content">
          <strong>Safe & Encrypted Checkout via Razorpay</strong>
          <p>
            Payments are securely processed using bank-grade 256-bit SSL encryption. We never store card numbers, CVVs, or UPI PINs. No automatic surprise charges or deceptive billing.
          </p>
        </div>
      </div>

      {/* Legal & Policy Links */}
      <div className="pricing-policies-bar">
        <span>By subscribing, you agree to MANMITRA's </span>
        <button type="button" className="policy-link-btn" onClick={() => onOpenPolicy && onOpenPolicy('terms')}>
          Terms of Service
        </button>
        <span> . </span>
        <button type="button" className="policy-link-btn" onClick={() => onOpenPolicy && onOpenPolicy('privacy')}>
          Privacy Policy
        </button>
        <span> . </span>
        <button type="button" className="policy-link-btn" onClick={() => onOpenPolicy && onOpenPolicy('cancellation')}>
          Cancellation & Refund Policy
        </button>
      </div>
    </div>
  );
}
