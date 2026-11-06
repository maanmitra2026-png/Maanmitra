import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  UserCheck,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';

export default function AdminCounsellorVerification({ api, notify }) {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCounsellors = async () => {
    setLoading(true);
    try {
      const data = await api('/admin/counsellors');
      setCounsellors(data || []);
    } catch (err) {
      notify(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounsellors();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await api(`/admin/counsellors/${id}/status`, {
        method: 'PATCH',
        body: { verification_status: newStatus }
      });
      notify(`Status updated to "${newStatus}" for counsellor #${id}`);
      setCounsellors(prev =>
        prev.map(c => (c.id === id ? { ...c, verification_status: newStatus, verified: newStatus === 'Approved' } : c))
      );
    } catch (err) {
      notify(err.message, true);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = counsellors.filter(c => {
    if (statusFilter !== 'ALL' && c.verification_status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = c.name?.toLowerCase().includes(q);
      const matchEmail = c.email?.toLowerCase().includes(q);
      const matchLic = c.license_number?.toLowerCase().includes(q);
      return matchName || matchEmail || matchLic;
    }
    return true;
  });

  return (
    <div className="admin-counsellor-verification">
      <div className="admin-card-head">
        <div>
          <h3>Practitioner Verification & Credential Review</h3>
          <p className="muted small">
            Review submitted degrees, clinical licenses, and onboarding states. Only practitioners with "Approved" status appear as Verified on the public platform.
          </p>
        </div>
        <button
          className="btn-outline btn-small"
          onClick={fetchCounsellors}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-row">
        <input
          type="text"
          placeholder="Search practitioner by name, email, license..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />

        <div className="admin-status-pills">
          {['ALL', 'Application Submitted', 'Under Review', 'Approved', 'Additional Information Required', 'Not Approved'].map((st) => (
            <button
              key={st}
              type="button"
              className={`chip ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>PRACTITIONER</th>
              <th>QUALIFICATIONS</th>
              <th>LICENSE NO</th>
              <th>EXPERIENCE</th>
              <th>CURRENT STATUS</th>
              <th>VERIFICATION DECISION</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="table-person">
                    <span className="avatar avatar-fallback">
                      {c.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </span>
                    <div>
                      <strong>{c.name}</strong>
                      <small className="block-muted">{c.email || 'Registered via portal'}</small>
                      <small className="muted">{c.specialization}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="tag-qual">{c.qualification}</span>
                </td>
                <td>
                  <code>{c.license_number || 'N/A'}</code>
                </td>
                <td>
                  {c.experience_years} years
                </td>
                <td>
                  <span className={`status-pill ${c.verification_status?.toLowerCase().replace(/\s+/g, '-')}`}>
                    {c.verification_status}
                  </span>
                </td>
                <td>
                  <select
                    className="select-control"
                    value={c.verification_status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    disabled={updatingId === c.id}
                  >
                    <option value="Application Submitted">Application Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved (Verified)</option>
                    <option value="Additional Information Required">Additional Information Required</option>
                    <option value="Not Approved">Not Approved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state compact">
          <p className="muted">No counsellor applications match the filter.</p>
        </div>
      )}
    </div>
  );
}
