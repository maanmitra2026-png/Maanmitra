import React from 'react';
import {
  X,
  ShieldCheck,
  Star,
  Clock,
  Globe,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Video,
  Heart
} from 'lucide-react';

export default function CounsellorProfileModal({
  isOpen,
  onClose,
  counsellor,
  onOpenBooking
}) {
  if (!isOpen || !counsellor) return null;

  return (
    <div className="mm-cs-modal-backdrop" onClick={onClose}>
      <div className="mm-cs-modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mm-cs-modal-header">
          <div>
            <h3>Counsellor Profile</h3>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', margin: '4px 0 0' }}>
              Verified MAANMITRA Professional
            </p>
          </div>
          <button onClick={onClose} className="mm-cs-modal-close-btn" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mm-cs-modal-content">
          {/* Top Profile Summary */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '24px' }}>
            <img
              src={counsellor.avatar_url || '/counselor_ananya.jpg'}
              alt={counsellor.name}
              style={{
                width: '96px',
                height: '96px',
                borderRadius: '20px',
                objectFit: 'cover',
                boxShadow: '0 8px 24px rgba(74, 21, 75, 0.12)',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', color: '#4A154B', margin: 0 }}>
                  {counsellor.name}
                </h4>
                <span
                  title="Verified Practitioner"
                  style={{
                    background: '#ECFDF5',
                    color: '#059669',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ShieldCheck size={13} /> Verified
                </span>
              </div>

              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#E91E63', marginBottom: '8px' }}>
                {counsellor.title}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '0.82rem', color: '#634C5F' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#B45309' }}>
                  <Star size={14} fill="#F59E0B" color="#F59E0B" /> {counsellor.rating || 4.9} ({counsellor.reviews_count || 120}+ reviews)
                </span>
                <span>&bull;</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} color="#E91E63" /> {counsellor.experience_years ? `${counsellor.experience_years}+ Years Experience` : '8+ Years'}
                </span>
              </div>
            </div>
          </div>

          {/* Qualifications & License Grid */}
          <div
            style={{
              background: '#FFF8FA',
              border: '1px solid #F0DCE8',
              borderRadius: '16px',
              padding: '16px 18px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px',
              marginBottom: '22px'
            }}
          >
            <div>
              <span style={{ fontSize: '0.74rem', color: '#8E7B89', fontWeight: 600, display: 'block' }}>Qualifications</span>
              <strong style={{ fontSize: '0.86rem', color: '#4A154B' }}>{counsellor.qualification || 'M.Phil Clinical Psychology'}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: '#8E7B89', fontWeight: 600, display: 'block' }}>Clinical Registration</span>
              <strong style={{ fontSize: '0.86rem', color: '#4A154B' }}>{counsellor.license_number || 'RCI Registered'}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: '#8E7B89', fontWeight: 600, display: 'block' }}>Languages Spoken</span>
              <strong style={{ fontSize: '0.86rem', color: '#4A154B' }}>
                {Array.isArray(counsellor.languages) ? counsellor.languages.join(', ') : counsellor.languages || 'Hindi, English'}
              </strong>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: '#8E7B89', fontWeight: 600, display: 'block' }}>Session Fee</span>
              <strong style={{ fontSize: '0.86rem', color: '#E91E63' }}>₹{counsellor.fee_inr || 1200} / 45-min Session</strong>
            </div>
          </div>

          {/* About / Bio */}
          <div style={{ marginBottom: '20px' }}>
            <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#4A154B', marginBottom: '8px' }}>
              About the Counsellor & Therapeutic Approach
            </h5>
            <p style={{ fontSize: '0.88rem', color: '#634C5F', lineHeight: 1.6, margin: 0 }}>
              {counsellor.bio ||
                'Dedicated to creating a secure, judgment-free space for couples, individuals, and families. Employs evidence-informed dialogue, boundary exploration, and cognitive empathy tools to build enduring trust and relationship health.'}
            </p>
          </div>

          {/* Specialization Tags */}
          <div style={{ marginBottom: '26px' }}>
            <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#4A154B', marginBottom: '8px' }}>
              Specialisations & Domains
            </h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(counsellor.specializations || ['Relationships', 'Premarital Guidance', 'Communication', 'Conflict Resolution']).map((tag, i) => (
                <span
                  key={i}
                  style={{
                    background: '#FCE7F3',
                    color: '#9D174D',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    padding: '4px 12px',
                    borderRadius: '9999px'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenBooking(counsellor);
            }}
            className="mm-cs-btn-rose"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.98rem' }}
          >
            Book Session with {counsellor.name}
          </button>
        </div>
      </div>
    </div>
  );
}

