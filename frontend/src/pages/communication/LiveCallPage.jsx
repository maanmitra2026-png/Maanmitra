import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
  ShieldCheck, AlertTriangle, Users, Sparkles, Clock, Send,
  ChevronRight, Volume2, Wallet, PlusCircle, CreditCard,
  CheckCircle2, Phone, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE, WS_BASE } from '../../apiConfig';
import { openRazorpayCheckout } from '../../utils/razorpay';

export default function LiveCallPage() {
  const params = useParams();
  const sessionId = params.sessionId || params.bookingId;
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, setUser } = useAuth();

  // Query params
  const searchParams = new URLSearchParams(location.search);
  const initialCommType = searchParams.get('type') || 'video';

  // Session state
  const [sessionData, setSessionData] = useState(null);
  const [commType, setCommType] = useState(initialCommType); // 'chat' | 'audio' | 'video'
  const [callActive, setCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0); // in seconds
  const [connectionStatus, setConnectionStatus] = useState('Connecting to secure peer...');

  // Billing state (Per-minute model)
  const [ratePerMin, setRatePerMin] = useState(initialCommType === 'video' ? 25 : initialCommType === 'audio' ? 15 : 5);
  const [totalBilled, setTotalBilled] = useState(ratePerMin); // 1st minute paid on start
  const [minutesBilled, setMinutesBilled] = useState(1);
  const [userWalletBalance, setUserWalletBalance] = useState(user?.wallet_balance_inr || 0);
  const [lowBalanceAlert, setLowBalanceAlert] = useState(false);
  const [sessionEndModal, setSessionEndModal] = useState(null);

  // Quick Top-up modal state
  const [topupModalOpen, setTopupModalOpen] = useState(false);
  const [topupLoading, setTopupLoading] = useState(false);

  // Call Controls state
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(initialCommType === 'audio' || initialCommType === 'chat');
  const [chatOpen, setChatOpen] = useState(initialCommType === 'chat');

  // Chat state
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: 'Encrypted real-time session connected. Live per-minute billing active.', isSystem: true, time: 'Now' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Refs for media and connections
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnRef = useRef(null);
  const signalingWsRef = useRef(null);
  const chatWsRef = useRef(null);
  const chatBottomRef = useRef(null);

  const isPartner = user?.role === 'maanmitra_partner';

  // 1. Fetch initial session status
  const fetchSessionStatus = async () => {
    if (!token || !sessionId) return;
    try {
      const res = await fetch(`${API_BASE}/sessions/${sessionId}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const d = await res.json();
        setSessionData(d);
        if (d.communication_type) setCommType(d.communication_type);
        if (d.rate_per_minute_inr) setRatePerMin(d.rate_per_minute_inr);
        if (d.total_billed_inr) setTotalBilled(d.total_billed_inr);
        if (d.minutes_billed) setMinutesBilled(d.minutes_billed);
        if (d.user_wallet_balance_inr !== undefined && !isPartner) {
          setUserWalletBalance(d.user_wallet_balance_inr);
        }
        if (d.status === 'ended') {
          setCallActive(false);
          setSessionEndModal({
            title: 'Session Concluded',
            message: 'This session has ended.',
            duration: d.duration_seconds || 0,
            totalBilled: d.total_billed_inr || 0
          });
        }
      }
    } catch (err) {
      console.warn('Failed to load session status:', err);
    }
  };

  useEffect(() => {
    fetchSessionStatus();
  }, [sessionId, token]);

  // 2. Format timer
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
  };

  // 3. Second-by-Second Call Duration Timer
  useEffect(() => {
    if (!callActive) return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callActive]);

  // 4. Per-Minute Billing Engine Heartbeat (runs every 60 seconds)
  useEffect(() => {
    if (!callActive || isPartner || !token || !sessionId) return;

    // Check every second if a new minute has completed
    if (callDuration > 0 && callDuration % 60 === 0) {
      const tickMinute = async () => {
        try {
          const res = await fetch(`${API_BASE}/sessions/${sessionId}/tick-minute`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (res.ok) {
            const data = await res.json();
            if (data.active === false) {
              // Balance exhausted!
              setCallActive(false);
              setSessionEndModal({
                title: 'Wallet Balance Exhausted',
                message: 'Your call was concluded because your wallet balance ran out.',
                duration: callDuration,
                totalBilled: data.total_billed_inr || totalBilled
              });
              if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(t => t.stop());
              }
            } else {
              setMinutesBilled(data.minutes_billed);
              setTotalBilled(data.total_billed_inr);
              setUserWalletBalance(data.remaining_balance_inr);
              if (user) {
                const updated = { ...user, wallet_balance_inr: data.remaining_balance_inr };
                setUser(updated);
                localStorage.setItem('mm_user', JSON.stringify(updated));
              }

              // Check if balance has less than 2 minutes remaining
              if (data.remaining_balance_inr < ratePerMin * 2) {
                setLowBalanceAlert(true);
              } else {
                setLowBalanceAlert(false);
              }
            }
          }
        } catch (err) {
          console.error('Tick minute error:', err);
        }
      };

      tickMinute();
    }
  }, [callDuration, callActive, isPartner, sessionId, token, ratePerMin]);

  // 5. WebRTC Setup & Media Capture
  useEffect(() => {
    if (commType === 'chat') {
      setConnectionStatus('Encrypted Real-Time Chat Active');
      return;
    }

    const iceServers = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const pc = new RTCPeerConnection(iceServers);
    peerConnRef.current = pc;

    // Remote stream arrives
    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setConnectionStatus('Peer Connected (High Quality HD)');
      }
    };

    // ICE Candidate generation
    pc.onicecandidate = (event) => {
      if (event.candidate && signalingWsRef.current?.readyState === WebSocket.OPEN) {
        signalingWsRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate,
          sender_id: user?.id
        }));
      }
    };

    // Capture Local Audio/Video
    const constraints = {
      audio: true,
      video: commType === 'video'
    };

    navigator.mediaDevices?.getUserMedia(constraints)
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current && commType === 'video') {
          localVideoRef.current.srcObject = stream;
        }
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        setConnectionStatus('Media stream active. Waiting for peer...');

        // If caller, create SDP offer
        if (!isPartner) {
          pc.createOffer()
            .then((offer) => pc.setLocalDescription(offer))
            .then(() => {
              if (signalingWsRef.current?.readyState === WebSocket.OPEN) {
                signalingWsRef.current.send(JSON.stringify({
                  type: 'offer',
                  sdp: pc.localDescription,
                  sender_id: user?.id
                }));
              }
            })
            .catch(console.error);
        }
      })
      .catch((err) => {
        console.warn('getUserMedia error:', err);
        setConnectionStatus('Audio/Video active (Preview / Simulation Mode)');
      });

    // Connect to WebRTC Signaling WebSocket
    const wsUrl = `${WS_BASE}/ws/maanmitra/signaling/${sessionId}`;
    const ws = new WebSocket(wsUrl);
    signalingWsRef.current = ws;

    ws.onmessage = async (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'offer' && isPartner) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          ws.send(JSON.stringify({
            type: 'answer',
            sdp: pc.localDescription,
            sender_id: user?.id
          }));
        } else if (data.type === 'answer' && !isPartner) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        } else if (data.type === 'ice-candidate' && data.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else if (data.type === 'billing_tick') {
          setMinutesBilled(data.minutes_elapsed);
          setTotalBilled(data.total_billed_inr);
          if (!isPartner && data.remaining_balance_inr !== undefined) {
            setUserWalletBalance(data.remaining_balance_inr);
          }
        } else if (data.type === 'call_ended') {
          setCallActive(false);
          setSessionEndModal({
            title: 'Session Ended by Participant',
            message: `${data.ended_by || 'Participant'} has concluded the call.`,
            duration: data.duration_seconds || callDuration,
            totalBilled: data.total_billed_inr || totalBilled
          });
        } else if (data.type === 'session_terminated') {
          setCallActive(false);
          setSessionEndModal({
            title: 'Session Ended',
            message: data.message || 'The session has ended.',
            duration: callDuration,
            totalBilled: totalBilled
          });
        }
      } catch (err) {
        console.error('Signaling message error:', err);
      }
    };

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (pc) pc.close();
      if (ws) ws.close();
    };
  }, [sessionId, commType, isPartner, user?.id]);

  // 6. Connect to In-Call Chat WebSocket
  useEffect(() => {
    const wsUrl = `${WS_BASE}/ws/maanmitra/chat/${sessionId}`;
    const ws = new WebSocket(wsUrl);
    chatWsRef.current = ws;

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'chat_message' || data.type === 'message') {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: data.sender_name || 'Companion',
              text: data.message_text || data.content,
              isMe: data.sender_id === user?.id,
              time: data.sent_at || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    return () => {
      if (ws) ws.close();
    };
  }, [sessionId, user?.id]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send in-call chat message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const text = inputMsg.trim();
    setInputMsg('');

    const newMsg = {
      id: Date.now(),
      sender: user?.full_name || 'You',
      text,
      isMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMsg]);

    // Send via WebSocket
    if (chatWsRef.current && chatWsRef.current.readyState === WebSocket.OPEN) {
      chatWsRef.current.send(JSON.stringify({
        type: 'chat_message',
        conversation_id: sessionId,
        sender_id: user?.id,
        sender_name: user?.full_name,
        message_text: text,
        sent_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
    }

    // Backup REST call
    try {
      await fetch(`${API_BASE}/conversations/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message_type: 'text', message_text: text })
      });
    } catch (err) {
      console.warn('REST message fallback warning:', err);
    }
  };

  // Toggle Controls
  const toggleMic = () => {
    setMicMuted(!micMuted);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = micMuted;
      });
    }
  };

  const toggleCamera = () => {
    setCameraOff(!cameraOff);
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = cameraOff;
      });
    }
  };

  // End Session cleanly
  const handleEndSession = async () => {
    if (window.confirm('Are you sure you want to conclude this session?')) {
      try {
        await fetch(`${API_BASE}/sessions/${sessionId}/end`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (err) {
        console.error(err);
      }
      setCallActive(false);
      setSessionEndModal({
        title: 'Session Concluded',
        message: 'Thank you for connecting with MAANMITRA.',
        duration: callDuration,
        totalBilled: totalBilled
      });
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    }
  };

  // Quick In-Call Top-up via Razorpay
  const handleInCallTopup = async (amount) => {
    setTopupLoading(true);
    try {
      const orderRes = await fetch(`${API_BASE}/user/wallet/create-topup-order`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount_inr: amount })
      });
      if (!orderRes.ok) throw new Error('Order creation failed');
      const orderData = await orderRes.json();

      await openRazorpayCheckout({
        order_id: orderData.order_id,
        amount: orderData.amount,
        name: 'MAANMITRA Wallet Recharge',
        description: `Top-up ₹${amount} to continue live conversation`,
        prefill: {
          name: user?.full_name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        onSuccess: async (rzpRes) => {
          const verifyRes = await fetch(`${API_BASE}/user/wallet/verify-topup`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              razorpay_order_id: rzpRes.razorpay_order_id,
              razorpay_payment_id: rzpRes.razorpay_payment_id,
              razorpay_signature: rzpRes.razorpay_signature,
              amount_inr: amount
            })
          });
          if (verifyRes.ok) {
            const vData = await verifyRes.json();
            setUserWalletBalance(vData.wallet_balance_inr);
            setLowBalanceAlert(false);
            setTopupModalOpen(false);
            if (user) {
              const updated = { ...user, wallet_balance_inr: vData.wallet_balance_inr };
              setUser(updated);
              localStorage.setItem('mm_user', JSON.stringify(updated));
            }
          }
        },
        onDismiss: () => setTopupLoading(false),
        onError: () => setTopupLoading(false)
      });
    } catch (e) {
      console.error(e);
    } finally {
      setTopupLoading(false);
    }
  };

  const partnerName = sessionData?.partner_name || 'Verified Counsellor';
  const partnerPhoto = sessionData?.partner_photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="mm-live-call-container" style={{ minHeight: '100vh', background: '#200823', color: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP STATUS & REAL-TIME BILLING BAR */}
      <header
        style={{
          background: 'rgba(32, 8, 35, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          zIndex: 100
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 10px #22C55E' }} />
            <strong style={{ fontSize: '0.95rem', letterSpacing: '0.04em' }}>
              LIVE {commType.toUpperCase()} WITH {partnerName}
            </strong>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '5px 12px',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700
            }}
          >
            <Clock size={15} color="#D4AF77" />
            <span>{formatTime(callDuration)}</span>
          </div>

          <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.65)' }}>
            {connectionStatus}
          </span>
        </div>

        {/* Live Per-Minute Billing Widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isPartner ? (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '6px 14px',
                  borderRadius: '12px',
                  fontSize: '0.82rem'
                }}
              >
                <div>
                  <span style={{ opacity: 0.7, fontSize: '0.72rem', display: 'block' }}>RATE</span>
                  <strong>₹{ratePerMin}/min</strong>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.15)' }} />
                <div>
                  <span style={{ opacity: 0.7, fontSize: '0.72rem', display: 'block' }}>SPENT</span>
                  <strong style={{ color: '#D4AF77' }}>₹{totalBilled}</strong>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.15)' }} />
                <div>
                  <span style={{ opacity: 0.7, fontSize: '0.72rem', display: 'block' }}>WALLET</span>
                  <strong style={{ color: userWalletBalance < ratePerMin * 2 ? '#EF4444' : '#22C55E' }}>
                    ₹{userWalletBalance}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTopupModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #E91E63, #C2185B)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <PlusCircle size={15} /> Top-Up
              </button>
            </>
          ) : (
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid #22C55E',
                color: '#22C55E',
                padding: '6px 16px',
                borderRadius: '12px',
                fontSize: '0.86rem',
                fontWeight: 700
              }}
            >
              Session Earnings: ₹{Math.floor(totalBilled * 0.7)} (70% share)
            </div>
          )}

          <button
            onClick={() => setChatOpen(!chatOpen)}
            style={{
              background: chatOpen ? 'rgba(233, 30, 99, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${chatOpen ? '#E91E63' : 'rgba(255, 255, 255, 0.2)'}`,
              color: '#FFFFFF',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <MessageSquare size={16} />
            <span>{chatOpen ? 'Hide Chat' : 'Chat'}</span>
          </button>
        </div>
      </header>

      {/* Low Balance Warning Banner */}
      {lowBalanceAlert && !isPartner && (
        <div
          style={{
            background: 'linear-gradient(90deg, #B91C1C 0%, #DC2626 100%)',
            color: '#FFFFFF',
            padding: '8px 24px',
            fontSize: '0.84rem',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 99
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} />
            <span>Low Balance Warning: You have less than 2 minutes left in your wallet! Top up now to prevent call disconnection.</span>
          </div>
          <button
            onClick={() => setTopupModalOpen(true)}
            style={{
              background: '#FFFFFF',
              color: '#B91C1C',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Instant Top-Up
          </button>
        </div>
      )}

      {/* 2. MAIN STAGE (Video / Audio Mode + In-call Chat) */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        
        {/* Call Viewport */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#120314' }}>
          
          {/* VIDEO MODE */}
          {commType === 'video' && (
            <>
              {/* Remote Video Stream */}
              <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Fallback image when remote stream is warming up */}
                <img
                  src={partnerPhoto}
                  alt={partnerName}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 1,
                    opacity: remoteVideoRef.current?.srcObject ? 0 : 1,
                    transition: 'opacity 0.4s ease'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '85px',
                    left: '24px',
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(8px)',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Sparkles size={16} color="#D4AF77" />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{partnerName}</span>
                </div>
              </div>

              {/* Local Video PIP Thumbnail */}
              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  width: '180px',
                  height: '120px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '2px solid rgba(255,255,255,0.25)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  zIndex: 20,
                  background: '#2B0E2E'
                }}
              >
                {cameraOff ? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#2B0E2E' }}>
                    <VideoOff size={24} color="#FFFFFF" />
                    <span style={{ fontSize: '0.72rem', marginTop: '4px' }}>Camera Off</span>
                  </div>
                ) : (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                  />
                )}
                <div style={{ position: 'absolute', bottom: 4, left: 6, fontSize: '0.68rem', background: 'rgba(0,0,0,0.6)', padding: '1px 6px', borderRadius: 4 }}>
                  You {micMuted && '(Muted)'}
                </div>
              </div>
            </>
          )}

          {/* AUDIO CALL MODE */}
          {commType === 'audio' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: -16,
                    borderRadius: '50%',
                    border: '2px dashed rgba(233, 30, 99, 0.4)',
                    animation: 'spin 12s linear infinite'
                  }}
                />
                <img
                  src={partnerPhoto}
                  alt={partnerName}
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid #E91E63',
                    boxShadow: '0 0 30px rgba(233, 30, 99, 0.4)'
                  }}
                />
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px' }}>{partnerName}</h2>
              <p style={{ margin: '0 0 16px', color: '#D4AF77', fontSize: '0.9rem', fontWeight: 600 }}>
                HD Voice Call In Progress
              </p>

              {/* Animated Audio Waveform Simulation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '40px', marginBottom: '20px' }}>
                {[14, 28, 36, 20, 32, 16, 26, 38, 22, 12].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      width: 4,
                      height: `${h}px`,
                      background: '#E91E63',
                      borderRadius: 4,
                      transition: 'height 0.2s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* CHAT ONLY MODE */}
          {commType === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #4A154B, #E91E63)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <MessageSquare size={36} color="#FFFFFF" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px' }}>
                Real-Time Chat Session Active
              </h2>
              <p style={{ margin: 0, opacity: 0.75, maxWidth: '420px', fontSize: '0.88rem' }}>
                Use the side chat drawer to message your counsellor in real time. Rate: ₹5 / minute.
              </p>
            </div>
          )}

          {/* FLOATING CALL CONTROLS */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(12px)',
              padding: '12px 24px',
              borderRadius: '9999px',
              zIndex: 30,
              border: '1px solid rgba(255,255,255,0.15)'
            }}
          >
            {/* MIC TOGGLE */}
            <button
              onClick={toggleMic}
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                border: 'none',
                background: micMuted ? '#EF4444' : 'rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title={micMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {micMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* CAMERA TOGGLE (Video only) */}
            {commType === 'video' && (
              <button
                onClick={toggleCamera}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: '50%',
                  border: 'none',
                  background: cameraOff ? '#EF4444' : 'rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={cameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
              >
                {cameraOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>
            )}

            {/* END CALL */}
            <button
              onClick={handleEndSession}
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                border: 'none',
                background: '#DC2626',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.5)'
              }}
              title="End Conversation Session"
            >
              <PhoneOff size={22} />
            </button>
          </div>
        </div>

        {/* 3. SIDEBAR: IN-CALL CHAT DRAWER */}
        {chatOpen && (
          <aside
            style={{
              width: '340px',
              background: '#1A061C',
              borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 50
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>In-Session Chat</h3>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>End-to-end encrypted</span>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                &times;
              </button>
            </div>

            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.isSystem ? 'center' : m.isMe ? 'flex-end' : 'flex-start',
                    maxWidth: m.isSystem ? '90%' : '80%',
                    background: m.isSystem ? 'rgba(255, 255, 255, 0.08)' : m.isMe ? '#E91E63' : 'rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    fontSize: '0.85rem'
                  }}
                >
                  {!m.isSystem && (
                    <span style={{ fontSize: '0.68rem', opacity: 0.7, display: 'block', marginBottom: '2px' }}>
                      {m.sender}
                    </span>
                  )}
                  <div style={{ lineHeight: 1.4 }}>{m.text}</div>
                  <span style={{ fontSize: '0.65rem', opacity: 0.6, display: 'block', textAlign: 'right', marginTop: '2px' }}>
                    {m.time}
                  </span>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            <form onSubmit={handleSendMessage} style={{ padding: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#FFFFFF',
                  fontSize: '0.86rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#E91E63',
                  border: 'none',
                  borderRadius: '10px',
                  width: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </aside>
        )}
      </div>

      {/* QUICK IN-CALL TOP-UP MODAL */}
      {topupModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '440px',
              width: '100%',
              color: '#4A154B',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={22} color="#E91E63" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>In-Call Quick Recharge</h3>
              </div>
              <button
                onClick={() => setTopupModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#8E738A' }}
              >
                &times;
              </button>
            </div>

            <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: '#665063', lineHeight: 1.5 }}>
              Current balance: <strong>₹{userWalletBalance}</strong>. Recharge your wallet instantly to continue this {commType} conversation without interruption.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {[100, 250, 500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleInCallTopup(amt)}
                  disabled={topupLoading}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '12px',
                    border: '1.5px solid #E91E63',
                    background: '#FFF1F5',
                    fontWeight: 800,
                    color: '#4A154B',
                    fontSize: '1rem',
                    cursor: topupLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  ₹{amt}
                  <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 500, color: '#8E738A', marginTop: '2px' }}>
                    +{Math.floor(amt / ratePerMin)} mins
                  </span>
                </button>
              ))}
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#8E738A' }}>
              Secured by Razorpay • UPI QR / Cards / Netbanking
            </div>
          </div>
        </div>
      )}

      {/* SESSION ENDED MODAL */}
      {sessionEndModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '36px 30px',
              maxWidth: '440px',
              width: '100%',
              textAlign: 'center',
              color: '#4A154B',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#FFF1F5',
                color: '#E91E63',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: 800 }}>
              {sessionEndModal.title}
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '0.9rem', color: '#665063', lineHeight: 1.5 }}>
              {sessionEndModal.message}
            </p>

            {/* Summary Box */}
            <div
              style={{
                background: '#FAF6F9',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-around',
                border: '1px solid #F0DCE8'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: '#8E738A', display: 'block' }}>TOTAL TIME</span>
                <strong style={{ fontSize: '1.1rem', color: '#4A154B' }}>
                  {formatTime(sessionEndModal.duration)}
                </strong>
              </div>
              <div style={{ width: '1px', background: '#E6D2DF' }} />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#8E738A', display: 'block' }}>
                  {isPartner ? 'EARNINGS' : 'TOTAL BILLED'}
                </span>
                <strong style={{ fontSize: '1.1rem', color: '#E91E63' }}>
                  ₹{isPartner ? Math.floor(sessionEndModal.totalBilled * 0.7) : sessionEndModal.totalBilled}
                </strong>
              </div>
            </div>

            <button
              onClick={() => navigate(isPartner ? '/partner/dashboard' : '/user/dashboard')}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #4A154B, #E91E63)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                padding: '14px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
