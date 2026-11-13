import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Public Pages
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import CounsellingPage from './pages/public/CounsellingPage';
import BecomePartnerPage from './pages/public/BecomePartnerPage';
import PartnerDetailPage from './pages/public/PartnerDetailPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import FAQPage from './pages/public/FAQPage';
import {
  AboutPage,
  ContactPage,
  TermsPage,
  PrivacyPage,
  RefundPolicyPage
} from './pages/public/StaticPages';

// 8 Dedicated Service Pages
import MeetANewFriendPage from './pages/services/MeetANewFriendPage';
import LivingRelationshipPage from './pages/services/LivingRelationshipPage';
import StrangerTripPage from './pages/services/StrangerTripPage';
import RelationshipGuidancePage from './pages/services/RelationshipGuidancePage';
import LifeCoachingPage from './pages/services/LifeCoachingPage';
import AstrologyKundaliPage from './pages/services/AstrologyKundaliPage';
import RemoteWorkPage from './pages/services/RemoteWorkPage';
import CounsellingSupportPage from './pages/services/CounsellingSupportPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Partner Onboarding
import {
  PartnerRegisterPage,
  PartnerOnboardingPaymentPage,
  PartnerVerificationPage as PartnerVerificationRedirect,
  PartnerStatusPage
} from './pages/partner/PartnerOnboarding';

// Admin Portal Pages
import {
  AdminDashboardPage,
  AdminPartnersPage,
  AdminUsersPage,
  AdminBookingsPage,
  AdminPaymentsPage,
  AdminPackagesPage,
  AdminSettingsPage
} from './pages/admin/AdminPages';

// Partner Portal Pages (All 20 Modules)
import {
  PartnerDashboardPage,
  PartnerProfilePage,
  PartnerExpertisePage,
  PartnerVerificationPage as PartnerVerificationDocPage,
  PartnerAvailabilityPage,
  PartnerBookingsPage,
  PartnerMessagesPage,
  PartnerAudioSessionsPage,
  PartnerVideoSessionsPage,
  PartnerLiveStreamingPage,
  PartnerWorkshopsPage,
  PartnerEarningsPage,
  PartnerWalletPage,
  PartnerWithdrawalsPage,
  PartnerRankPage,
  PartnerBonusesPage,
  PartnerReviewsPage,
  PartnerNotificationsPage,
  PartnerSupportPage,
  PartnerSettingsPage
} from './pages/partner/PartnerPages';

// User Portal Pages
import {
  UserDashboardPage,
  UserDiscoverPage,
  UserMatchesPage,
  UserMatchChatPage,
  UserContentPage,
  UserAIPage,
  UserProfilePage,
  UserSubscriptionStatusPage,
  UserSessionsPage
} from './pages/user/UserPages';
import UserSubscriptionPage from './pages/user/UserSubscription';
import UserWalletPage from './pages/user/UserWalletPage';

// Communication Room
import LiveCallPage from './pages/communication/LiveCallPage';

