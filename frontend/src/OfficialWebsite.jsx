import React, { useState, useEffect } from 'react';
import ManmitraLogo, { ManmitraSymbol, ManmitraAppIcon } from './ManmitraLogo';
import PricingSection from './PricingSection';
import {
  Heart,
  ShieldCheck,
  Users,
  Leaf,
  Sparkles,
  ChevronRight,
  MapPin,
  Lock,
  CheckCircle2,
  Calendar,
  MessageCircle,
  HelpCircle,
  Headphones,
  Compass,
  ArrowRight,
  Star,
  Award,
  Search,
  SlidersHorizontal,
  Plus,
  HeartHandshake,
  TrendingUp,
  UserCheck,
  Clock,
  Video,
  Phone,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function OfficialWebsite({
  onOpenAuth,
  loggedInUser,
  onGoToApp,
  currentTheme = 'romantic',
  onThemeChange,
  onOpenReflection
}) {
  const [selectedTriage, setSelectedTriage] = useState('relationships');
  const [openFaq, setOpenFaq] = useState(0);
  const [counsellorFilter, setCounsellorFilter] = useState('all');
  const [reflectionInput, setReflectionInput] = useState('');
  const [reflectionResponse, setReflectionResponse] = useState(null);
  const [isReflecting, setIsReflecting] = useState(false);

  // The 7 Configurable Counselling Categories
  const categories = [
    {
      id: 'relationship',
      title: 'Relationship Counselling',
      badge: 'Primary Care',
      desc: 'For communication difficulties, relationship expectations, trust, boundaries, and understanding relationship challenges.',
      icon: HeartHandshake,
      scope: 'Interpersonal conflict mediation, healthy boundary architectures, and trust restoration.'
    },
    {
      id: 'personal',
      title: 'Personal Guidance',
      badge: 'Self-Clarity',
      desc: 'For self-understanding, confidence, personal growth, and decision-making support during life crossroads.',
      icon: Sparkles,
      scope: 'Self-worth reinforcement, emotional resilience, and authentic decision frameworks.'
    },
    {
      id: 'emotional',
      title: 'Emotional Support',
      badge: 'Compassionate Space',
      desc: 'A respectful, safe space for people seeking help understanding difficult situations and navigating complex emotions.',
      icon: Heart,
      scope: 'Grounding techniques, active listening, and gentle de-escalation of internal overwhelm.'
    },
    {
      id: 'marriage_compat',
      title: 'Marriage & Compatibility',
      badge: 'Cohabitation & Future',
      desc: 'For relationship expectations, compatibility discussions, and preparation for important relationship decisions.',
      icon: Compass,
      scope: 'Cohabitation financial alignment, domestic rhythm assessments, and values concordance.'
    },
    {
      id: 'family_comm',
      title: 'Family & Communication',
      badge: 'Interpersonal Harmony',
      desc: 'For communication challenges, family boundaries, and navigating interpersonal difficulties with grace.',
      icon: Users,
      scope: 'Intergenerational boundary setting, non-violent communication, and relationship repair.'
    },
    {
      id: 'professional',
      title: 'Professional Guidance',
      badge: 'Clinical Direction',
      desc: 'For users who need direction toward a suitably qualified professional or specialized clinical care.',
      icon: ShieldCheck,
      scope: 'Triage assessment, ethical referrals, and navigation toward accredited care.'
    },
    {
      id: 'other',
      title: 'Other Counselling Services',
      badge: 'Configurable',
      desc: 'A configurable category managed through the administration panel for specialized guidance inquiries.',
      icon: Plus,
      scope: 'Customized support pathways configured by the MANMITRA clinical committee.'
    }
  ];

  // Triage Options for "What would you like support with today?"
  const triageOptions = [
    { id: 'relationships', label: 'My Relationships', catId: 'relationship', icon: HeartHandshake, blurb: 'Communication friction, unspoken expectations, trust & boundaries.' },
    { id: 'myself', label: 'Understanding Myself', catId: 'personal', icon: Sparkles, blurb: 'Self-clarity, managing burnout, and discovering personal direction.' },
    { id: 'emotional', label: 'Emotional Support', catId: 'emotional', icon: Heart, blurb: 'Navigating overwhelming feelings in a confidential, non-judgmental space.' },
    { id: 'marriage', label: 'Marriage & Compatibility', catId: 'marriage_compat', icon: Compass, blurb: 'Aligning on lifestyle values, cohabitation rhythms & long-term goals.' },
    { id: 'growth', label: 'Personal Growth', catId: 'personal', icon: TrendingUp, blurb: 'Developing assertive communication, healthy habits & emotional maturity.' },
    { id: 'other', label: 'Something Else', catId: 'other', icon: HelpCircle, blurb: 'Explore guidance options freely without pressure to reveal sensitive details.' }
  ];

  // Verified Counsellor Profiles
  const counsellors = [
    {
      id: 1,
      name: 'Dr. Meera Kulkarni',
      title: 'Senior Counseling Psychologist & Cohabitation Specialist',
      qualification: 'Ph.D. in Clinical Psychology, M.Phil (NIMHANS)',
      experience: '10+ Years',
      license: 'RCI-PSY-49182',
      specialty: 'relationship',
      specialtyName: 'Relationship & Cohabitation Dynamics',
      languages: 'English, Hindi, Marathi',
      rating: 4.9,
      reviews: 48,
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      bio: 'Specializes in relationship communication protocols, premarital values alignment, and constructive boundary navigation for modern couples and individuals.',
      scope: 'Evidence-based interpersonal therapy and relational mediation.'
    },
    {
      id: 2,
      name: 'Rohan Deshmukh',
      title: 'Counseling Psychologist & Personal Guidance Coach',
      qualification: 'M.A. Counseling Psychology, Certified REBT Practitioner',
      experience: '7+ Years',
      license: 'ICF-PCC-88219',
      specialty: 'personal',
      specialtyName: 'Personal Clarity & Emotional Grounding',
      languages: 'English, Hindi, Marathi',
      rating: 4.8,
      reviews: 36,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      bio: 'Assists individuals through significant life transitions, self-worth blockages, career-relationship balance, and emotional resilience practices.',
      scope: 'Cognitive-behavioral reflection and solution-focused personal guidance.'
    },
    {
      id: 3,
      name: 'Dr. Ananya Sen',
      title: 'Family Systems & Compatibility Guidance Consultant',
      qualification: 'M.Phil Clinical Psychology, Certified Gottman Method Level 2',
      experience: '9+ Years',
      license: 'RCI-PSY-61024',
      specialty: 'marriage_compat',
      specialtyName: 'Marriage Preparation & Compatibility',
      languages: 'English, Hindi, Bengali',
      rating: 4.9,
      reviews: 52,
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      bio: 'Passionate about helping prospective partners discuss domestic realities, family boundaries, and emotional alignment before making major life commitments.',
      scope: 'Systemic family consultation and compatibility facilitation.'
    },
    {
      id: 4,
      name: 'Dr. Rajesh Iyer',
      title: 'Behavioral Scientist & Professional Guidance Advisor',
      qualification: 'Ph.D. Behavioral Sciences, M.Sc. Applied Psychology',
      experience: '12+ Years',
      license: 'BPA-IND-3391',
      specialty: 'professional',
      specialtyName: 'Professional Guidance & Life Transitions',
      languages: 'English, Hindi, Tamil',
      rating: 4.9,
      reviews: 41,
      photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
      bio: 'Helps people make informed life decisions, navigate interpersonal friction, and connect with appropriate clinical care pathways when specialized support is needed.',
      scope: 'Life direction triage and clinical referral coordination.'
    }
  ];

  // Secondary Ecosystem Services (Wider MANMITRA ecosystem, clearly secondary to counselling)
  const secondaryServices = [
    { title: 'Living Harmony', badge: 'Co-living Clarity', desc: 'Practical communication frameworks and domestic rhythm check-ins for cohabiting couples.', status: 'Active Tool' },
    { title: 'Consensual Matchmaking', badge: 'Mutual Consent', desc: 'Values-first companionship discovery requiring mutual connection and consent before messaging.', status: 'Active Feature' },
    { title: 'Relationship Tools', badge: 'Shared Wellness', desc: 'Daily mood journals, habit alignment, and communication pause checklists.', status: 'Active Tool' },
    { title: 'Life Coaching', badge: 'Goal Orientation', desc: 'Constructive personal growth and goal structuring distinct from clinical mental healthcare.', status: 'Active Service' },
    { title: 'Personal Grooming', badge: 'Self-Care', desc: 'Guidance for personal self-presentation, confidence, and grooming routines.', status: 'Active Guidance' },
    { title: 'Business Buddy', badge: 'Professional Network', desc: 'Collaborative networking for solo professionals, side-hustlers, and co-founders.', status: 'Active Service' },
    { title: 'Doctor & Medical', badge: 'Clinical Review', desc: 'Medical and clinical workflows currently undergoing regulatory certification.', status: 'In Verification' }
  ];

  // Frequently Asked Questions
  const faqs = [
    {
      q: 'What is the primary purpose of MANMITRA?',
      a: 'MANMITRA is a counselling-first platform designed to help people understand their situations, explore appropriate guidance, improve relationships, and make more informed personal decisions. Our ethos is built around our taglines: "Better Understanding. Healthier Lives." and "Someone to Talk To. Guidance to Move Forward."'
    },
    {
      q: 'How does MANMITRA verify professional counsellors?',
      a: 'Every counsellor on MANMITRA submits verified academic qualifications (such as M.Phil, Ph.D.), government or regulatory board registration numbers (e.g. RCI, BPA, ICF), and verified years of clinical experience. Only professionals who pass formal credential review by our clinical advisory team receive the Verified Professional badge.'
    },
    {
      q: 'How do the membership plans work?',
      a: 'MANMITRA offers exactly two transparent monthly membership plans: Basic at ₹499/month (eligible matchmaking discovery, up to 20 text messages/day with mutual connections, educational content, and basic AI reflection guidance; no voice/video calling) and Premium at ₹999/month (includes voice/video calling with accepted connections, 200 text messages/day, advanced compatibility insights, advanced AI guidance, and 1 included personal counselling session per month subject to verified professional availability).'
    },
    {
      q: 'Is my personal information and session data confidential?',
      a: 'Confidentiality is fundamental to our platform. All conversations, background notes, and session records are strictly confidential and encrypted. We do not sell your personal data or disclose private identifiers. In emergency situations where there is imminent risk of harm to yourself or others, standard ethical and legal duty-of-care protocols apply.'
    },
    {
      q: 'What are the limits of MANMITRA AI Guidance?',
      a: 'MANMITRA AI Guidance is an exploratory self-reflection tool designed to help you organize your thoughts and consider constructive perspectives. It is not psychotherapy, clinical diagnosis, medical treatment, or crisis intervention. For complex emotional challenges or medical concerns, we guide you to connect with our verified human counsellors or licensed healthcare specialists.'
    },
    {
      q: 'What if I am experiencing an acute emotional crisis or distress?',
      a: 'If you or someone you know is in immediate emotional distress, please reach out directly to certified 24/7 crisis helplines: Tele-MANAS (Government of India) at 14416 or 1800-891-4416; Vandrevala Foundation at 9999 666 555; or KIRAN Mental Health Helpline at 1800-599-0019.'
    }
  ];

  const handleInteractiveReflection = (e) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;

    setIsReflecting(true);
    setTimeout(() => {
      setReflectionResponse({
        perspective: 'When communication feels strained, it often signals an unmet need for emotional acknowledgment or boundary clarity, rather than a lack of care.',
        question: 'If you could express your core need without focusing on the other person's faults, what would you ask for?',
        exercise: 'Take 3 deep, grounding breaths. Before responding next, pause for 60 seconds to notice your physical tension.'
      });
      setIsReflecting(false);
    }, 700);
  };

  const filteredCounsellors = counsellorFilter === 'all'
    ? counsellors
    : counsellors.filter((c) => c.specialty === counsellorFilter);

  return (
    <div className="manmitra-public-redesign" style={{ background: '#FAF9FE', color: '#14213D', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. TOP ANNOUNCEMENT & CRISIS SUPPORT BAR */}
      <div
        style={{
          background: '#14213D',
          color: '#E9E4F5',
          fontSize: '0.78rem',
          padding: '8px 16px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <span>
           <strong>A Safe, Confidential Space:</strong> Professional guidance for life, self-understanding & relationships. - In urgent emotional crisis? Call 24/7 Tele-MANAS at <strong>14416</strong>.
        </span>
      </div>

      {/* 2. STICKY GLASS HEADER */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E9E4F5',
          padding: '12px 24px'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <ManmitraLogo variant="horizontal" size={36} />
          </div>

          {/* Navigation Links */}
          <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
            <a href="#categories" style={{ textDecoration: 'none', color: '#14213D' }}>Counselling Categories</a>
            <a href="#how-it-works" style={{ textDecoration: 'none', color: '#14213D' }}>How It Works</a>
            <a href="#professionals" style={{ textDecoration: 'none', color: '#14213D' }}>Verified Counsellors</a>
            <a href="#plans" style={{ textDecoration: 'none', color: '#14213D' }}>Membership Plans</a>
            <a href="#faq" style={{ textDecoration: 'none', color: '#14213D' }}>FAQ & Ethics</a>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {loggedInUser ? (
              <button
                onClick={onGoToApp}
                style={{
                  background: 'linear-gradient(135deg, #14213D 0%, #1F2D4B 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Go to Dashboard <ChevronRight size={16} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  style={{
                    background: 'transparent',
                    border: '1px solid #CBD5E1',
                    color: '#14213D',
                    padding: '8px 18px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  style={{
                    background: 'linear-gradient(135deg, #F26B6B 0%, #E25555 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '9px 20px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(242, 107, 107, 0.3)'
                  }}
                >
                  Find Support
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. COUNSELLING-FIRST HERO SECTION */}
      <section
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAF9FE 60%, #F5F3FB 100%)',
          padding: '70px 20px 60px',
          borderBottom: '1px solid #E9E4F5'
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          {/* Gentle Brand Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: '#E9E4F5',
              borderRadius: '999px',
              color: '#14213D',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.4px',
              marginBottom: '20px'
            }}
          >
            <Sparkles size={14} color="#36B7A5" />
            Better Understanding. Healthier Lives.
          </div>

          {/* Hero Headline */}
          <h1
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              color: '#14213D',
              lineHeight: 1.2,
              margin: '0 auto 20px',
              maxWidth: '860px',
              letterSpacing: '-0.5px'
            }}
          >
            Sometimes, One Conversation Can Help You See Things Differently.
          </h1>

          {/* Supporting Text */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
              color: '#4B5563',
              maxWidth: '740px',
              margin: '0 auto 28px',
              lineHeight: 1.6
            }}
          >
            Explore guidance for relationships, personal growth, emotional challenges, and important life decisions in a respectful, supportive environment.
          </p>

          {/* Gentle Note */}
          <div
            style={{
              fontSize: '0.92rem',
              color: '#36B7A5',
              fontWeight: 600,
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>"Your journey starts with understanding. Choose the kind of support that feels right for you."</span>
          </div>

          {/* Hero CTAs */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
            <button
              onClick={() => onOpenAuth('register')}
              style={{
                background: 'linear-gradient(135deg, #F26B6B 0%, #E25555 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 10px 24px rgba(242, 107, 107, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'transform 0.2s'
              }}
            >
              Find the Right Support <ArrowRight size={18} />
            </button>

            <a
              href="#categories"
              style={{
                background: '#FFFFFF',
                color: '#14213D',
                border: '1.5px solid #CBD5E1',
                padding: '14px 28px',
                borderRadius: '16px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Explore Our Services
            </a>
          </div>

          {/* INTERACTIVE ONBOARDING TRIAGE WIDGET */}
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '30px',
              boxShadow: '0 18px 45px rgba(20, 33, 61, 0.08)',
              border: '1px solid #E9E4F5',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: '#14213D' }}>
                  What would you like support with today?
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#6B7280' }}>
                  Select an area to explore verified professional guidance or try a reflective exercise:
                </p>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#36B7A5', fontWeight: 600, background: '#EDFAF8', padding: '4px 10px', borderRadius: '8px' }}>
                Private & Free to Explore
              </span>
            </div>

            {/* Triage Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {triageOptions.map((opt) => {
                const Icon = opt.icon;
                const active = selectedTriage === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedTriage(opt.id)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      border: `1.5px solid ${active ? '#F26B6B' : '#E9E4F5'}`,
                      background: active ? '#FFF7F8' : '#FAF9FE',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: active ? '#F26B6B' : '#E9E4F5',
                        color: active ? '#FFFFFF' : '#14213D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: active ? '#14213D' : '#374151' }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#718096', marginTop: '3px', lineHeight: 1.4 }}>
                        {opt.blurb}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Guidance Recommendation */}
            <div
              style={{
                background: '#FAF9FE',
                borderRadius: '16px',
                padding: '16px 20px',
                border: '1px solid #E9E4F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#36B7A5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Recommended Guidance Pathway
                </span>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#14213D', marginTop: '2px' }}>
                  Connect with verified psychologists specializing in{' '}
                  <span style={{ color: '#F26B6B' }}>
                    {triageOptions.find((o) => o.id === selectedTriage)?.label}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href="#professionals"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: '#14213D',
                    color: '#FFFFFF',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  View Suitable Counsellors
                </a>
                <button
                  onClick={() => onOpenAuth('register')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: 'transparent',
                    border: '1px solid #CBD5E1',
                    color: '#14213D',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Start Confidential Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COUNSELLING CATEGORIES SECTION */}
      <section id="categories" style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F26B6B', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Evidence-Informed Support
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#14213D', margin: '8px 0 12px' }}>
            Comprehensive Counselling Categories
          </h2>
          <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem', color: '#5A6578', lineHeight: 1.6 }}>
            Our verified practitioners provide confidential, structured guidance tailored to your specific situation and emotional needs.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '28px',
                  boxShadow: '0 8px 24px rgba(20, 33, 61, 0.05)',
                  border: '1px solid #E9E4F5',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        background: '#EDFAF8',
                        color: '#36B7A5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      style={{
                        background: '#E9E4F5',
                        color: '#14213D',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}
                    >
                      {cat.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#14213D', margin: '0 0 10px' }}>
                    {cat.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: '#5A6578', lineHeight: 1.55, margin: '0 0 16px' }}>
                    {cat.desc}
                  </p>

                  <div style={{ background: '#FAF9FE', padding: '10px 14px', borderRadius: '10px', fontSize: '0.78rem', color: '#4B5563', marginBottom: '20px' }}>
                    <strong>Scope of Care:</strong> {cat.scope}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCounsellorFilter(cat.id === 'other' ? 'all' : cat.id);
                    const el = document.getElementById('professionals');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    background: 'transparent',
                    border: '1px solid #CBD5E1',
                    borderRadius: '12px',
                    padding: '10px 16px',
                    color: '#14213D',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}
                >
                  Explore Practitioners in this Field <ChevronRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. HOW MANMITRA WORKS */}
      <section
        id="how-it-works"
        style={{
          background: '#FFFFFF',
          padding: '80px 20px',
          borderTop: '1px solid #E9E4F5',
          borderBottom: '1px solid #E9E4F5'
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#36B7A5', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Simple, Private, Guided
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#14213D', margin: '8px 0 12px' }}>
              How MANMITRA Works
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem', color: '#5A6578' }}>
              Access respectful guidance without navigating complicated dashboards or high-friction barriers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              {
                step: '01',
                title: 'Share What Help You Seek',
                desc: 'Explain what you are experiencing through our simple, pressure-free triage or browse categories directly.',
                icon: HelpCircle
              },
              {
                step: '02',
                title: 'Discover Suitable Guides',
                desc: 'Review verified qualifications, years of experience, languages, and declared scope of practice.',
                icon: UserCheck
              },
              {
                step: '03',
                title: 'Schedule a Confidential Session',
                desc: 'Choose an available time slot for encrypted video or voice consultation with clear, transparent pricing.',
                icon: Calendar
              },
              {
                step: '04',
                title: 'Build Long-Term Clarity',
                desc: 'Receive compassionate follow-up notes, grounding homework, and ongoing emotional support.',
                icon: TrendingUp
              }
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  style={{
                    padding: '28px 24px',
                    borderRadius: '20px',
                    background: '#FAF9FE',
                    border: '1px solid #E9E4F5',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      color: '#E9E4F5',
                      position: 'absolute',
                      top: '20px',
                      right: '20px'
                    }}
                  >
                    {st.step}
                  </div>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: '#FFFFFF',
                      color: '#F26B6B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '18px',
                      boxShadow: '0 4px 12px rgba(242, 107, 107, 0.15)'
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#14213D', margin: '0 0 8px' }}>
                    {st.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#5A6578', lineHeight: 1.5, margin: 0 }}>
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. VERIFIED PROFESSIONALS SHOWCASE */}
      <section id="professionals" style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#36B7A5', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Accredited Clinical Experience
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#14213D', margin: '6px 0 0' }}>
              Meet Our Verified Practitioners
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#5A6578', margin: '6px 0 0' }}>
              Each counsellor is vetted for degrees, regulatory registration, and commitment to client safety.
            </p>
          </div>

          {/* Specialty Filter Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Specialties' },
              { id: 'relationship', label: 'Relationships' },
              { id: 'personal', label: 'Personal Growth' },
              { id: 'marriage_compat', label: 'Marriage Compatibility' },
              { id: 'professional', label: 'Life Direction' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setCounsellorFilter(f.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  border: `1px solid ${counsellorFilter === f.id ? '#14213D' : '#CBD5E1'}`,
                  background: counsellorFilter === f.id ? '#14213D' : '#FFFFFF',
                  color: counsellorFilter === f.id ? '#FFFFFF' : '#374151',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredCounsellors.map((c) => (
            <div
              key={c.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(20, 33, 61, 0.06)',
                border: '1px solid #E9E4F5',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <img
                    src={c.photo}
                    alt={c.name}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #36B7A5'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#14213D' }}>
                        {c.name}
                      </h3>
                      <span title="Verified Credentials" style={{ color: '#36B7A5', display: 'flex', alignItems: 'center' }}>
                        <CheckCircle2 size={16} />
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '3px' }}>
                      {c.title}
                    </div>

                    <div style={{ fontSize: '0.74rem', color: '#36B7A5', fontWeight: 600, marginTop: '4px' }}>
                      {c.experience} - {c.license}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#14213D', background: '#F7F6FC', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px' }}>
                  <strong>Degree:</strong> {c.qualification}
                </div>

                <p style={{ fontSize: '0.85rem', color: '#5A6578', lineHeight: 1.5, margin: '0 0 14px' }}>
                  {c.bio}
                </p>

                <div style={{ fontSize: '0.78rem', color: '#718096', marginBottom: '16px' }}>
                   Languages: <strong>{c.languages}</strong>
                </div>
              </div>

              <div>
                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '14px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#718096' }}>Consultation Fee</span>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#14213D' }}>
                      ₹{c.id === 2 ? '900' : '1,200'}
                      <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B' }}> / session</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#36B7A5', fontWeight: 600, background: '#EDFAF8', padding: '4px 8px', borderRadius: '6px' }}>
                    Included with Premium
                  </span>
                </div>

                <button
                  onClick={() => onOpenAuth('register')}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #14213D 0%, #1F2D4B 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Calendar size={15} /> Request Consultation Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. INTERACTIVE AI GUIDED SELF-REFLECTION PREVIEW */}
      <section
        style={{
          background: 'linear-gradient(135deg, #14213D 0%, #0F172A 100%)',
          color: '#FFFFFF',
          padding: '80px 20px'
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: '999px',
              background: 'rgba(54, 183, 165, 0.2)',
              color: '#36B7A5',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '16px'
            }}
          >
            <Sparkles size={14} /> Available Guidance Feature
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 14px' }}>
            Structured Self-Reflection with MANMITRA
          </h2>

          <p style={{ maxWidth: '640px', margin: '0 auto 36px', fontSize: '0.98rem', color: '#CBD5E1', lineHeight: 1.6 }}>
            Gain perspective on relationship communication or personal friction between sessions. Try a sample reflective inquiry below:
          </p>

          {/* Interactive Mini Box */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px 28px',
              textAlign: 'left',
              color: '#14213D',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)'
            }}
          >
            <form onSubmit={handleInteractiveReflection}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px' }}>
                What situation would you like to unpack?
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="e.g. My partner and I argue when tired after work, and conversations escalate..."
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '260px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={isReflecting || !reflectionInput.trim()}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #F26B6B 0%, #E25555 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: isReflecting || !reflectionInput.trim() ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isReflecting ? 'Reflecting...' : 'Explore Perspective'}
                </button>
              </div>
            </form>

            {reflectionResponse && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '18px',
                  borderRadius: '14px',
                  background: '#EDFAF8',
                  border: '1px solid #36B7A5'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#14213D', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <Lightbulb size={16} color="#36B7A5" /> Reflective Perspective
                </div>
                <p style={{ margin: '0 0 10px', fontSize: '0.88rem', color: '#374151', lineHeight: 1.5 }}>
                  {reflectionResponse.perspective}
                </p>
                <div style={{ fontSize: '0.82rem', color: '#1F2937', background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px' }}>
                  <strong>A question to reflect on:</strong> {reflectionResponse.question}
                </div>
              </div>
            )}

            {/* Ethical Boundary Disclaimer */}
            <div
              style={{
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '0.74rem',
                color: '#6B7280',
                lineHeight: 1.4
              }}
            >
              <AlertTriangle size={15} color="#F26B6B" style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>
                <strong>Ethical Notice:</strong> MANMITRA AI Guidance is an exploratory self-inquiry tool. It is not clinical psychotherapy, medical care, or crisis intervention. For deeper support, connect with our verified professionals.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MEMBERSHIP PLANS SECTION (EXACTLY TWO PLANS) */}
      <section id="plans" style={{ padding: '80px 20px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F26B6B', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Transparent Care & Communication
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#14213D', margin: '8px 0 12px' }}>
            Two Honest, Monthly Membership Plans
          </h2>
          <p style={{ maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem', color: '#5A6578' }}>
            No deceptive lifetime claims or hidden charges. Choose the tier that matches your personal and relational journey.
          </p>
        </div>

        <PricingSection
          isLoggedIn={Boolean(loggedInUser)}
          currentPlanCode={null}
          onSelectPlan={() => onOpenAuth('register')}
          onOpenAuth={onOpenAuth}
        />
      </section>

      {/* 9. WIDER MANMITRA ECOSYSTEM (SECONDARY SERVICES) */}
      <section
        style={{
          background: '#FFFFFF',
          padding: '70px 20px',
          borderTop: '1px solid #E9E4F5',
          borderBottom: '1px solid #E9E4F5'
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Wider MANMITRA Ecosystem
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#14213D', margin: '6px 0 10px' }}>
              Companion Guidance & Wellbeing Services
            </h2>
            <p style={{ maxWidth: '620px', margin: '0 auto', fontSize: '0.88rem', color: '#5A6578' }}>
              While professional counselling remains our primary service, explore our complementary relationship, lifestyle, and growth tools:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            {secondaryServices.map((srv) => (
              <div
                key={srv.title}
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: '#FAF9FE',
                  border: '1px solid #E9E4F5'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#14213D' }}>{srv.title}</span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: srv.status === 'In Verification' ? '#FEF2F2' : '#EDFAF8',
                      color: srv.status === 'In Verification' ? '#DC2626' : '#2DA090'
                    }}
                  >
                    {srv.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#F26B6B', fontWeight: 600, marginBottom: '6px' }}>
                  {srv.badge}
                </div>
                <p style={{ fontSize: '0.82rem', color: '#5A6578', margin: 0, lineHeight: 1.45 }}>
                  {srv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. TRUST, PRIVACY & SAFETY INFORMATION */}
      <section style={{ padding: '70px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF9FE 0%, #FFFFFF 100%)',
            borderRadius: '24px',
            padding: '36px',
            border: '1px solid #E9E4F5',
            boxShadow: '0 12px 30px rgba(20, 33, 61, 0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <ShieldCheck size={32} color="#36B7A5" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#14213D' }}>
                Trust, Privacy & Ethical Boundaries
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#5A6578' }}>
                Counselling requires the highest standard of care and respect.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', fontSize: '0.85rem', color: '#4B5563' }}>
            <div>
              <strong style={{ color: '#14213D', display: 'block', marginBottom: '4px' }}> Strict Privacy Controls</strong>
              Private phone numbers and sensitive identifiers are strictly encrypted and never published or sold to third-party ad networks.
            </div>

            <div>
              <strong style={{ color: '#14213D', display: 'block', marginBottom: '4px' }}> Verified Qualifications</strong>
              We do not permit unverified practitioners. Credentials, academic degrees, and board registrations are reviewed prior to verification badges.
            </div>

            <div>
              <strong style={{ color: '#14213D', display: 'block', marginBottom: '4px' }}> Consensual Connection</strong>
              In matchmaking and peer communication, mutual connection and consent are strictly enforced before text messaging or calling.
            </div>

            <div>
              <strong style={{ color: '#14213D', display: 'block', marginBottom: '4px' }}> Emergency Helpline Access</strong>
              MANMITRA provides clear guidance toward 24/7 national mental health helplines for anyone experiencing acute crisis.
            </div>
          </div>
        </div>
      </section>

      {/* 11. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" style={{ padding: '60px 20px 80px', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F26B6B', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Clear Answers
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#14213D', margin: '6px 0 0' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E9E4F5',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : i)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#14213D',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    size={18}
                    color="#718096"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                      flexShrink: 0
                    }}
                  />
                </button>

                {isOpen && (
                  <div style={{ padding: '0 22px 18px', fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.6 }}>
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 12. RESPECTFUL FOOTER & CRISIS DIRECTORY */}
      <footer
        style={{
          background: '#0B132B',
          color: '#E9E4F5',
          padding: '60px 20px 40px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '40px' }}>
            {/* Col 1: Brand */}
            <div>
              <ManmitraLogo variant="horizontal" size={32} />
              <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginTop: '14px', lineHeight: 1.55 }}>
                "Better Understanding. Healthier Lives."<br />
                "Someone to Talk To. Guidance to Move Forward."
              </p>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '12px' }}>
                A counselling-first ecosystem fostering healthy relationships, personal self-understanding, and informed decisions.
              </p>
            </div>

            {/* Col 2: Counselling Categories */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '0.92rem', margin: '0 0 14px', fontWeight: 700 }}>
                Counselling Services
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 2 }}>
                <li>Relationship Counselling</li>
                <li>Personal Guidance</li>
                <li>Emotional Support</li>
                <li>Marriage & Compatibility</li>
                <li>Family & Communication</li>
                <li>Professional Guidance</li>
              </ul>
            </div>

            {/* Col 3: Professional Accreditation */}
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '0.92rem', margin: '0 0 14px', fontWeight: 700 }}>
                Professional Portal
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5 }}>
                Are you a qualified psychologist or counsellor? Apply to join our verified professional directory.
              </p>
              <button
                onClick={() => onOpenAuth('register')}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: '1px solid #36B7A5',
                  background: 'rgba(54, 183, 165, 0.1)',
                  color: '#36B7A5',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Counsellor Registration
              </button>
            </div>

            {/* Col 4: Crisis Helplines (Crucial for Ethical Platform) */}
            <div>
              <h4 style={{ color: '#F26B6B', fontSize: '0.92rem', margin: '0 0 14px', fontWeight: 700 }}>
                24/7 Crisis Helplines (India)
              </h4>
              <div style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: 1.6 }}>
                <div><strong>Tele-MANAS:</strong> 14416 / 1800-891-4416</div>
                <div><strong>Vandrevala Foundation:</strong> +91 9999 666 555</div>
                <div><strong>KIRAN Helpline:</strong> 1800-599-0019</div>
                <div style={{ marginTop: '8px', fontSize: '0.74rem', color: '#94A3B8' }}>
                  If you are in immediate physical danger or medical emergency, please call 112 immediately.
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.75rem',
              color: '#94A3B8'
            }}
          >
            <div>
               {new Date().getFullYear()} MANMITRA. All rights reserved. Built with ethical care, verified credentials & client confidentiality.
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Ethical Standards</span>
              <span>Scope of Care</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
