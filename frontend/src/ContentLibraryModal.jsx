import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Crown,
  Lock,
  Sparkles,
  X,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function ContentLibraryModal({
  api,
  notify,
  onClose,
  onOpenUpgrade,
  userPlan = null // 'BASIC' | 'PREMIUM' | null
}) {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const data = await api('/content');
        setArticles(data || []);
      } catch (err) {
        notify(err.message || 'Failed to load content', true);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  async function handleOpenArticle(item) {
    if (item.access_level === 'PREMIUM' && userPlan !== 'PREMIUM') {
      onOpenUpgrade(
        'Premium Astrology & Relationship Masterclasses',
        'In-depth astrological synastry charts, conflict resolution guides, and relationship masterclasses are exclusive to MANMITRA Premium members.'
      );
      return;
    }
    try {
      const full = await api(`/content/${item.id}`);
      setSelectedArticle(full);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('premium')) {
        onOpenUpgrade(
          'Premium Educational Content',
          'This resource is restricted to MANMITRA Premium subscribers. Upgrade for ₹999/month to access our entire library.'
        );
      } else {
        notify(err.message, true);
      }
    }
  }

  return (
    <div className="upgrade-modal-backdrop" onClick={onClose}>
      <div className="upgrade-modal-card content-library-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="upgrade-modal-close"
          onClick={onClose}
          aria-label="Close content library"
        >
          <X size={20} />
        </button>

        {selectedArticle ? (
          <div className="article-reader-view">
            <button
              type="button"
              className="btn-outline btn-xs back-to-list-btn"
              onClick={() => setSelectedArticle(null)}
            >
               Back to Library
            </button>
            <div className="article-reader-head">
              <span className={`access-pill access-${selectedArticle.access_level.toLowerCase()}`}>
                {selectedArticle.access_level} ACCESS
              </span>
              <span className="category-pill">{selectedArticle.category}</span>
              <h2 className="article-reader-title">{selectedArticle.title}</h2>
              <p className="article-reader-summary">{selectedArticle.summary}</p>
            </div>
            <div className="article-reader-body">
              {selectedArticle.body.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        ) : (
          <div className="content-list-view">
            <div className="content-list-head">
              <div className="upgrade-modal-badge" style={{ background: 'var(--brand-emerald-surface)', color: 'var(--brand-emerald-dark)' }}>
                <BookOpen size={13} /> RELATIONSHIP & ASTROLOGY LIBRARY
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 2px', color: 'var(--brand-emerald-dark)' }}>
                Guides, Wisdom & Celestial Harmony
              </h2>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--muted)' }}>
                Free guides are open to all members. Deep synastry analyses & masterclasses require MANMITRA Premium.
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>Loading library...</div>
            ) : (
              <div className="articles-grid">
                {articles.map((item) => {
                  const isLocked = item.access_level === 'PREMIUM' && userPlan !== 'PREMIUM';
                  return (
                    <div
                      key={item.id}
                      className={`article-card ${isLocked ? 'article-locked' : 'article-unlocked'}`}
                      onClick={() => handleOpenArticle(item)}
                    >
                      <div className="article-card-top">
                        <span className={`access-pill access-${item.access_level.toLowerCase()}`}>
                          {item.access_level === 'PREMIUM' && <Crown size={12} style={{ display: 'inline', marginRight: 4 }} />}
                          {item.access_level}
                        </span>
                        <span className="category-pill">{item.category}</span>
                      </div>
                      <h4 className="article-card-title">{item.title}</h4>
                      <p className="article-card-summary">{item.summary}</p>
                      <div className="article-card-action">
                        {isLocked ? (
                          <span className="locked-action">
                            <Lock size={14} /> Unlock with Premium
                          </span>
                        ) : (
                          <span className="read-action">
                            Read article <ChevronRight size={14} />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
