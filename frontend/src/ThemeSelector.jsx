import React, { useState, useEffect, useRef } from 'react';
import { Palette, Check, Sparkles, Moon, Heart, ChevronDown } from 'lucide-react';

export const THEMES = [
  {
    id: 'romantic',
    name: 'Velvet Romance',
    icon: '',
    desc: 'Deep bordeaux, passion rose & candlelight gold',
    swatches: ['#2D0C1E', '#E11D48', '#E8B97C']
  },
  {
    id: 'emerald',
    name: 'Emerald Luxury',
    icon: '',
    desc: 'Forest emerald, champagne gold & warm cream',
    swatches: ['#0F3D37', '#D4AF7C', '#F7F5ED']
  },
  {
    id: 'midnight',
    name: 'Midnight Noir',
    icon: '',
    desc: 'Obsidian starlight, royal violet & electric rose',
    swatches: ['#0B0B14', '#8B5CF6', '#F43F5E']
  }
];

export default function ThemeSelector({ currentTheme = 'romantic', onThemeChange, compact = false }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const selectTheme = (id) => {
    if (onThemeChange) {
      onThemeChange(id);
    }
    setOpen(false);
  };

  return (
    <div className={`theme-selector-wrap ${compact ? 'compact' : ''}`} ref={dropdownRef}>
      <button
        type="button"
        className="theme-selector-trigger"
        onClick={() => setOpen(!open)}
        title="Change App Theme"
        aria-label="Change Theme"
        aria-expanded={open}
      >
        <span className="theme-trigger-icon">{activeThemeObj.icon}</span>
        {!compact && <span className="theme-trigger-name">{activeThemeObj.name}</span>}
        <ChevronDown size={14} className={`theme-chevron ${open ? 'rotated' : ''}`} />
      </button>

      {open && (
        <div className="theme-dropdown-menu">
          <div className="theme-menu-header">
            <Palette size={14} className="theme-header-icon" />
            <span>Select Experience Theme</span>
          </div>

          <div className="theme-options-list">
            {THEMES.map((theme) => {
              const isSelected = theme.id === currentTheme;
              return (
                <button
                  key={theme.id}
                  type="button"
                  className={`theme-option-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => selectTheme(theme.id)}
                >
                  <span className="theme-option-icon">{theme.icon}</span>
                  <div className="theme-option-info">
                    <div className="theme-option-title-row">
                      <strong>{theme.name}</strong>
                      {isSelected && <Check size={14} className="theme-active-check" />}
                    </div>
                    <small>{theme.desc}</small>
                  </div>
                  <div className="theme-swatch-row">
                    {theme.swatches.map((color, i) => (
                      <span
                        key={i}
                        className="theme-swatch-circle"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
