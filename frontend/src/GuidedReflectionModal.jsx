import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Compass,
  Heart,
  ShieldCheck,
  Send,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

export default function GuidedReflectionModal({
  isOpen,
  onClose,
  initialCategory = 'relationship',
  initialTopic = '',
  subscription,
  api,
  notify,
  onUpgradeRequired
}) {
  if (!isOpen) return null;

  const [category, setCategory] = useState(initialCategory || 'relationship');
  const [topic, setTopic] = useState(initialTopic || '');
  const [userReflection, setUserReflection] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const categories = [
    { id: 'relationship', title: 'Relationship Counselling', desc: 'Communication, trust & boundaries' },
    { id: 'personal', title: 'Personal Guidance', desc: 'Self-clarity, confidence & life decisions' },
    { id: 'emotional', title: 'Emotional Support', desc: 'Safe space for difficult situations' },
    { id: 'marriage_compat', title: 'Marriage & Compatibility', desc: 'Cohabitation, expectations & values' },
    { id: 'family_comm', title: 'Family & Communication', desc: 'Interpersonal dynamics & harmony' },
    { id: 'professional', title: 'Professional Guidance', desc: 'Direction toward qualified specialists' }
  ];

  const handleReflect = async (e) => {
    e.preventDefault();
    if (!userReflection.trim()) return;

    setBusy(true);
    try {
      const data = await api('/guidance/reflect', {
        method: 'POST',
        body: {
          category,
          topic: topic.trim() || 'Personal Reflection',
          user_reflection: userReflection.trim()
        }
      });
      setResult(data);
    } catch (err) {
      if (err.message && (err.message.includes('limit reached') || err.message.includes('membership'))) {
        onClose();
        onUpgradeRequired({
          isOpen: true,
          featureName: 'AI Guided Reflection Quota',
          reason: err.message
        });
      } else {
        notify(err.message, true);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setUserReflection('');
    setTopic('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1050 }}>
      <div
        className="modal-card modal-reflection"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '680px',
          width: '94%',
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(20, 33, 61, 0.18)',
          border: '1px solid #E9E4F5',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #14213D 0%, #1F2D4B 100%)',
            padding: '22px 28px',
            color: '#FFFFFF',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close reflection modal"
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(242, 107, 107, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F26B6B'
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF' }}>
                MANMITRA Guided Self-Reflection
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#E9E4F5', opacity: 0.85 }}>
                A respectful, structured space to clarify thoughts and gain healthy perspective
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
          {result ? (
            /* Results View */
            <div>
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: '#EDFAF8',
                  border: '1px solid #36B7A5',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#14213D', fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px' }}>
                  <Lightbulb size={18} color="#36B7A5" />
                  Constructive Perspective
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#1F2937', lineHeight: 1.6 }}>
                  {result.perspective}
                </p>
              </div>

              {/* Reflective Questions */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: 700, color: '#14213D', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HelpCircle size={18} color="#F26B6B" /> 3 Questions to Sit With Today
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {result.reflective_questions.map((q, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '14px',
                        background: '#F7F6FC',
                        border: '1px solid #E9E4F5',
                        display: 'flex',
                        gap: '12px',
                        fontSize: '0.88rem',
                        color: '#14213D'
                      }}
                    >
                      <span style={{ fontWeight: 700, color: '#F26B6B' }}>0{idx + 1}.</span>
                      <span style={{ lineHeight: 1.5 }}>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Exercise */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: '#FFF7F8',
                  border: '1px solid #F26B6B',
                  marginBottom: '22px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#14213D', fontWeight: 700, fontSize: '0.92rem', marginBottom: '6px' }}>
                  <CheckCircle2 size={18} color="#F26B6B" />
                  Recommended Grounding Practice
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#374151', lineHeight: 1.5 }}>
                  {result.recommended_exercise}
                </p>
              </div>

              {/* Ethical Disclaimer */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  lineHeight: 1.45,
                  marginBottom: '20px'
                }}
              >
                <strong>Important Notice:</strong> {result.disclaimer}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#5A6578',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Explore Another Topic
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#14213D',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Input View */
            <form onSubmit={handleReflect}>
              {/* Category Picker */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#14213D', marginBottom: '8px' }}>
                  Guidance Category
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {categories.map((c) => {
                    const active = category === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        style={{
                          textAlign: 'left',
                          padding: '10px 14px',
                          borderRadius: '14px',
                          border: `1.5px solid ${active ? '#36B7A5' : '#E9E4F5'}`,
                          background: active ? '#EDFAF8' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', fontWeight: active ? 700 : 600, color: active ? '#14213D' : '#374151' }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#718096', marginTop: '2px' }}>
                          {c.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topic Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#14213D', marginBottom: '6px' }}>
                  Topic or Key Focus (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Navigating relationship conflict, expressing boundaries calmly..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    color: '#14213D',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Reflection Query */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#14213D', marginBottom: '6px' }}>
                  What situation or thoughts are on your mind?
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share what you are feeling or observing in your situation. Express yourself freely in a private, supportive space..."
                  value={userReflection}
                  onChange={(e) => setUserReflection(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    color: '#14213D',
                    outline: 'none',
                    lineHeight: 1.5,
                    resize: 'none'
                  }}
                />
              </div>

              {/* Non-clinical disclaimer banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: '#F7F6FC',
                  border: '1px solid #E9E4F5',
                  marginBottom: '20px'
                }}
              >
                <ShieldCheck size={18} color="#36B7A5" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.78rem', color: '#5A6578', lineHeight: 1.45 }}>
                  <strong>Ethical Boundary:</strong> MANMITRA AI Guidance is a structured self-inquiry tool to support personal understanding. It is not psychotherapy, clinical diagnosis, or medical treatment.
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '14px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#5A6578',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={busy || !userReflection.trim()}
                  style={{
                    padding: '12px 26px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #F26B6B 0%, #E25555 100%)',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: busy || !userReflection.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 20px rgba(242, 107, 107, 0.25)'
                  }}
                >
                  {busy ? 'Generating Guidance...' : (
                    <>
                      <Send size={16} /> Seek Perspective
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
