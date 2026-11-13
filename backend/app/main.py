from datetime import datetime, timedelta, date
from typing import Optional, List
import os, uuid, shutil, hmac, hashlib, json
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import bcrypt
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from sqlalchemy import create_engine, String, Integer, Boolean, DateTime, Date, Text, ForeignKey, UniqueConstraint, func, Float
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, sessionmaker, Session

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parent.parent / ".env")
    load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")
except ImportError:
    pass

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
_root_db = ROOT_DIR / "living_relationships.db"
_local_db = Path("living_relationships.db").resolve()
_default_sqlite = _root_db if _root_db.exists() else _local_db
_default_db_url = f"sqlite:///{_default_sqlite.as_posix()}"

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = _default_db_url
elif DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
elif DATABASE_URL.startswith("sqlite:///./") and not Path(DATABASE_URL.replace("sqlite:///./", "")).exists() and _root_db.exists():
    DATABASE_URL = f"sqlite:///{_root_db.as_posix()}"

JWT_SECRET = os.getenv("JWT_SECRET", "change-this-development-secret-before-deployment")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = int(os.getenv("ACCESS_TOKEN_MINUTES", "720"))
_default_uploads = ROOT_DIR / "uploads" if (ROOT_DIR / "uploads").exists() else Path("./uploads").resolve()
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", str(_default_uploads))).resolve()
MAX_UPLOAD_BYTES = 5 * 1024 * 1024
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
class Base(DeclarativeBase): pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(32), nullable=True, unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(120))
    username: Mapped[str] = mapped_column(String(60), unique=True, index=True)
    date_of_birth: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    gender: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)
    location: Mapped[str] = mapped_column(String(120), default="Pune, India")
    bio: Mapped[str] = mapped_column(String(500), default="")
    avatar_url: Mapped[str] = mapped_column(String(500), default="")
    interests: Mapped[str] = mapped_column(Text, default="travel,fitness,food")
    relationship_goal: Mapped[str] = mapped_column(String(100), default="Meaningful relationship")
    discoverable: Mapped[bool] = mapped_column(Boolean, default=True)
    show_age: Mapped[bool] = mapped_column(Boolean, default=True)
    show_online: Mapped[bool] = mapped_column(Boolean, default=True)
    role: Mapped[str] = mapped_column(String(20), default="user")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Connection(Base):
    __tablename__ = "connections"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    requester_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    receiver_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    __table_args__ = (UniqueConstraint("requester_id", "receiver_id", name="uq_connection_pair"),)

class Block(Base):
    __tablename__ = "blocks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    blocker_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    blocked_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    __table_args__ = (UniqueConstraint("blocker_id", "blocked_id", name="uq_block_pair"),)

class Report(Base):
    __tablename__ = "reports"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    reporter_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    reported_user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    reason: Mapped[str] = mapped_column(String(80))
    details: Mapped[str] = mapped_column(String(1000), default="")
    status: Mapped[str] = mapped_column(String(20), default="open")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    receiver_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    body: Mapped[str] = mapped_column(String(4000))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    body: Mapped[str] = mapped_column(String(2000))
    image_url: Mapped[str] = mapped_column(String(500), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

class PostLike(Base):
    __tablename__ = "post_likes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    __table_args__ = (UniqueConstraint("post_id", "user_id", name="uq_post_like"),)

class Comment(Base):
    __tablename__ = "comments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    body: Mapped[str] = mapped_column(String(1000))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class WellnessCheckin(Base):
    __tablename__ = "wellness_checkins"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    mood: Mapped[str] = mapped_column(String(30))
    note: Mapped[str] = mapped_column(String(500), default="")
    water_glasses: Mapped[int] = mapped_column(Integer, default=0)
    movement_minutes: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

class Meal(Base):
    __tablename__ = "meals"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    meal_date: Mapped[date] = mapped_column(Date, default=date.today, index=True)
    meal_type: Mapped[str] = mapped_column(String(30))
    name: Mapped[str] = mapped_column(String(150))
    calories: Mapped[int] = mapped_column(Integer, default=0)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)

class HealthReport(Base):
    __tablename__ = "health_reports"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    original_name: Mapped[str] = mapped_column(String(255))
    stored_name: Mapped[str] = mapped_column(String(255), unique=True)
    content_type: Mapped[str] = mapped_column(String(100))
    size_bytes: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class TravelPlan(Base):
    __tablename__ = "travel_plans"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    destination: Mapped[str] = mapped_column(String(150))
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    budget: Mapped[int] = mapped_column(Integer, default=0)
    interests: Mapped[str] = mapped_column(String(500), default="")
    notes: Mapped[str] = mapped_column(String(1000), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Appointment(Base):
    __tablename__ = "appointments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    counsellor_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    counsellor_name: Mapped[str] = mapped_column(String(150))
    category: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, default="relationship")
    support_topic: Mapped[Optional[str]] = mapped_column(String(200), nullable=True, default="")
    appointment_date: Mapped[date] = mapped_column(Date)
    time_slot: Mapped[str] = mapped_column(String(30))
    mode: Mapped[str] = mapped_column(String(20), default="video")
    status: Mapped[str] = mapped_column(String(20), default="pending")
    user_notes: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True, default="")
    counsellor_notes: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class CounsellingCategory(Base):
    __tablename__ = "counselling_categories"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(String(500))
    icon: Mapped[str] = mapped_column(String(50), default="Heart")
    badge: Mapped[str] = mapped_column(String(50), default="")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

class Counsellor(Base):
    __tablename__ = "counsellors"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(150))
    title: Mapped[str] = mapped_column(String(150), default="Certified Counselling Psychologist")
    qualification: Mapped[str] = mapped_column(String(200))
    experience_years: Mapped[int] = mapped_column(Integer, default=5)
    license_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    bio: Mapped[str] = mapped_column(Text, default="")
    avatar_url: Mapped[str] = mapped_column(String(500), default="")
    primary_category: Mapped[str] = mapped_column(String(50), default="relationship")
    categories: Mapped[str] = mapped_column(String(500), default="relationship,personal,emotional")
    languages: Mapped[str] = mapped_column(String(200), default="English,Hindi")
    fee_inr: Mapped[int] = mapped_column(Integer, default=1000)
    included_with_premium: Mapped[bool] = mapped_column(Boolean, default=True)
    cancellation_terms: Mapped[str] = mapped_column(String(300), default="Free cancellation or rescheduling up to 4 hours before session.")
    scope_of_practice: Mapped[str] = mapped_column(String(500), default="Interpersonal relationships, emotional wellbeing, conflict mediation, and personal clarity.")
    verification_status: Mapped[str] = mapped_column(String(50), default="Approved")  # Application Submitted, Under Review, Approved, Additional Information Required, Not Approved
    verified: Mapped[bool] = mapped_column(Boolean, default=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    collaboration_agreed: Mapped[bool] = mapped_column(Boolean, default=True)
    rating: Mapped[float] = mapped_column(Float, default=4.9)
    reviews_count: Mapped[int] = mapped_column(Integer, default=28)
    available_days: Mapped[str] = mapped_column(String(100), default="Mon,Tue,Wed,Thu,Fri,Sat")
    time_slots: Mapped[str] = mapped_column(String(300), default="10:00 AM, 11:30 AM, 02:00 PM, 04:00 PM, 06:30 PM")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SupportTicket(Base):
    __tablename__ = "support_tickets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    subject: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(50), default="technical")
    details: Mapped[str] = mapped_column(String(2000))
    status: Mapped[str] = mapped_column(String(20), default="open")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class PartnerApplication(Base):
    __tablename__ = "partner_applications"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(150))
    email: Mapped[str] = mapped_column(String(255), index=True)
    mobile_number: Mapped[str] = mapped_column(String(32))
    partner_category: Mapped[str] = mapped_column(String(100))
    qualification: Mapped[str] = mapped_column(String(255))
    experience_years: Mapped[str] = mapped_column(String(50))
    city: Mapped[str] = mapped_column(String(100))
    introduction: Mapped[str] = mapped_column(String(2000), default="")
    consent: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[str] = mapped_column(String(50), default="Under Review")
    application_code: Mapped[str] = mapped_column(String(50), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

import json
from fastapi import Request
from app.subscription_models import (
    SubscriptionPlan,
    UserSubscription,
    PaymentTransaction,
    ContentItem,
    DailyUsageTracking,
    SystemConfig
)
from app.entitlements import SubscriptionEntitlementService, get_system_config
from app.payment_service import PaymentGatewayService
from app.maanmitra_models import MaanmitraBase, ensure_maanmitra_schema_upgrades
from app.maanmitra_router import router as maanmitra_router
from app.maanmitra_seed import seed_maanmitra_data

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
app = FastAPI(title="MANMITRA API", version="1.0.0", description="Full-stack API for MANMITRA — Connect Hearts, Live Together")
cors_origins_env = os.getenv("CORS_ORIGINS", "")
if not cors_origins_env or cors_origins_env.strip() == "*":
    origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000"
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_origin_regex=r"https?://.*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    origins = [x.strip() for x in cors_origins_env.split(",") if x.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_origin_regex=r"https?://.*\.onrender\.com",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
app.include_router(maanmitra_router)


class ChatConnectionManager:
    """In-process WebSocket fan-out. PostgreSQL remains the durable message store."""
    def __init__(self):
        self.active: dict[int, set[WebSocket]] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active.setdefault(user_id, set()).add(websocket)

    def disconnect(self, user_id: int, websocket: WebSocket):
        sockets = self.active.get(user_id)
        if sockets:
            sockets.discard(websocket)
            if not sockets:
                self.active.pop(user_id, None)

    async def send_user(self, user_id: int, payload: dict):
        dead = []
        for socket in list(self.active.get(user_id, set())):
            try:
                await socket.send_json(payload)
            except Exception:
                dead.append(socket)
        for socket in dead:
            self.disconnect(user_id, socket)


chat_manager = ChatConnectionManager()

class RegisterIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=8, max_length=128)
    username: str = Field(min_length=3, max_length=60, pattern=r"^[a-zA-Z0-9_.-]+$")
    phone: Optional[str] = Field(default=None, max_length=32)
    date_of_birth: date
    gender: Optional[str] = None
    location: str = "Pune, India"
    terms_accepted: bool = False

class LoginIn(BaseModel): email: str = Field(min_length=3, max_length=255); password: str
class ProfileIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    username: str = Field(min_length=3, max_length=60, pattern=r"^[a-zA-Z0-9_.-]+$")
    bio: str = Field(default="", max_length=500)
    location: str = Field(default="Pune, India", max_length=120)
    interests: List[str] = Field(default_factory=list, max_length=30)
    relationship_goal: str = Field(default="Meaningful relationship", max_length=100)
    discoverable: bool = True
    show_age: bool = True
    show_online: bool = True
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
class MessageIn(BaseModel): body: str = Field(min_length=1, max_length=4000)
class PostIn(BaseModel): body: str = Field(min_length=1, max_length=2000); image_url: str = Field(default="", max_length=500)
class CommentIn(BaseModel): body: str = Field(min_length=1, max_length=1000)
class ReportIn(BaseModel): reason: str = Field(min_length=3, max_length=80); details: str = Field(default="", max_length=1000)
class WellnessIn(BaseModel): mood: str = Field(min_length=1, max_length=30); note: str = Field(default="", max_length=500); water_glasses: int = Field(default=0, ge=0, le=30); movement_minutes: int = Field(default=0, ge=0, le=1440)
class MealIn(BaseModel): meal_date: date = Field(default_factory=date.today); meal_type: str = Field(min_length=2, max_length=30); name: str = Field(min_length=2, max_length=150); calories: int = Field(ge=0, le=10000); completed: bool = False
class TravelIn(BaseModel): destination: str = Field(min_length=2, max_length=150); start_date: Optional[date] = None; end_date: Optional[date] = None; budget: int = Field(default=0, ge=0, le=100000000); interests: str = Field(default="", max_length=500); notes: str = Field(default="", max_length=1000)
class AppointmentIn(BaseModel):
    counsellor_name: str = Field(min_length=2, max_length=150)
    appointment_date: date
    time_slot: str = Field(min_length=3, max_length=30)
    mode: str = "video"
    category: Optional[str] = "relationship"
    support_topic: Optional[str] = ""
    user_notes: Optional[str] = ""
    counsellor_id: Optional[int] = None

