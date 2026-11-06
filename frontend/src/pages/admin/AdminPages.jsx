import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Award, Calendar, DollarSign, Settings,
  CheckCircle2, XCircle, AlertCircle, Clock, Search, Filter,
  Eye, EyeOff, Check, X, ShieldAlert, ShieldOff, Download, RefreshCw, Video
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../apiConfig';

// ---------------------------------------------------------------------------
// 1. ADMIN DASHBOARD OVERVIEW (/admin/dashboard)
// ---------------------------------------------------------------------------
export function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setStats(data.stats || data.summary);
          setRecentBookings(data.recent_bookings || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <DashboardLayout role="admin">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Platform Administration Overview</h1>
          <p className="mm-dashboard-subtitle">Real-time statistics, companion applications, and system revenue</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mm-btn-secondary mm-btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="mm-loading-state">
          <div className="mm-spinner"></div>
          <p>Loading administrative metrics...</p>
        </div>
      ) : (
        <>
          {/* STATS METRIC TILES */}
          <div className="mm-stats-grid">
            <div className="mm-stat-tile">
              <div className="mm-stat-icon-wrap" style={{ background: '#FFF1F5', color: '#E91E63' }}>
                <Users size={22} />
              </div>
              <div className="mm-stat-info">
                <span className="mm-stat-label">Total Members</span>
                <span className="mm-stat-val">{stats?.total_users || 0}</span>
              </div>
            </div>

            <div className="mm-stat-tile">
              <div className="mm-stat-icon-wrap" style={{ background: '#F5EEF8', color: '#4A154B' }}>
                <Award size={22} />
              </div>
              <div className="mm-stat-info">
                <span className="mm-stat-label">Approved Partners</span>
                <span className="mm-stat-val">{stats?.approved_partners || 0}</span>
                <span className="mm-stat-sub">({stats?.pending_applications || 0} pending review)</span>
              </div>
            </div>

            <div className="mm-stat-tile">
              <div className="mm-stat-icon-wrap" style={{ background: '#E8F5E9', color: '#22A447' }}>
                <Calendar size={22} />
              </div>
              <div className="mm-stat-info">
                <span className="mm-stat-label">Total Bookings</span>
                <span className="mm-stat-val">{stats?.total_bookings || 0}</span>
                <span className="mm-stat-sub">{stats?.completed_bookings || 0} completed</span>
              </div>
            </div>

            <div className="mm-stat-tile">
              <div className="mm-stat-icon-wrap" style={{ background: '#FFF8E1', color: '#D4AF77' }}>
                <DollarSign size={22} />
              </div>
              <div className="mm-stat-info">
                <span className="mm-stat-label">Platform Collections</span>
                <span className="mm-stat-val">₹{stats?.total_revenue?.toLocaleString() || 0}</span>
                <span className="mm-stat-sub">Comm: ₹{stats?.platform_commission?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          {/* FINANCIAL BREAKDOWN ROW */}
          <div className="mm-grid-2" style={{ marginTop: '24px' }}>
            <div className="mm-card">
              <h3 className="mm-card-title">Revenue & Commission Split</h3>
              <div className="mm-revenue-bars" style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Partner Payouts (80%)</span>
                  <strong>₹{stats?.partner_earnings_pool?.toLocaleString() || 0}</strong>
                </div>
                <div className="mm-progress-track">
                  <div className="mm-progress-fill" style={{ width: '80%', background: 'var(--mm-gold)' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0 8px' }}>
                  <span>Platform Commission (20%)</span>
                  <strong>₹{stats?.platform_commission?.toLocaleString() || 0}</strong>
                </div>
                <div className="mm-progress-track">
                  <div className="mm-progress-fill" style={{ width: '20%', background: 'var(--mm-rose)' }}></div>
                </div>
              </div>
            </div>

            <div className="mm-card">
              <h3 className="mm-card-title">Quick Administrative Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                <a href="/admin/partners" className="mm-btn-secondary" style={{ textDecoration: 'none', textAlign: 'center' }}>
                  Review Pending Partner Applications ({stats?.pending_applications || 0})
                </a>
                <a href="/admin/bookings" className="mm-btn-secondary" style={{ textDecoration: 'none', textAlign: 'center' }}>
                  Inspect Active Conversation Bookings
                </a>
                <a href="/admin/payments" className="mm-btn-secondary" style={{ textDecoration: 'none', textAlign: 'center' }}>
                  Download Financial Audit Statement
                </a>
              </div>
            </div>
          </div>

          {/* RECENT BOOKINGS TABLE */}
          <div className="mm-card" style={{ marginTop: '24px' }}>
            <h3 className="mm-card-title">Recent Conversation Sessions</h3>
            <div className="mm-table-responsive" style={{ marginTop: '16px' }}>
              <table className="mm-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Member User</th>
                    <th>Companion Partner</th>
                    <th>Duration</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '24px' }}>No bookings recorded yet.</td>
                    </tr>
                  ) : (
                    recentBookings.map((b) => (
                      <tr key={b.id}>
                        <td><strong>#{String(b.id)}</strong></td>
                        <td>{b.user_name || 'Member'}</td>
                        <td>{b.partner_name || 'Companion'}</td>
                        <td>{b.duration_minutes} mins</td>
                        <td>
                          <span className="mm-badge-comm">{b.communication_type}</span>
                        </td>
                        <td>
                          <span className={`mm-badge-status ${b.status}`}>{b.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// 2. MANAGE PARTNERS (/admin/partners)
// ---------------------------------------------------------------------------
export function AdminPartnersPage() {
  const { token } = useAuth();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [actionMsg, setActionMsg] = useState('');
  const [zoomLink, setZoomLink] = useState('');
  const [zoomDatetime, setZoomDatetime] = useState('');
  const [zoomNotes, setZoomNotes] = useState('');
  const [zoomLoading, setZoomLoading] = useState(false);
  const [showZoomForm, setShowZoomForm] = useState(false);

  const fetchPartners = () => {
    setLoading(true);
    fetch(`${API_BASE}/admin/partners`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setPartners(Array.isArray(data) ? data : (data?.partners || [])))
      .catch(err => {
        console.error(err);
        setPartners([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPartners();
  }, [token]);

  const adminAction = async (partnerId, action, body = {}) => {
    setActionLoading(true);
    setActionMsg('');
    try {
      const res = await fetch(`${API_BASE}/admin/partners/${partnerId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setSelectedPartner(null);
        setRejectReason('');
        setSuspendReason('');
        fetchPartners();
      } else {
        const err = await res.json().catch(() => ({}));
        setActionMsg(err.detail || `Action "${action}" failed.`);
      }
    } catch (err) {
      console.error(err);
      setActionMsg('Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleScheduleZoom = async () => {
    if (!zoomLink.trim() || !zoomDatetime) {
      setActionMsg('Please enter both a Zoom link and meeting date/time.');
      return;
    }
    setZoomLoading(true);
    setActionMsg('');
    try {
      const res = await fetch(`${API_BASE}/admin/partners/${selectedPartner.id}/schedule-zoom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          zoom_link: zoomLink.trim(),
          meeting_datetime: new Date(zoomDatetime).toISOString(),
          notes: zoomNotes.trim() || 'Maanmitra Partner Induction & Orientation Call'
        })
      });
      if (res.ok) {
        setActionMsg('v Zoom meeting scheduled! Partner has been notified.');
        setShowZoomForm(false);
        setZoomLink(''); setZoomDatetime(''); setZoomNotes('');
        fetchPartners();
      } else {
        const e = await res.json().catch(() => ({}));
        setActionMsg(e.detail || 'Failed to schedule Zoom meeting.');
      }
    } catch (err) {
      setActionMsg('Network error scheduling Zoom.');
    } finally {
      setZoomLoading(false);
    }
  };

  const handleCompleteZoom = async () => {
    setZoomLoading(true);
    setActionMsg('');
    try {
      const res = await fetch(`${API_BASE}/admin/partners/${selectedPartner.id}/complete-zoom`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setActionMsg('v Induction marked complete! Partner can now pay ₹499 to activate.');
        fetchPartners();
      } else {
        const e = await res.json().catch(() => ({}));
        setActionMsg(e.detail || 'Failed to mark meeting complete.');
      }
    } catch (err) {
      setActionMsg('Network error.');
    } finally {
      setZoomLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const map = {
      approved:        { background: '#F0FDF4', color: '#16A34A', border: '1px solid #86EFAC' },
      inactive:        { background: '#F3F4F6', color: '#6B7280', border: '1px solid #D1D5DB' },
      payment_pending: { background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' },
      suspended:       { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' },
      rejected:        { background: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5' },
      under_review:    { background: '#EFF6FF', color: '#2563EB', border: '1px solid #93C5FD' },
      pending:         { background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }
    };
    return map[status] || { background: '#F3F4F6', color: '#6B7280', border: '1px solid #D1D5DB' };
  };

  const getStatusLabel = (status) => {
    const map = {
      approved: 'v Approved',
      inactive: ' Inactive',
      payment_pending: ' Payment Pending',
      suspended: ' Suspended',
      rejected: ' Rejected',
      under_review: ' Under Review',
      pending: ' Pending'
    };
    return map[status] || status;
  };

  const safePartners = Array.isArray(partners) ? partners : [];
  const filtered = safePartners.filter(p => {
    const dName = (p.display_name || '').toLowerCase();
    const lName = (p.legal_name || p.full_name || '').toLowerCase();
    const email = (p.email || '').toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch = dName.includes(q) || lName.includes(q) || email.includes(q);
    const status = p.application_status || p.verification_status;
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const partnerStatus = selectedPartner
    ? (selectedPartner.application_status || selectedPartner.verification_status)
    : null;

  return (
    <DashboardLayout role="admin">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Counsellor & Partner Management</h1>
          <p className="mm-dashboard-subtitle">Manage counsellor registrations, activations, suspensions and account status</p>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="mm-card" style={{ marginBottom: '20px' }}>
        <div className="mm-grid-2">
          <div className="mm-input-icon-wrap">
            <Search size={18} color="var(--mm-secondary-text)" />
            <input
              type="text"
              placeholder="Search by legal name, display name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mm-input"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mm-select"
            >
              <option value="all">All Statuses</option>
              <option value="payment_pending">Payment Pending</option>
              <option value="inactive">Inactive (Registered, Not Activated)</option>
              <option value="approved">Approved & Active</option>
              <option value="suspended">Suspended</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* PARTNERS TABLE */}
      <div className="mm-card">
        {loading ? (
          <div className="mm-loading-state">
            <div className="mm-spinner"></div>
            <p>Loading counsellor profiles...</p>
          </div>
        ) : (
          <div className="mm-table-responsive">
            <table className="mm-table">
              <thead>
                <tr>
                  <th>Counsellor</th>
                  <th>Legal Name</th>
                  <th>Contact</th>
                  <th>Payments</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--mm-secondary-text)' }}>
                      No counsellors found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => {
                    const status = p.application_status || p.verification_status;
                    const ss = getStatusStyle(status);
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={p.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                              alt={p.display_name}
                              className="mm-table-avatar"
                            />
                            <div>
                              <strong>{p.display_name}</strong>
                              <div style={{ fontSize: '0.8rem', color: 'var(--mm-secondary-text)' }}>
                                * {p.rating ? p.rating.toFixed(1) : '5.0'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{p.legal_name || p.full_name || '--'}</td>
                        <td>
                          <div style={{ fontSize: '0.88rem' }}>{p.email || '--'}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--mm-secondary-text)' }}>{p.phone || ''}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <span style={{ color: p.registration_fee_paid ? '#16A34A' : '#D97706' }}>
                              {p.registration_fee_paid ? 'v' : ''} ₹99 Reg
                            </span>
                            <span style={{ color: p.activation_fee_paid ? '#16A34A' : '#D97706' }}>
                              {p.activation_fee_paid ? 'v' : ''} ₹499 Act
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={{ ...ss, padding: '4px 10px', borderRadius: '20px', fontSize: '0.76rem', fontWeight: '600', whiteSpace: 'nowrap' }}>
                            {getStatusLabel(status)}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => { setSelectedPartner(p); setActionMsg(''); }}
                            className="mm-btn-primary mm-btn-sm"
                          >
                            <Eye size={14} /> Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PARTNER MANAGEMENT MODAL */}
      {selectedPartner && (
        <div className="mm-modal-backdrop">
          <div className="mm-modal-dialog" style={{ maxWidth: '560px' }}>
            <div className="mm-modal-header">
              <h3>Manage Counsellor</h3>
              <button onClick={() => setSelectedPartner(null)} className="mm-modal-close-btn">x</button>
            </div>

            <div className="mm-modal-body">
              {/* Profile summary */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                <img
                  src={selectedPartner.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                  alt={selectedPartner.display_name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--mm-plum)' }}>{selectedPartner.display_name}</h4>
                  <p style={{ margin: '3px 0 0', color: 'var(--mm-secondary-text)', fontSize: '0.88rem' }}>
                    {selectedPartner.legal_name} . {selectedPartner.email}
                  </p>
                  <span style={{ ...getStatusStyle(partnerStatus), padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', display: 'inline-block', marginTop: '5px' }}>
                    {getStatusLabel(partnerStatus)}
                  </span>
                </div>
              </div>

              {/* Payment info */}
              <div style={{ background: '#F9F5FF', border: '1px solid #E9D5FF', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
                <h5 style={{ margin: '0 0 10px', color: 'var(--mm-plum)', fontSize: '0.9rem' }}>Payment Status</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: selectedPartner.registration_fee_paid ? '#16A34A' : '#D97706', fontSize: '1.1rem' }}>
                      {selectedPartner.registration_fee_paid ? 'v' : ''}
                    </span>
                    <span>₹99 Registration Fee</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: selectedPartner.activation_fee_paid ? '#16A34A' : '#D97706', fontSize: '1.1rem' }}>
                      {selectedPartner.activation_fee_paid ? 'v' : ''}
                    </span>
                    <span>₹499 Activation Fee</span>
                  </div>
                </div>
              </div>

              {/* Zoom Induction Meeting Section */}
              {selectedPartner.registration_fee_paid && (
                <div style={{ border: '1px solid #E9D5FF', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px', background: '#F9F5FF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h5 style={{ margin: 0, color: '#6D28D9', fontSize: '0.9rem' }}> Zoom Induction Meeting</h5>
                    <span style={{
                      padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700',
                      background: selectedPartner.zoom_meeting_completed ? '#F0FDF4' : selectedPartner.zoom_meeting_scheduled ? '#EFF6FF' : '#FFF8E6',
                      color: selectedPartner.zoom_meeting_completed ? '#16A34A' : selectedPartner.zoom_meeting_scheduled ? '#2563EB' : '#D97706',
                      border: `1px solid ${selectedPartner.zoom_meeting_completed ? '#86EFAC' : selectedPartner.zoom_meeting_scheduled ? '#93C5FD' : '#FDE68A'}`
                    }}>
                      {selectedPartner.zoom_meeting_completed ? 'v Completed' : selectedPartner.zoom_meeting_scheduled ? ' Scheduled' : ' Not Scheduled'}
                    </span>
                  </div>

                  {selectedPartner.zoom_meeting_scheduled && selectedPartner.zoom_meeting_link && (
                    <div style={{ fontSize: '0.83rem', marginBottom: '10px' }}>
                      <div style={{ color: '#5B21B6' }}>
                         <a href={selectedPartner.zoom_meeting_link} target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB' }}>
                          {selectedPartner.zoom_meeting_link.length > 50 ? selectedPartner.zoom_meeting_link.slice(0, 50) + '...' : selectedPartner.zoom_meeting_link}
                        </a>
                      </div>
                      {selectedPartner.zoom_meeting_datetime && (
                        <div style={{ color: '#6D28D9', marginTop: '4px' }}>
                           {new Date(selectedPartner.zoom_meeting_datetime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Schedule Zoom Form */}
                  {!selectedPartner.zoom_meeting_completed && (
                    <div>
                      {!showZoomForm ? (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setShowZoomForm(true)}
                            style={{ padding: '7px 14px', background: '#7C3AED', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}
                          >
                            {selectedPartner.zoom_meeting_scheduled ? ' Reschedule' : '+ Schedule Zoom'}
                          </button>
                          {selectedPartner.zoom_meeting_scheduled && !selectedPartner.zoom_meeting_completed && (
                            <button
                              onClick={handleCompleteZoom}
                              disabled={zoomLoading}
                              style={{ padding: '7px 14px', background: '#16A34A', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', opacity: zoomLoading ? 0.6 : 1 }}
                            >
                              v Mark Meeting Done
                            </button>
                          )}
                        </div>
                      ) : (
                        <div style={{ background: '#EDE9FE', borderRadius: '10px', padding: '12px', marginTop: '8px' }}>
                          <div style={{ marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#5B21B6', display: 'block', marginBottom: '4px' }}>Zoom Meeting Link *</label>
                            <input
                              type="url"
                              placeholder="https://zoom.us/j/..."
                              value={zoomLink}
                              onChange={(e) => setZoomLink(e.target.value)}
                              style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #C4B5FD', fontSize: '0.83rem', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#5B21B6', display: 'block', marginBottom: '4px' }}>Date & Time (IST) *</label>
                            <input
                              type="datetime-local"
                              value={zoomDatetime}
                              onChange={(e) => setZoomDatetime(e.target.value)}
                              style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #C4B5FD', fontSize: '0.83rem', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div style={{ marginBottom: '10px' }}>
                            <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#5B21B6', display: 'block', marginBottom: '4px' }}>Notes (optional)</label>
                            <input
                              type="text"
                              placeholder="e.g. Maanmitra Induction & Orientation Call"
                              value={zoomNotes}
                              onChange={(e) => setZoomNotes(e.target.value)}
                              style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #C4B5FD', fontSize: '0.83rem', boxSizing: 'border-box' }}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={handleScheduleZoom}
                              disabled={zoomLoading}
                              style={{ flex: 1, padding: '8px', background: '#7C3AED', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.83rem', fontWeight: '600', opacity: zoomLoading ? 0.6 : 1 }}
                            >
                              {zoomLoading ? 'Scheduling...' : 'Confirm & Notify Partner'}
                            </button>
                            <button
                              onClick={() => setShowZoomForm(false)}
                              style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #C4B5FD', color: '#5B21B6', borderRadius: '8px', cursor: 'pointer', fontSize: '0.83rem' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Bio */}
              {selectedPartner.bio && (
                <div style={{ background: '#fdf7f9', border: '1px solid #F1DCE5', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', fontSize: '0.88rem', color: 'var(--mm-primary-text)' }}>
                  <strong style={{ color: 'var(--mm-plum)', display: 'block', marginBottom: '4px' }}>Bio</strong>
                  {selectedPartner.bio}
                </div>
              )}

              {/* Reason inputs */}
              <div className="mm-form-group">
                <label className="mm-form-label">Rejection / Suspension Reason (optional):</label>
                <input
                  type="text"
                  placeholder="e.g. Inappropriate behaviour, payment dispute"
                  value={rejectReason || suspendReason}
                  onChange={(e) => { setRejectReason(e.target.value); setSuspendReason(e.target.value); }}
                  className="mm-input"
                />
              </div>

              {actionMsg && (
                <div style={{ background: '#FEECEE', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginTop: '8px' }}>
                  {actionMsg}
                </div>
              )}
            </div>

            <div className="mm-modal-footer" style={{ flexWrap: 'wrap', gap: '8px' }}>
              {/* Reject -- always available */}
              <button
                onClick={() => adminAction(selectedPartner.id, 'reject', { reason: rejectReason || 'Administrative decision' })}
                disabled={actionLoading}
                className="mm-btn-danger"
                style={{ flex: '1', minWidth: '120px' }}
              >
                <X size={15} /> Reject
              </button>

              {/* Suspend -- only for non-suspended, non-rejected */}
              {partnerStatus !== 'suspended' && partnerStatus !== 'rejected' && (
                <button
                  onClick={() => adminAction(selectedPartner.id, 'suspend', { reason: suspendReason || 'Platform policy violation' })}
                  disabled={actionLoading}
                  style={{
                    flex: '1', minWidth: '120px', padding: '10px 16px',
                    background: '#7C3AED', color: '#FFFFFF', border: 'none',
                    borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    opacity: actionLoading ? 0.6 : 1
                  }}
                >
                  <ShieldOff size={15} /> Suspend
                </button>
              )}

              {/* Deactivate -- only for approved */}
              {partnerStatus === 'approved' && (
                <button
                  onClick={() => adminAction(selectedPartner.id, 'deactivate')}
                  disabled={actionLoading}
                  style={{
                    flex: '1', minWidth: '120px', padding: '10px 16px',
                    background: '#6B7280', color: '#FFFFFF', border: 'none',
                    borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.88rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    opacity: actionLoading ? 0.6 : 1
                  }}
                >
                  <EyeOff size={15} /> Deactivate
                </button>
              )}

              {/* Activate / Re-activate */}
              {(partnerStatus !== 'approved') && (
                <button
                  onClick={() => adminAction(selectedPartner.id, 'approve')}
                  disabled={actionLoading}
                  className="mm-btn-primary"
                  style={{ flex: '1', minWidth: '120px' }}
                >
                  <Check size={15} />
                  {partnerStatus === 'suspended' ? 'Re-activate' : 'Approve & Activate'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// 3. MANAGE USERS (/admin/users)
// ---------------------------------------------------------------------------
export function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setUsers(Array.isArray(data) ? data : (data?.users || [])))
      .catch(err => {
        console.error(err);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const toggleStatus = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/toggle-status`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, account_status: u.account_status === 'active' ? 'suspended' : 'active' } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const filtered = safeUsers.filter(u =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Platform Members & Users</h1>
          <p className="mm-dashboard-subtitle">Manage customer accounts, status, and conversation access</p>
        </div>
      </div>

      <div className="mm-card" style={{ marginBottom: '20px' }}>
        <div className="mm-input-icon-wrap">
          <Search size={18} color="var(--mm-secondary-text)" />
          <input
            type="text"
            placeholder="Search member by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mm-input"
          />
        </div>
      </div>

      <div className="mm-card">
        {loading ? (
          <div className="mm-loading-state"><div className="mm-spinner"></div><p>Loading members...</p></div>
        ) : (
          <div className="mm-table-responsive">
            <table className="mm-table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.full_name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className="mm-badge-role">{u.role}</span></td>
                    <td><span className={`mm-badge-status ${u.account_status}`}>{u.account_status}</span></td>
                    <td>
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`mm-btn-${u.account_status === 'active' ? 'danger' : 'secondary'} mm-btn-sm`}
                      >
                        {u.account_status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// 4. MANAGE BOOKINGS (/admin/bookings)
// ---------------------------------------------------------------------------
export function AdminBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/admin/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setBookings(Array.isArray(data) ? data : (data?.bookings || [])))
      .catch(err => {
        console.error(err);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <DashboardLayout role="admin">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">All Conversation Bookings</h1>
          <p className="mm-dashboard-subtitle">Monitor scheduled, active, and completed companion conversations</p>
        </div>
      </div>

      <div className="mm-card">
        {loading ? (
          <div className="mm-loading-state"><div className="mm-spinner"></div><p>Loading bookings...</p></div>
        ) : (
          <div className="mm-table-responsive">
            <table className="mm-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Member</th>
                  <th>Partner</th>
                  <th>Scheduled Date</th>
                  <th>Duration</th>
                  <th>Mode</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(bookings) ? bookings : []).length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>No bookings found.</td></tr>
                ) : (
                  bookings.map(b => {
                    const dateStr = b.scheduled_start ? new Date(b.scheduled_start).toLocaleString() : (b.time || 'Scheduled');
                    const status = b.status || b.booking_status || 'confirmed';
                    return (
                      <tr key={b.id}>
                        <td><strong>#{String(b.id)}</strong></td>
                        <td>{b.user_name || 'Member'}</td>
                        <td>{b.partner_name || 'Companion'}</td>
                        <td>{dateStr}</td>
                        <td>{b.duration_minutes || 30} mins</td>
                        <td><span className="mm-badge-comm">{b.communication_type || 'Audio'}</span></td>
                        <td><span className={`mm-badge-status ${status}`}>{status}</span></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// 5. MANAGE PAYMENTS & REVENUE (/admin/payments)
// ---------------------------------------------------------------------------
export function AdminPaymentsPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('payments'); // 'payments' | 'withdrawals'
  const [payments, setPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [payoutModal, setPayoutModal] = useState(null); // withdrawal item
  const [payoutRef, setPayoutRef] = useState('');

  const fetchPayments = () => {
    setLoading(true);
    fetch(`${API_BASE}/admin/payments`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          if (Array.isArray(data)) {
            setPayments(data);
          } else {
            setPayments(Array.isArray(data.payments) ? data.payments : []);
            setSummary(data.summary || null);
          }
        } else {
          setPayments([]);
        }
      })
      .catch(err => {
        console.error(err);
        setPayments([]);
      })
      .finally(() => setLoading(false));
  };

  const fetchWithdrawals = () => {
    fetch(`${API_BASE}/admin/withdrawals`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setWithdrawals(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchPayments();
    fetchWithdrawals();
  }, [token]);

  const safePayments = Array.isArray(payments) ? payments : [];

  const handleWithdrawalAction = async (id, action) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/withdrawals/${id}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action,
          payout_ref: payoutRef || `MANMITRA-BANK-${Date.now()}`,
          rejection_reason: action === 'reject' ? 'Administrative compliance verification' : undefined
        })
      });
      if (res.ok) {
        setPayoutModal(null);
        setPayoutRef('');
        fetchWithdrawals();
        fetchPayments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleScheduleZoom = async () => {
    if (!zoomLink.trim() || !zoomDatetime) {
      setActionMsg('Please enter both a Zoom link and meeting date/time.');
      return;
    }
    setZoomLoading(true);
    setActionMsg('');
    try {
      const res = await fetch(`${API_BASE}/admin/partners/${selectedPartner.id}/schedule-zoom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          zoom_link: zoomLink.trim(),
          meeting_datetime: new Date(zoomDatetime).toISOString(),
          notes: zoomNotes.trim() || 'Maanmitra Partner Induction & Orientation Call'
        })
      });
      if (res.ok) {
        setActionMsg('v Zoom meeting scheduled! Partner has been notified.');
        setShowZoomForm(false);
        setZoomLink(''); setZoomDatetime(''); setZoomNotes('');
        fetchPartners();
      } else {
        const e = await res.json().catch(() => ({}));
        setActionMsg(e.detail || 'Failed to schedule Zoom meeting.');
      }
    } catch (err) {
      setActionMsg('Network error scheduling Zoom.');
    } finally {
      setZoomLoading(false);
    }
  };

  const handleCompleteZoom = async () => {
    setZoomLoading(true);
    setActionMsg('');
    try {
      const res = await fetch(`${API_BASE}/admin/partners/${selectedPartner.id}/complete-zoom`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setActionMsg('v Induction marked complete! Partner can now pay ₹499 to activate.');
        fetchPartners();
      } else {
        const e = await res.json().catch(() => ({}));
        setActionMsg(e.detail || 'Failed to mark meeting complete.');
      }
    } catch (err) {
      setActionMsg('Network error.');
    } finally {
      setZoomLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Payment ID,Booking,Gross Amount,Partner Share (70%),Platform Commission (30%),Status,Timestamp\n'];
    const rows = safePayments.map(p => {
      const gross = p.gross_amount ?? p.amount ?? 0;
      const partnerShare = p.partner_share ?? Math.round(gross * 0.7);
      const platformComm = p.platform_commission ?? Math.round(gross * 0.3);
      const bookingRef = p.booking_code || p.booking_id || `MM-${p.id}`;
      return `"${p.id}","${bookingRef}","${gross}","${partnerShare}","${platformComm}","${p.payment_status || 'captured'}","${p.created_at || ''}"`;
    });
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maanmitra_payments_statement_${Date.now()}.csv`;
    a.click();
  };

  return (
    <DashboardLayout role="admin">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Financial Ledger & Payouts</h1>
          <p className="mm-dashboard-subtitle">Audited Razorpay transactions, partner revenue allocations (70/30), and withdrawal processing</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={exportCSV} className="mm-btn-secondary mm-btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> Download Ledger
          </button>
        </div>
      </div>

      {summary && (
        <div className="mm-stats-grid" style={{ marginBottom: '24px' }}>
          <div className="mm-stat-tile">
            <div className="mm-stat-icon-wrap" style={{ background: '#FFF1F5', color: '#E91E63' }}>
              <DollarSign size={22} />
            </div>
            <div className="mm-stat-info">
              <span className="mm-stat-label">Total Platform Volume</span>
              <span className="mm-stat-val">₹{summary.total_revenue?.toLocaleString() || 0}</span>
            </div>
          </div>

          <div className="mm-stat-tile">
            <div className="mm-stat-icon-wrap" style={{ background: '#F5EEF8', color: '#4A154B' }}>
              <DollarSign size={22} />
            </div>
            <div className="mm-stat-info">
              <span className="mm-stat-label">Platform Share (30%)</span>
              <span className="mm-stat-val">₹{summary.platform_revenue?.toLocaleString() || Math.round((summary.total_revenue || 0) * 0.3).toLocaleString()}</span>
            </div>
          </div>

          <div className="mm-stat-tile">
            <div className="mm-stat-icon-wrap" style={{ background: '#E8F5E9', color: '#22A447' }}>
              <DollarSign size={22} />
            </div>
            <div className="mm-stat-info">
              <span className="mm-stat-label">Partner Revenue (70%)</span>
              <span className="mm-stat-val">₹{summary.partner_payouts?.toLocaleString() || Math.round((summary.total_revenue || 0) * 0.7).toLocaleString()}</span>
            </div>
          </div>

          <div className="mm-stat-tile">
            <div className="mm-stat-icon-wrap" style={{ background: '#FFF8E1', color: '#D4AF77' }}>
              <Clock size={22} />
            </div>
            <div className="mm-stat-info">
              <span className="mm-stat-label">Pending Withdrawals</span>
              <span className="mm-stat-val">{withdrawals.filter(w => w.status === 'pending').length} requests</span>
            </div>
          </div>
        </div>
      )}

      {/* TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
        <button
          onClick={() => setActiveTab('payments')}
          className={activeTab === 'payments' ? 'mm-btn-primary mm-btn-sm' : 'mm-btn-secondary mm-btn-sm'}
        >
          Member Transactions ({safePayments.length})
        </button>
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={activeTab === 'withdrawals' ? 'mm-btn-primary mm-btn-sm' : 'mm-btn-secondary mm-btn-sm'}
        >
          Mentor Withdrawals ({withdrawals.length})
        </button>
      </div>

      {activeTab === 'payments' ? (
        <div className="mm-card">
          {loading ? (
            <div className="mm-loading-state"><div className="mm-spinner"></div><p>Loading payments...</p></div>
          ) : (
            <div className="mm-table-responsive">
              <table className="mm-table">
                <thead>
                  <tr>
                    <th>Txn ID</th>
                    <th>Member</th>
                    <th>Gross Amount</th>
                    <th>Partner Share (70%)</th>
                    <th>Commission (30%)</th>
                    <th>Payment Status</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {safePayments.length === 0 ? (
                    <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>No payments logged yet.</td></tr>
                  ) : (
                    safePayments.map(p => {
                      const gross = p.gross_amount ?? p.amount ?? 0;
                      const partnerShare = p.partner_share ?? Math.round(gross * 0.7);
                      const platformComm = p.platform_commission ?? Math.round(gross * 0.3);
                      const dateStr = p.created_at ? new Date(p.created_at).toLocaleString() : 'N/A';
                      const status = p.payment_status || 'captured';

                      return (
                        <tr key={p.id}>
                          <td><strong>#{String(p.id)}</strong></td>
                          <td>{p.user_name || 'Member'}</td>
                          <td><strong>₹{gross}</strong></td>
                          <td style={{ color: 'var(--mm-success)' }}>₹{partnerShare}</td>
                          <td style={{ color: 'var(--mm-plum)' }}>₹{platformComm}</td>
                          <td><span className={`mm-badge-status ${status}`}>{status}</span></td>
                          <td>{dateStr}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="mm-card">
          <div className="mm-table-responsive">
            <table className="mm-table">
              <thead>
                <tr>
                  <th>Request Ref</th>
                  <th>Mentor ID</th>
                  <th>Amount</th>
                  <th>Bank / IFSC</th>
                  <th>Status</th>
                  <th>Requested Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>No withdrawal requests found.</td></tr>
                ) : (
                  withdrawals.map(w => (
                    <tr key={w.id}>
                      <td><strong>{w.request_code}</strong></td>
                      <td>Partner #{w.partner_id}</td>
                      <td><strong style={{ color: 'var(--mm-plum)' }}>₹{w.amount_inr?.toLocaleString()}</strong></td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{w.bank_name || 'Bank'} ({w.account_number_masked || '----'})</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--mm-secondary-text)' }}>{w.ifsc_code || 'IFSC'}</div>
                      </td>
                      <td>
                        <span className={`mm-badge-status ${w.status === 'processed' ? 'approved' : w.status === 'rejected' ? 'rejected' : 'pending'}`}>
                          {w.status?.toUpperCase()}
                        </span>
                      </td>
                      <td>{w.created_at ? new Date(w.created_at).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        {w.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => setPayoutModal(w)}
                              className="mm-btn-primary mm-btn-sm"
                            >
                              Process
                            </button>
                            <button
                              onClick={() => handleWithdrawalAction(w.id, 'reject')}
                              disabled={actionLoading}
                              className="mm-btn-secondary mm-btn-sm"
                              style={{ color: '#DC2626' }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--mm-secondary-text)' }}>
                            {w.payout_ref || 'Completed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAYOUT CONFIRMATION MODAL */}
      {payoutModal && (
        <div className="mm-modal-backdrop">
          <div className="mm-modal-dialog">
            <div className="mm-modal-header">
              <h3>Disburse Mentor Withdrawal</h3>
              <button onClick={() => setPayoutModal(null)} className="mm-modal-close-btn">x</button>
            </div>
            <div className="mm-modal-body">
              <p>You are approving a payout of <strong>₹{payoutModal.amount_inr?.toLocaleString()}</strong> for Partner #{payoutModal.partner_id}.</p>
              <div className="mm-card" style={{ background: '#f8f4f9', marginBottom: '16px', padding: '12px' }}>
                <div><strong>Bank:</strong> {payoutModal.bank_name || 'HDFC Bank'}</div>
                <div><strong>Account:</strong> {payoutModal.account_number_masked || '-------- 4821'}</div>
                <div><strong>IFSC:</strong> {payoutModal.ifsc_code || 'HDFC0001234'}</div>
              </div>
              <div className="mm-form-group">
                <label className="mm-form-label">Bank UTR / Transaction Reference ID:</label>
                <input
                  type="text"
                  placeholder="e.g. UTR-20261106-99214"
                  value={payoutRef}
                  onChange={e => setPayoutRef(e.target.value)}
                  className="mm-input"
                />
              </div>
            </div>
            <div className="mm-modal-footer">
              <button onClick={() => setPayoutModal(null)} className="mm-btn-secondary">Cancel</button>
              <button
                onClick={() => handleWithdrawalAction(payoutModal.id, 'approve')}
                disabled={actionLoading}
                className="mm-btn-primary"
              >
                {actionLoading ? 'Processing...' : 'Confirm Bank Transfer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// 6. MANAGE PACKAGES (/admin/packages)
// ---------------------------------------------------------------------------
export function AdminPackagesPage() {
  const { token } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/packages`)
      .then(res => res.ok ? res.json() : [])
      .then(setPackages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Conversation Packages & Pricing</h1>
          <p className="mm-dashboard-subtitle">Configure session tiers, standard pricing, and allowed conversation durations</p>
        </div>
      </div>

      <div className="mm-grid-3">
        {packages.map(pkg => (
          <div key={pkg.id} className="mm-card">
            <h3 style={{ color: 'var(--mm-plum)', marginBottom: '8px' }}>{pkg.name}</h3>
            <p style={{ color: 'var(--mm-secondary-text)', fontSize: '0.9rem', minHeight: '40px' }}>{pkg.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--mm-rose)' }}>₹{pkg.price}</span>
              <span className="mm-badge-comm">{pkg.duration_minutes} minutes</span>
            </div>
            <button className="mm-btn-secondary mm-btn-sm mm-btn-block">
              Configure Package
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

// ---------------------------------------------------------------------------
// 7. PLATFORM SETTINGS (/admin/settings)
// ---------------------------------------------------------------------------
export function AdminSettingsPage() {
  const { token } = useAuth();
  const [commissionRate, setCommissionRate] = useState(20);
  const [supportEmail, setSupportEmail] = useState('support@maanmitra.com');
  const [bookingDays, setBookingDays] = useState(7);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/admin/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          if (data.commission_percentage) setCommissionRate(Number(data.commission_percentage));
          if (data.support_email) setSupportEmail(data.support_email);
          if (data.max_booking_days) setBookingDays(Number(data.max_booking_days));

        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_BASE}/admin/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          commission_percentage: String(commissionRate),
          support_email: supportEmail,
          max_booking_days: String(bookingDays)
        })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="mm-dashboard-header">
        <div>
          <h1 className="mm-dashboard-title">Platform Configuration</h1>
          <p className="mm-dashboard-subtitle">Commission rules, security parameters, and operational policies</p>
        </div>
      </div>

      <div className="mm-card" style={{ maxWidth: '640px' }}>
        {saved && (
          <div className="mm-alert mm-alert-success" style={{ marginBottom: '16px' }}>
            <CheckCircle2 size={18} /> Platform settings successfully saved!
          </div>
        )}

        {loading ? (
          <div className="mm-loading-state"><div className="mm-spinner"></div><p>Loading settings...</p></div>
        ) : (
          <form onSubmit={handleSave}>
            <div className="mm-form-group">
              <label className="mm-form-label">Platform Commission Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="mm-input"
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--mm-secondary-text)' }}>
                Current: {commissionRate}% platform commission retained, {100 - commissionRate}% credited directly to companion earnings.
              </span>
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Support Email Contact</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="mm-input"
                required
              />
            </div>

            <div className="mm-form-group">
              <label className="mm-form-label">Max Advance Booking Window (Days)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={bookingDays}
                onChange={(e) => setBookingDays(e.target.value)}
                className="mm-input"
                required
              />
            </div>

            <button type="submit" className="mm-btn-primary">
              Save Platform Settings
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
