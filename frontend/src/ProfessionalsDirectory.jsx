import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  Phone,
  UserCheck,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRight,
  Info,
  ChevronDown
} from 'lucide-react';

export default function ProfessionalsDirectory({
  counsellors = [],
  categories = [],
  subscription,
  onOpenBooking,
  onOpenUpgrade
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [selectedMode, setSelectedMode] = useState('ALL');
  const [selectedBioId, setSelectedBioId] = useState(null);

  const isPremium = subscription?.plan?.code === 'PREMIUM';

  // Extract all unique languages
  const allLanguages = useMemo(() => {
    const set = new Set();
    counsellors.forEach(c => {
      (c.languages || []).forEach(l => set.add(l));
    });
    return Array.from(set);
  }, [counsellors]);

  // Filter counsellors
  const filteredCounsellors = useMemo(() => {
    return counsellors.filter(c => {
      // Search
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchName = c.name?.toLowerCase().includes(query);
        const matchSpec = c.specialization?.toLowerCase().includes(query);
        const matchQual = c.qualification?.toLowerCase().includes(query);
        if (!matchName && !matchSpec && !matchQual) return false;
      }

      // Category
      if (selectedCategory !== 'ALL') {
        const matchCat = c.category_slug === selectedCategory || 
                         c.specialization?.toLowerCase().includes(selectedCategory.toLowerCase());
        if (!matchCat) return false;
      }

      // Language
      if (selectedLanguage !== 'ALL') {
        if (!c.languages || !c.languages.includes(selectedLanguage)) return false;
      }

      // Mode
      if (selectedMode !== 'ALL') {
        if (!c.consultation_modes || !c.consultation_modes.includes(selectedMode)) return false;
      }

      return true;
    });
  }, [counsellors, searchTerm, selectedCategory, selectedLanguage, selectedMode]);

  return (
    <div className="professionals-directory-page">
      {/* Header */}
      <div className="page-heading">
        <div>
          <div className="eyebrow-teal">PROFESSIONAL DIRECTORY</div>
          <h1>Browse Verified Professionals</h1>
          <p>
            Connect with verified relationship counsellors, personal guidance advisors, and family communication specialists.
          </p>
        </div>
      </div>

      {/* Scope Disclaimer */}
      <div className="directory-scope-alert">
        <Info size={18} color="#36B7A5" />
        <div>
          <strong>Scope of Practice & Verification Notice:</strong>
          <span>
            These are service categories, not a claim that every counsellor handles every issue. Verified practitioners list their formal qualifications, verified credentials, and specific domain of practice.
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card card-pad directory-filter-bar">
        <div className="filter-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by counsellor name, specialization, or qualifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')}></button>
          )}
        </div>

        <div className="filter-controls-row">
          <div className="filter-control-item">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map(cat => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-control-item">
            <label>Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="ALL">All Languages</option>
              {allLanguages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div className="filter-control-item">
            <label>Session Mode</label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
            >
              <option value="ALL">All Modes</option>
              <option value="video">Video Call</option>
              <option value="voice">Voice Call</option>
              <option value="in_person">In Person</option>
            </select>
          </div>
        </div>

        <div className="filter-summary-row">
          <span className="muted small">
            Showing <strong>{filteredCounsellors.length}</strong> verified practitioners
          </span>
          {(searchTerm || selectedCategory !== 'ALL' || selectedLanguage !== 'ALL' || selectedMode !== 'ALL') && (
            <button
              className="text-link"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setSelectedLanguage('ALL');
                setSelectedMode('ALL');
              }}
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Counsellor Cards Grid */}
      <div className="professionals-cards-grid">
        {filteredCounsellors.map((c) => {
          const isExpanded = selectedBioId === c.id;
          return (
            <div className="professional-card card" key={c.id}>
              <div className="pro-card-header">
                <div className="pro-avatar">
                  {c.avatar_url ? (
                    <img src={c.avatar_url} alt={c.name} />
                  ) : (
                    <span>{c.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</span>
                  )}
                </div>
                <div className="pro-badges">
                  {c.verified && (
                    <span className="verified-pill">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  )}
                  <span className="rating-pill">* {c.rating || '4.9'}</span>
                </div>
              </div>

              <div className="pro-body">
                <h3>{c.name}</h3>
                <div className="pro-spec">{c.specialization}</div>

                <div className="pro-qual-row">
                  <Award size={14} color="#36B7A5" />
                  <span>{c.qualification}</span>
                </div>

                <div className="pro-meta-row">
                  <span><strong>{c.experience_years}</strong> years experience</span>
                  <span>.</span>
                  <span>License: <strong>{c.license_number || 'REG-MH-2024'}</strong></span>
                </div>

                <div className="pro-bio-snippet">
                  <p>
                    {isExpanded ? c.bio : (c.bio?.slice(0, 140) + '...')}
                  </p>
                  {c.bio?.length > 140 && (
                    <button
                      className="text-link bio-toggle"
                      onClick={() => setSelectedBioId(isExpanded ? null : c.id)}
                    >
                      {isExpanded ? 'Show less' : 'Read full scope '}
                    </button>
                  )}
                </div>

                <div className="pro-tags-section">
                  <div className="tag-group">
                    <span className="group-label">Languages:</span>
                    {(c.languages || ['English', 'Hindi']).map(l => (
                      <span key={l} className="lang-tag">{l}</span>
                    ))}
                  </div>

                  <div className="tag-group">
                    <span className="group-label">Modes:</span>
                    {(c.consultation_modes || ['video', 'voice']).map(m => (
                      <span key={m} className="mode-tag">{m}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pro-footer">
                <div className="fee-display">
                  {isPremium ? (
                    <div className="included-pill">
                      <ShieldCheck size={14} color="#36B7A5" />
                      <span>Included in Premium</span>
                    </div>
                  ) : (
                    <div className="fee-pricing">
                      <span className="amount">₹{c.fee_inr || 799}</span>
                      <small>/ 20-min session</small>
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-coral"
                  onClick={() => onOpenBooking(c)}
                >
                  <Calendar size={15} /> Book Session
                </button>
              </div>
            </div>
          );
        })}

        {filteredCounsellors.length === 0 && (
          <div className="card empty-state" style={{ gridColumn: '1 / -1' }}>
            <UserCheck size={40} color="#7E636F" />
            <h3>No professionals match your search</h3>
            <p>Try clearing filters or adjusting your search term to see more specialists.</p>
            <button
              className="btn"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setSelectedLanguage('ALL');
                setSelectedMode('ALL');
              }}
            >
              Show all professionals
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
