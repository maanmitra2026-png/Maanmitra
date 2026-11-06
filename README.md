# MAANMITRA — A Listening Friend, Always With You
*Complete Full-Stack Responsive Web Application*

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-4A154B?style=flat-square&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Uvicorn-E91E63?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![WebSockets](https://img.shields.io/badge/Real--Time-WebSockets%20%2B%20WebRTC-4A154B?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay%20Verified-0080FF?style=flat-square)](https://razorpay.com/)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue?style=flat-square&logo=python)](https://python.org/)
[![Tests](https://img.shields.io/badge/Tests-Pytest%20Passing%20(7%2F7)-success?style=flat-square)](backend/tests/test_maanmitra_workflows.py)

---

## 🌟 Executive Summary

**MAANMITRA** is a modern, premium, responsive **web application** engineered to connect users with registered, verified female companions called **Maanmitra Partners** for friendly conversations through real-time text chat, audio calls, and video calls.

The platform is designed strictly as a **responsive web application** (HTML/React/FastAPI) that dynamically adapts between **Desktop Web** (with dedicated sidebars, analytics charts, and data tables) and **Mobile Web** (compact headers, touch cards, and bottom navigation), closely recreating the reference mobile visual design without any native mobile app dependencies.

---

## 🎭 The Exactly Three Primary Roles

The platform enforces strict role-based access control (RBAC) across exactly three primary roles:

1. **Admin** (`role: admin`)
   - Platform health, statistics, and revenue tracking.
   - User account management (search, suspend, activate).
   - Partner application review (verify KYC documents, approve, reject with reason, suspend).
   - Booking supervision (schedule, mode, payment status).
   - Financial ledger (gross revenue, platform commission cut 20%, partner payout tracking).
   - Settings & packages configuration.

2. **Maanmitra Partner** (`role: maanmitra_partner`)
   - Dedicated partner registration and identity verification workflow (Aadhaar, PAN, Driving License).
   - Real-time application approval status tracking.
   - Interactive Partner Dashboard with live **Online/Offline presence toggle**.
   - Availability slot management (weekdays, timings, communication modes).
   - Booking management (incoming requests, accept, reject, start paid session).
   - Live conversation console (WebRTC audio/video calls with picture-in-picture local preview, mic/cam mute, and in-call messaging).
   - Net earnings breakdown, commission explanations, and transaction history.

3. **User** (`role: user`)
   - Registration & authentication with terms consent.
   - Browse verified companions with live search and filters (*Online Now, Popular, Languages, Communication Mode*).
   - Detailed Partner Profile (bio, verified badge, spoken languages, ratings, reviews, rate cards).
   - Configurable package selection (15-min chat, 30-min audio call, 30-min video call, extended talk).
   - Secure Razorpay payment checkout with test simulation and instant backend verification.
   - Real-time communication interface (video, audio, text chat).
   - Dashboard (upcoming sessions, past conversations, payments, profile settings).

---

## 🎨 Brand Identity & Design System

The application incorporates the official brand colors consistently across all screens:

| Color Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Deep Plum** | `#4A154B` | Primary headers, desktop sidebars, brand logo, dark splash backdrops |
| **Romantic Rose** | `#E91E63` | Primary CTA buttons, action pills, active highlights, badges |
| **Soft Blush** | `#FFF1F5` | Canvas background, card containers, subtle borders |
| **Champagne Gold**| `#D4AF77` | Logo accent strokes, luxury badges, premium highlights |
| **White** | `#FFFFFF` | Content cards, data tables, contrast surfaces |
| **Success Green** | `#22A447` | Online presence indicator, captured payments |
| **Warning Amber** | `#F59E0B` | Pending verification, under-review statuses |
| **Error Red** | `#DC2626` | Rejections, suspensions, end-call buttons |

---

## 📱 Responsive Architecture & 24-Screen Reference Flow

The web application natively includes three interactive view modes:

1. **Desktop Web Mode**:
   - Authenticated portals feature a sleek **Deep Plum left sidebar** (`.mm-desktop-sidebar`) with quick route links, active rose highlights, user card, and logout.
   - Main content displays high-density analytics cards, revenue trend charts, and styled data tables (`.mm-data-table`).
   - Public pages provide a clean top navbar with hero CTAs.

2. **Mobile Web Mode**:
   - Seamlessly accessible at mobile screen widths (< 768px) or via the built-in 390px device preview frame.
   - Features compact sticky headers, filter chip carousels, responsive cards, and an interactive **mobile bottom navigation bar** (`.mm-bottom-nav`).

3. **Visual 24-Screen Flow Poster**:
   - Direct reproduction of the 3-column reference design poster:
     - **Admin Journey** (8 Screens): Splash Screen → Admin Login → Dashboard → Manage Partners → Manage Users → Manage Bookings → Payments & Reports → Settings
     - **Partner Journey** (8 Screens): Welcome → Registration → Document Verification → Approval Status → Partner Login → Partner Dashboard → My Bookings → Chat/Call Screen
     - **User Journey** (8 Screens): Welcome → Registration → Browse Partners → Partner Profile → Select Package → Payment → Live Chat/Call → User Dashboard
   - Click any screen card to instantly launch and test that screen interactively.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18+ with Vite 6
- **Typography & Icons**: DM Sans, Outfit, Lucide React icons
- **Styling**: Vanilla CSS Design System (`frontend/src/maanmitra_theme.css`) with tokens, responsive media queries, and flex/grid layouts.
- **Media & Communication**: WebRTC signaling integration + live camera/mic preview + WebSockets.

### Backend
- **Framework**: Python 3.11 with FastAPI & Uvicorn
- **Database ORM**: SQLAlchemy 2.0 with PostgreSQL / SQLite support
- **Authentication**: JWT (`python-jose`) with bcrypt password hashing
- **Payments**: Razorpay gateway service with order creation, signature verification, and webhook handling
- **Real-Time**: FastAPI WebSockets for live chat fan-out and WebRTC signaling exchange

---

## 🗄️ Database Schema (`backend/app/maanmitra_models.py`)

1. `mm_users`: User identity, authentication, role (`admin`, `maanmitra_partner`, `user`), status (`active`, `suspended`).
2. `mm_partner_profiles`: Companion bio, spoken languages, approval status, rating average, review count, rates.
3. `mm_partner_verification_documents`: Submitted KYC documents (Aadhaar, PAN, Driving License) and review notes.
4. `mm_partner_availability`: Configured weekly time slots and communication modes.
5. `mm_packages`: Configurable conversation tiers (duration, communication type, price in INR).
6. `mm_bookings`: Booking records with double-booking concurrency checks and authoritative pricing.
7. `mm_payments`: Razorpay transaction records (order ID, payment ID, signature, status).
8. `mm_conversations` & `mm_messages`: Real-time session and text logs.
9. `mm_reviews`: Verified reviews from completed sessions.
10. `mm_partner_earnings`: Ledger recording gross amount, platform commission (20%), and net partner earnings.
11. `mm_notifications`: In-app notification queue.
12. `mm_reports` & `mm_blocked_users`: Trust and safety enforcement.
13. `mm_audit_logs`: Administrative action tracking.
14. `mm_system_settings`: Platform parameters and commission percentages.

---

## 🧪 Automated Testing

All workflows are covered by comprehensive pytest integration tests in `backend/tests/test_maanmitra_workflows.py`:

```bash
cd backend
pytest tests/test_maanmitra_workflows.py -v
```

**Test Coverage Highlights:**
- ✅ Admin login and dashboard statistics retrieval
- ✅ User registration and approved partner directory filtering
- ✅ Partner registration, KYC document submission, and admin approval lifecycle
- ✅ Booking creation, Razorpay order payment verification, and **double-booking prevention** (409 Conflict)
- ✅ Matching logic and compatibility algorithms (7 of 7 tests passing)

---

## 🚀 Running Locally

### 1. Backend Server
```powershell
cd backend
# Activate virtual environment
..\.venv\Scripts\Activate.ps1
# Run FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Documentation (Swagger): `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/api/health`

### 2. Frontend Web Application
```powershell
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

### Demo Credentials
- **Admin**: `admin@maanmitra.com` / `Admin@12345`
- **Partner**: `priya@example.com` / `Partner@12345`
- **User**: `amit@example.com` / `User@12345`
*(Or use the quick 1-click Role Switcher buttons in the top header)*