class CounsellorApplicationIn(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    title: str = Field(default="Counselling Professional", max_length=150)
    qualification: str = Field(min_length=2, max_length=200)
    experience_years: int = Field(ge=0, le=60)
    license_number: Optional[str] = Field(default=None, max_length=100)
    bio: str = Field(min_length=10, max_length=2000)
    primary_category: str = Field(default="relationship", max_length=50)
    categories: List[str] = Field(default_factory=lambda: ["relationship", "personal"])
    languages: List[str] = Field(default_factory=lambda: ["English", "Hindi"])
    fee_inr: int = Field(default=1000, ge=0, le=100000)
    cancellation_terms: Optional[str] = Field(default="Free cancellation or rescheduling up to 4 hours before the session.", max_length=300)
    scope_of_practice: str = Field(min_length=5, max_length=500)
    available_days: List[str] = Field(default_factory=lambda: ["Mon", "Tue", "Wed", "Thu", "Fri"])
    time_slots: List[str] = Field(default_factory=lambda: ["10:00 AM", "02:00 PM", "04:30 PM", "06:00 PM"])
    avatar_url: Optional[str] = Field(default="", max_length=500)
    collaboration_agreed: bool = Field(default=True)

class CounsellorStatusUpdate(BaseModel):
    verification_status: str = Field(..., pattern="^(Application Submitted|Under Review|Approved|Additional Information Required|Not Approved)$")
    note: Optional[str] = ""

class CounsellorAppointmentUpdate(BaseModel):
    status: str = Field(..., pattern="^(requested|confirmed|scheduled|completed|cancelled)$")
    counsellor_notes: Optional[str] = Field(default="", max_length=2000)

class PartnerApplicationIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    mobile_number: str = Field(min_length=8, max_length=20)
    partner_category: str = Field(min_length=2, max_length=100)
    qualification: str = Field(min_length=2, max_length=255)
    experience_years: str = Field(min_length=1, max_length=50)
    city: str = Field(min_length=2, max_length=100)
    introduction: Optional[str] = Field(default="", max_length=1000)
    consent: bool = True

class CategoryCreateIn(BaseModel):
    slug: str = Field(min_length=2, max_length=50)
    title: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=5, max_length=500)
    icon: Optional[str] = "Heart"
    badge: Optional[str] = ""
    is_active: bool = True
    sort_order: int = 0

class GuidanceReflectIn(BaseModel):
    category: str = Field(default="relationship", max_length=50)
    topic: str = Field(min_length=2, max_length=150)
    user_reflection: str = Field(min_length=3, max_length=1000)

class TicketIn(BaseModel): subject: str = Field(min_length=3, max_length=200); category: str = Field(default="technical", max_length=50); details: str = Field(min_length=3, max_length=2000)
class PrivacyIn(BaseModel): discoverable: bool; show_age: bool; show_online: bool
class CheckoutIn(BaseModel): plan_code: str = Field(..., pattern="^(BASIC|PREMIUM)$")
class VerifyIn(BaseModel): razorpay_order_id: str; razorpay_payment_id: str; razorpay_signature: str
class AiGuidanceIn(BaseModel): topic: str = Field(default="general", max_length=100); query: str = Field(min_length=3, max_length=1000); partner_interests: Optional[str] = Field(default="", max_length=500)
class ContentIn(BaseModel): title: str = Field(min_length=3, max_length=255); category: str = Field(default="relationship_guidance", max_length=50); access_level: str = Field(default="FREE", pattern="^(FREE|PREMIUM)$"); summary: str = Field(min_length=5, max_length=500); body: str = Field(min_length=10); image_url: str = Field(default="", max_length=500); author_name: str = Field(default="MANMITRA Editorial", max_length=120); read_time_minutes: int = Field(default=5, ge=1, le=120)
class ConfigUpdateIn(BaseModel): basic_daily_message_limit: Optional[int] = Field(default=None, ge=1, le=1000); premium_daily_message_limit: Optional[int] = Field(default=None, ge=1, le=5000); basic_ai_daily_limit: Optional[int] = Field(default=None, ge=1, le=100); premium_ai_daily_limit: Optional[int] = Field(default=None, ge=1, le=1000); premium_included_counselling_monthly: Optional[int] = Field(default=None, ge=0, le=10)

# Pydantic response helpers keep phone/email out of public discovery responses.
def user_public(u: User, viewer_id: Optional[int] = None):
    age = None
    if u.date_of_birth and u.show_age:
        today = date.today(); age = today.year-u.date_of_birth.year-((today.month,today.day)<(u.date_of_birth.month,u.date_of_birth.day))
    return {"id":u.id,"full_name":u.full_name,"username":u.username,"age":age,"gender":u.gender,"location":u.location,"bio":u.bio,"avatar_url":u.avatar_url,"interests":[x.strip() for x in u.interests.split(",") if x.strip()],"relationship_goal":u.relationship_goal,"show_online":u.show_online,"created_at":u.created_at.isoformat()}
def user_private(u: User):
    d=user_public(u,u.id); d.update({"email":u.email,"phone":u.phone,"date_of_birth":u.date_of_birth.isoformat() if u.date_of_birth else None,"discoverable":u.discoverable,"show_age":u.show_age,"role":u.role}); return d

def get_db():
    db=SessionLocal()
    try: yield db
    finally: db.close()
def is_adult(dob: date) -> bool:
    today = date.today()
    age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    return age >= 18
def hash_password(password: str) -> str:
    pwd_bytes = password.encode("utf-8")[:72]
    return bcrypt.hashpw(pwd_bytes, bcrypt.gensalt()).decode("utf-8")
def verify_password(password: str, hashed: str) -> bool:
    try:
        pwd_bytes = password.encode("utf-8")[:72]
        hash_bytes = hashed.encode("utf-8")
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception:
        return False
def create_token(user_id: int, role: str):
    now=datetime.utcnow(); return jwt.encode({"sub":str(user_id),"role":role,"iat":now,"exp":now+timedelta(minutes=ACCESS_TOKEN_MINUTES)},JWT_SECRET,algorithm=JWT_ALGORITHM)
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    error=HTTPException(status_code=401, detail="Invalid or expired authentication token", headers={"WWW-Authenticate":"Bearer"})
    try:
        payload=jwt.decode(token,JWT_SECRET,algorithms=[JWT_ALGORITHM]); user_id=int(payload.get("sub"))
    except (JWTError, TypeError, ValueError): raise error
    user=db.get(User,user_id)
    if not user or not user.is_active: raise error
    return user
def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin": raise HTTPException(403,"Administrator access required")
    return user
def connected(db: Session, a: int, b: int) -> bool:
    return db.query(Connection).filter(Connection.status=="accepted", ((Connection.requester_id==a)&(Connection.receiver_id==b))|((Connection.requester_id==b)&(Connection.receiver_id==a))).first() is not None
def blocked(db: Session, a: int, b: int) -> bool:
    return db.query(Block).filter(((Block.blocker_id==a)&(Block.blocked_id==b))|((Block.blocker_id==b)&(Block.blocked_id==a))).first() is not None
