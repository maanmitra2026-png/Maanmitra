import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  Clock,
  Calendar,
  ShieldCheck,
  AlertCircle,
  FileText,
  UserCheck,
  Settings,
  ChevronRight,
  Sparkles,
  Lock,
  MessageSquare,
  HelpCircle,
  Video,
  Phone,
  RefreshCw,
  Plus
} from 'lucide-react';

export default function CounsellorPortalModal({
  isOpen,
  onClose,
  user,
  api,
  notify
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('overview'); // overview, appointments, profile, ethics
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [counsellorNote, setCounsellorNote] = useState('');
  const [apptStatus, setApptStatus] = useState('confirmed');

  // Application form state
  const [formName, setFormName] = useState(user?.full_name || '');
  const [formTitle, setFormTitle] = useState('Counseling Psychologist & Life Guide');
  const [formQualification, setFormQualification] = useState('');
  const [formExpYears, setFormExpYears] = useState(5);
  const [formLicense, setFormLicense] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formPrimaryCat, setFormPrimaryCat] = useState('relationship');
  const [formCategories, setFormCategories] = useState(['relationship', 'personal']);
  const [formLanguages, setFormLanguages] = useState(['English', 'Hindi']);
  const [formFee, setFormFee] = useState(1000);
  const [formScope, setFormScope] = useState('');
  const [formDays, setFormDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [formSlots, setFormSlots] = useState(['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '06:00 PM']);
  const [agreedEthics, setAgreedEthics] = useState(true);

  const availableCategories = [
    { id: 'relationship', label: 'Relationship Counselling' },
    { id: 'personal', label: 'Personal Guidance' },
    { id: 'emotional', label: 'Emotional Support' },
    { id: 'marriage_compat', label: 'Marriage & Compatibility Guidance' },
    { id: 'family_comm', label: 'Family & Communication Guidance' },
    { id: 'professional', label: 'Professional Guidance' },
    { id: 'other', label: 'Other Counselling Services' }
  ];

  const daysList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const loadData = async () => {
    setLoading(true);
    try {
      const p = await api('/counsellor/me');
      setProfile(p);
      if (p.has_profile) {
        setFormName(p.name || user?.full_name || '');
        setFormTitle(p.title || '');
        setFormQualification(p.qualification || '');
        setFormExpYears(p.experience_years || 5);
        setFormLicense(p.license_number || '');
        setFormBio(p.bio || '');
        setFormPrimaryCat(p.primary_category || 'relationship');
        setFormCategories(p.categories || ['relationship']);
        setFormLanguages(p.languages || ['English', 'Hindi']);
        setFormFee(p.fee_inr || 1000);
        setFormScope(p.scope_of_practice || '');
        setFormDays(p.available_days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
        setFormSlots(p.time_slots || ['10:00 AM', '02:00 PM', '04:00 PM']);

        const appts = await api('/counsellor/me/appointments');
        setAppointments(appts || []);
      }
    } catch (err) {
      notify(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!agreedEthics) {
      notify('You must agree to the collaboration terms and ethical practice guidelines.', true);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: formName,
        title: formTitle,
        qualification: formQualification,
        experience_years: Number(formExpYears),
        license_number: formLicense || null,
        bio: formBio,
        primary_category: formPrimaryCat,
        categories: formCategories,
        languages: formLanguages,
        fee_inr: Number(formFee),
        scope_of_practice: formScope,
        available_days: formDays,
        time_slots: formSlots,
        collaboration_agreed: agreedEthics
      };
      const res = await api('/counsellors/apply', { method: 'POST', body: payload });
      notify(res.message || 'Credentials submitted successfully.');
      await loadData();
      setActiveTab('overview');
    } catch (err) {
      notify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAppt = async (e) => {
    e.preventDefault();
    if (!selectedAppt) return;
    setSubmitting(true);
    try {
      await api(`/counsellor/me/appointments/${selectedAppt.id}`, {
        method: 'PATCH',
        body: {
          status: apptStatus,
          counsellor_notes: counsellorNote
        }
      });
      notify('Appointment notes and status updated.');
      setSelectedAppt(null);
      await loadData();
    } catch (err) {
      notify(err.message, true);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCategory = (catId) => {
    setFormCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const toggleDay = (d) => {
    setFormDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span style={{ background: '#EDFAF8', color: '#36B7A5', border: '1px solid #36B7A5', borderRadius: '999px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> Approved & Verified
          </span>
        );
      case 'Under Review':
        return (
          <span style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #F59E0B', borderRadius: '999px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> Under Review
          </span>
        );
      case 'Application Submitted':
        return (
          <span style={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #3B82F6', borderRadius: '999px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <FileText size={13} /> Application Submitted
          </span>
        );
      case 'Additional Information Required':
        return (
          <span style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #EF4444', borderRadius: '999px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={13} /> Additional Info Required
          </span>
        );
      case 'Not Approved':
        return (
          <span style={{ background: '#F3F4F6', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: '999px', padding: '4px 12px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <X size={13} /> Not Approved
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1050 }}>
      <div
        className="modal-card modal-counsellor-portal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '880px',
          width: '95%',
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(20, 33, 61, 0.18)',
          border: '1px solid #E9E4F5',
          overflow: 'hidden',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #14213D 0%, #1F2D4B 100%)',
            padding: '24px 30px',
            color: '#FFFFFF',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '22px',
              right: '24px',
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
            aria-label="Close portal modal"
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(54, 183, 165, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#36B7A5'
              }}
            >
              <Award size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF' }}>
                  MANMITRA Counsellor Portal
                </h3>
                {profile?.has_profile && getStatusBadge(profile.verification_status)}
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#E9E4F5', opacity: 0.85 }}>
                Professional onboarding, credential verification, appointment management, and client records
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
            {[
              { id: 'overview', label: 'Practice Overview' },
              { id: 'appointments', label: `Session Schedule (${appointments.length})` },
              { id: 'profile', label: profile?.has_profile ? 'Edit Professional Profile' : 'Apply to Join' },
              { id: 'ethics', label: 'Collaboration & Ethics' }
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
                    color: active ? '#14213D' : '#E9E4F5',
                    fontSize: '0.82rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '24px 30px', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>
              <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
              Loading professional records...
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div>
                  {!profile?.has_profile ? (
                    <div
                      style={{
                        padding: '36px',
                        textAlign: 'center',
                        background: '#FAF9FE',
                        borderRadius: '20px',
                        border: '1px dashed #CBD5E1'
                      }}
                    >
                      <UserCheck size={48} color="#36B7A5" style={{ margin: '0 auto 16px' }} />
                      <h4 style={{ margin: '0 0 8px', fontSize: '1.2rem', color: '#14213D' }}>
                        Join the MANMITRA Verified Professional Community
                      </h4>
                      <p style={{ margin: '0 auto 20px', maxWidth: '520px', fontSize: '0.9rem', color: '#5A6578', lineHeight: 1.55 }}>
                        MANMITRA welcomes qualified counseling psychologists, relationship therapists, and family guidance specialists committed to ethical practice, confidentiality, and high-trust support.
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '24px' }}>
                        Notice: We review verified academic credentials and regulatory registrations (e.g. RCI, BPA). We do not promise guaranteed earnings or client quotas.
                      </p>
                      <button
                        onClick={() => setActiveTab('profile')}
                        style={{
                          padding: '12px 28px',
                          borderRadius: '14px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #36B7A5 0%, #2DA090 100%)',
                          color: '#FFFFFF',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 8px 20px rgba(54, 183, 165, 0.25)'
                        }}
                      >
                        Submit Professional Application
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Status Banner */}
                      <div
                        style={{
                          padding: '18px 20px',
                          borderRadius: '16px',
                          background: profile.verified ? '#EDFAF8' : '#FFFBEB',
                          border: `1px solid ${profile.verified ? '#36B7A5' : '#F59E0B'}`,
                          marginBottom: '24px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '14px'
                        }}
                      >
                        {profile.verified ? (
                          <CheckCircle2 size={24} color="#36B7A5" style={{ flexShrink: 0 }} />
                        ) : (
                          <Clock size={24} color="#D97706" style={{ flexShrink: 0 }} />
                        )}
                        <div>
                          <div style={{ fontWeight: 700, color: '#14213D', fontSize: '0.95rem' }}>
                            Onboarding Status: {profile.verification_status}
                          </div>
                          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#374151', lineHeight: 1.45 }}>
                            {profile.verified
                              ? 'Your professional credentials have been authenticated. Your profile is live in the public and member directory.'
                              : profile.verification_status === 'Under Review'
                              ? 'Our credential review board is evaluating your submitted qualifications. You will receive an update within 24-48 business hours.'
                              : 'Your application has been received and logged into our clinical verification queue.'}
                          </p>
                        </div>
                      </div>

                      {/* Stat Cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
                        <div style={{ padding: '16px 20px', borderRadius: '16px', background: '#F7F6FC', border: '1px solid #E9E4F5' }}>
                          <div style={{ fontSize: '0.78rem', color: '#718096', fontWeight: 600 }}>Active Sessions</div>
                          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#14213D', marginTop: '4px' }}>
                            {appointments.filter((a) => a.status === 'confirmed' || a.status === 'scheduled').length}
                          </div>
                        </div>

                        <div style={{ padding: '16px 20px', borderRadius: '16px', background: '#F7F6FC', border: '1px solid #E9E4F5' }}>
                          <div style={{ fontSize: '0.78rem', color: '#718096', fontWeight: 600 }}>Completed Consultations</div>
                          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#36B7A5', marginTop: '4px' }}>
                            {appointments.filter((a) => a.status === 'completed').length}
                          </div>
                        </div>

                        <div style={{ padding: '16px 20px', borderRadius: '16px', background: '#F7F6FC', border: '1px solid #E9E4F5' }}>
                          <div style={{ fontSize: '0.78rem', color: '#718096', fontWeight: 600 }}>Consultation Rate</div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#14213D', marginTop: '4px' }}>
                            ₹{profile.fee_inr || 1000}{' '}
                            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#718096' }}>/ session</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Profile Summary */}
                      <div style={{ padding: '20px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E9E4F5', marginBottom: '20px' }}>
                        <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#14213D', fontWeight: 700 }}>
                          Verified Scope of Practice
                        </h4>
                        <p style={{ margin: '0 0 10px', fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.5 }}>
                          {profile.scope_of_practice || 'Evidence-based interpersonal communication and relational guidance.'}
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                          {profile.categories?.map((cat) => (
                            <span
                              key={cat}
                              style={{
                                background: '#EDFAF8',
                                color: '#2DA090',
                                padding: '4px 10px',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 600
                              }}
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: APPOINTMENTS */}
              {activeTab === 'appointments' && (
                <div>
                  <h4 style={{ margin: '0 0 16px', fontSize: '1.05rem', color: '#14213D', fontWeight: 700 }}>
                    Client Consultations & Clinical Session Records
                  </h4>

                  {appointments.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#718096', background: '#FAF9FE', borderRadius: '16px' }}>
                      <Calendar size={32} style={{ margin: '0 auto 10px', opacity: 0.6 }} />
                      No booked sessions yet. As users discover your specialty, appointments will appear here.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {appointments.map((appt) => (
                        <div
                          key={appt.id}
                          style={{
                            padding: '18px 20px',
                            borderRadius: '16px',
                            background: '#FFFFFF',
                            border: '1px solid #E9E4F5',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '16px'
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontWeight: 700, color: '#14213D', fontSize: '0.98rem' }}>
                                {appt.client_name || `Client #${appt.id}`}
                              </span>
                              <span
                                style={{
                                  background: appt.status === 'completed' ? '#EDFAF8' : appt.status === 'confirmed' ? '#EFF6FF' : '#FEF2F2',
                                  color: appt.status === 'completed' ? '#36B7A5' : appt.status === 'confirmed' ? '#2563EB' : '#DC2626',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 600
                                }}
                              >
                                {appt.status}
                              </span>
                            </div>

                            <div style={{ display: 'flex', gap: '14px', fontSize: '0.82rem', color: '#5A6578', marginTop: '6px' }}>
                              <span> {appt.appointment_date}</span>
                              <span> {appt.time_slot}</span>
                              <span> {appt.mode?.toUpperCase()}</span>
                            </div>

                            {appt.support_topic && (
                              <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: '#14213D' }}>
                                <strong>Topic:</strong> {appt.support_topic}
                              </p>
                            )}

                            {appt.user_notes && (
                              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#718096', fontStyle: 'italic' }}>
                                <strong>Client Background:</strong> "{appt.user_notes}"
                              </p>
                            )}

                            {appt.counsellor_notes && (
                              <div style={{ marginTop: '8px', padding: '8px 12px', background: '#F7F6FC', borderRadius: '8px', fontSize: '0.8rem', color: '#1F2937' }}>
                                <strong>Counsellor Follow-up Notes:</strong> {appt.counsellor_notes}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              setSelectedAppt(appt);
                              setApptStatus(appt.status);
                              setCounsellorNote(appt.counsellor_notes || '');
                            }}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '10px',
                              border: '1px solid #CBD5E1',
                              background: '#FFFFFF',
                              color: '#14213D',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Update Notes & Status
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Update Appointment Modal / Inline Box */}
                  {selectedAppt && (
                    <div
                      style={{
                        marginTop: '20px',
                        padding: '20px',
                        background: '#FAF9FE',
                        borderRadius: '16px',
                        border: '1px solid #36B7A5'
                      }}
                    >
                      <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', color: '#14213D' }}>
                        Update Session Record for {selectedAppt.client_name}
                      </h4>
                      <form onSubmit={handleUpdateAppt}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                              Session Status
                            </label>
                            <select
                              value={apptStatus}
                              onChange={(e) => setApptStatus(e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                            >
                              <option value="confirmed">Confirmed</option>
                              <option value="scheduled">Scheduled</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                              Clinical Follow-up Notes & Homework
                            </label>
                            <input
                              type="text"
                              value={counsellorNote}
                              placeholder="e.g. Recommended boundary framework, next session in 2 weeks..."
                              onChange={(e) => setCounsellorNote(e.target.value)}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => setSelectedAppt(null)}
                            style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.8rem' }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submitting}
                            style={{ padding: '6px 18px', borderRadius: '8px', border: 'none', background: '#36B7A5', color: '#FFFFFF', fontWeight: 600, fontSize: '0.8rem' }}
                          >
                            Save Session Record
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: APPLICATION / PROFILE FORM */}
              {activeTab === 'profile' && (
                <form onSubmit={handleApply}>
                  <h4 style={{ margin: '0 0 14px', fontSize: '1.05rem', color: '#14213D', fontWeight: 700 }}>
                    {profile?.has_profile ? 'Update Professional Credentials & Availability' : 'Counsellor Credential Verification Application'}
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14213D', marginBottom: '4px' }}>
                        Full Name & Credentials
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14213D', marginBottom: '4px' }}>
                        Professional Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Senior Counseling Psychologist"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14213D', marginBottom: '4px' }}>
                        Degree & Academic Qualifications
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ph.D. Clinical Psychology, M.Phil"
                        value={formQualification}
                        onChange={(e) => setFormQualification(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14213D', marginBottom: '4px' }}>
                        Years of Experience
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        required
                        value={formExpYears}
                        onChange={(e) => setFormExpYears(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14213D', marginBottom: '4px' }}>
                        License / RCI Registration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. RCI-PSY-XXXXX"
                        value={formLicense}
                        onChange={(e) => setFormLicense(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                      />
                    </div>
                  </div>

                  {/* Primary & Practice Categories */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14213D', marginBottom: '6px' }}>
                      Practice Categories & Specialties (Select all applicable)
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      {availableCategories.map((cat) => {
                        const selected = formCategories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            style={{
                              textAlign: 'left',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: `1.5px solid ${selected ? '#36B7A5' : '#E2E8F0'}`,
                              background: selected ? '#EDFAF8' : '#FFFFFF',
                              fontSize: '0.8rem',
                              color: selected ? '#14213D' : '#4B5563',
                              fontWeight: selected ? 600 : 400,
                              cursor: 'pointer'
                            }}
                          >
                            {selected ? 'v ' : '+ '} {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bio and Scope */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14213D', marginBottom: '4px' }}>
                      Professional Bio & Philosophy
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe your therapeutic orientation, philosophy, and areas of deep focus..."
                      value={formBio}
                      onChange={(e) => setFormBio(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', resize: 'none' }}
                    />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14213D', marginBottom: '4px' }}>
                      Declared Scope of Practice (Limits of Care)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cognitive-behavioral communication, boundary definition. Referrals provided for acute psychiatry."
                      value={formScope}
                      onChange={(e) => setFormScope(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #CBD5E1' }}
                    />
                  </div>

                  {/* Available Days */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#14213D', marginBottom: '6px' }}>
                      Consultation Days
                    </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {daysList.map((d) => {
                        const active = formDays.includes(d);
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => toggleDay(d)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: `1px solid ${active ? '#36B7A5' : '#CBD5E1'}`,
                              background: active ? '#36B7A5' : '#FFFFFF',
                              color: active ? '#FFFFFF' : '#4B5563',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ethics Agreement */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <input
                      type="checkbox"
                      id="ethicsCheck"
                      checked={agreedEthics}
                      onChange={(e) => setAgreedEthics(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <label htmlFor="ethicsCheck" style={{ fontSize: '0.8rem', color: '#4B5563' }}>
                      I certify that all qualifications and registration numbers provided are accurate, and I agree to uphold client confidentiality, ethical practice, and scope-of-care standards.
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        padding: '12px 28px',
                        borderRadius: '12px',
                        border: 'none',
                        background: '#36B7A5',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        cursor: submitting ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {submitting ? 'Submitting Application...' : profile?.has_profile ? 'Save Profile Updates' : 'Submit Credentials for Review'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: ETHICS */}
              {activeTab === 'ethics' && (
                <div>
                  <h4 style={{ margin: '0 0 14px', fontSize: '1.05rem', color: '#14213D', fontWeight: 700 }}>
                    MANMITRA Clinical Collaboration & Professional Standards
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem', color: '#374151', lineHeight: 1.55 }}>
                    <div style={{ padding: '14px 18px', borderRadius: '12px', background: '#FAF9FE', border: '1px solid #E9E4F5' }}>
                      <strong style={{ color: '#14213D' }}>1. Strict Client Confidentiality</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#5A6578' }}>
                        All communications and notes remain strictly private between the counsellor and client. Client identifiers are never shared with third parties or advertisers.
                      </p>
                    </div>

                    <div style={{ padding: '14px 18px', borderRadius: '12px', background: '#FAF9FE', border: '1px solid #E9E4F5' }}>
                      <strong style={{ color: '#14213D' }}>2. Respectful Scope of Practice</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#5A6578' }}>
                        Practitioners must clearly declare their qualifications and refer acute crisis or psychiatric emergencies to certified emergency resources (e.g. Tele-MANAS: 14416).
                      </p>
                    </div>

                    <div style={{ padding: '14px 18px', borderRadius: '12px', background: '#FAF9FE', border: '1px solid #E9E4F5' }}>
                      <strong style={{ color: '#14213D' }}>3. Transparent Session Terms & No False Promises</strong>
                      <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#5A6578' }}>
                        No promises of guaranteed relationship outcomes, instant fixes, or client quotas. All pricing and included membership sessions are clearly displayed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
