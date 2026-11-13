import React from 'react';

/**
 * Manmitra Official Brand Logo Component
 * Incorporates the two-figures + heart "M" symbol and official typography
 * Colors: Deep Emerald (#0F3D37), Champagne Gold (#D4AF7C), Warm Cream (#F7F5ED), Charcoal (#1A1A1A)
 */
export function ManmitraSymbol({
  size = 36,
  color = '#D4AF7C',
  className = '',
  style = {}
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`manmitra-symbol-svg ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      aria-label="Manmitra Logo Mark"
    >
      <defs>
        <linearGradient id="manmitraGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E5C799" />
          <stop offset="50%" stopColor="#D4AF77" />
          <stop offset="100%" stopColor="#B3894E" />
        </linearGradient>
        <linearGradient id="manmitraBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF77" />
          <stop offset="60%" stopColor="#E91E63" />
          <stop offset="100%" stopColor="#4A154B" />
        </linearGradient>
      </defs>

      {/* Left Person Head */}
      <circle cx="21.9" cy="14.35" r="7.6" fill={color === 'brand' ? 'url(#manmitraBrandGrad)' : color === 'gold' ? 'url(#manmitraGoldGrad)' : color} />

      {/* Right Person Head */}
      <circle cx="78.6" cy="12.9" r="7.6" fill={color === 'brand' ? 'url(#manmitraBrandGrad)' : color === 'gold' ? 'url(#manmitraGoldGrad)' : color} />

      {/* Center Heart */}
      <path
        d="M 50 39.5 C 49 37.8 38 29.5 38 24.2 C 38 19.8 41.5 16.8 45.8 17.5 C 47.8 17.8 49.1 19.2 50 20.8 C 50.9 19.2 52.2 17.8 54.2 17.5 C 58.5 16.8 62 19.8 62 24.2 C 62 29.5 51 37.8 50 39.5 Z"
        fill={color === 'brand' ? 'url(#manmitraBrandGrad)' : color === 'gold' ? 'url(#manmitraGoldGrad)' : color}
      />

      {/* M-Body Connecting Form */}
      <path
        d="M 88.7 29.3 C 86 28 78 28.3 72.8 28.3 L 49.5 59.8 L 24 27.2 C 19 27.2 12.4 27.2 10.5 29.5 C 8 32.5 8.1 40 8.1 46 L 8.1 91.5 C 8.1 93 10 94 11.5 93.5 L 20.8 88.5 C 22.5 87.7 23.5 86 23.8 84 L 24 44.2 L 49.5 73.8 L 77 45.2 L 77.5 85 C 77.7 87 78.8 88.5 80.5 89.2 L 89.5 93.5 C 91 94.2 92.5 93 92.5 91.5 L 92.5 45 C 92.5 39 91.5 30.5 88.7 29.3 Z"
        fill={color === 'brand' ? 'url(#manmitraBrandGrad)' : color === 'gold' ? 'url(#manmitraGoldGrad)' : color}
      />
    </svg>
  );
}

/**
 * App Icon Squircle Badge (like top right of reference image)
 */
export function ManmitraAppIcon({ size = 48, className = '' }) {
  const radius = Math.round(size * 0.23);
  return (
    <div
      className={`manmitra-app-icon-badge ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: 'linear-gradient(145deg, #5C153A 0%, #380C22 55%, #1D0512 100%)',
        display: 'grid',
        placeItems: 'center',
        boxShadow: '0 8px 22px rgba(60, 12, 34, 0.45)',
        border: '1px solid rgba(232, 185, 124, 0.45)',
        flexShrink: 0,
        overflow: 'hidden'
      }}
      title="MANMITRA -- Connect Hearts, Live Together"
    >
      <ManmitraSymbol size={Math.round(size * 0.65)} color="gold" />
    </div>
  );
}

/**
 * Original MAANMITRA Logo Component from reference design
 * Displays the authentic golden emblem (two figures + heart 'M') and official typography
 */
