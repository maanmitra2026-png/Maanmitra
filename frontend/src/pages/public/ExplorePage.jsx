import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Filter, Star, Phone, Video, MessageSquare,
  ShieldCheck, ArrowRight, Heart, Sparkles, CheckCircle2,
  Globe, Clock, UserCheck
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { API_BASE } from '../../apiConfig';

export default function ExplorePage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedCommType, setSelectedCommType] = useState('All');
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  useEffect(() => {
    fetch(`${API_BASE}/partners`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPartners(data);
        } else {
          setPartners(defaultPartners);
        }
      })
      .catch(err => {
        setPartners(defaultPartners);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavoriteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const quickFilters = ['All', 'Online', 'Hindi', 'English', 'Marathi', 'Bengali'];

  const handleQuickFilter = (qf) => {
    if (qf === 'All') {
      setSelectedLanguage('All');
      setOnlyOnline(false);
    } else if (qf === 'Online') {
      setOnlyOnline(!onlyOnline);
    } else {
      setSelectedLanguage(qf);
    }
  };

  const filteredPartners = (partners.length > 0 ? partners : defaultPartners).filter(p => {
    const nameMatch = p.display_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const bioMatch = p.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    const langRaw = Array.isArray(p.languages) ? p.languages.join(' ') : (p.languages || '');
    const langSearchMatch = langRaw.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSearch = !searchQuery || nameMatch || bioMatch || langSearchMatch;

    const matchesLang =
      selectedLanguage === 'All' ||
      langRaw.toLowerCase().includes(selectedLanguage.toLowerCase());

    const matchesOnline = !onlyOnline || p.availability_status === 'online' || p.is_online !== false;

    const matchesComm =
      selectedCommType === 'All' ||
      (selectedCommType === 'chat' && p.allows_chat !== false) ||
      (selectedCommType === 'audio' && p.allows_audio !== false) ||
      (selectedCommType === 'video' && p.allows_video !== false);

    return matchesSearch && matchesLang && matchesOnline && matchesComm;
  }).sort((a, b) => {
    if (sortBy === 'rating') return ((b.rating_average || b.rating || 4.8) - (a.rating_average || a.rating || 4.8));
    if (sortBy === 'price_low') return ((a.rate_chat_15m || a.hourly_rate || 99) - (b.rate_chat_15m || b.hourly_rate || 99));
    if (sortBy === 'price_high') return ((b.rate_chat_15m || b.hourly_rate || 99) - (a.rate_chat_15m || a.hourly_rate || 99));
    return 0;
  });

  return (
    <div className="mm-page-wrapper">
      <PublicNavbar />

      <main id="main-content">
        {/* Explore Header */}
        <section className="mm-explore-hero">
          <div className="mm-explore-hero-inner">
            <h1 className="mm-page-title">Explore Partners</h1>
            <p className="mm-page-subtitle">
              Find your perfect conversation partner.
            </p>

            {/* Search Input Box */}
            <div className="mm-search-bar-wrap">
              <div className="mm-search-input-box">
                <Search size={18} color="var(--mm-secondary-text)" />
                <input
                  type="text"
                  placeholder="Search by name, interest, or language..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search companions"
                />
                {searchQuery && (
                  <button
                    className="mm-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    x
                  </button>
                )}
              </div>
            </div>

            {/* Quick Filter Pills */}
            <div className="mm-quick-pills-row" role="group" aria-label="Quick filters">
              {quickFilters.map((qf) => {
                const isActive =
                  (qf === 'All' && selectedLanguage === 'All' && !onlyOnline) ||
                  (qf === 'Online' && onlyOnline) ||
                  (qf !== 'All' && qf !== 'Online' && selectedLanguage === qf);

                return (
                  <button
                    key={qf}
                    onClick={() => handleQuickFilter(qf)}
                    className={`mm-quick-pill ${isActive ? 'active' : ''}`}
                  >
                    {qf}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Content Area */}
        <section className="mm-explore-content-section">
          <div className="mm-container">
            {/* Filter controls row */}
            <div className="mm-explore-toolbar">
              <div className="mm-results-counter">
                Showing <strong>{filteredPartners.length}</strong> verified companion{filteredPartners.length === 1 ? '' : 's'}
              </div>

              <div className="mm-toolbar-selectors">
                <div className="mm-selector-item">
                  <label htmlFor="comm-type-select" className="sr-only">Communication Type</label>
                  <select
                    id="comm-type-select"
                    value={selectedCommType}
                    onChange={(e) => setSelectedCommType(e.target.value)}
                    className="mm-select-compact"
                  >
                    <option value="All">All Formats</option>
                    <option value="chat">Text Chat</option>
                    <option value="audio">Voice Call</option>
                    <option value="video">Video Call</option>
                  </select>
                </div>

                <div className="mm-selector-item">
                  <label htmlFor="sort-by-select" className="sr-only">Sort By</label>
                  <select
                    id="sort-by-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="mm-select-compact"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Partner Grid */}
            {loading ? (
              <div className="mm-loading-state">
                <div className="mm-spinner"></div>
                <p>Loading friendly companions...</p>
              </div>
            ) : filteredPartners.length === 0 ? (
              <div className="mm-empty-state">
                <Heart size={44} color="var(--mm-rose)" />
                <h3>No companions matched your criteria</h3>
                <p>Try resetting filters or searching with different keywords.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedLanguage('All'); setSelectedCommType('All'); setOnlyOnline(false); }}
                  className="mm-btn-hero-primary"
                  style={{ display: 'inline-flex', marginTop: '14px' }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="mm-popular-partners-grid" style={{ marginTop: '20px' }}>
                {filteredPartners.map(p => {
                  const isFav = favoriteIds.has(p.id);
                  const startingRate = p.rate_chat_15m || p.hourly_rate || 99;
                  const langStr = Array.isArray(p.languages) ? p.languages.join(', ') : (p.languages || 'Hindi, English');
                  const rating = p.rating_average || p.rating || 4.8;

                  return (
                    <div key={p.id} className="mm-partner-card-v2">
                      <div className="mm-partner-card-media">
                        <img
                          src={p.profile_photo_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=85'}
                          alt={p.display_name}
                          className="mm-partner-card-img"
                        />
                        <div className="mm-partner-online-chip">
                          <span className="mm-green-dot" />
                          <span>Online</span>
                        </div>
                        <button
                          className={`mm-partner-heart-btn ${isFav ? 'favorited' : ''}`}
                          onClick={(e) => toggleFavorite(p.id, e)}
                          aria-label={`Favorite ${p.display_name}`}
                        >
                          <Heart size={16} fill={isFav ? '#E91E63' : 'none'} color={isFav ? '#E91E63' : '#FFFFFF'} />
                        </button>
                      </div>

                      <div className="mm-partner-card-content">
                        <div className="mm-partner-title-row">
                          <h3 className="mm-partner-name">{p.display_name}</h3>
                          <div className="mm-partner-rating-badge">
                            <Star size={13} fill="#D4AF77" color="#D4AF77" />
                            <span>{typeof rating === 'number' ? rating.toFixed(1) : rating}</span>
                          </div>
                        </div>

                        <div className="mm-partner-meta-row">
                          <span className="mm-meta-lang">{langStr}</span>
                        </div>

                        {p.bio && (
                          <p className="mm-partner-card-snippet">
                            {p.bio.length > 90 ? `${p.bio.substring(0, 90)}...` : p.bio}
                          </p>
                        )}

                        <div className="mm-partner-price-action-row">
                          <div className="mm-partner-from-price">
                            <span className="mm-price-label">From </span>
                            <span className="mm-price-val">₹{startingRate}</span>
                          </div>
                          <Link to={`/partners/${p.id}`} className="mm-btn-view-profile">
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

const defaultPartners = [
  {
    id: 1,
    display_name: 'Priya S.',
    profile_photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=85',
    languages: ['Hindi', 'English'],
    rating_average: 4.8,
    review_count: 236,
    bio: 'Warm, empathetic listener. Ready to chat about your day, dreams, or anything on your mind with zero judgment.',
    rate_chat_15m: 99,
    rate_audio_30m: 299,
    allows_chat: true,
    allows_audio: true,
    allows_video: true
  },
  {
    id: 2,
    display_name: 'Ananya R.',
    profile_photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85',
    languages: ['Marathi', 'Hindi'],
    rating_average: 4.9,
    review_count: 184,
    bio: 'Friendly companion who loves heartfelt conversations, storytelling, and sharing positive daily energy.',
    rate_chat_15m: 99,
    rate_audio_30m: 299,
    allows_chat: true,
    allows_audio: true,
    allows_video: true
  },
  {
    id: 3,
    display_name: 'Neha K.',
    profile_photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85',
    languages: ['English', 'Hindi'],
    rating_average: 4.7,
    review_count: 98,
    bio: 'Patient listener and cheerful spirit. Passionate about art, books, and creating a calm space for you.',
    rate_chat_15m: 99,
    rate_audio_30m: 299,
    allows_chat: true,
    allows_audio: true,
    allows_video: true
  },
  {
    id: 4,
    display_name: 'Sana M.',
    profile_photo_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=85',
    languages: ['Hindi', 'Urdu'],
    rating_average: 4.8,
    review_count: 142,
    bio: 'Gentle, attentive listener here whenever you need a supportive ear after a long or hectic workday.',
    rate_chat_15m: 99,
    rate_audio_30m: 299,
    allows_chat: true,
    allows_audio: true,
    allows_video: true
  }
];
