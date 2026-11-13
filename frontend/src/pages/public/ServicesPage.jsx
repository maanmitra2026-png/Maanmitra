import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  Headphones,
  Users
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';
import { MAANMITRA_SERVICES } from '../../utils/servicesData';

export default function ServicesPage() {
  const topPriorityServices = MAANMITRA_SERVICES.slice(0, 3);
  const remainingServices = MAANMITRA_SERVICES.slice(3);

  return (
    <div style={{ background: '#FFF9F5', minHeight: '100vh', fontFamily: "'Outfit', 'Poppins', sans-serif", color: '#2D162C' }}>
      <PublicNavbar />

      <main>
        {/* HERO */}
        <section style={{
          padding: '48px 20px 40px',
          maxWidth: '1240px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#D8B36A',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '10px'
          }}>
            Explore Our 8 Services
          </span>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.2rem, 4vw, 3.3rem)',
            fontWeight: 800,
            color: '#50164F',
            margin: '0 0 16px',
            lineHeight: 1.15
          }}>
            Connections, Guidance &amp; Opportunities <span style={{ color: '#D8B36A', display: 'block' }}>Designed Around You.</span>
          </h1>
          <p style={{
            color: '#665365',
            fontSize: '1.08rem',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 auto 36px'
          }}>
            From making lifelong friendships and exploring group travels to living relationship advisory, Kundali consultations, and remote opportunities — discover your path on MAANMITRA.
          </p>
        </section>

        {/* TOP 3 PRIORITY SERVICES (FEATURED ROW) */}
        <section style={{ maxWidth: '1280px', margin: '0 auto 60px', padding: '0 20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{ width: '4px', height: '24px', background: '#D8B36A', borderRadius: '4px' }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 800, color: '#50164F', margin: 0 }}>
              Main Priority Services
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {topPriorityServices.map((service) => {
              const IconComp = service.icon;
              return (
                <div
                  key={service.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: `2px solid ${service.theme.borderLight}`,
                    boxShadow: '0 8px 30px rgba(80, 22, 79, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 16px 36px rgba(80, 22, 79, 0.14)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(80, 22, 79, 0.08)';
                  }}
                >
                  <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                    <img src={service.heroImage} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      background: service.theme.pillBg,
                      color: service.theme.tagColor,
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em'
                    }}>
                      PRIORITY {service.number}
                    </div>
                  </div>

                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: service.theme.bgLight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IconComp size={20} color={service.theme.accent} />
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#50164F', margin: 0 }}>
                        {service.title}
                      </h3>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: '#665365', lineHeight: 1.55, margin: '0 0 20px', minHeight: '44px' }}>
                      {service.cardDescription}
                    </p>

                    <Link
                      to={service.path}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '12px',
                        borderRadius: '9999px',
                        background: '#50164F',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        textDecoration: 'none',
                        boxShadow: '0 4px 14px rgba(80, 22, 79, 0.2)'
                      }}
                    >
                      <span>{service.ctaText}</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* REMAINING 5 SERVICES */}
        <section style={{ maxWidth: '1280px', margin: '0 auto 70px', padding: '0 20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{ width: '4px', height: '24px', background: '#50164F', borderRadius: '4px' }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 800, color: '#50164F', margin: 0 }}>
              Specialized Guidance &amp; Growth Services
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {remainingServices.map((service) => {
              const IconComp = service.icon;
              return (
                <div
                  key={service.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '24px',
                    border: '1.5px solid #F0E3D7',
                    boxShadow: '0 4px 18px rgba(80, 22, 79, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(80, 22, 79, 0.10)';
                    e.currentTarget.style.borderColor = '#D8B36A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 4px 18px rgba(80, 22, 79, 0.04)';
                    e.currentTarget.style.borderColor = '#F0E3D7';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: service.theme.bgLight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IconComp size={22} color={service.theme.accent} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D8B36A' }}>
                        {service.number}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#50164F', margin: '0 0 8px' }}>
                      {service.title}
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.55, margin: '0 0 20px' }}>
                      {service.cardDescription}
                    </p>
                  </div>

                  <Link
                    to={service.path}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 18px',
                      borderRadius: '9999px',
                      background: '#FFF9F5',
                      border: '1px solid #F0E3D7',
                      color: '#50164F',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      textDecoration: 'none'
                    }}
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight size={15} color="#D8B36A" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