// Protected Route Guard
function RequireAuth({ children, role, allowPending = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mm-loading-state" style={{ minHeight: '100vh' }}>
        <div className="mm-spinner"></div>
        <p>Verifying secure session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin access
  if (role === 'admin') {
    if (user.role !== 'admin') {
      if (user.role === 'maanmitra_partner') return <Navigate to="/partner/dashboard" replace />;
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  // Partner access
  if (role === 'maanmitra_partner') {
    if (user.role !== 'maanmitra_partner') {
      if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
      return <Navigate to="/user/dashboard" replace />;
    }
    // Only redirect to onboarding if registration fee (₹99) is not yet paid
    if (!allowPending && (user.partner_status === 'payment_pending' || !user.partner_status)) {
      return <Navigate to="/partner/onboarding" replace />;
    }
  }

  // Member / User access
  if (role === 'user') {
    if (user.role !== 'user') {
      if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
      if (user.role === 'maanmitra_partner') return <Navigate to="/partner/dashboard" replace />;
    }
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
          {/* ================= PUBLIC WEBSITE ROUTES ================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />

          {/* ================= 8 INDIVIDUAL DEDICATED SERVICE ROUTES ================= */}
          <Route path="/services/meet-a-new-friend" element={<MeetANewFriendPage />} />
          <Route path="/services/living-relationship" element={<LivingRelationshipPage />} />
          <Route path="/services/stranger-trip" element={<StrangerTripPage />} />
          <Route path="/services/relationship-guidance" element={<RelationshipGuidancePage />} />
          <Route path="/services/life-coaching" element={<LifeCoachingPage />} />
          <Route path="/services/astrology-kundali" element={<AstrologyKundaliPage />} />
          <Route path="/services/remote-work" element={<RemoteWorkPage />} />
          <Route path="/services/counselling" element={<CounsellingSupportPage />} />

          {/* Core Navigation & Compatibility Routes */}
          <Route path="/counselling" element={<CounsellingPage />} />
          <Route path="/counseling" element={<CounsellingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/become-a-partner" element={<BecomePartnerPage />} />
          <Route path="/become-partner" element={<BecomePartnerPage />} />
          <Route path="/explore" element={<Navigate to="/services" replace />} />
          <Route path="/partners" element={<Navigate to="/counselling" replace />} />
          <Route path="/partners/:id" element={<PartnerDetailPage />} />
          <Route path="/pricing" element={<Navigate to="/services" replace />} />
          <Route path="/packages" element={<Navigate to="/services" replace />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />

          {/* ================= AUTHENTICATION ROUTES ================= */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* ================= PARTNER ONBOARDING ================= */}
          <Route path="/partner/register" element={<PartnerRegisterPage />} />
          <Route
            path="/partner/onboarding"
            element={
              <RequireAuth role="maanmitra_partner" allowPending={true}>
                <PartnerOnboardingPaymentPage />
              </RequireAuth>
            }
          />
          <Route
            path="/partner/status"
            element={
              <RequireAuth role="maanmitra_partner" allowPending={true}>
                <PartnerStatusPage />
              </RequireAuth>
            }
          />

          {/* ================= ADMIN WEB PANEL (>= 1024px Desktop-first) ================= */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAuth role="admin">
                <AdminDashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/partners"
            element={
              <RequireAuth role="admin">
                <AdminPartnersPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireAuth role="admin">
                <AdminUsersPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <RequireAuth role="admin">
                <AdminBookingsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <RequireAuth role="admin">
                <AdminPaymentsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/packages"
            element={
              <RequireAuth role="admin">
                <AdminPackagesPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <RequireAuth role="admin">
                <AdminSettingsPage />
              </RequireAuth>
            }
          />

          {/* ================= MAANMITRA PARTNER & MENTOR PORTAL (20 MODULES) ================= */}
          <Route
            path="/partner"
            element={<Navigate to="/partner/dashboard" replace />}
          />
          {/* 1. Overview */}
          <Route
            path="/partner/dashboard"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerDashboardPage />
              </RequireAuth>
            }
          />
          {/* 2. My Profile */}
          <Route
            path="/partner/profile"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerProfilePage />
              </RequireAuth>
            }
          />
          {/* 3. My Expertise */}
          <Route
            path="/partner/expertise"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerExpertisePage />
              </RequireAuth>
            }
          />
          {/* 4. Verification & Documents */}
          <Route
            path="/partner/verification"
            element={
              <RequireAuth role="maanmitra_partner" allowPending={true}>
                <PartnerVerificationDocPage />
              </RequireAuth>
            }
          />
          {/* 5. Availability Calendar */}
          <Route
            path="/partner/availability"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerAvailabilityPage />
              </RequireAuth>
            }
          />
          {/* 6. My Sessions / Bookings */}
          <Route
            path="/partner/bookings"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerBookingsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/partner/sessions"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerBookingsPage />
              </RequireAuth>
            }
          />
          {/* 7. Chat & Messages */}
          <Route
            path="/partner/messages"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerMessagesPage />
              </RequireAuth>
            }
          />
          {/* 8. Audio Sessions */}
          <Route
            path="/partner/audio-sessions"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerAudioSessionsPage />
              </RequireAuth>
            }
          />
          {/* 9. Video Sessions */}
          <Route
            path="/partner/video-sessions"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerVideoSessionsPage />
              </RequireAuth>
            }
          />
          {/* 10. Live Streaming */}
          <Route
            path="/partner/live"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerLiveStreamingPage />
              </RequireAuth>
            }
          />
          {/* 11. Group Workshops */}
          <Route
            path="/partner/workshops"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerWorkshopsPage />
              </RequireAuth>
            }
          />
          {/* 12. My Earnings */}
          <Route
            path="/partner/earnings"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerEarningsPage />
              </RequireAuth>
            }
          />
          {/* 13. Wallet */}
          <Route
            path="/partner/wallet"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerWalletPage />
              </RequireAuth>
            }
          />
          {/* 14. Withdrawals */}
          <Route
            path="/partner/withdrawals"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerWithdrawalsPage />
              </RequireAuth>
            }
          />
          {/* 15. Rank & Performance */}
          <Route
            path="/partner/rank"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerRankPage />
              </RequireAuth>
            }
          />
          {/* 16. Bonuses & Rewards */}
          <Route
            path="/partner/bonuses"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerBonusesPage />
              </RequireAuth>
            }
          />
          {/* 17. Reviews & Ratings */}
          <Route
            path="/partner/reviews"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerReviewsPage />
              </RequireAuth>
            }
          />
          {/* 18. Notifications */}
          <Route
            path="/partner/notifications"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerNotificationsPage />
              </RequireAuth>
            }
          />
          {/* 19. Help & Support */}
          <Route
            path="/partner/support"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerSupportPage />
              </RequireAuth>
            }
          />
          {/* 20. Settings */}
          <Route
            path="/partner/settings"
            element={
              <RequireAuth role="maanmitra_partner">
                <PartnerSettingsPage />
              </RequireAuth>
            }
          />

          {/* ================= USER WEB PORTAL ================= */}
          <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
          <Route path="/user/subscribe" element={
            <RequireAuth role="user" allowPending={true}>
              <UserSubscriptionPage />
            </RequireAuth>
          } />
          <Route path="/user/dashboard" element={
            <RequireAuth role="user">
              <UserDashboardPage />
            </RequireAuth>
          } />
          <Route path="/user/discover" element={
            <RequireAuth role="user">
              <UserDiscoverPage />
            </RequireAuth>
          } />
          <Route path="/user/matches" element={
            <RequireAuth role="user">
              <UserMatchesPage />
            </RequireAuth>
          } />
          <Route path="/user/chat/:matchId" element={
            <RequireAuth role="user">
              <UserMatchChatPage />
            </RequireAuth>
          } />
          <Route path="/user/content" element={
            <RequireAuth role="user">
              <UserContentPage />
            </RequireAuth>
          } />
          <Route path="/user/ai" element={
            <RequireAuth role="user">
              <UserAIPage />
            </RequireAuth>
          } />
          <Route path="/user/profile" element={
            <RequireAuth role="user">
              <UserProfilePage />
            </RequireAuth>
          } />
          <Route path="/user/subscription" element={
            <RequireAuth role="user">
              <UserSubscriptionStatusPage />
            </RequireAuth>
          } />
          <Route path="/user/wallet" element={
            <RequireAuth role="user">
              <UserWalletPage />
            </RequireAuth>
          } />
          <Route path="/user/sessions" element={
            <RequireAuth role="user">
              <UserSessionsPage />
            </RequireAuth>
          } />

          {/* ================= LIVE COMMUNICATION ROOM ================= */}
          <Route
            path="/call/:bookingId"
            element={
              <RequireAuth>
                <LiveCallPage />
              </RequireAuth>
            }
          />
          <Route
            path="/session/:sessionId"
            element={
              <RequireAuth>
                <LiveCallPage />
              </RequireAuth>
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  </AuthProvider>
);
}
