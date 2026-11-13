import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import PublicFooter from '../../components/layout/PublicFooter';

export default function StrangerTripPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalTrip, setModalTrip] = useState(null);
  const [interestSubmitted, setInterestSubmitted] = useState(false);

  // Sample curated upcoming itineraries (clearly marked sample exploration itineraries)
  const sampleTrips = [
    {
      id: 'himachal-weekend',
      destination: 'Kasol & Tosh Valley, Himachal',
      category: 'mountains',
      dates: 'Upcoming Weekend Batch',
      duration: '4 Days / 3 Nights',
      estPrice: '₹8,500 – ₹11,000 / person (Est.)',
      seats: '8 to 12 Explorers (Intimate Group)',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      description: 'Pine forest hikes, riverside campfire conversations, and star-gazing in Parvati valley with verified young travellers.'
    },
    {
      id: 'gokarna-beach',
      destination: 'Gokarna & Murudeshwar, Karnataka',
      category: 'beach',
      dates: 'Next Month Batch',
      duration: '3 Days / 2 Nights',
      estPrice: '₹7,200 – ₹9,800 / person (Est.)',
      seats: '10 to 14 Explorers',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      description: 'Cliffside coastal walks, peaceful beach cafes, group yoga mornings, and quiet sunsets away from tourist crowds.'
    },
    {
      id: 'rajasthan-heritage',
      destination: 'Pushkar & Udaipur Cultural Circuit',
      category: 'culture',
      dates: 'Upcoming Season Batch',
      duration: '5 Days / 4 Nights',
      estPrice: '₹12,000 – ₹15,500 / person (Est.)',
      seats: '8 to 12 Explorers',
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
      description: 'Sunset lake strolls, heritage homestays, folk music storytelling evenings, and curated regional culinary discoveries.'
    }
  ];

  const filteredTrips = selectedCategory === 'all'
    ? sampleTrips
    : sampleTrips.filter(t => t.category === selectedCategory);

  return (
    <div style={{ background: '#FFF9F5', minHeight: '100vh', fontFamily: "'Outfit', 'Poppins', sans-serif", color: '#2D162C' }}>
      <PublicNavbar />

      <main>
        {/* HERO SECTION */}
        <section style={{
          padding: '40px 20px 60px',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: '#CCFBF1',
              color: '#0F766E',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              marginBottom: '18px'
            }}>
              <Compass size={16} /> PRIORITY SERVICE 03
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#50164F',
              margin: '0 0 18px'
            }}>
              Discover New Places. <span style={{ color: '#D8B36A', display: 'block' }}>Meet New People.</span>
            </h1>

            <p style={{
              fontSize: '1.08rem',
              color: '#665365',
              lineHeight: 1.65,
              marginBottom: '32px',
              maxWidth: '520px'
            }}>
              Explore small group travel experiences, connect with verified fellow travellers across India, and create memorable adventures in a safe, organized community.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <a
                href="#upcoming-trips"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '13px 28px',
                  borderRadius: '9999px',
                  background: '#50164F',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  textDecoration: 'none',
                  boxShadow: '0 6px 20px rgba(80, 22, 79, 0.25)'
                }}
              >
                <span>Explore Group Trips</span>
                <ArrowRight size={16} />
              </a>
              <Link
                to="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '13px 26px',
                  borderRadius: '9999px',
                  background: '#FFFFFF',
                  color: '#50164F',
                  border: '1.5px solid #50164F',
                  fontWeight: 600,
                  fontSize: '0.96rem',
                  textDecoration: 'none'
                }}
              >
                <span>Propose a Destination</span>
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#50164F' }}>
                <CheckCircle2 size={16} color="#0D9488" /> Verified Fellow Explorers
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#0D9488' }}>
                <CheckCircle2 size={16} color="#0D9488" /> Gender-Balanced Batches
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#0D9488' }}>
                <CheckCircle2 size={16} color="#0D9488" /> Transparent Pricing
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 20px 48px rgba(80, 22, 79, 0.16)',
              border: '3px solid #FFFFFF'
            }}>
              <img
                src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1200&q=80"
                alt="Realistic group of diverse Indian friends hiking and exploring together"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </section>

        {/* SECTION A & B: UPCOMING GROUP TRIPS */}
        <section id="upcoming-trips" style={{ padding: '60px 20px', background: '#F0FDFA', borderTop: '1px solid #99F6E4', borderBottom: '1px solid #99F6E4' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Curated Expeditions</span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '4px 0 0' }}>
                  Upcoming Stranger Trip Batches
                </h2>
              </div>

              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { key: 'all', label: 'All Trips' },
                  { key: 'mountains', label: 'Mountains' },
                  { key: 'beach', label: 'Coastal' },
                  { key: 'culture', label: 'Heritage' }
                ].map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      border: selectedCategory === cat.key ? '1px solid #0D9488' : '1px solid #CCFBF1',
                      background: selectedCategory === cat.key ? '#0D9488' : '#FFFFFF',
                      color: selectedCategory === cat.key ? '#FFFFFF' : '#0F766E',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '26px' }}>
              {filteredTrips.map(trip => (
                <div key={trip.id} style={{
                  background: '#FFFFFF',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  border: '1.5px solid #CCFBF1',
                  boxShadow: '0 8px 24px rgba(13, 148, 136, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
                      <img src={trip.image} alt={trip.destination} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(15, 23, 42, 0.85)',
                        color: '#FFFFFF',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Clock size={12} /> {trip.duration}
                      </div>
                    </div>

                    <div style={{ padding: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F766E', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                        <MapPin size={15} /> {trip.destination}
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#50164F', margin: '0 0 10px' }}>{trip.destination}</h3>
                      <p style={{ fontSize: '0.88rem', color: '#665365', lineHeight: 1.55, margin: '0 0 16px' }}>{trip.description}</p>

                      <div style={{ borderTop: '1px solid #F0FDFA', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: '#665365' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Timeline:</span>
                          <span style={{ fontWeight: 600, color: '#50164F' }}>{trip.dates}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Group Size:</span>
                          <span style={{ fontWeight: 600, color: '#50164F' }}>{trip.seats}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Est. Contribution:</span>
                          <span style={{ fontWeight: 700, color: '#D8B36A' }}>{trip.estPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '0 22px 22px' }}>
                    <button
                      onClick={() => setModalTrip(trip)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '9999px',
                        background: '#0D9488',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>Express Interest / View Details</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '32px',
              padding: '16px 20px',
              borderRadius: '14px',
              background: '#FFFFFF',
              border: '1px solid #CCFBF1',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.86rem',
              color: '#0F766E'
            }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span>
                Note: Stranger Trips are community-curated co-travel batches. Dates and prices shown are estimates until minimum verified batch capacity is confirmed. No fake confirmed bookings are listed.
              </span>
            </div>
          </div>
        </section>

        {/* SECTION D: HOW IT WORKS */}
        <section style={{ padding: '70px 20px', maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D8B36A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Four Clear Steps</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.1rem', color: '#50164F', margin: '6px 0 12px' }}>
              How Stranger Trips Work
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '22px' }}>
            {[
              { num: '01', title: 'Explore Available Trips', desc: 'Browse curated itineraries matching your schedule, budget, and travel interests.' },
              { num: '02', title: 'Submit Interest', desc: 'Fill out a short preference form indicating your dates, city of origin, and comfort preferences.' },
              { num: '03', title: 'Review Trip Information', desc: 'Join the orientation call with the designated trip coordinator and review verified fellow travellers.' },
              { num: '04', title: 'Confirm Participation', desc: 'Finalize bookings transparently with clear stay, transport, and cancellation details.' }
            ].map(s => (
              <div key={s.num} style={{ background: '#FFFFFF', borderRadius: '18px', padding: '26px 20px', border: '1.5px solid #F0E3D7' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#D8B36A', marginBottom: '12px' }}>{s.num}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#50164F', margin: '0 0 8px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.86rem', color: '#665365', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION E: TRAVEL SAFETY */}
        <section style={{ padding: '60px 20px', background: '#FFFFFF', borderTop: '1px solid #F0E3D7', borderBottom: '1px solid #F0E3D7' }}>
          <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#50164F', margin: '0 0 10px' }}>
                Safety & Verification First
              </h2>
              <p style={{ color: '#665365', margin: 0 }}>We believe group exploration thrives only on mutual safety and accountability.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {[
                { title: 'Verified Identity Protocols', desc: 'Government ID verification required for all confirmed trip members.' },
                { title: '24x7 Emergency Contact', desc: 'Designated local coordinator on-ground with emergency logistics and medical contacts.' },
                { title: 'Respectful Group Code', desc: 'Zero tolerance for harassment, substance abuse, or unauthorized changes.' },
                { title: 'Transparent Cancellation', desc: 'Clear refund and replacement terms communicated before booking confirmation.' }
              ].map((sf, idx) => (
                <div key={idx} style={{ background: '#FFF9F5', borderRadius: '16px', padding: '20px', border: '1px solid #F0E3D7' }}>
                  <ShieldCheck size={22} color="#0D9488" style={{ marginBottom: '10px' }} />
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#50164F', margin: '0 0 6px' }}>{sf.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#665365', lineHeight: 1.5, margin: 0 }}>{sf.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION F: CTA BANNER */}
        <section style={{ padding: '70px 20px', textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.4rem', color: '#50164F', margin: '0 0 14px' }}>
            Ready to Explore the World Together?
          </h2>
          <p style={{ color: '#665365', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Take the leap. Connect with thoughtful travellers and discover destinations off the beaten path.
          </p>
          <a
            href="#upcoming-trips"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '9999px',
              background: '#50164F',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(80, 22, 79, 0.25)'
            }}
          >
            <span>Explore Group Trips Now</span>
            <ArrowRight size={17} />
          </a>
        </section>

        {/* TRIP DETAIL & INTEREST MODAL */}
        {modalTrip && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '520px',
              width: '100%',
              padding: '30px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
              position: 'relative'
            }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#50164F', margin: '0 0 8px' }}>
                {modalTrip.destination}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#665365', marginBottom: '16px' }}>{modalTrip.description}</p>

              <div style={{ background: '#F0FDFA', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.85rem', color: '#0F766E' }}>
                <div><strong>Duration:</strong> {modalTrip.duration}</div>
                <div><strong>Timeline:</strong> {modalTrip.dates}</div>
                <div><strong>Est. Cost:</strong> {modalTrip.estPrice}</div>
              </div>

              {interestSubmitted ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <CheckCircle2 size={36} color="#0D9488" style={{ margin: '0 auto 10px' }} />
                  <h4 style={{ color: '#50164F', margin: '0 0 6px' }}>Interest Registered!</h4>
                  <p style={{ color: '#665365', fontSize: '0.86rem', margin: '0 0 16px' }}>
                    Our coordinator will notify you once this batch reaches minimum confirmation threshold.
                  </p>
                  <button
                    onClick={() => { setModalTrip(null); setInterestSubmitted(false); }}
                    style={{ padding: '8px 20px', borderRadius: '9999px', background: '#50164F', color: '#FFF', border: 'none', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setInterestSubmitted(true); }}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#50164F', marginBottom: '4px' }}>Your Name</label>
                    <input required placeholder="Enter full name" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }} />
                  </div>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#50164F', marginBottom: '4px' }}>WhatsApp / Phone Number</label>
                    <input required placeholder="+91 98765 43210" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setModalTrip(null)}
                      style={{ padding: '10px 18px', borderRadius: '9999px', background: 'transparent', border: '1px solid #D1D5DB', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ padding: '10px 22px', borderRadius: '9999px', background: '#0D9488', color: '#FFF', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Submit Travel Interest
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}