def safe_user(db: Session, user_id: int):
    u=db.get(User,user_id)
    if not u: raise HTTPException(404,"User not found")
    return u

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    MaanmitraBase.metadata.create_all(bind=engine)
    ensure_maanmitra_schema_upgrades(engine)
    db=SessionLocal()
    try:
        seed_maanmitra_data(db)
        # 1. Ensure system admin account exists
        if db.query(User).filter_by(role="admin").count()==0:
            admin_email=os.getenv("ADMIN_EMAIL", "admin@livingrelationships.test")
            admin_pwd=os.getenv("ADMIN_PASSWORD", "Admin!2026Secure")
            admin=User(email=admin_email,password_hash=hash_password(admin_pwd),full_name="System Administrator",username="admin",location="Pune, India",role="admin",discoverable=False,show_online=False)
            db.add(admin)
            db.commit()

        # 2. Seed the EXACT TWO subscription plans
        if db.query(SubscriptionPlan).count() == 0:
            basic_config = {
                "tagline": "Affordable matchmaking & daily communication",
                "message_limit_daily": 20,
                "ai_limit_daily": 5,
                "calling_enabled": False,
                "counselling_sessions_included": 0,
                "premium_content": False,
                "highlights": [
                    "Full profile creation & verified discovery",
                    "Mutual connection matching requests",
                    "Up to 20 text messages/day with accepted connections",
                    "Access to all FREE relationship & astrology guides",
                    "Basic AI relationship reflection & communication tips",
                    "Private health & travel planners included"
                ]
            }
            premium_config = {
                "tagline": "Advanced relationship guidance, calling & personal counselling",
                "message_limit_daily": 200,
                "ai_limit_daily": 50,
                "calling_enabled": True,
                "counselling_sessions_included": 1,
                "premium_content": True,
                "highlights": [
                    "Everything in MANMITRA Basic",
                    "Enhanced compatibility analysis & deep matching insights",
                    "High allowance: 200 text messages/day",
                    "Voice & Video calling between mutual connections",
                    "1 Personal Counselling session/month with verified experts",
                    "Exclusive PREMIUM astrology, horoscopes & intimacy guides",
                    "Advanced AI emotional guidance & tailored advice",
                    "Priority verified support & badge"
                ]
            }
            plan_basic = SubscriptionPlan(
                code="BASIC",
                name="MANMITRA Basic",
                amount_inr=499,
                billing_period="monthly",
                feature_configuration=json.dumps(basic_config),
                is_active=True
            )
            plan_premium = SubscriptionPlan(
                code="PREMIUM",
                name="MANMITRA Premium",
                amount_inr=999,
                billing_period="monthly",
                feature_configuration=json.dumps(premium_config),
                is_active=True
            )
            db.add_all([plan_basic, plan_premium])
            db.commit()

        # 3. Seed Default System Configs for limits
        default_configs = [
            ("BASIC_DAILY_MESSAGE_LIMIT", "20", "Daily text message allowance for Basic members"),
            ("PREMIUM_DAILY_MESSAGE_LIMIT", "200", "Daily text message allowance for Premium members"),
            ("BASIC_AI_DAILY_LIMIT", "5", "Daily AI queries for Basic members"),
            ("PREMIUM_AI_DAILY_LIMIT", "50", "Daily AI queries for Premium members"),
            ("PREMIUM_INCLUDED_COUNSELLING_MONTHLY", "1", "Monthly included counselling sessions for Premium members")
        ]
        for k, v, desc in default_configs:
            if not db.query(SystemConfig).filter_by(key=k).first():
                db.add(SystemConfig(key=k, value=v, description=desc))
        db.commit()

        # 4. Seed initial Educational Content Items (FREE and PREMIUM)
        if db.query(ContentItem).count() == 0:
            c1 = ContentItem(
                title="The Astrological Blueprint of Live-in Compatibility",
                category="astrology",
                access_level="FREE",
                summary="Explore how planetary placements, Moon signs, and the 7th & 11th houses influence emotional harmony, cohabitation habits, and daily conflict resolution.",
                body="In Vedic astrology, cohabitation reflects the intersection of the 4th house (the domestic sanctuary) and the 7th house (committed partnership). Understanding each other's Moon signs provides profound insights into domestic rhythms—how you process stress, how you seek comfort at the end of a long workday, and how you share space gracefully. When both partners recognize their astrological tendencies, mundane conflicts around schedules or personal space evolve into opportunities for mutual respect and emotional grounding.",
                author_name="Pandit Arvind Joshi",
                read_time_minutes=6,
                is_published=True
            )
            c2 = ContentItem(
                title="5 Healthy Boundaries to Establish Before Moving In Together",
                category="relationship_guidance",
                access_level="FREE",
                summary="A practical framework for couples transitioning from dating to living together in contemporary Indian urban life.",
                body="Moving in together is both a deeply romantic milestone and an operational partnership. Before unpacking the boxes, conscious couples must establish clear agreements in five vital areas: (1) Financial clarity on shared vs individual expenses, (2) Solitude and personal unwinding rituals, (3) Division of domestic routines, (4) Navigating social circles and family visits, and (5) A proactive protocol for taking emotional time-outs during heated discussions.",
                author_name="Dr. Meera Kulkarni",
                read_time_minutes=5,
                is_published=True
            )
            c3 = ContentItem(
                title="Navamsha (D9) Chart Deep-Dive: Karmic Bonds & Cohabitation",
                category="astrology",
                access_level="PREMIUM",
                summary="An advanced astrological masterclass on analyzing your D9 chart to forecast long-term domestic compatibility and karmic partnership growth.",
                body="While the Rashi (D1) chart illustrates initial attraction, magnetic chemistry, and outward social alignment, the Navamsha (D9) chart reveals the enduring soul contract of two individuals living under one roof. In this comprehensive masterclass, we explore the placement of the D9 7th lord, the influence of Venus and Jupiter across the divisional houses, and how cohabitation activates latent planetary periods (Dashas). Learn how to identify karmic lessons and channel astrological insights to build lasting harmony.",
                author_name="Pandit Arvind Joshi",
                read_time_minutes=10,
                is_published=True
            )
            c4 = ContentItem(
                title="Intimacy & De-escalation Masterclass: The 4-Step Communication Reset",
                category="relationship_guidance",
                access_level="PREMIUM",
                summary="Clinical techniques from leading relationship therapists to navigate financial stress, family expectations, and emotional exhaustion without losing connection.",
                body="Cohabiting couples face micro-tensions daily. The 4-Step Communication Reset provides a structured, non-accusatory dialogue framework: (1) Acknowledge the emotional trigger without defensiveness, (2) Name the underlying unmet need rather than critiquing behavior, (3) Create a safe physiological pause to lower cortisol levels, and (4) Re-enter the conversation with a collaborative problem-solving mindset. Practiced consistently, this protocol transforms recurring friction into deeper intimacy and mutual trust.",
                author_name="Dr. Meera Kulkarni",
                read_time_minutes=8,
                is_published=True
            )
            db.add_all([c1, c2, c3, c4])
            db.commit()

        # 5. Seed Counselling Categories
        if db.query(CounsellingCategory).count() == 0:
            categories_data = [
                ("relationship", "Relationship Counselling", "For communication difficulties, relationship expectations, trust, boundaries, and understanding relationship challenges.", "HeartHandshake", "Primary Care", 1),
                ("personal", "Personal Guidance", "For self-understanding, confidence, personal growth, and decision-making support.", "Sparkles", "Self-Clarity", 2),
                ("emotional", "Emotional Support", "A respectful space for people seeking help understanding difficult situations and emotions.", "Heart", "Compassionate Space", 3),
                ("marriage_compat", "Marriage and Compatibility Guidance", "For relationship expectations, compatibility discussions, and preparation for important relationship decisions.", "Compass", "Cohabitation & Future", 4),
                ("family_comm", "Family and Communication Guidance", "For communication challenges and navigating interpersonal difficulties.", "Users", "Interpersonal Harmony", 5),
                ("professional", "Professional Guidance", "For users who need direction toward a suitably qualified professional.", "ShieldCheck", "Clinical Direction", 6),
                ("other", "Other Counselling Services", "A configurable category managed through the administration panel for specialized guidance inquiries.", "PlusCircle", "Configurable", 7)
            ]
            for slug, title, desc, icon, badge, sort_order in categories_data:
                db.add(CounsellingCategory(slug=slug, title=title, description=desc, icon=icon, badge=badge, sort_order=sort_order, is_active=True))
            db.commit()

        # 6. Seed Verified Counsellors
        if db.query(Counsellor).count() == 0:
            counsellors_data = [
                Counsellor(
                    name="Dr. Meera Kulkarni",
                    title="Senior Counseling Psychologist & Cohabitation Specialist",
                    qualification="Ph.D. in Clinical Psychology, M.Phil (NIMHANS)",
                    experience_years=10,
                    license_number="RCI-PSY-49182",
                    bio="Dr. Meera specializes in relational dynamics, premarital communication protocols, and constructive conflict resolution for individuals and modern couples navigating shared lives.",
                    avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
                    primary_category="relationship",
                    categories="relationship,emotional,marriage_compat,family_comm",
                    languages="English, Hindi, Marathi",
                    fee_inr=1200,
                    included_with_premium=True,
                    cancellation_terms="Free cancellation or rescheduling up to 4 hours before the session.",
                    scope_of_practice="Evidence-based interpersonal therapy, cognitive-behavioral communication, boundary definition, and compatibility facilitation. Non-prescriptive emotional guidance.",
                    verification_status="Approved",
                    verified=True,
                    is_active=True,
                    collaboration_agreed=True,
                    rating=4.9,
                    reviews_count=48,
                    available_days="Mon, Tue, Wed, Thu, Fri, Sat",
                    time_slots="10:00 AM, 11:30 AM, 02:00 PM, 04:00 PM, 06:30 PM"
                ),
                Counsellor(
                    name="Rohan Deshmukh",
                    title="Counseling Psychologist & Personal Guidance Coach",
                    qualification="M.A. Counseling Psychology, Certified REBT Practitioner",
                    experience_years=7,
                    license_number="ICF-PCC-88219",
                    bio="Rohan helps individuals build self-clarity, navigate major life transitions, manage emotional burnout, and build authentic confidence in personal and interpersonal settings.",
                    avatar_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
                    primary_category="personal",
                    categories="personal,emotional,professional",
                    languages="English, Hindi, Marathi",
                    fee_inr=900,
                    included_with_premium=True,
                    cancellation_terms="Free cancellation or rescheduling up to 4 hours before the session.",
                    scope_of_practice="Solution-focused personal reflection, stress regulation, emotional grounding, and assertive communication.",
                    verification_status="Approved",
                    verified=True,
                    is_active=True,
                    collaboration_agreed=True,
                    rating=4.8,
                    reviews_count=36,
                    available_days="Mon, Tue, Wed, Thu, Fri",
                    time_slots="11:00 AM, 01:00 PM, 03:30 PM, 05:00 PM, 07:00 PM"
                ),
                Counsellor(
                    name="Dr. Ananya Sen",
                    title="Family Systems & Marriage Guidance Consultant",
                    qualification="M.Phil Clinical Psychology, Certified Gottman Method Level 2",
                    experience_years=9,
                    license_number="RCI-PSY-61024",
                    bio="With extensive experience in marriage and compatibility guidance, Dr. Ananya helps partners explore realistic expectations, family boundaries, and emotional alignment.",
                    avatar_url="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
                    primary_category="marriage_compat",
                    categories="marriage_compat,family_comm,relationship",
                    languages="English, Hindi, Bengali",
                    fee_inr=1400,
                    included_with_premium=True,
                    cancellation_terms="Free cancellation or rescheduling up to 4 hours before the session.",
                    scope_of_practice="Premarital discernment, family boundary negotiation, systemic conflict resolution, and mutual values assessment.",
                    verification_status="Approved",
                    verified=True,
                    is_active=True,
                    collaboration_agreed=True,
                    rating=4.9,
                    reviews_count=52,
                    available_days="Tue, Wed, Thu, Fri, Sat",
                    time_slots="09:30 AM, 11:00 AM, 02:30 PM, 04:30 PM"
                ),
                Counsellor(
                    name="Dr. Rajesh Iyer",
                    title="Behavioral Scientist & Professional Guidance Advisor",
                    qualification="Ph.D. in Behavioral Sciences, M.Sc. Applied Psychology",
                    experience_years=12,
                    license_number="BPA-IND-3391",
                    bio="Dr. Rajesh specializes in helping people make informed life decisions, navigate interpersonal friction in professional and personal contexts, and connect with specialized clinical care when needed.",
                    avatar_url="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
                    primary_category="professional",
                    categories="professional,personal,other",
                    languages="English, Hindi, Tamil",
                    fee_inr=1100,
                    included_with_premium=True,
                    cancellation_terms="Free cancellation or rescheduling up to 4 hours before the session.",
                    scope_of_practice="Life direction triage, career-relationship balance, ethical direction, and clinical referral navigation.",
                    verification_status="Approved",
                    verified=True,
                    is_active=True,
                    collaboration_agreed=True,
                    rating=4.9,
                    reviews_count=41,
                    available_days="Mon, Wed, Fri, Sat",
                    time_slots="10:00 AM, 12:00 PM, 03:00 PM, 06:00 PM"
                )
            ]
            db.add_all(counsellors_data)
            db.commit()
    finally:
        db.close()

@app.get("/api/health")
def health(db: Session=Depends(get_db)):
    try: db.execute(__import__('sqlalchemy').text("SELECT 1"))
    except Exception as e: raise HTTPException(503,"Database is unavailable") from e
    return {"status":"ok","database":"connected","service":"manmitra-api"}

# Render health-check path (matches render.yaml healthCheckPath)
@app.get("/api/v1/health")
def health_v1(db: Session=Depends(get_db)):
    try: db.execute(__import__('sqlalchemy').text("SELECT 1"))
    except Exception as e: raise HTTPException(503,"Database is unavailable") from e
    import sys
    return {
        "status": "ok",
        "database": "connected",
        "service": "maanmitra-api",
        "python": sys.version.split()[0]
    }

@app.post("/api/auth/register", status_code=201)
def register(payload: RegisterIn, db: Session=Depends(get_db)):
    if not payload.terms_accepted: raise HTTPException(400,"You must accept the terms and privacy notice")
    if not is_adult(payload.date_of_birth): raise HTTPException(400,"You must be at least 18 years old")
    if db.query(User).filter(func.lower(User.email)==payload.email.lower()).first(): raise HTTPException(409,"Email is already registered")
    if db.query(User).filter(func.lower(User.username)==payload.username.lower()).first(): raise HTTPException(409,"Username is already taken")
    if payload.phone and db.query(User).filter(User.phone==payload.phone).first(): raise HTTPException(409,"Phone number is already registered")
    user_gender = payload.gender.strip().lower() if payload.gender else None
    u=User(email=payload.email.lower(),phone=payload.phone,password_hash=hash_password(payload.password),full_name=payload.full_name.strip(),username=payload.username.lower(),date_of_birth=payload.date_of_birth,gender=user_gender,location=payload.location.strip())
    db.add(u); db.commit(); db.refresh(u)
    return {"access_token":create_token(u.id,u.role),"token_type":"bearer","user":user_private(u)}

@app.post("/api/auth/login")
def login(payload: LoginIn, db: Session=Depends(get_db)):
    u=db.query(User).filter(func.lower(User.email)==payload.email.lower()).first()
    if not u or not verify_password(payload.password,u.password_hash): raise HTTPException(401,"Email or password is incorrect")
    if not u.is_active: raise HTTPException(403,"This account is inactive")
    return {"access_token":create_token(u.id,u.role),"token_type":"bearer","user":user_private(u)}

@app.get("/api/me")
def me(user: User=Depends(get_current_user)): return user_private(user)
@app.patch("/api/me/profile")
def update_profile(payload: ProfileIn, user: User=Depends(get_current_user), db: Session=Depends(get_db)):
    dupe=db.query(User).filter(func.lower(User.username)==payload.username.lower(),User.id!=user.id).first()
    if dupe: raise HTTPException(409,"Username is already taken")
    if payload.date_of_birth and not is_adult(payload.date_of_birth): raise HTTPException(400,"You must be at least 18 years old")
    for key in ["full_name","username","bio","location","relationship_goal","discoverable","show_age","show_online","gender","date_of_birth"]:
        val = getattr(payload, key)
        if key == "gender" and val: val = val.strip().lower()
        setattr(user, key, val)
    user.interests=",".join(dict.fromkeys(x.strip().lower() for x in payload.interests if x.strip()))
    db.commit();db.refresh(user);return user_private(user)