export function MaanmitraOriginalLogo({
  height = 42,
  className = '',
  style = {},
  showTagline = true,
  onClick
}) {
  return (
    <div
      className={`maanmitra-original-logo-wrap ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: onClick ? 'pointer' : 'default',
        textDecoration: 'none',
        ...style
      }}
    >
      <img
        src="/maanmitra-new-emblem.png"
        alt="MAANMITRA Emblem"
        style={{
          height: `${height}px`,
          width: 'auto',
          display: 'block',
          objectFit: 'contain'
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', lineHeight: 1 }}>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: `${Math.round(height * 0.50)}px`,
              fontWeight: 800,
              color: '#4A154B',
              letterSpacing: '0.8px',
              lineHeight: 1
            }}
          >
            MAANMITRA
          </span>
          <span
            style={{
              fontSize: `${Math.round(height * 0.22)}px`,
              fontWeight: 700,
              color: '#4A154B',
              verticalAlign: 'super',
              marginLeft: '2px',
              lineHeight: 1
            }}
          >
            ®
          </span>
        </div>
        {showTagline && (
          <span
            style={{
              fontFamily: "'Outfit', 'Poppins', sans-serif",
              fontSize: `${Math.max(9, Math.round(height * 0.21))}px`,
              fontWeight: 600,
              color: '#C49A45',
              letterSpacing: '0.3px',
              marginTop: '3px',
              lineHeight: 1,
              whiteSpace: 'nowrap'
            }}
          >
            A Listening Friend, Always With You
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Complete Manmitra Brand Logo Component
 * - variant: 'horizontal' | 'stacked' | 'badge' | 'symbol' | 'original'
 * - theme: 'gold' (for dark bordeaux/charcoal bg) | 'emerald' | 'romantic' (for light/cream bg) | 'dark'
 */
export default function ManmitraLogo({
  variant = 'horizontal',
  theme = 'romantic',
  size = 38,
  showTagline = true,
  className = '',
  onClick
}) {
  if (variant === 'original') {
    return <MaanmitraOriginalLogo height={size} className={className} onClick={onClick} />;
  }
  const isDarkTheme = theme === 'gold' || theme === 'dark' || theme === 'midnight';
  const isEmerald = theme === 'emerald';
  const symbolColor = isDarkTheme ? 'gold' : (isEmerald ? '#0F3D37' : '#380C22');
  const titleColor = isDarkTheme ? '#E8B97C' : (isEmerald ? '#0F3D37' : '#380C22');
  const tagColor = isDarkTheme ? '#FFF7F8' : (isEmerald ? '#3B6B62' : '#7E5B6A');

  if (variant === 'badge') {
    return <ManmitraAppIcon size={size} className={className} />;
  }

  if (variant === 'symbol') {
    return <ManmitraSymbol size={size} color={symbolColor} className={className} />;
  }

  if (variant === 'stacked') {
    return (
      <div
        className={`manmitra-logo-stacked ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          cursor: onClick ? 'pointer' : 'default'
        }}
        onClick={onClick}
      >
        <div style={{ marginBottom: 12 }}>
          <ManmitraAppIcon size={size * 1.6} />
        </div>
        <div
          style={{
            fontFamily: "'Manrope', 'Outfit', sans-serif",
            fontSize: Math.max(18, Math.round(size * 0.6)),
            fontWeight: 800,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: titleColor,
            lineHeight: 1.1,
            paddingLeft: '0.24em' // balances letter-spacing visually
          }}
        >
          MANMITRA
        </div>
        {showTagline && (
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: Math.max(10, Math.round(size * 0.28)),
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: tagColor,
              marginTop: 5,
              opacity: isDarkTheme ? 0.9 : 0.85
            }}
          >
            Connect Hearts, Live Together
          </div>
        )}
      </div>
    );
  }

  // Default: Horizontal
  return (
    <div
      className={`manmitra-logo-horizontal ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'left'
      }}
      onClick={onClick}
    >
      <ManmitraAppIcon size={size} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: "'Manrope', 'Outfit', sans-serif",
            fontSize: Math.max(15, Math.round(size * 0.44)),
            fontWeight: 800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: titleColor,
            lineHeight: 1.1
          }}
        >
          MANMITRA
        </span>
        {showTagline && (
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: Math.max(9, Math.round(size * 0.23)),
              fontWeight: 600,
              letterSpacing: '0.04em',
              color: tagColor,
              marginTop: 2,
              opacity: isDarkTheme ? 0.9 : 0.85
            }}
          >
            Connect Hearts, Live Together
          </span>
        )}
      </div>
    </div>
  );
}
