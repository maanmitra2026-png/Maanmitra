import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Plus,
  ArrowRight,
  Crown
} from 'lucide-react';

export default function MyAppointments({
  appointments = [],
  subscription,
  onNavigate,
  onOpenBooking,
  api,
  notify,
  onRefresh
}) {
  const [tab, setTab] = useState('upcoming');
  const [cancellingId, setCancellingId] = useState(null);

  const isPremium = subscription?.plan?.code === 'PREMIUM';

  const todayStr = new Date().toISOString().slice(0, 10);

  const upcomingList = appointments.filter(a => {
    return a.appointment_date >= todayStr && a.status !== 'cancelled';
  });

  const pastList = appointments.filter(a => {
    return a.appointment_date < todayStr || a.status === 'cancelled' || a.status === 'completed';
  });

  const displayList = tab === 'upcoming' ? upcomingList : pastList;

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you wish to cancel this appointment? Your monthly allowance will be restored.')) {
      return;
    }

    try {
      setCancellingId(id);
      await api(`/appointments/${id}/cancel`, { method: 'PATCH' });
      notify('Appointment cancelled successfully.');
      if (onRefresh) onRefresh();
    } catch (err) {
      notify(err.message, true);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="my-appointments-page">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <div className="eyebrow-teal">SCHEDULE & HISTORY</div>
          <h1>My Appointments</h1>
          <p>
            Track your confidential 1-on-1 sessions, review counsellor clinical notes, and manage your upcoming schedule.
          </p>
        </div>
        <button className="btn btn-coral" onClick={() => onNavigate('professionals')}>
          <Plus size={16} /> Book New Session
        </button>
      </div>

      {/* Plan Allowance Card */}
      <div className="card allowance-banner">
        <div className="allowance-icon">
          <Crown size={22} color="#D4AF7C" />
        </div>
        <div className="allowance-copy">
          <strong>
            {isPremium
              ? 'MANMITRA Premium . 1 Included 20-min Session/Month'
              : 'Free Account . Pay Per Session or Upgrade'}
          </strong>
          <p>
            {isPremium
              ? 'You have access to 1 included 20-minute video or voice session every month with verified relationship specialists. Double booking is strictly prevented.'
              : 'Upgrade to MANMITRA Premium (₹999/month) to receive 1 included 20-minute session every month, encrypted voice/video calling, and higher messaging allowances.'}
          </p>
        </div>
        {!isPremium && (
          <button className="btn btn-gold" onClick={() => onNavigate('membership')}>
            Upgrade to Premium <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="pill-tabs-wrap">
        <div className="pill-tabs">
          <button
            type="button"
            className={tab === 'upcoming' ? 'active' : ''}
            onClick={() => setTab('upcoming')}
          >
            Upcoming Sessions ({upcomingList.length})
          </button>
          <button
            type="button"
            className={tab === 'past' ? 'active' : ''}
            onClick={() => setTab('past')}
          >
            Past & History ({pastList.length})
          </button>
        </div>
      </div>

      {/* List */}
      <div className="appointments-list-container">
        {displayList.map((a) => (
          <div className="card appointment-detail-card" key={a.id}>
            <div className="app-card-left">
              <div className="app-date-box">
                <span className="app-month">
                  {new Date(a.appointment_date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                </span>
                <span className="app-day">
                  {new Date(a.appointment_date).getDate()}
                </span>
                <span className="app-year">
                  {new Date(a.appointment_date).getFullYear()}
                </span>
              </div>

              <div className="app-core-info">
                <div className="app-counsellor-row">
                  <h3>{a.counsellor_name}</h3>
                  <span className={`status-pill ${a.status}`}>
                    {a.status === 'confirmed' && <CheckCircle2 size={13} />}
                    {a.status === 'cancelled' && <XCircle size={13} />}
                    {a.status === 'requested' && <Clock size={13} />}
                    <span>{a.status.toUpperCase()}</span>
                  </span>
                </div>

                <div className="app-meta-row">
                  <span className="meta-item">
                    <Clock size={14} /> {a.time_slot}
                  </span>
                  <span className="meta-item">
                    {a.mode === 'video' ? <Video size={14} /> : a.mode === 'voice' ? <Phone size={14} /> : <UserCheck size={14} />}
                    {a.mode === 'video' ? 'Video Consultation' : a.mode === 'voice' ? 'Voice Call' : 'In Person'}
                  </span>
                  <span className="meta-item category-tag">
                    {a.category || 'Relationship Guidance'}
                  </span>
                </div>

                {a.support_topic && (
                  <div className="app-topic">
                    <strong>Support Topic:</strong> {a.support_topic}
                  </div>
                )}

                {a.user_notes && (
                  <div className="app-notes user-note">
                    <strong>Your confidential context:</strong> {a.user_notes}
                  </div>
                )}

                {a.counsellor_notes && (
                  <div className="app-notes counsellor-note">
                    <div className="note-title">
                      <FileText size={14} color="#36B7A5" />
                      <strong>Practitioner Follow-up & Recommendations:</strong>
                    </div>
                    <p>{a.counsellor_notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="app-card-actions">
              {a.status !== 'cancelled' && a.appointment_date >= todayStr ? (
                <>
                  <button
                    className="btn btn-coral"
                    onClick={() => notify(`Opening encrypted ${a.mode} consultation room...`)}
                  >
                    {a.mode === 'video' ? <Video size={15} /> : <Phone size={15} />}
                    Join Room
                  </button>
                  <button
                    className="btn-outline danger"
                    onClick={() => handleCancel(a.id)}
                    disabled={cancellingId === a.id}
                  >
                    {cancellingId === a.id ? 'Cancelling...' : 'Cancel Session'}
                  </button>
                </>
              ) : (
                <button
                  className="btn-outline"
                  onClick={() => onNavigate('professionals')}
                >
                  Book Follow-up
                </button>
              )}
            </div>
          </div>
        ))}

        {displayList.length === 0 && (
          <div className="card empty-state">
            <Calendar size={44} color="#7E636F" />
            <h3>No {tab === 'upcoming' ? 'upcoming' : 'past'} sessions found</h3>
            <p>
              {tab === 'upcoming'
                ? 'You have no scheduled appointments. Book a confidential 1-on-1 session with a certified counsellor.'
                : 'Your session history and counsellor follow-up notes will appear here once sessions are completed.'}
            </p>
            <button className="btn btn-coral" onClick={() => onNavigate('professionals')}>
              Browse Verified Counsellors
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