@app.patch("/api/me/privacy")
def update_privacy(payload: PrivacyIn,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    user.discoverable=payload.discoverable;user.show_age=payload.show_age;user.show_online=payload.show_online;db.commit();return {"discoverable":user.discoverable,"show_age":user.show_age,"show_online":user.show_online}
@app.delete("/api/me",status_code=204)
def delete_account(user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    # Foreign keys cascade user-owned content and private files are removed best-effort.
    reports=db.query(HealthReport).filter(HealthReport.user_id==user.id).all()
    for report in reports:
        try: (UPLOAD_DIR/report.stored_name).unlink(missing_ok=True)
        except OSError: pass
    db.delete(user);db.commit();return None

@app.get("/api/users/discover")
def discover(q: str="", location: str="", interests: str="", limit: int=Query(24,ge=1,le=100), offset: int=Query(0,ge=0), user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    query=db.query(User).filter(User.id!=user.id,User.is_active.is_(True),User.discoverable.is_(True))
    hidden=db.query(Block.blocked_id).filter(Block.blocker_id==user.id).union(db.query(Block.blocker_id).filter(Block.blocked_id==user.id))
    query=query.filter(~User.id.in_(hidden))
    # Strict cross-gender display: male displays only female, female displays only male
    if user.gender:
        user_gender = user.gender.strip().lower()
        if user_gender == "male":
            query = query.filter(func.lower(User.gender) == "female")
        elif user_gender == "female":
            query = query.filter(func.lower(User.gender) == "male")
        else:
            query = query.filter(func.lower(User.gender) != user_gender)
    if q: query=query.filter((User.full_name.ilike(f"%{q}%"))|(User.username.ilike(f"%{q}%"))|(User.bio.ilike(f"%{q}%")))
    if location: query=query.filter(User.location.ilike(f"%{location}%"))
    results=query.order_by(User.created_at.desc()).offset(offset).limit(limit).all()
    requested_ids={r.receiver_id for r in db.query(Connection).filter(Connection.requester_id==user.id,Connection.status=="pending").all()}
    accepted=[]
    for other in results:
        shared=set(x.strip() for x in user.interests.split(",") if x.strip()) & set(x.strip() for x in other.interests.split(",") if x.strip())
        score=min(99,55+len(shared)*9+(10 if user.location.lower()==other.location.lower() else 0))
        if interests and not any(i.strip().lower() in other.interests.lower() for i in interests.split(",")): continue
        d=user_public(other);d.update({"match_score":score,"shared_interests":sorted(shared),"connection_status":"connected" if connected(db,user.id,other.id) else ("sent" if other.id in requested_ids else "none")})
        accepted.append(d)
    return {"items":accepted,"count":len(accepted),"limit":limit,"offset":offset}
@app.get("/api/users/{user_id}")
def get_profile(user_id:int,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    other=safe_user(db,user_id)
    if user_id!=user.id and (not other.discoverable or blocked(db,user.id,user_id)): raise HTTPException(404,"Profile not found")
    d=user_public(other)
    if user_id==user.id: return user_private(other)
    shared=set(user.interests.split(","))&set(other.interests.split(","));d.update({"match_score":min(99,55+len(shared)*9+(10 if user.location.lower()==other.location.lower() else 0)),"shared_interests":sorted(x for x in shared if x)})
    return d

@app.post("/api/connections/{user_id}",status_code=201)
def send_connection(user_id:int,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    other=safe_user(db,user_id)
    if user_id==user.id: raise HTTPException(400,"You cannot connect with yourself")
    if not other.discoverable or blocked(db,user.id,user_id): raise HTTPException(404,"User not found")
    existing=db.query(Connection).filter(((Connection.requester_id==user.id)&(Connection.receiver_id==user_id))|((Connection.requester_id==user_id)&(Connection.receiver_id==user.id))).first()
    if existing:
        if existing.status=="accepted": raise HTTPException(409,"You are already connected")
        if existing.status=="pending": raise HTTPException(409,"A connection request already exists")
        existing.requester_id=user.id;existing.receiver_id=user_id;existing.status="pending";db.commit();return {"id":existing.id,"status":existing.status}
    c=Connection(requester_id=user.id,receiver_id=user_id);db.add(c);db.commit();db.refresh(c);return {"id":c.id,"status":c.status}
@app.get("/api/connections")
def list_connections(user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    rows=db.query(Connection).filter((Connection.requester_id==user.id)|(Connection.receiver_id==user.id)).order_by(Connection.created_at.desc()).all();items=[]
    for c in rows:
        other=safe_user(db,c.receiver_id if c.requester_id==user.id else c.requester_id)
        items.append({"id":c.id,"status":c.status,"direction":"sent" if c.requester_id==user.id else "received","created_at":c.created_at.isoformat(),"user":user_public(other)})
    return items
@app.patch("/api/connections/{connection_id}")
def respond_connection(connection_id:int,decision:str=Query(...,pattern="^(accept|reject|cancel|remove)$"),user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    c=db.get(Connection,connection_id)
    if not c or user.id not in (c.requester_id,c.receiver_id): raise HTTPException(404,"Connection request not found")
    if decision in ("accept","reject") and (c.receiver_id!=user.id or c.status!="pending"): raise HTTPException(403,"Only the recipient can respond to a pending request")
    if decision=="cancel" and (c.requester_id!=user.id or c.status!="pending"): raise HTTPException(403,"Only the requester can cancel a pending request")
    if decision=="accept":c.status="accepted"
    elif decision=="reject":c.status="rejected"
    else:db.delete(c);db.commit();return {"status":"removed"}
    db.commit();return {"status":c.status}
@app.post("/api/users/{user_id}/block",status_code=201)
def block_user(user_id:int,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    safe_user(db,user_id)
    if user_id==user.id:raise HTTPException(400,"Cannot block yourself")
    if not db.query(Block).filter_by(blocker_id=user.id,blocked_id=user_id).first():db.add(Block(blocker_id=user.id,blocked_id=user_id))
    rows=db.query(Connection).filter(((Connection.requester_id==user.id)&(Connection.receiver_id==user_id))|((Connection.requester_id==user_id)&(Connection.receiver_id==user.id))).all()
    for c in rows:db.delete(c)
    db.commit();return {"status":"blocked"}
@app.post("/api/users/{user_id}/report",status_code=201)
def report_user(user_id:int,payload:ReportIn,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    safe_user(db,user_id)
    if user_id==user.id:raise HTTPException(400,"Cannot report yourself")
    r=Report(reporter_id=user.id,reported_user_id=user_id,reason=payload.reason,details=payload.details);db.add(r);db.commit();db.refresh(r);return {"id":r.id,"status":r.status}

@app.get("/api/messages/{user_id}")
def get_messages(user_id:int,before_id:Optional[int]=None,limit:int=Query(50,ge=1,le=100),user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    safe_user(db,user_id)
    if blocked(db,user.id,user_id) or not connected(db,user.id,user_id):raise HTTPException(403,"Chat is available only to accepted connections")
    q=db.query(Message).filter(((Message.sender_id==user.id)&(Message.receiver_id==user_id))|((Message.sender_id==user_id)&(Message.receiver_id==user.id)))
    if before_id:q=q.filter(Message.id<before_id)
    rows=q.order_by(Message.id.desc()).limit(limit).all();rows=list(reversed(rows))
    for m in rows:
        if m.receiver_id==user.id and not m.read_at:m.read_at=datetime.utcnow()
    db.commit()
    return [{"id":m.id,"sender_id":m.sender_id,"receiver_id":m.receiver_id,"body":m.body,"created_at":m.created_at.isoformat(),"read":m.read_at is not None} for m in rows]
@app.post("/api/messages/{user_id}",status_code=201)
async def send_message(user_id:int,payload:MessageIn,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    safe_user(db,user_id)
    if user_id==user.id:raise HTTPException(400,"Cannot message yourself")
    if blocked(db,user.id,user_id) or not connected(db,user.id,user_id):raise HTTPException(403,"Chat is available only to accepted connections")
    # Enforce subscription entitlement and daily message limit
    SubscriptionEntitlementService.check_message_permission(db, user.id)
    m=Message(sender_id=user.id,receiver_id=user_id,body=payload.body.strip())
    db.add(m)
    db.commit()
    db.refresh(m)
    SubscriptionEntitlementService.increment_message_count(db, user.id)
    result={"id":m.id,"sender_id":m.sender_id,"receiver_id":m.receiver_id,"body":m.body,"created_at":m.created_at.isoformat(),"read":False}
    event={"type":"message","message":result}
    await chat_manager.send_user(user_id,event)
    await chat_manager.send_user(user.id,event)
    return result


@app.websocket("/api/ws/chat/{user_id}")
async def websocket_chat(websocket: WebSocket, user_id: int, token: str = Query(...)):
    """Authenticated one-to-one realtime chat; each message is persisted before broadcast.

    The JWT is passed as a query parameter because browser WebSocket APIs do not
    support arbitrary Authorization headers. Use WSS in production to protect it.
    """
    db = SessionLocal()
    current_user = None
    try:
        try:
            claims = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            current_user_id = int(claims.get("sub"))
        except (JWTError, TypeError, ValueError):
            await websocket.close(code=4401, reason="Invalid or expired token")
            return
        current_user = db.get(User, current_user_id)
        target = db.get(User, user_id)
        if not current_user or not current_user.is_active:
            await websocket.close(code=4401, reason="Inactive account")
            return
        if not target or target.id == current_user.id:
            await websocket.close(code=4404, reason="Chat user not found")
            return
        if blocked(db, current_user.id, target.id) or not connected(db, current_user.id, target.id):
            await websocket.close(code=4403, reason="Chat requires an accepted connection")
            return
        await chat_manager.connect(current_user.id, websocket)
        await websocket.send_json({"type": "ready", "user_id": current_user.id, "peer_id": target.id})
        while True:
            data = await websocket.receive_json()
            if not isinstance(data, dict) or data.get("type") != "message":
                await websocket.send_json({"type": "error", "detail": "Unsupported event type"})
                continue
            body = data.get("body")
            if not isinstance(body, str) or not body.strip() or len(body.strip()) > 4000:
                await websocket.send_json({"type": "error", "detail": "Message must contain 1–4000 characters"})
                continue
            # Re-check permission on every message in case a connection was removed/blocked.
            db.expire_all()
            if blocked(db, current_user.id, target.id) or not connected(db, current_user.id, target.id):
                await websocket.send_json({"type": "error", "detail": "Chat access has been revoked"})
                await websocket.close(code=4403, reason="Chat access revoked")
                return
            try:
                SubscriptionEntitlementService.check_message_permission(db, current_user.id)
            except HTTPException as e:
                await websocket.send_json({"type": "limit_exceeded", "detail": e.detail, "upgrade_required": True})
                continue
            message = Message(sender_id=current_user.id, receiver_id=target.id, body=body.strip())
            db.add(message)
            db.commit()
            db.refresh(message)
            SubscriptionEntitlementService.increment_message_count(db, current_user.id)
            event = {"type": "message", "message": {"id": message.id, "sender_id": message.sender_id, "receiver_id": message.receiver_id, "body": message.body, "created_at": message.created_at.isoformat(), "read": False}}
            await chat_manager.send_user(target.id, event)
            await chat_manager.send_user(current_user.id, event)
    except WebSocketDisconnect:
        pass
    except Exception:
        try:
            await websocket.close(code=1011, reason="Realtime chat error")
        except Exception:
            pass
    finally:
        if current_user is not None:
            chat_manager.disconnect(current_user.id, websocket)
        db.close()

@app.get("/api/posts")
def list_posts(limit:int=Query(30,ge=1,le=100),offset:int=Query(0,ge=0),user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    rows=db.query(Post).order_by(Post.created_at.desc()).offset(offset).limit(limit).all();out=[]
    for p in rows:
        owner=db.get(User,p.user_id)
        if not owner or blocked(db,user.id,p.user_id):continue
        out.append({"id":p.id,"body":p.body,"image_url":p.image_url,"created_at":p.created_at.isoformat(),"author":user_public(owner),"likes":db.query(PostLike).filter_by(post_id=p.id).count(),"comments":db.query(Comment).filter_by(post_id=p.id).count(),"liked_by_me":db.query(PostLike).filter_by(post_id=p.id,user_id=user.id).first() is not None})
    return out
@app.post("/api/posts",status_code=201)
def create_post(payload:PostIn,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    p=Post(user_id=user.id,body=payload.body.strip(),image_url=payload.image_url.strip());db.add(p);db.commit();db.refresh(p);return {"id":p.id,"body":p.body,"image_url":p.image_url,"created_at":p.created_at.isoformat()}
@app.post("/api/posts/{post_id}/like")
def toggle_like(post_id:int,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    p=db.get(Post,post_id)
    if not p:raise HTTPException(404,"Post not found")
    existing=db.query(PostLike).filter_by(post_id=post_id,user_id=user.id).first()
    if existing:db.delete(existing);liked=False
    else:db.add(PostLike(post_id=post_id,user_id=user.id));liked=True
    db.commit();return {"liked":liked,"likes":db.query(PostLike).filter_by(post_id=post_id).count()}
@app.get("/api/posts/{post_id}/comments")
def list_comments(post_id:int,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    if not db.get(Post,post_id):raise HTTPException(404,"Post not found")
    return [{"id":c.id,"body":c.body,"created_at":c.created_at.isoformat(),"author":user_public(safe_user(db,c.user_id))} for c in db.query(Comment).filter_by(post_id=post_id).order_by(Comment.created_at.asc()).all()]
@app.post("/api/posts/{post_id}/comments",status_code=201)
def add_comment(post_id:int,payload:CommentIn,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    if not db.get(Post,post_id):raise HTTPException(404,"Post not found")
    c=Comment(post_id=post_id,user_id=user.id,body=payload.body.strip());db.add(c);db.commit();db.refresh(c);return {"id":c.id,"body":c.body,"created_at":c.created_at.isoformat()}

@app.get("/api/wellness")
def list_wellness(user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    rows=db.query(WellnessCheckin).filter_by(user_id=user.id).order_by(WellnessCheckin.created_at.desc()).limit(30).all()
    return [{"id":r.id,"mood":r.mood,"note":r.note,"water_glasses":r.water_glasses,"movement_minutes":r.movement_minutes,"created_at":r.created_at.isoformat()} for r in rows]
@app.post("/api/wellness",status_code=201)
def create_wellness(payload:WellnessIn,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    c=WellnessCheckin(user_id=user.id,**payload.model_dump());db.add(c);db.commit();db.refresh(c);return {"id":c.id,"mood":c.mood,"note":c.note,"water_glasses":c.water_glasses,"movement_minutes":c.movement_minutes,"created_at":c.created_at.isoformat()}
@app.get("/api/meals")
def list_meals(meal_date:date=Query(default_factory=date.today),user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    rows=db.query(Meal).filter_by(user_id=user.id,meal_date=meal_date).order_by(Meal.id.asc()).all();return [{"id":m.id,"meal_date":m.meal_date.isoformat(),"meal_type":m.meal_type,"name":m.name,"calories":m.calories,"completed":m.completed} for m in rows]
@app.post("/api/meals",status_code=201)
def create_meal(payload:MealIn,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    m=Meal(user_id=user.id,**payload.model_dump());db.add(m);db.commit();db.refresh(m);return {"id":m.id,"meal_date":m.meal_date.isoformat(),"meal_type":m.meal_type,"name":m.name,"calories":m.calories,"completed":m.completed}
@app.patch("/api/meals/{meal_id}")
def toggle_meal(meal_id:int,completed:bool=Query(...),user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    m=db.query(Meal).filter_by(id=meal_id,user_id=user.id).first()
    if not m:raise HTTPException(404,"Meal not found")
    m.completed=completed;db.commit();return {"id":m.id,"completed":m.completed}

@app.get("/api/health-reports")
def list_health_reports(user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    return [{"id":r.id,"original_name":r.original_name,"content_type":r.content_type,"size_bytes":r.size_bytes,"created_at":r.created_at.isoformat()} for r in db.query(HealthReport).filter_by(user_id=user.id).order_by(HealthReport.created_at.desc()).all()]
@app.post("/api/health-reports",status_code=201)
async def upload_health_report(file:UploadFile=File(...),user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    allowed={"application/pdf":".pdf","image/jpeg":".jpg","image/png":".png"}
    if file.content_type not in allowed:raise HTTPException(415,"Only PDF, JPG, and PNG files are accepted")
    content=await file.read(MAX_UPLOAD_BYTES+1)
    if not content:raise HTTPException(400,"The uploaded file is empty")
    if len(content)>MAX_UPLOAD_BYTES:raise HTTPException(413,"Maximum file size is 5 MB")
    ext=allowed[file.content_type];stored=f"u{user.id}_{uuid.uuid4().hex}{ext}"
    # Keep a private random filename; never expose physical paths.
    (UPLOAD_DIR/stored).write_bytes(content)
    r=HealthReport(user_id=user.id,original_name=Path(file.filename or f"report{ext}").name[:255],stored_name=stored,content_type=file.content_type,size_bytes=len(content));db.add(r);db.commit();db.refresh(r)
    return {"id":r.id,"original_name":r.original_name,"content_type":r.content_type,"size_bytes":r.size_bytes,"created_at":r.created_at.isoformat()}
@app.get("/api/health-reports/{report_id}/download")
def download_health_report(report_id:int,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    from fastapi.responses import FileResponse
    r=db.query(HealthReport).filter_by(id=report_id,user_id=user.id).first()
    if not r:raise HTTPException(404,"Report not found")
    path=UPLOAD_DIR/r.stored_name
    if not path.is_file():raise HTTPException(404,"Stored report file not found")
    return FileResponse(path,media_type=r.content_type,filename=r.original_name)
@app.delete("/api/health-reports/{report_id}",status_code=204)
def delete_health_report(report_id:int,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    r=db.query(HealthReport).filter_by(id=report_id,user_id=user.id).first()
    if not r:raise HTTPException(404,"Report not found")
    try:(UPLOAD_DIR/r.stored_name).unlink(missing_ok=True)
    except OSError:pass
    db.delete(r);db.commit();return None

@app.get("/api/travel-plans")
def list_travel(user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    return [{"id":t.id,"destination":t.destination,"start_date":t.start_date.isoformat() if t.start_date else None,"end_date":t.end_date.isoformat() if t.end_date else None,"budget":t.budget,"interests":t.interests,"notes":t.notes,"created_at":t.created_at.isoformat()} for t in db.query(TravelPlan).filter_by(user_id=user.id).order_by(TravelPlan.created_at.desc()).all()]
@app.post("/api/travel-plans",status_code=201)
def create_travel(payload:TravelIn,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    if payload.start_date and payload.end_date and payload.end_date<payload.start_date:raise HTTPException(400,"End date cannot be before start date")
    t=TravelPlan(user_id=user.id,**payload.model_dump());db.add(t);db.commit();db.refresh(t);return {"id":t.id,"destination":t.destination,"start_date":t.start_date.isoformat() if t.start_date else None,"end_date":t.end_date.isoformat() if t.end_date else None,"budget":t.budget,"interests":t.interests,"notes":t.notes}
@app.delete("/api/travel-plans/{plan_id}",status_code=204)
def delete_travel(plan_id:int,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    t=db.query(TravelPlan).filter_by(id=plan_id,user_id=user.id).first()
    if not t:raise HTTPException(404,"Travel plan not found")
    db.delete(t);db.commit();return None
@app.get("/api/counselling/categories")
def list_counselling_categories(db: Session = Depends(get_db)):
    cats = db.query(CounsellingCategory).filter_by(is_active=True).order_by(CounsellingCategory.sort_order.asc()).all()
    return [
        {
            "id": c.id,
            "slug": c.slug,
            "title": c.title,
            "description": c.description,
            "icon": c.icon,
            "badge": c.badge,
            "sort_order": c.sort_order
        }
        for c in cats
    ]

@app.get("/api/counselling/triage-options")
def get_triage_options():
    return [
        {"id": "relationships", "slug": "relationship", "title": "My Relationships", "desc": "Communication difficulties, boundaries, trust, and relationship expectations.", "icon": "HeartHandshake"},
        {"id": "myself", "slug": "personal", "title": "Understanding Myself", "desc": "Self-worth, life transitions, emotional grounding, and clarity.", "icon": "Sparkles"},
        {"id": "emotional", "slug": "emotional", "title": "Emotional Support", "desc": "A respectful, confidential space to unpack difficult situations and emotions.", "icon": "Heart"},
        {"id": "marriage_compat", "slug": "marriage_compat", "title": "Marriage and Compatibility", "desc": "Relationship expectations, compatibility discussions, and cohabitation decisions.", "icon": "Compass"},
        {"id": "personal_growth", "slug": "personal", "title": "Personal Growth", "desc": "Constructive decision-making, resilience, confidence, and personal development.", "icon": "TrendingUp"},
        {"id": "something_else", "slug": "other", "title": "Something Else", "desc": "Explore guidance options freely without pressure to disclose sensitive details.", "icon": "HelpCircle"}
    ]

@app.get("/api/counsellors")
def counsellors(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Counsellor).filter(Counsellor.is_active == True, Counsellor.verification_status == "Approved")
    if category and category != "all":
        query = query.filter((Counsellor.primary_category == category) | (Counsellor.categories.contains(category)))
    c_list = query.all()
    out = []
    for c in c_list:
        out.append({
            "id": c.id,
            "name": c.name,
            "title": c.title,
            "qualification": c.qualification,
            "experience_years": c.experience_years,
            "license_number": c.license_number,
            "specialization": c.primary_category,
            "primary_category": c.primary_category,
            "categories": [cat.strip() for cat in c.categories.split(",") if cat.strip()],
            "languages": [lang.strip() for lang in c.languages.split(",") if lang.strip()],
            "rating": float(c.rating) if c.rating else 4.9,
            "reviews_count": c.reviews_count,
            "fee_inr": c.fee_inr,
            "verified": c.verified,
            "included_with_premium": c.included_with_premium,
            "cancellation_terms": c.cancellation_terms,
            "scope_of_practice": c.scope_of_practice,
            "avatar_url": c.avatar_url,
            "available_days": [d.strip() for d in c.available_days.split(",") if d.strip()],
            "time_slots": [s.strip() for s in c.time_slots.split(",") if s.strip()],
            "verification_status": c.verification_status,
            "bio": c.bio
        })
    return out

@app.get("/api/counsellors/{counsellor_id}")
def get_counsellor(counsellor_id: int, db: Session = Depends(get_db)):
    c = db.get(Counsellor, counsellor_id)
    if not c:
        raise HTTPException(404, "Counsellor not found")
    return {
        "id": c.id,
        "name": c.name,
        "title": c.title,
        "qualification": c.qualification,
        "experience_years": c.experience_years,
        "license_number": c.license_number,
        "specialization": c.primary_category,
        "primary_category": c.primary_category,
        "categories": [cat.strip() for cat in c.categories.split(",") if cat.strip()],
        "languages": [lang.strip() for lang in c.languages.split(",") if lang.strip()],
        "rating": float(c.rating) if c.rating else 4.9,
        "reviews_count": c.reviews_count,
        "fee_inr": c.fee_inr,
        "verified": c.verified,
        "included_with_premium": c.included_with_premium,
        "cancellation_terms": c.cancellation_terms,
        "scope_of_practice": c.scope_of_practice,
        "avatar_url": c.avatar_url,
        "available_days": [d.strip() for d in c.available_days.split(",") if d.strip()],
        "time_slots": [s.strip() for s in c.time_slots.split(",") if s.strip()],
        "verification_status": c.verification_status,
        "bio": c.bio
    }

@app.post("/api/counsellors/apply", status_code=201)
def apply_counsellor(payload: CounsellorApplicationIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Counsellor).filter_by(user_id=user.id).first()
    categories_str = ",".join(payload.categories)
    languages_str = ",".join(payload.languages)
    available_days_str = ",".join(payload.available_days)
    time_slots_str = ",".join(payload.time_slots)

    if existing:
        existing.name = payload.name
        existing.title = payload.title
        existing.qualification = payload.qualification
        existing.experience_years = payload.experience_years
        existing.license_number = payload.license_number
        existing.bio = payload.bio
        existing.primary_category = payload.primary_category
        existing.categories = categories_str
        existing.languages = languages_str
        existing.fee_inr = payload.fee_inr
        existing.scope_of_practice = payload.scope_of_practice
        existing.available_days = available_days_str
        existing.time_slots = time_slots_str
        existing.avatar_url = payload.avatar_url or user.avatar_url
        existing.verification_status = "Under Review"
        existing.verified = False
        db.commit()
        db.refresh(existing)
        return {"id": existing.id, "verification_status": existing.verification_status, "message": "Counsellor credential submission updated and placed under review."}

    c = Counsellor(
        user_id=user.id,
        name=payload.name,
        title=payload.title,
        qualification=payload.qualification,
        experience_years=payload.experience_years,
        license_number=payload.license_number,
        bio=payload.bio,
        avatar_url=payload.avatar_url or user.avatar_url,
        primary_category=payload.primary_category,
        categories=categories_str,
        languages=languages_str,
        fee_inr=payload.fee_inr,
        cancellation_terms=payload.cancellation_terms or "Free cancellation or rescheduling up to 4 hours before the session.",
        scope_of_practice=payload.scope_of_practice,
        verification_status="Application Submitted",
        verified=False,
        is_active=True,
        collaboration_agreed=payload.collaboration_agreed,
        rating=5.0,
        reviews_count=0,
        available_days=available_days_str,
        time_slots=time_slots_str
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return {"id": c.id, "verification_status": c.verification_status, "message": "Application submitted successfully. Our credential committee will review your documents."}

@app.post("/api/partners/apply", status_code=201)
def submit_partner_application(payload: PartnerApplicationIn, db: Session = Depends(get_db)):
    code = f"MM-PARTNER-{uuid.uuid4().hex[:6].upper()}"
    app_record = PartnerApplication(
        full_name=payload.full_name,
        email=payload.email,
        mobile_number=payload.mobile_number,
        partner_category=payload.partner_category,
        qualification=payload.qualification,
        experience_years=payload.experience_years,
        city=payload.city,
        introduction=payload.introduction or "",
        consent=payload.consent,
        status="Under Review",
        application_code=code
    )
    db.add(app_record)
    db.commit()
    db.refresh(app_record)
    return {
        "status": "success",
        "id": app_record.id,
        "application_code": app_record.application_code,
        "full_name": app_record.full_name,
        "partner_category": app_record.partner_category,
        "message": "Your partner application has been submitted successfully! Our onboarding team will review your qualifications and reach out within 24-48 business hours."
    }

@app.get("/api/partners/apply/{code}")
def get_partner_application_by_code(code: str, db: Session = Depends(get_db)):
    app_record = db.query(PartnerApplication).filter_by(application_code=code).first()
    if not app_record:
        raise HTTPException(status_code=404, detail="Partner application not found.")
    return {
        "id": app_record.id,
        "application_code": app_record.application_code,
        "full_name": app_record.full_name,
        "partner_category": app_record.partner_category,
        "status": app_record.status,
        "created_at": app_record.created_at.isoformat()
    }

@app.get("/api/counsellor/me")
def get_my_counsellor_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    c = db.query(Counsellor).filter_by(user_id=user.id).first()
    if not c:
        return {"has_profile": False, "verification_status": None}
    return {
        "has_profile": True,
        "id": c.id,
        "name": c.name,
        "title": c.title,
        "qualification": c.qualification,
        "experience_years": c.experience_years,
        "license_number": c.license_number,
        "bio": c.bio,
        "avatar_url": c.avatar_url,
        "primary_category": c.primary_category,
        "categories": [cat.strip() for cat in c.categories.split(",") if cat.strip()],
        "languages": [lang.strip() for lang in c.languages.split(",") if lang.strip()],
        "rating": float(c.rating),
        "reviews_count": c.reviews_count,
        "fee_inr": c.fee_inr,
        "included_with_premium": c.included_with_premium,
        "cancellation_terms": c.cancellation_terms,
        "scope_of_practice": c.scope_of_practice,
        "verification_status": c.verification_status,
        "verified": c.verified,
        "available_days": [d.strip() for d in c.available_days.split(",") if d.strip()],
        "time_slots": [s.strip() for s in c.time_slots.split(",") if s.strip()],
        "collaboration_agreed": c.collaboration_agreed
    }

@app.patch("/api/counsellor/me")
def update_my_counsellor_profile(payload: CounsellorApplicationIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    c = db.query(Counsellor).filter_by(user_id=user.id).first()
    if not c:
        raise HTTPException(404, "Counsellor profile not found. Please submit an initial application.")
    c.name = payload.name
    c.title = payload.title
    c.qualification = payload.qualification
    c.experience_years = payload.experience_years
    c.license_number = payload.license_number
    c.bio = payload.bio
    c.primary_category = payload.primary_category
    c.categories = ",".join(payload.categories)
    c.languages = ",".join(payload.languages)
    c.fee_inr = payload.fee_inr
    c.scope_of_practice = payload.scope_of_practice
    c.available_days = ",".join(payload.available_days)
    c.time_slots = ",".join(payload.time_slots)
    db.commit()
    db.refresh(c)
    return {"message": "Counsellor schedule and profile updated successfully."}

@app.get("/api/counsellor/me/appointments")
def get_my_counsellor_appointments(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    c = db.query(Counsellor).filter_by(user_id=user.id).first()
    query = db.query(Appointment)
    if c:
        query = query.filter((Appointment.counsellor_id == c.id) | (Appointment.counsellor_name == c.name))
    else:
        query = query.filter(Appointment.counsellor_name == user.full_name)
    appts = query.order_by(Appointment.appointment_date.desc()).all()
    results = []
    for a in appts:
        client = db.get(User, a.user_id)
        results.append({
            "id": a.id,
            "client_name": client.full_name if client else f"Client #{a.user_id}",
            "client_avatar": client.avatar_url if client else "",
            "client_location": client.location if client else "",
            "counsellor_name": a.counsellor_name,
            "category": a.category or "relationship",
            "support_topic": a.support_topic or "",
            "appointment_date": a.appointment_date.isoformat(),
            "time_slot": a.time_slot,
            "mode": a.mode,
            "status": a.status,
            "user_notes": a.user_notes or "",
            "counsellor_notes": a.counsellor_notes or "",
            "created_at": a.created_at.isoformat()
        })
    return results

@app.patch("/api/counsellor/me/appointments/{appointment_id}")
def update_counsellor_appointment(appointment_id: int, payload: CounsellorAppointmentUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    a = db.get(Appointment, appointment_id)
    if not a:
        raise HTTPException(404, "Appointment not found")
    a.status = payload.status
    if payload.counsellor_notes is not None:
        a.counsellor_notes = payload.counsellor_notes
    db.commit()
    return {"id": a.id, "status": a.status, "counsellor_notes": a.counsellor_notes, "message": "Appointment status and clinical notes updated."}

@app.get("/api/admin/counsellors")
def admin_list_counsellors(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    counsellors = db.query(Counsellor).order_by(Counsellor.created_at.desc()).all()
    return [
        {
            "id": c.id,
            "user_id": c.user_id,
            "name": c.name,
            "title": c.title,
            "qualification": c.qualification,
            "experience_years": c.experience_years,
            "license_number": c.license_number,
            "bio": c.bio,
            "primary_category": c.primary_category,
            "categories": [cat.strip() for cat in c.categories.split(",") if cat.strip()],
            "fee_inr": c.fee_inr,
            "verification_status": c.verification_status,
            "verified": c.verified,
            "is_active": c.is_active,
            "rating": float(c.rating),
            "created_at": c.created_at.isoformat()
        }
        for c in counsellors
    ]

@app.patch("/api/admin/counsellors/{counsellor_id}/status")
def admin_update_counsellor_status(counsellor_id: int, payload: CounsellorStatusUpdate, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    c = db.get(Counsellor, counsellor_id)
    if not c:
        raise HTTPException(404, "Counsellor not found")
    c.verification_status = payload.verification_status
    c.verified = (payload.verification_status == "Approved")
    db.commit()
    return {"id": c.id, "verification_status": c.verification_status, "verified": c.verified, "message": f"Counsellor status updated to {c.verification_status}."}

@app.get("/api/appointments")
def list_appointments(user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    return [
        {
            "id": a.id,
            "counsellor_name": a.counsellor_name,
            "counsellor_id": a.counsellor_id,
            "category": a.category or "relationship",
            "support_topic": a.support_topic or "",
            "appointment_date": a.appointment_date.isoformat(),
            "time_slot": a.time_slot,
            "mode": a.mode,
            "status": a.status,
            "user_notes": a.user_notes or "",
            "counsellor_notes": a.counsellor_notes or "",
            "created_at": a.created_at.isoformat()
        }
        for a in db.query(Appointment).filter_by(user_id=user.id).order_by(Appointment.appointment_date.desc()).all()
    ]

@app.post("/api/appointments",status_code=201)
def create_appointment(payload:AppointmentIn,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    if payload.appointment_date<date.today():raise HTTPException(400,"Appointment date must be today or later")
    if payload.mode not in ("video","voice","in_person"):raise HTTPException(400,"Invalid appointment mode")
    # Prevent double booking: verify no existing appointment for same counsellor, date, and time slot
    existing = db.query(Appointment).filter(
        Appointment.counsellor_name == payload.counsellor_name,
        Appointment.appointment_date == payload.appointment_date,
        Appointment.time_slot == payload.time_slot,
        Appointment.status.in_(["requested", "confirmed", "scheduled"])
    ).first()
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "This counsellor time slot is already booked. Please choose an alternative slot.")
    # Enforce Premium subscription and counselling allowance
    SubscriptionEntitlementService.check_counselling_permission(db, user.id)
    a=Appointment(
        user_id=user.id,
        counsellor_id=payload.counsellor_id,
        counsellor_name=payload.counsellor_name,
        category=payload.category or "relationship",
        support_topic=payload.support_topic or "",
        appointment_date=payload.appointment_date,
        time_slot=payload.time_slot,
        mode=payload.mode,
        user_notes=payload.user_notes or "",
        status="confirmed"
    )
    db.add(a)
    db.commit()
    db.refresh(a)
    return {"id":a.id,"status":a.status,"message":"Counselling session successfully scheduled under your MANMITRA Premium membership allowance."}

@app.patch("/api/appointments/{appointment_id}/cancel")
def cancel_appointment(appointment_id:int,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    a = db.query(Appointment).filter_by(id=appointment_id, user_id=user.id).first()
    if not a:
        raise HTTPException(404, "Appointment not found")
    if a.status == "cancelled":
        return {"id": a.id, "status": a.status, "message": "Appointment is already cancelled"}
    a.status = "cancelled"
    db.commit()
    return {"id": a.id, "status": a.status, "message": "Appointment cancelled. Your included session allowance has been restored."}
@app.get("/api/support-tickets")
def list_tickets(user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    return [{"id":t.id,"subject":t.subject,"category":t.category,"details":t.details,"status":t.status,"created_at":t.created_at.isoformat()} for t in db.query(SupportTicket).filter_by(user_id=user.id).order_by(SupportTicket.created_at.desc()).all()]
@app.post("/api/support-tickets",status_code=201)
def create_ticket(payload:TicketIn,user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    t=SupportTicket(user_id=user.id,**payload.model_dump());db.add(t);db.commit();db.refresh(t);return {"id":t.id,"subject":t.subject,"category":t.category,"details":t.details,"status":t.status,"created_at":t.created_at.isoformat()}

@app.get("/api/admin/overview")
def admin_overview(admin:User=Depends(require_admin),db:Session=Depends(get_db)):
    return {"users":db.query(User).count(),"active_users":db.query(User).filter_by(is_active=True).count(),"connections":db.query(Connection).filter_by(status="accepted").count(),"pending_requests":db.query(Connection).filter_by(status="pending").count(),"open_reports":db.query(Report).filter_by(status="open").count(),"open_tickets":db.query(SupportTicket).filter_by(status="open").count(),"posts":db.query(Post).count()}
@app.get("/api/admin/users")
def admin_users(q:str="",limit:int=Query(50,ge=1,le=200),offset:int=Query(0,ge=0),admin:User=Depends(require_admin),db:Session=Depends(get_db)):
    query=db.query(User)
    if q:query=query.filter((User.full_name.ilike(f"%{q}%"))|(User.email.ilike(f"%{q}%"))|(User.username.ilike(f"%{q}%")))
    return [{"id":u.id,"full_name":u.full_name,"username":u.username,"email":u.email,"role":u.role,"is_active":u.is_active,"created_at":u.created_at.isoformat()} for u in query.order_by(User.created_at.desc()).offset(offset).limit(limit).all()]
@app.patch("/api/admin/users/{user_id}/status")
def admin_user_status(user_id:int,is_active:bool=Query(...),admin:User=Depends(require_admin),db:Session=Depends(get_db)):
    u=safe_user(db,user_id)
    if u.id==admin.id and not is_active:raise HTTPException(400,"You cannot deactivate your own admin account")
    u.is_active=is_active;db.commit();return {"id":u.id,"is_active":u.is_active}
@app.get("/api/admin/reports")
def admin_reports(admin:User=Depends(require_admin),db:Session=Depends(get_db)):
    return [{"id":r.id,"reporter_id":r.reporter_id,"reported_user_id":r.reported_user_id,"reason":r.reason,"details":r.details,"status":r.status,"created_at":r.created_at.isoformat()} for r in db.query(Report).order_by(Report.created_at.desc()).limit(200).all()]
@app.patch("/api/admin/reports/{report_id}")
def admin_resolve_report(report_id:int,report_status:str=Query(...,pattern="^(open|reviewing|resolved|dismissed)$"),admin:User=Depends(require_admin),db:Session=Depends(get_db)):
    r=db.get(Report,report_id)
    if not r:raise HTTPException(404,"Report not found")
    r.status=report_status;db.commit();return {"id":r.id,"status":r.status}
@app.get("/api/admin/support-tickets")
def admin_tickets(admin:User=Depends(require_admin),db:Session=Depends(get_db)):
    return [{"id":t.id,"user_id":t.user_id,"subject":t.subject,"category":t.category,"details":t.details,"status":t.status,"created_at":t.created_at.isoformat()} for t in db.query(SupportTicket).order_by(SupportTicket.created_at.desc()).limit(200).all()]
@app.patch("/api/admin/support-tickets/{ticket_id}")
def admin_ticket_status(ticket_id:int,ticket_status:str=Query(...,pattern="^(open|in_progress|resolved)$"),admin:User=Depends(require_admin),db:Session=Depends(get_db)):
    t=db.get(SupportTicket,ticket_id)
    if not t:raise HTTPException(404,"Ticket not found")
    t.status=ticket_status;db.commit();return {"id":t.id,"status":t.status}

# ==============================================================================
# MANMITRA SUBSCRIPTION & PAYMENT API ENDPOINTS
# Exactly Two Plans: BASIC (₹499/mo) and PREMIUM (₹999/mo)
# ==============================================================================

@app.get("/api/plans")
def list_plans(db: Session = Depends(get_db)):
    """
    Public endpoint returning the two active membership plans:
    1. MANMITRA Basic — ₹499/month
    2. MANMITRA Premium — ₹999/month
    """
    plans = db.query(SubscriptionPlan).filter_by(is_active=True).order_by(SubscriptionPlan.amount_inr.asc()).all()
    out = []
    for p in plans:
        cfg = {}
        try:
            cfg = json.loads(p.feature_configuration)
        except Exception:
            pass
        out.append({
            "id": p.id,
            "code": p.code,
            "name": p.name,
            "amount_inr": p.amount_inr,
            "billing_period": p.billing_period,
            "tagline": cfg.get("tagline", ""),
            "message_limit_daily": cfg.get("message_limit_daily", 20),
            "ai_limit_daily": cfg.get("ai_limit_daily", 5),
            "calling_enabled": cfg.get("calling_enabled", False),
            "counselling_sessions_included": cfg.get("counselling_sessions_included", 0),
            "premium_content": cfg.get("premium_content", False),
            "highlights": cfg.get("highlights", [])
        })
    return out

@app.get("/api/subscriptions/me")
def my_subscription(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Return authenticated user's current subscription, entitlements, and payment history.
    """
    entitlements = SubscriptionEntitlementService.get_entitlements(db, user.id)
    history = (
        db.query(PaymentTransaction)
        .filter_by(user_id=user.id)
        .order_by(PaymentTransaction.created_at.desc())
        .limit(20)
        .all()
    )
    entitlements["payment_history"] = [
        {
            "id": tx.id,
            "order_id": tx.provider_order_id,
            "payment_id": tx.provider_payment_id,
            "amount": tx.amount,
            "currency": tx.currency,
            "status": tx.status,
            "created_at": tx.created_at.isoformat(),
            "verified_at": tx.verified_at.isoformat() if tx.verified_at else None
        }
        for tx in history
    ]
    return entitlements

@app.post("/api/subscriptions/checkout")
def checkout_subscription(payload: CheckoutIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Create a Razorpay payment order for BASIC (₹499) or PREMIUM (₹999).
    """
    plan = db.query(SubscriptionPlan).filter_by(code=payload.plan_code, is_active=True).first()
    if not plan:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Subscription plan '{payload.plan_code}' not found or inactive.")
    order_data = PaymentGatewayService.create_order(db, user.id, plan)
    return order_data

@app.post("/api/subscriptions/verify")
def verify_subscription(payload: VerifyIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Verify payment signature server-side and activate subscription immediately upon verified payment.
    """
    result = PaymentGatewayService.verify_and_activate(
        db=db,
        user_id=user.id,
        order_id=payload.razorpay_order_id,
        payment_id=payload.razorpay_payment_id,
        signature=payload.razorpay_signature
    )
    # Refresh entitlements
    result["entitlements"] = SubscriptionEntitlementService.get_entitlements(db, user.id)
    return result

@app.post("/api/subscriptions/cancel")
def cancel_subscription(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Cancel subscription auto-renewal. Access remains active until the end of the paid billing period.
    """
    sub = SubscriptionEntitlementService.get_active_subscription(db, user.id)
    if not sub:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No active subscription found to cancel.")
    if sub.status == "cancelled":
        return {
            "status": "cancelled",
            "message": "Subscription is already set to cancel at the end of the billing period.",
            "current_period_end": sub.current_period_end.isoformat()
        }
    sub.status = "cancelled"
    sub.cancelled_at = datetime.utcnow()
    db.commit()
    return {
        "status": "cancelled",
        "message": f"Your subscription has been cancelled. You retain full membership access until {sub.current_period_end.strftime('%B %d, %Y')}.",
        "current_period_end": sub.current_period_end.isoformat()
    }

@app.get("/api/subscriptions/usage")
def subscription_usage(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Return today's usage counters and remaining allowances.
    """
    entitlements = SubscriptionEntitlementService.get_entitlements(db, user.id)
    return {
        "plan_code": entitlements["plan_code"],
        "plan_name": entitlements["plan_name"],
        "limits": entitlements["limits"]
    }

@app.post("/api/payments/webhook")
async def payment_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Handle official Razorpay webhooks with signature verification and idempotency.
    """
    raw_body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")
    try:
        payload = json.loads(raw_body.decode("utf-8"))
    except Exception:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid JSON payload.")
    result = PaymentGatewayService.process_webhook(db, payload, raw_body, signature)
    return result

# ==============================================================================
# STANDARD RAZORPAY CHECKOUT ENDPOINTS (GENERIC / FRONTEND INTEGRATION)
# ==============================================================================

class GenericCreateOrderIn(BaseModel):
    amount: int = Field(..., ge=100, description="Amount in paise (minimum 100 paise = 1 INR)")
    currency: Optional[str] = "INR"
    receipt: Optional[str] = None
    notes: Optional[dict] = None

class GenericVerifyPaymentIn(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@app.post("/api/create-order")
@app.post("/api/v1/create-order")
def generic_create_order(payload: GenericCreateOrderIn):
    """
    Standard Razorpay Order Creation Endpoint
    POST /api/create-order
    POST /api/v1/create-order
    """
    if payload.amount < 100:
        raise HTTPException(status_code=400, detail="Minimum order amount is 100 paise (1 INR)")

    key_id = os.getenv("RAZORPAY_KEY_ID")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")

    if not key_id or not key_secret:
        raise HTTPException(status_code=500, detail="Razorpay credentials not configured in environment")

    try:
        import razorpay as rz
        client = rz.Client(auth=(key_id, key_secret))
        order_data = {
            "amount": payload.amount,
            "currency": payload.currency or "INR",
            "receipt": payload.receipt or f"rcpt_{uuid.uuid4().hex[:10]}"
        }
        if payload.notes:
            order_data["notes"] = payload.notes
        rzp_order = client.order.create(data=order_data)
        return {
            "order_id": rzp_order["id"],
            "amount": rzp_order["amount"],
            "currency": rzp_order["currency"],
            "key_id": key_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Razorpay order: {str(e)}")

@app.post("/api/verify-payment")
@app.post("/api/v1/verify-payment")
def generic_verify_payment(payload: GenericVerifyPaymentIn):
    """
    Standard Razorpay Signature Verification Endpoint
    POST /api/verify-payment
    POST /api/v1/verify-payment
    """
    key_secret = os.getenv("RAZORPAY_KEY_SECRET", "q7va1o41GaonSEItKLzKxwnD")
    if not key_secret:
        raise HTTPException(status_code=500, detail="Razorpay secret not configured")

    if not payload.razorpay_order_id or not payload.razorpay_payment_id or not payload.razorpay_signature:
        raise HTTPException(status_code=400, detail="Missing required payment verification fields")

    msg = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode("utf-8")
    expected_sig = hmac.new(key_secret.encode("utf-8"), msg, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected_sig, payload.razorpay_signature):
        raise HTTPException(status_code=400, detail="Payment signature verification failed")

    return {
        "success": True,
        "message": "Payment verified successfully",
        "razorpay_payment_id": payload.razorpay_payment_id,
        "razorpay_order_id": payload.razorpay_order_id
    }

# ==============================================================================
# EDUCATIONAL CONTENT ENDPOINTS (FREE and PREMIUM)
# ==============================================================================

@app.get("/api/content")
def list_content(category: Optional[str] = None, user_id: Optional[int] = None, db: Session = Depends(get_db)):
    """
    Retrieve educational articles, astrology guides, and relationship resources.
    Content marked PREMIUM is presented with a teaser/locked preview for Free and Basic users.
    """
    query = db.query(ContentItem).filter_by(is_published=True)
    if category:
        query = query.filter_by(category=category)
    items = query.order_by(ContentItem.created_at.desc()).all()

    # Determine user's premium status if logged in
    has_premium = False
    if user_id:
        plan_code = SubscriptionEntitlementService.get_user_plan_code(db, user_id)
        has_premium = (plan_code == "PREMIUM")

    out = []
    for item in items:
        is_locked = (item.access_level == "PREMIUM" and not has_premium)
        out.append({
            "id": item.id,
            "title": item.title,
            "category": item.category,
            "access_level": item.access_level,
            "summary": item.summary,
            "body": item.summary if is_locked else item.body,
            "is_locked": is_locked,
            "image_url": item.image_url,
            "author_name": item.author_name,
            "read_time_minutes": item.read_time_minutes,
            "created_at": item.created_at.isoformat()
        })
    return out

@app.get("/api/content/{content_id}")
def get_content_item(content_id: int, user: Optional[User] = Depends(lambda: None), db: Session = Depends(get_db), token: Optional[str] = None):
    """
    Retrieve full article content. Enforces server-side access control for PREMIUM items.
    """
    item = db.get(ContentItem, content_id)
    if not item or not item.is_published:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Content article not found.")

    # Check access level
    current_user_id = None
    if token:
        try:
            claims = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            current_user_id = int(claims.get("sub"))
        except Exception:
            pass

    SubscriptionEntitlementService.check_content_access(db, current_user_id, item.access_level)
    return {
        "id": item.id,
        "title": item.title,
        "category": item.category,
        "access_level": item.access_level,
        "summary": item.summary,
        "body": item.body,
        "is_locked": False,
        "image_url": item.image_url,
        "author_name": item.author_name,
        "read_time_minutes": item.read_time_minutes,
        "created_at": item.created_at.isoformat()
    }

# ==============================================================================
# CALLING BOUNDARY & PERMISSIONS
# Voice and Video Calling are exclusively available to MANMITRA Premium members
# ==============================================================================

@app.get("/api/calling/check/{target_user_id}")
def check_calling_eligibility(target_user_id: int, mode: str = Query("voice", pattern="^(voice|video)$"), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Verify caller has Premium entitlement and target user is a mutually accepted connection.
    Does not expose private phone numbers.
    """
    SubscriptionEntitlementService.check_calling_permission(db, user.id, mode)
    target = safe_user(db, target_user_id)
    if target.id == user.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Cannot initiate a call with yourself.")
    if blocked(db, user.id, target.id) or not connected(db, user.id, target.id):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Calling is only permitted between mutually accepted connections.")

    return {
        "eligible": True,
        "mode": mode,
        "caller_id": user.id,
        "target_id": target.id,
        "target_name": target.full_name,
        "integration_status": "ready",
        "notice": "Private in-app live WebRTC calling boundary. Phone numbers remain confidential."
    }

@app.post("/api/calling/initiate")
def initiate_call_session(target_user_id: int = Query(...), mode: str = Query("voice", pattern="^(voice|video)$"), user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Generate an authenticated WebRTC calling session room boundary for eligible Premium members.
    """
    SubscriptionEntitlementService.check_calling_permission(db, user.id, mode)
    target = safe_user(db, target_user_id)
    if target.id == user.id or blocked(db, user.id, target.id) or not connected(db, user.id, target.id):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Calling requires a mutually accepted connection.")

    room_id = f"room_{min(user.id, target.id)}_{max(user.id, target.id)}_{uuid.uuid4().hex[:8]}"
    return {
        "session_id": room_id,
        "mode": mode,
        "caller": {"id": user.id, "name": user.full_name},
        "target": {"id": target.id, "name": target.full_name},
        "created_at": datetime.utcnow().isoformat(),
        "status": "signaling_ready",
        "documentation": "Connect audio/video streams via WebRTC peer connection. No private numbers disclosed."
    }

# ==============================================================================
# AI RELATIONSHIP GUIDANCE ENDPOINT
# Available to Basic (5 queries/day) and Premium (50 queries/day)
# ==============================================================================

@app.post("/api/ai/guidance")
def get_ai_guidance(payload: AiGuidanceIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Provide relationship reflection, communication de-escalation, and compatibility guidance.
    Enforces daily query limits and includes transparent non-clinical disclaimer.
    """
    plan_code = SubscriptionEntitlementService.get_user_plan_code(db, user.id)
    is_advanced = (plan_code == "PREMIUM")
    
    SubscriptionEntitlementService.check_ai_permission(db, user.id, is_advanced=False)

    # Provide structured, constructive relationship advice
    topic_clean = payload.topic.lower()
    advice_snippets = {
        "communication": (
            "1. Express feelings using 'I feel' statements instead of 'You always' generalizations.\n"
            "2. Listen to understand your partner's emotional state before formulating your reply.\n"
            "3. Take a 15-minute grounding timeout if a conversation reaches emotional overwhelm."
        ),
        "finances": (
            "1. Create a transparent joint tracking document for shared living costs (groceries, rent, utilities).\n"
            "2. Keep personal discretionary spending accounts separate to preserve individual autonomy.\n"
            "3. Schedule a calm 20-minute monthly financial sync without blame or guilt."
        ),
        "boundaries": (
            "1. Clearly define sacred personal spaces in the home for quiet work and recharging.\n"
            "2. Agree on social guest protocols and family visits well in advance.\n"
            "3. Honor your partner's need for alone time without taking it as emotional withdrawal."
        )
    }
    
    chosen_advice = advice_snippets.get(topic_clean, (
        "1. Prioritize emotional safety and authentic listening in your daily interactions.\n"
        "2. Celebrate small shared moments—cooking together, evening tea, and mindful walks.\n"
        "3. Address minor frictions proactively before they accumulate into resentment."
    ))

    SubscriptionEntitlementService.increment_ai_count(db, user.id, is_advanced=is_advanced)
    
    disclaimer = (
        "MANMITRA AI Guidance is intended strictly for self-reflection and communication encouragement. "
        "It does not constitute professional psychological evaluation, psychiatric care, or clinical therapy. "
        "For complex mental-health concerns, consult a licensed healthcare professional."
    )

    return {
        "topic": payload.topic,
        "query": payload.query,
        "guidance": chosen_advice,
        "plan_applied": plan_code,
        "is_advanced_tier": is_advanced,
        "disclaimer": disclaimer,
        "timestamp": datetime.utcnow().isoformat()
    }

# ==============================================================================
# ADMIN SUBSCRIPTION & PAYMENT MANAGEMENT ENDPOINTS
# ==============================================================================

@app.get("/api/admin/subscriptions")
def admin_subscriptions(
    plan: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    List member subscriptions with filtering by plan code and status.
    """
    query = db.query(UserSubscription)
    if plan:
        plan_obj = db.query(SubscriptionPlan).filter_by(code=plan.upper()).first()
        if plan_obj:
            query = query.filter_by(plan_id=plan_obj.id)
    if status:
        query = query.filter_by(status=status)

    total = query.count()
    rows = query.order_by(UserSubscription.created_at.desc()).offset(offset).limit(limit).all()
    
    out = []
    for s in rows:
        u = db.get(User, s.user_id)
        p = db.get(SubscriptionPlan, s.plan_id)
        out.append({
            "id": s.id,
            "user_id": s.user_id,
            "user_name": u.full_name if u else "Unknown",
            "user_email": u.email if u else "Unknown",
            "plan_code": p.code if p else "UNKNOWN",
            "plan_name": p.name if p else "Unknown",
            "amount_inr": p.amount_inr if p else 0,
            "status": s.status,
            "started_at": s.started_at.isoformat(),
            "current_period_end": s.current_period_end.isoformat(),
            "cancelled_at": s.cancelled_at.isoformat() if s.cancelled_at else None,
            "provider_subscription_id": s.provider_subscription_id
        })
    return {"total": total, "items": out}

@app.get("/api/admin/subscriptions/stats")
def admin_subscription_stats(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    """
    Return subscription breakdown: Basic vs Premium members, status counts, and revenue.
    """
    basic_plan = db.query(SubscriptionPlan).filter_by(code="BASIC").first()
    premium_plan = db.query(SubscriptionPlan).filter_by(code="PREMIUM").first()

    basic_plan_id = basic_plan.id if basic_plan else -1
    premium_plan_id = premium_plan.id if premium_plan else -1

    now = datetime.utcnow()
    basic_members = (
        db.query(UserSubscription)
        .filter(
            UserSubscription.plan_id == basic_plan_id,
            UserSubscription.status.in_(["active", "cancelled"]),
            UserSubscription.current_period_end >= now
        )
        .count()
    )
    premium_members = (
        db.query(UserSubscription)
        .filter(
            UserSubscription.plan_id == premium_plan_id,
            UserSubscription.status.in_(["active", "cancelled"]),
            UserSubscription.current_period_end >= now
        )
        .count()
    )

    active_count = db.query(UserSubscription).filter(UserSubscription.status.in_(["active", "cancelled"]), UserSubscription.current_period_end >= now).count()
    expired_count = db.query(UserSubscription).filter((UserSubscription.current_period_end < now) | (UserSubscription.status == "expired")).count()
    cancelled_count = db.query(UserSubscription).filter_by(status="cancelled").count()
    failed_tx_count = db.query(PaymentTransaction).filter_by(status="failed").count()
    
    # Calculate verified revenue
    total_revenue_inr = db.query(func.sum(PaymentTransaction.amount)).filter_by(status="verified").scalar() or 0

    return {
        "basic_members": basic_members,
        "premium_members": premium_members,
        "active_subscriptions": active_count,
        "expired_subscriptions": expired_count,
        "cancelled_subscriptions": cancelled_count,
        "failed_payments": failed_tx_count,
        "total_revenue_inr": total_revenue_inr
    }

@app.get("/api/admin/payments")
def admin_payments(
    status: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    List payment transactions with provider order/payment IDs.
    """
    query = db.query(PaymentTransaction)
    if status:
        query = query.filter_by(status=status)
    total = query.count()
    rows = query.order_by(PaymentTransaction.created_at.desc()).offset(offset).limit(limit).all()
    
    out = []
    for tx in rows:
        u = db.get(User, tx.user_id)
        out.append({
            "id": tx.id,
            "user_id": tx.user_id,
            "user_name": u.full_name if u else "Unknown",
            "user_email": u.email if u else "Unknown",
            "order_id": tx.provider_order_id,
            "payment_id": tx.provider_payment_id,
            "amount": tx.amount,
            "currency": tx.currency,
            "status": tx.status,
            "created_at": tx.created_at.isoformat(),
            "verified_at": tx.verified_at.isoformat() if tx.verified_at else None
        })
    return {"total": total, "items": out}

@app.get("/api/admin/config")
def admin_get_config(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    """
    Retrieve configurable limits for daily messages, AI queries, and counselling allowances.
    """
    return {
        "BASIC_DAILY_MESSAGE_LIMIT": get_system_config(db, "BASIC_DAILY_MESSAGE_LIMIT", 20),
        "PREMIUM_DAILY_MESSAGE_LIMIT": get_system_config(db, "PREMIUM_DAILY_MESSAGE_LIMIT", 200),
        "BASIC_AI_DAILY_LIMIT": get_system_config(db, "BASIC_AI_DAILY_LIMIT", 5),
        "PREMIUM_AI_DAILY_LIMIT": get_system_config(db, "PREMIUM_AI_DAILY_LIMIT", 50),
        "PREMIUM_INCLUDED_COUNSELLING_MONTHLY": get_system_config(db, "PREMIUM_INCLUDED_COUNSELLING_MONTHLY", 1)
    }

@app.patch("/api/admin/config")
def admin_update_config(payload: ConfigUpdateIn, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    """
    Update configurable limits in system configuration table.
    """
    mapping = {
        "BASIC_DAILY_MESSAGE_LIMIT": payload.basic_daily_message_limit,
        "PREMIUM_DAILY_MESSAGE_LIMIT": payload.premium_daily_message_limit,
        "BASIC_AI_DAILY_LIMIT": payload.basic_ai_daily_limit,
        "PREMIUM_AI_DAILY_LIMIT": payload.premium_ai_daily_limit,
        "PREMIUM_INCLUDED_COUNSELLING_MONTHLY": payload.premium_included_counselling_monthly
    }
    for k, v in mapping.items():
        if v is not None:
            cfg = db.query(SystemConfig).filter_by(key=k).first()
            if cfg:
                cfg.value = str(v)
            else:
                db.add(SystemConfig(key=k, value=str(v), description=f"Updated by admin {admin.username}"))
    db.commit()
    return {"status": "updated", "config": admin_get_config(admin, db)}

@app.post("/api/admin/content", status_code=201)
def admin_create_content(payload: ContentIn, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    """
    Create educational resource marked FREE or PREMIUM.
    """
    item = ContentItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"id": item.id, "title": item.title, "access_level": item.access_level, "status": "created"}

@app.patch("/api/admin/content/{content_id}")
def admin_update_content(content_id: int, access_level: Optional[str] = Query(None, pattern="^(FREE|PREMIUM)$"), is_published: Optional[bool] = None, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    """
    Toggle content access level (FREE vs PREMIUM) or publication status.
    """
    item = db.get(ContentItem, content_id)
    if not item:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Content item not found.")
    if access_level:
        item.access_level = access_level
    if is_published is not None:
        item.is_published = is_published
    db.commit()
    return {"id": item.id, "title": item.title, "access_level": item.access_level, "is_published": item.is_published}

@app.post("/api/guidance/reflect")
def reflect_guidance(payload: GuidanceReflectIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Structured self-reflection and guidance framework across counselling categories.
    Enforces daily quota based on membership.
    """
    plan_code = SubscriptionEntitlementService.get_user_plan_code(db, user.id)
    is_advanced = (plan_code == "PREMIUM")
    SubscriptionEntitlementService.check_ai_permission(db, user.id, is_advanced=is_advanced)
    
    cat = (payload.category or "relationship").lower()
    reflection_maps = {
        "relationship": {
            "perspective": "In relationships, difficulties in communication often stem from unspoken assumptions or fear of vulnerability rather than a lack of affection.",
            "questions": [
                "What is the deeper emotional need beneath the current disagreement?",
                "How would you express your hope for this relationship without focusing on what the other person did wrong?",
                "What is one small boundary or appreciation you can offer today?"
            ],
            "exercise": "The 24-Hour Active Listening Pause: Commit to hearing your partner's viewpoint for 5 minutes without defending, justifying, or offering unsolicited fixes."
        },
        "personal": {
            "perspective": "Self-clarity begins by separating your authentic internal values from the expectations placed on you by others.",
            "questions": [
                "If no one were watching or judging, what choice would feel most truthful to your personal integrity?",
                "What part of yourself feels tired or unacknowledged right now?",
                "What is one realistic boundary that would protect your energy this week?"
            ],
            "exercise": "Values Alignment Check: Write down 3 decisions you face, and rate them 1-10 on whether they align with your core values versus fear."
        },
        "emotional": {
            "perspective": "Emotions are informational signals about what matters to you. Suppressing them intensifies strain, while acknowledging them with compassion creates room for calm.",
            "questions": [
                "Can you name the physical sensation of this emotion without labeling it as 'bad' or 'unacceptable'?",
                "What would a compassionate, wise friend say to you about what you are carrying today?",
                "What is one restorative, non-demanding act of self-care you can take right now?"
            ],
            "exercise": "5-Minute Emotional Grounding: Take 5 slow breaths (inhale 4s, exhale 6s). Notice 5 things around you, 4 things you can touch, and 1 kind thought for yourself."
        },
        "marriage_compat": {
            "perspective": "Long-term compatibility is not the absence of differences, but having a respectful system for discussing differences around money, lifestyle, personal space, and families.",
            "questions": [
                "What are your non-negotiables regarding domestic life, shared finances, and personal downtime?",
                "How do each of you react under stress, and what helps you both de-escalate?",
                "What does mutual emotional respect look like in daily living?"
            ],
            "exercise": "Cohabitation Harmony Sync: Schedule a 20-minute coffee conversation to calmly review weekly routines, shared chores, and quiet hours."
        },
        "family_comm": {
            "perspective": "Family dynamics often trigger long-standing generational patterns. You cannot control others' reactions, but you have full autonomy over your own responses and boundaries.",
            "questions": [
                "Where does your responsibility for their feelings end, and your responsibility for your own wellbeing begin?",
                "Can you communicate a clear 'No' with warmth and calm firmness rather than resentment?",
                "What supportive allies can you lean on when family tensions arise?"
            ],
            "exercise": "The Clear Boundary Script: 'I appreciate your care. For my own balance, I need to handle this in my own time, and I will keep you updated.'"
        },
        "professional": {
            "perspective": "Recognizing when you need direction toward specialized clinical or psychiatric support is a sign of wisdom, self-respect, and maturity.",
            "questions": [
                "Are the challenges you are facing significantly impairing your sleep, appetite, work, or safety?",
                "Would working with a licensed clinical psychologist or medical specialist provide the specialized care you deserve?",
                "What questions would you like to ask a verified professional in your first session?"
            ],
            "exercise": "Directory Exploration: Browse our verified professionals directory to review qualifications, scope of practice, and select a suitable session slot."
        }
    }
    
    info = reflection_maps.get(cat, reflection_maps["relationship"])
    SubscriptionEntitlementService.increment_ai_count(db, user.id, is_advanced=is_advanced)
    
    return {
        "topic": payload.topic,
        "category": payload.category,
        "user_reflection": payload.user_reflection,
        "perspective": info["perspective"],
        "reflective_questions": info["questions"],
        "recommended_exercise": info["exercise"],
        "plan_code": plan_code,
        "disclaimer": "MANMITRA AI Guidance is an exploratory self-reflection tool. It is not psychotherapy, clinical diagnosis, medical care, or crisis intervention. If you are experiencing distress, please connect with a verified counsellor or contact a trusted crisis helpline (Tele-MANAS: 14416 / Vandrevala Foundation: 9999 666 555)."
    }

@app.post("/api/admin/counselling/categories", status_code=201)
def admin_create_category(payload: CategoryCreateIn, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    existing = db.query(CounsellingCategory).filter_by(slug=payload.slug).first()
    if existing:
        raise HTTPException(400, "Category slug already exists")
    cat = CounsellingCategory(**payload.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return {"id": cat.id, "slug": cat.slug, "title": cat.title, "status": "created"}

@app.patch("/api/admin/counselling/categories/{category_id}")
def admin_update_category(category_id: int, payload: CategoryCreateIn, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    cat = db.get(CounsellingCategory, category_id)
    if not cat:
        raise HTTPException(404, "Category not found")
    cat.title = payload.title
    cat.description = payload.description
    cat.icon = payload.icon
    cat.badge = payload.badge
    cat.is_active = payload.is_active
    cat.sort_order = payload.sort_order
    db.commit()
    return {"id": cat.id, "slug": cat.slug, "title": cat.title, "status": "updated"}


