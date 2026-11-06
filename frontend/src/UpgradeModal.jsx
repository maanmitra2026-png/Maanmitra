import React from 'react';
import {
  Crown,
  X,
  Sparkles,
  Phone,
  Video,
  Headphones,
  MessageCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function UpgradeModal({
  featureName = 'This feature',
  reason = 'Upgrade to MANMITRA Premium to unlock voice & video calling, included 1-on-1 personal counselling, and higher message allowances.',
  onClose,
  onUpgrade,
  busy = false
}) {
  const premiumPerks = [
    { icon: Phone, text: 'Direct Voice & Video Calling between accepted connections' },
    { icon: Headphones, text: '1 Personal Counselling Session included every billing month' },
    { icon: MessageCircle, text: 'Higher daily text messaging allowance (200 messages/day)' },
    { icon: BookOpen, text: 'Full access to PREMIUM astrology charts & relationship guides' },
    { icon: Sparkles, text: 'Advanced AI relationship analysis & personality compatibility reports' }
  ];

  return (
    <div className="upgrade-modal-backdrop" onClick={onClose} aria-hidden="true">
      <div
        className="upgrade-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="upgrade-modal-close"
          onClick={onClose}
          aria-label="Close upgrade modal"
        >
          <X size={20} />
        </button>

        <div className="upgrade-modal-header">
          <div className="upgrade-modal-badge">
            <Crown size={14} /> MANMITRA PREMIUM EXCLUSIVE
          </div>
          <h2 className="upgrade-modal-title">Unlock {featureName}</h2>
          <p className="upgrade-modal-reason">{reason}</p>
        </div>

        <div className="upgrade-modal-price-box">
          <div className="up-price-info">
            <span className="up-plan-name">MANMITRA Premium</span>
            <span className="up-plan-cycle">Billed monthly . Cancel anytime</span>
          </div>
          <div className="up-price-tag">
            <span className="up-currency">₹</span>
            <span className="up-amount">999</span>
            <span className="up-period">/ month</span>
          </div>
        </div>

        <div className="upgrade-modal-perks">
          <div className="perks-label">EVERYTHING INCLUDED IN PREMIUM:</div>
          {premiumPerks.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="perk-row">
                <span className="perk-icon-circle">
                  <Icon size={14} />
                </span>
                <span className="perk-text">{p.text}</span>
              </div>
            );
          })}
        </div>

        <div className="upgrade-modal-actions">
          <button
            type="button"
            className="btn btn-gold upgrade-submit-btn"
            onClick={onUpgrade}
            disabled={busy}
          >
            {busy ? 'Processing...' : (
              <>
                Upgrade to Premium -- ₹999/month <ArrowRight size={16} />
              </>
            )}
          </button>
          <button
            type="button"
            className="btn-outline upgrade-cancel-btn"
            onClick={onClose}
          >
            Maybe later
          </button>
        </div>

        <div className="upgrade-modal-footer">
          <ShieldCheck size={14} color="var(--brand-gold)" />
          <span>Secured by Razorpay . 100% money-safe . No automatic surprise fees</span>
        </div>
      </div>
    </div>
  );
}
