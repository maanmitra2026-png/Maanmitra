import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Video,
  Phone,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Award,
  CheckCircle2,
  Lock,
  Heart
} from 'lucide-react';

export default function AppointmentBookingModal({
  isOpen,
  onClose,
  counsellor,
  subscription,
  onBookSuccess,
  onUpgradeRequired,
  api,
  notify
}) {
  if (!isOpen || !counsellor) return null;

  const isPremium = subscription?.plan?.code === 'PREMIUM';
  const sessionsUsed = subscription?.usage?.counselling_sessions_used || 0;
  const sessionsIncluded = 1;
  const hasIncludedSessionLeft = isPremium && sessionsUsed < sessionsIncluded;

  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(
    counsellor.time_slots && counsellor.time_slots.length > 0
      ? counsellor.time_slots[0]
      : '10:00 AM'
  );
  const [mode, setMode] = useState('video');
  const [category, setCategory] = useState(counsellor.primary_category || 'relationship');
  const [supportTopic, setSupportTopic] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [busy, setBusy] = useState(false);

  // Available slots from counsellor profile or defaults
  const slots = counsellor.time_slots && counsellor.time_slots.length > 0
    ? counsellor.time_slots
    : ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '06:30 PM'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPremium) {
      onClose();
      onUpgradeRequired({
        isOpen: true,
        featureName: 'Personal Relationship Counselling',
        reason: '1-on-1 personal counselling sessions with verified relationship guides are exclusively included with MANMITRA Premium (₹999/month).'
      });
      return;
    }

    setBusy(true);
    try {
      const payload = {
        counsellor_name: counsellor.name,
        counsellor_id: counsellor.id,
        appointment_date: date,
        time_slot: selectedSlot,
        mode,
        category,
        support_topic: supportTopic,
        user_notes: userNotes
      };
      await api('/appointments', { method: 'POST', body: payload });
      notify('Session successfully scheduled! You can review details under My Appointments.', false);
      onBookSuccess();
      onClose();
    } catch (err) {
      if (err.message && (err.message.includes('PREMIUM') || err.message.includes('allowance'))) {
        onClose();
        onUpgradeRequired({
          isOpen: true,
          featureName: 'Counselling Monthly Allowance',
          reason: err.message
        });
      } else {
        notify(err.message, true);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1050 }}>
      <div
        className="modal-card modal-counselling"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '580px',
          width: '94%',
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(20, 33, 61, 0.18)',
          border: '1px solid #E9E4F5',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #14213D 0%, #1F2D4B 100%)',
            padding: '24px 28px',
            color: '#FFFFFF',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src={counsellor.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'}
              alt={counsellor.name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #36B7A5'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {counsellor.name}
                </h3>
                {counsellor.verified && (
                  <span
                    style={{
                      background: 'rgba(54, 183, 165, 0.25)',
                      color: '#36B7A5',
                      border: '1px solid #36B7A5',
                      borderRadius: '999px',
                      padding: '2px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCircle2 size={11} /> Verified
                  </span>
                )}
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#E9E4F5', opacity: 0.9 }}>
                {counsellor.title || counsellor.qualification}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#36B7A5' }}>
                {counsellor.experience_years}+ years experience - {counsellor.license_number || 'Licensed Practitioner'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
          {/* Plan Allowance Banner */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: isPremium ? '#EDFAF8' : '#FDF1F1',
              border: `1px solid ${isPremium ? '#36B7A5' : '#F26B6B'}`
            }}
          >
            {isPremium ? (
              <>
                <Sparkles size={20} color="#36B7A5" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.85rem', color: '#14213D' }}>
                  <strong>MANMITRA Premium Benefit:</strong>{' '}
                  {hasIncludedSessionLeft
                    ? '1 personal session is included with your membership this month at no extra fee.'
                    : 'Included session allowance utilized for this billing cycle.'}
                </div>
              </>
            ) : (
              <>
                <AlertCircle size={20} color="#F26B6B" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.85rem', color: '#14213D' }}>
                  <strong>Counselling is included with MANMITRA Premium (₹999/mo).</strong>{' '}
                  Free or Basic members can explore guidance resources and upgrade to book.
                </div>
              </>
            )}
          </div>

          {/* Consultation Mode */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#14213D', marginBottom: '8px' }}>
              Consultation Mode
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { id: 'video', label: 'Encrypted Video', icon: Video },
                { id: 'voice', label: 'Private Voice', icon: Phone },
                { id: 'in_person', label: 'Clinical In-Person', icon: UserCheck }
              ].map((m) => {
                const Icon = m.icon;
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '12px',
                      border: `1.5px solid ${active ? '#36B7A5' : '#E9E4F5'}`,
                      background: active ? '#EDFAF8' : '#FFFFFF',
                      color: active ? '#14213D' : '#5A6578',
                      fontSize: '0.8rem',
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon size={18} color={active ? '#36B7A5' : '#718096'} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date and Time Slot */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#14213D', marginBottom: '6px' }}>
                Select Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  color: '#14213D',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#14213D', marginBottom: '6px' }}>
                Select Time Slot
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  color: '#14213D',
                  outline: 'none',
                  background: '#FFFFFF'
                }}
              >
                {slots.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Counselling Focus Topic */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#14213D', marginBottom: '6px' }}>
              What would you like support with?
            </label>
            <input
              type="text"
              placeholder="e.g. Communication difficulties, boundary setting, premarital clarity..."
              value={supportTopic}
              onChange={(e) => setSupportTopic(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '0.88rem',
                color: '#14213D',
                outline: 'none'
              }}
            />
          </div>

          {/* Confidential Notes for Counsellor */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#14213D', marginBottom: '6px' }}>
              <span>Confidential Background Notes (Optional)</span>
              <span style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 400, display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Lock size={11} /> 100% Private
              </span>
            </label>
            <textarea
              rows={3}
              placeholder="Briefly describe what you are experiencing. Only your verified counsellor will see this."
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '0.85rem',
                color: '#14213D',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* Cancellation Terms */}
          <p style={{ fontSize: '0.75rem', color: '#718096', margin: '0 0 20px', lineHeight: 1.4 }}>
             <strong>Ethical Care & Cancellation:</strong> {counsellor.cancellation_terms || 'Free cancellation or rescheduling up to 4 hours before the session.'}
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 20px',
                borderRadius: '14px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#5A6578',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={busy}
              style={{
                padding: '12px 28px',
                borderRadius: '14px',
                border: 'none',
                background: isPremium ? 'linear-gradient(135deg, #36B7A5 0%, #2DA090 100%)' : 'linear-gradient(135deg, #F26B6B 0%, #E25555 100%)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: busy ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isPremium ? '0 8px 20px rgba(54, 183, 165, 0.3)' : '0 8px 20px rgba(242, 107, 107, 0.3)'
              }}
            >
              {busy ? (
                'Confirming Session...'
              ) : isPremium ? (
                <>
                  <CheckCircle2 size={16} /> Confirm Included Session
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Upgrade to Book (₹999/mo)
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
