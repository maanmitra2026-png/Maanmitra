from datetime import datetime, date
from typing import Optional, List
from sqlalchemy import (
    String, Integer, Boolean, DateTime, Date, Text,
    ForeignKey, UniqueConstraint, Float, Index
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class MaanmitraBase(DeclarativeBase):
    pass

class User(MaanmitraBase):
    __tablename__ = "mm_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(32), default="user", index=True) # admin, maanmitra_partner, user
    account_status: Mapped[str] = mapped_column(String(32), default="active", index=True) # active, suspended, pending_verification, rejected
    email_verified: Mapped[bool] = mapped_column(Boolean, default=True)
    phone_verified: Mapped[bool] = mapped_column(Boolean, default=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    # Registration & Activation Payments (No KYC required)
    registration_fee_paid: Mapped[bool] = mapped_column(Boolean, default=False)
    registration_paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    activation_fee_paid: Mapped[bool] = mapped_column(Boolean, default=False)
    activation_paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    training_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    # User Subscription / Membership (₹499 User Portal Access)
    subscription_paid: Mapped[bool] = mapped_column(Boolean, default=False)
    subscription_paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    subscription_amount: Mapped[int] = mapped_column(Integer, default=499)

    # User Wallet (Top-up system for Chat, Audio, Video Calls)
    wallet_balance_inr: Mapped[int] = mapped_column(Integer, default=0)

    is_demo: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    partner_profile: Mapped[Optional["PartnerProfile"]] = relationship("PartnerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    profile: Mapped[Optional["UserProfile"]] = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    bookings_as_user: Mapped[List["Booking"]] = relationship("Booking", back_populates="user", foreign_keys="Booking.user_id")
    payments: Mapped[List["Payment"]] = relationship("Payment", back_populates="user")
    reviews_given: Mapped[List["Review"]] = relationship("Review", back_populates="user")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class PartnerProfile(MaanmitraBase):
    __tablename__ = "mm_partner_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), unique=True, index=True)
    display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    headline: Mapped[str] = mapped_column(String(200), default="Empathetic Listener & Wellness Mentor")
    bio: Mapped[str] = mapped_column(Text, default="")
    profile_photo_url: Mapped[str] = mapped_column(String(500), default="")
    languages: Mapped[str] = mapped_column(String(255), default="Hindi, English")
    verification_status: Mapped[str] = mapped_column(String(32), default="draft", index=True) # draft, pending, under_review, approved, rejected, suspended
    availability_status: Mapped[str] = mapped_column(String(32), default="online", index=True) # online, offline, busy
    rating_average: Mapped[float] = mapped_column(Float, default=4.9)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    total_chats: Mapped[int] = mapped_column(Integer, default=0)
    total_calls: Mapped[int] = mapped_column(Integer, default=0)
    rate_chat_15m: Mapped[int] = mapped_column(Integer, default=99)
    rate_audio_30m: Mapped[int] = mapped_column(Integer, default=299)
    rate_video_30m: Mapped[int] = mapped_column(Integer, default=499)
    
    # Counsellor & Mentor Portal Upgrade Fields
    experience_years: Mapped[int] = mapped_column(Integer, default=3)
    education: Mapped[str] = mapped_column(String(300), default="Master's in Counseling & Guidance")
    city: Mapped[str] = mapped_column(String(120), default="Pune, Maharashtra")
    timezone: Mapped[str] = mapped_column(String(60), default="Asia/Kolkata (IST)")
    intro_video_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    rank_level: Mapped[int] = mapped_column(Integer, default=10, index=True) # 10 is Starter, 1 is Principal Mentor
    per_minute_rate_inr: Mapped[int] = mapped_column(Integer, default=10) # Tied to rank
    completeness_percentage: Mapped[int] = mapped_column(Integer, default=85)
    
    # Bank & Payout Details
    bank_name: Mapped[Optional[str]] = mapped_column(String(120), default="HDFC Bank")
    bank_account_number_masked: Mapped[Optional[str]] = mapped_column(String(50), default="XXXX-XXXX-4829")
    bank_ifsc: Mapped[Optional[str]] = mapped_column(String(30), default="HDFC0001234")
    bank_account_holder: Mapped[Optional[str]] = mapped_column(String(120), default="")
    bank_verified: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # Registration & Activation Payments (No KYC required)
    registration_fee_paid: Mapped[bool] = mapped_column(Boolean, default=False)
    registration_paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    activation_fee_paid: Mapped[bool] = mapped_column(Boolean, default=False)
    activation_paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    training_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    # Zoom Induction Meeting (scheduled by admin after ₹99 paid)
    zoom_meeting_scheduled: Mapped[bool] = mapped_column(Boolean, default=False)
    zoom_meeting_link: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    zoom_meeting_datetime: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    zoom_meeting_notes: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    zoom_meeting_completed: Mapped[bool] = mapped_column(Boolean, default=False)  # Admin marks after call
    
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False)
    admin_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="partner_profile")
    documents: Mapped[List["PartnerVerificationDocument"]] = relationship("PartnerVerificationDocument", back_populates="partner", cascade="all, delete-orphan")
    availabilities: Mapped[List["PartnerAvailability"]] = relationship("PartnerAvailability", back_populates="partner", cascade="all, delete-orphan")
    slots: Mapped[List["AvailabilitySlot"]] = relationship("AvailabilitySlot", back_populates="partner", cascade="all, delete-orphan")
    bookings: Mapped[List["Booking"]] = relationship("Booking", back_populates="partner", foreign_keys="Booking.partner_id")
    earnings: Mapped[List["PartnerEarning"]] = relationship("PartnerEarning", back_populates="partner", cascade="all, delete-orphan")
    reviews: Mapped[List["Review"]] = relationship("Review", back_populates="partner", cascade="all, delete-orphan")
    
    # Extended Portal Relationships
    expertises: Mapped[List["PartnerExpertise"]] = relationship("PartnerExpertise", back_populates="partner", cascade="all, delete-orphan")
    qualifications: Mapped[List["PartnerQualification"]] = relationship("PartnerQualification", back_populates="partner", cascade="all, delete-orphan")
    wallet: Mapped[Optional["MentorWallet"]] = relationship("MentorWallet", back_populates="partner", uselist=False, cascade="all, delete-orphan")
    ledger_entries: Mapped[List["FinancialLedger"]] = relationship("FinancialLedger", back_populates="partner", cascade="all, delete-orphan")
    withdrawals: Mapped[List["WithdrawalRequest"]] = relationship("WithdrawalRequest", back_populates="partner", cascade="all, delete-orphan")
    rank_histories: Mapped[List["RankHistory"]] = relationship("RankHistory", back_populates="partner", cascade="all, delete-orphan")
    bonus_transactions: Mapped[List["BonusTransaction"]] = relationship("BonusTransaction", back_populates="partner", cascade="all, delete-orphan")
    live_sessions: Mapped[List["LiveSession"]] = relationship("LiveSession", back_populates="partner", cascade="all, delete-orphan")
    workshops: Mapped[List["WorkshopEvent"]] = relationship("WorkshopEvent", back_populates="partner", cascade="all, delete-orphan")
    support_tickets: Mapped[List["PartnerSupportTicket"]] = relationship("PartnerSupportTicket", back_populates="partner", cascade="all, delete-orphan")


class PartnerVerificationDocument(MaanmitraBase):
    __tablename__ = "mm_partner_verification_documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    document_type: Mapped[str] = mapped_column(String(50), nullable=False) # aadhaar, pan, driving_license, passport
    document_number_masked: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    private_storage_key: Mapped[str] = mapped_column(String(500), nullable=False)
    verification_status: Mapped[str] = mapped_column(String(32), default="pending") # pending, approved, rejected
    reviewed_by: Mapped[Optional[int]] = mapped_column(ForeignKey("mm_users.id", ondelete="SET NULL"), nullable=True)
    review_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="documents")


class PartnerAvailability(MaanmitraBase):
    __tablename__ = "mm_partner_availability"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    weekday: Mapped[str] = mapped_column(String(10), nullable=False) # Mon, Tue, Wed, Thu, Fri, Sat, Sun
    start_time: Mapped[str] = mapped_column(String(10), default="09:00 AM")
    end_time: Mapped[str] = mapped_column(String(10), default="10:00 PM")
    communication_type: Mapped[str] = mapped_column(String(20), default="all") # all, chat, audio, video
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="availabilities")


class Package(MaanmitraBase):
    __tablename__ = "mm_packages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(500), default="")
    duration_minutes: Mapped[int] = mapped_column(Integer, default=30)
    communication_type: Mapped[str] = mapped_column(String(20), default="audio") # chat, audio, video
    price: Mapped[int] = mapped_column(Integer, default=299)
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    badge: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Booking(MaanmitraBase):
    __tablename__ = "mm_bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    booking_code: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    package_id: Mapped[Optional[int]] = mapped_column(ForeignKey("mm_packages.id", ondelete="SET NULL"), nullable=True)
    scheduled_start: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    scheduled_end: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    communication_type: Mapped[str] = mapped_column(String(20), default="audio") # chat, audio, video
    booking_status: Mapped[str] = mapped_column(String(32), default="confirmed", index=True)
    # pending_payment, confirmed, accepted, in_progress, completed, cancelled, no_show, refunded
    payment_status: Mapped[str] = mapped_column(String(32), default="pending", index=True)
    # pending, completed, failed, refunded
    total_amount: Mapped[int] = mapped_column(Integer, default=299)
    cancellation_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="bookings_as_user", foreign_keys=[user_id])
    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="bookings", foreign_keys=[partner_id])
    package: Mapped[Optional["Package"]] = relationship("Package")
    payment: Mapped[Optional["Payment"]] = relationship("Payment", back_populates="booking", uselist=False)
    conversation: Mapped[Optional["Conversation"]] = relationship("Conversation", back_populates="booking", uselist=False)
    review: Mapped[Optional["Review"]] = relationship("Review", back_populates="booking", uselist=False)
    earning: Mapped[Optional["PartnerEarning"]] = relationship("PartnerEarning", back_populates="booking", uselist=False)


class Payment(MaanmitraBase):
    __tablename__ = "mm_payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    booking_id: Mapped[int] = mapped_column(ForeignKey("mm_bookings.id", ondelete="CASCADE"), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    provider: Mapped[str] = mapped_column(String(50), default="razorpay")
    provider_order_id: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    provider_payment_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    provider_signature: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    amount: Mapped[int] = mapped_column(Integer, nullable=False) # In INR rupees
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    payment_status: Mapped[str] = mapped_column(String(32), default="created") # created, captured, failed, refunded
    payment_method: Mapped[str] = mapped_column(String(50), default="Razorpay (UPI/Card)")
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    booking: Mapped["Booking"] = relationship("Booking", back_populates="payment")
    user: Mapped["User"] = relationship("User", back_populates="payments")


class Conversation(MaanmitraBase):
    __tablename__ = "mm_conversations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    booking_id: Mapped[Optional[int]] = mapped_column(ForeignKey("mm_bookings.id", ondelete="SET NULL"), unique=True, nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    communication_type: Mapped[str] = mapped_column(String(20), default="chat") # chat, audio, video
    status: Mapped[str] = mapped_column(String(32), default="active") # waiting, active, ended
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0)
    rate_per_minute_inr: Mapped[int] = mapped_column(Integer, default=15)
    total_billed_inr: Mapped[int] = mapped_column(Integer, default=0)
    minutes_billed: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    booking: Mapped[Optional["Booking"]] = relationship("Booking", back_populates="conversation")
    user: Mapped["User"] = relationship("User", foreign_keys=[user_id])
    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", foreign_keys=[partner_id])
    messages: Mapped[List["Message"]] = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.sent_at")


class Message(MaanmitraBase):
    __tablename__ = "mm_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("mm_conversations.id", ondelete="CASCADE"), index=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    message_type: Mapped[str] = mapped_column(String(20), default="text") # text, system, media
    message_text: Mapped[str] = mapped_column(Text, nullable=False)
    sent_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="messages")


class Review(MaanmitraBase):
    __tablename__ = "mm_reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    booking_id: Mapped[int] = mapped_column(ForeignKey("mm_bookings.id", ondelete="CASCADE"), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    rating: Mapped[int] = mapped_column(Integer, default=5) # 1 to 5
    review_text: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    booking: Mapped["Booking"] = relationship("Booking", back_populates="review")
    user: Mapped["User"] = relationship("User", back_populates="reviews_given")
    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="reviews")


class PartnerEarning(MaanmitraBase):
    __tablename__ = "mm_partner_earnings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    booking_id: Mapped[int] = mapped_column(ForeignKey("mm_bookings.id", ondelete="CASCADE"), unique=True, index=True)
    gross_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    platform_commission: Mapped[int] = mapped_column(Integer, nullable=False)
    net_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    payout_status: Mapped[str] = mapped_column(String(32), default="pending", index=True) # pending, processing, paid
    paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="earnings")
    booking: Mapped["Booking"] = relationship("Booking", back_populates="earning")


class Notification(MaanmitraBase):
    __tablename__ = "mm_notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    notification_type: Mapped[str] = mapped_column(String(40), default="system")
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="notifications")


class Report(MaanmitraBase):
    __tablename__ = "mm_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    reporter_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    reported_user_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    booking_id: Mapped[Optional[int]] = mapped_column(ForeignKey("mm_bookings.id", ondelete="SET NULL"), nullable=True)
    reason: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    report_status: Mapped[str] = mapped_column(String(32), default="pending") # pending, reviewed, resolved, dismissed
    reviewed_by: Mapped[Optional[int]] = mapped_column(ForeignKey("mm_users.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class BlockedUser(MaanmitraBase):
    __tablename__ = "mm_blocked_users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    blocker_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    blocked_user_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("blocker_id", "blocked_user_id", name="uq_mm_block_pair"),)


class AuditLog(MaanmitraBase):
    __tablename__ = "mm_audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    actor_id: Mapped[Optional[int]] = mapped_column(ForeignKey("mm_users.id", ondelete="SET NULL"), nullable=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False)
    entity_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    metadata_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class SystemSetting(MaanmitraBase):
    __tablename__ = "mm_system_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    value: Mapped[str] = mapped_column(Text, default="")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ============================================================================
# EXTENDED COUNSELLOR & MENTOR PORTAL MODELS
# ============================================================================

class PartnerExpertise(MaanmitraBase):
    __tablename__ = "mm_partner_expertise"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    category_name: Mapped[str] = mapped_column(String(120), nullable=False)
    subcategories_json: Mapped[str] = mapped_column(Text, default="[]")
    skills_json: Mapped[str] = mapped_column(Text, default="[]")
    is_primary: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="expertises")


class PartnerQualification(MaanmitraBase):
    __tablename__ = "mm_partner_qualifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    degree_title: Mapped[str] = mapped_column(String(150), nullable=False)
    institution: Mapped[str] = mapped_column(String(200), nullable=False)
    year_completed: Mapped[int] = mapped_column(Integer, default=2020)
    certificate_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    verification_status: Mapped[str] = mapped_column(String(32), default="pending") # pending, verified, rejected
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="qualifications")


class AvailabilitySlot(MaanmitraBase):
    __tablename__ = "mm_availability_slots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    slot_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[str] = mapped_column(String(10), nullable=False) # e.g. "10:00 AM" or "10:00"
    end_time: Mapped[str] = mapped_column(String(10), nullable=False)   # e.g. "10:30 AM" or "10:30"
    communication_type: Mapped[str] = mapped_column(String(20), default="all") # all, chat, audio, video
    is_booked: Mapped[bool] = mapped_column(Boolean, default=False)
    is_blocked: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="slots")


class MentorWallet(MaanmitraBase):
    __tablename__ = "mm_mentor_wallets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), unique=True, index=True)
    available_balance_paise: Mapped[int] = mapped_column(Integer, default=0) # Integer Paise (1 INR = 100 paise)
    pending_balance_paise: Mapped[int] = mapped_column(Integer, default=0)
    total_earned_paise: Mapped[int] = mapped_column(Integer, default=0)
    total_withdrawn_paise: Mapped[int] = mapped_column(Integer, default=0)
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="wallet")


class FinancialLedger(MaanmitraBase):
    __tablename__ = "mm_financial_ledger"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    booking_id: Mapped[Optional[int]] = mapped_column(ForeignKey("mm_bookings.id", ondelete="SET NULL"), nullable=True)
    transaction_type: Mapped[str] = mapped_column(String(40), index=True) # session_earning, platform_fee, withdrawal, bonus, adjustment, refund, registration_fee, activation_fee
    amount_paise: Mapped[int] = mapped_column(Integer, nullable=False) # Signed (+ for credit, - for debit)
    balance_after_paise: Mapped[int] = mapped_column(Integer, nullable=False)
    reference_code: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    description: Mapped[str] = mapped_column(String(300), default="")
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="ledger_entries")


class WithdrawalRequest(MaanmitraBase):
    __tablename__ = "mm_withdrawal_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    reference_code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    amount_paise: Mapped[int] = mapped_column(Integer, nullable=False)
    bank_name: Mapped[str] = mapped_column(String(120), default="HDFC Bank")
    account_number_masked: Mapped[str] = mapped_column(String(50), default="XXXX-XXXX-4829")
    ifsc_code: Mapped[str] = mapped_column(String(30), default="HDFC0001234")
    account_holder_name: Mapped[str] = mapped_column(String(120), default="")
    status: Mapped[str] = mapped_column(String(32), default="requested", index=True)
    # requested, under_review, approved, processing, paid, rejected
    admin_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    requested_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    processed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="withdrawals")


class RankDefinition(MaanmitraBase):
    __tablename__ = "mm_rank_definitions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    rank_level: Mapped[int] = mapped_column(Integer, unique=True, index=True) # 10 to 1
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    price_per_minute_inr: Mapped[int] = mapped_column(Integer, nullable=False)
    mentor_share_percentage: Mapped[int] = mapped_column(Integer, default=70) # 70% mentor
    platform_share_percentage: Mapped[int] = mapped_column(Integer, default=30) # 30% platform
    min_completed_sessions: Mapped[int] = mapped_column(Integer, default=0)
    min_billable_minutes: Mapped[int] = mapped_column(Integer, default=0)
    min_rating: Mapped[float] = mapped_column(Float, default=4.0)
    max_cancellation_rate: Mapped[float] = mapped_column(Float, default=20.0) # in %
    badge_label: Mapped[str] = mapped_column(String(50), default="Standard")
    benefits_json: Mapped[str] = mapped_column(Text, default="[]")


class RankHistory(MaanmitraBase):
    __tablename__ = "mm_rank_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    old_rank: Mapped[int] = mapped_column(Integer)
    new_rank: Mapped[int] = mapped_column(Integer)
    reason: Mapped[str] = mapped_column(String(200), default="Performance review promotion")
    promoted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="rank_histories")


class BonusCampaign(MaanmitraBase):
    __tablename__ = "mm_bonus_campaigns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    reward_amount_paise: Mapped[int] = mapped_column(Integer, default=100000) # ₹1,000 in paise
    criteria_type: Mapped[str] = mapped_column(String(50), default="sessions_count") # sessions_count, rating_milestone, weekend_hours
    criteria_value: Mapped[int] = mapped_column(Integer, default=20)
    badge_text: Mapped[str] = mapped_column(String(50), default="Milestone Bonus")
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class BonusTransaction(MaanmitraBase):
    __tablename__ = "mm_bonus_transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    campaign_id: Mapped[int] = mapped_column(ForeignKey("mm_bonus_campaigns.id", ondelete="CASCADE"), index=True)
    amount_paise: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="pending") # pending, credited
    credited_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="bonus_transactions")
    campaign: Mapped["BonusCampaign"] = relationship("BonusCampaign")


class LiveSession(MaanmitraBase):
    __tablename__ = "mm_live_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    category: Mapped[str] = mapped_column(String(100), default="General Guidance")
    scheduled_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    ended_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="scheduled") # scheduled, live, ended
    viewer_count: Mapped[int] = mapped_column(Integer, default=0)
    peak_viewers: Mapped[int] = mapped_column(Integer, default=0)
    stream_key: Mapped[str] = mapped_column(String(100), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="live_sessions")
    comments: Mapped[List["LiveSessionComment"]] = relationship("LiveSessionComment", back_populates="session", cascade="all, delete-orphan")


class LiveSessionComment(MaanmitraBase):
    __tablename__ = "mm_live_session_comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("mm_live_sessions.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    user_name: Mapped[str] = mapped_column(String(120), default="Viewer")
    comment_text: Mapped[str] = mapped_column(String(500), nullable=False)
    is_question: Mapped[bool] = mapped_column(Boolean, default=False)
    is_flagged: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    session: Mapped["LiveSession"] = relationship("LiveSession", back_populates="comments")


class WorkshopEvent(MaanmitraBase):
    __tablename__ = "mm_workshop_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    category: Mapped[str] = mapped_column(String(100), default="Relationship Wellness")
    scheduled_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=60)
    capacity: Mapped[int] = mapped_column(Integer, default=25)
    fee_paise: Mapped[int] = mapped_column(Integer, default=49900) # ₹499
    status: Mapped[str] = mapped_column(String(32), default="published") # draft, published, live, completed, cancelled
    cover_image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="workshops")
    registrations: Mapped[List["WorkshopRegistration"]] = relationship("WorkshopRegistration", back_populates="workshop", cascade="all, delete-orphan")


class WorkshopRegistration(MaanmitraBase):
    __tablename__ = "mm_workshop_registrations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    workshop_id: Mapped[int] = mapped_column(ForeignKey("mm_workshop_events.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    payment_status: Mapped[str] = mapped_column(String(32), default="paid")
    attended: Mapped[bool] = mapped_column(Boolean, default=False)
    registered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    workshop: Mapped["WorkshopEvent"] = relationship("WorkshopEvent", back_populates="registrations")
    user: Mapped["User"] = relationship("User")


class PartnerSupportTicket(MaanmitraBase):
    __tablename__ = "mm_partner_support_tickets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ticket_code: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_profiles.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    category: Mapped[str] = mapped_column(String(60), default="Earnings & Payouts") # Payouts, Technical, Client Dispute, Account
    subject: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    priority: Mapped[str] = mapped_column(String(20), default="medium") # low, medium, high, urgent
    status: Mapped[str] = mapped_column(String(30), default="open") # open, in_progress, waiting_for_user, resolved, closed
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    partner: Mapped["PartnerProfile"] = relationship("PartnerProfile", back_populates="support_tickets")
    messages: Mapped[List["PartnerSupportMessage"]] = relationship("PartnerSupportMessage", back_populates="ticket", cascade="all, delete-orphan", order_by="PartnerSupportMessage.created_at")


class PartnerSupportMessage(MaanmitraBase):
    __tablename__ = "mm_partner_support_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ticket_id: Mapped[int] = mapped_column(ForeignKey("mm_partner_support_tickets.id", ondelete="CASCADE"), index=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    sender_role: Mapped[str] = mapped_column(String(30), default="partner") # partner, support_admin
    message: Mapped[Text] = mapped_column(Text, nullable=False)
    attachment_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    ticket: Mapped["PartnerSupportTicket"] = relationship("PartnerSupportTicket", back_populates="messages")


# ---------------------------------------------------------------------------
# USER PROFILE (mm_user_profiles)
# ---------------------------------------------------------------------------
class UserProfile(MaanmitraBase):
    __tablename__ = "mm_user_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), unique=True, index=True)
    gender: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    age: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    photo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    looking_for: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)   # partner, friendship, marriage
    interests: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)    # comma-separated
    horoscope_sign: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    education: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    occupation: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    religion: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
    mother_tongue: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
    height_cm: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True)
    ai_messages_today: Mapped[int] = mapped_column(Integer, default=0)
    ai_messages_reset_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="profile")


# ---------------------------------------------------------------------------
# USER MATCH (mm_user_matches)
# ---------------------------------------------------------------------------
class UserMatch(MaanmitraBase):
    __tablename__ = "mm_user_matches"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id_1: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    user_id_2: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    liked_by_1: Mapped[bool] = mapped_column(Boolean, default=False)
    liked_by_2: Mapped[bool] = mapped_column(Boolean, default=False)
    is_mutual: Mapped[bool] = mapped_column(Boolean, default=False)
    matched_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")  # pending, mutual, unmatched
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    __table_args__ = (UniqueConstraint("user_id_1", "user_id_2", name="uq_user_match"),)


# ---------------------------------------------------------------------------
# USER MATCH MESSAGE (mm_user_match_messages)
# ---------------------------------------------------------------------------
class UserMatchMessage(MaanmitraBase):
    __tablename__ = "mm_user_match_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    match_id: Mapped[int] = mapped_column(ForeignKey("mm_user_matches.id", ondelete="CASCADE"), index=True)
    sender_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    message_text: Mapped[str] = mapped_column(Text, nullable=False)
    sent_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)


# ---------------------------------------------------------------------------
# USER SUBSCRIPTION PAYMENT (mm_user_subscriptions)
# ---------------------------------------------------------------------------
class UserSubscription(MaanmitraBase):
    __tablename__ = "mm_user_subscriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    amount_inr: Mapped[int] = mapped_column(Integer, default=499)
    razorpay_order_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    razorpay_payment_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="pending")   # pending, paid, failed
    paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class UserWalletTransaction(MaanmitraBase):
    __tablename__ = "mm_user_wallet_transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("mm_users.id", ondelete="CASCADE"), index=True)
    transaction_type: Mapped[str] = mapped_column(String(40), default="topup")  # topup, deduction_chat, deduction_audio, deduction_video, refund
    amount_inr: Mapped[int] = mapped_column(Integer, nullable=False)
    balance_after_inr: Mapped[int] = mapped_column(Integer, default=0)
    razorpay_order_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    razorpay_payment_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    description: Mapped[str] = mapped_column(String(255), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User")


def ensure_maanmitra_schema_upgrades(engine):
    """
    Safely creates all new tables and adds any missing columns to existing SQLite / PostgreSQL tables.
    """
    from sqlalchemy import inspect, text

    # 1. Create any missing tables
    MaanmitraBase.metadata.create_all(bind=engine)

    # 2. Check and migrate missing columns in existing tables (SQLite safe)
    inspector = inspect(engine)
    
    # PartnerProfile columns
    existing_pp_cols = {col["name"] for col in inspector.get_columns("mm_partner_profiles")}
    new_pp_columns = [
        ("headline", "VARCHAR(200)", "'Empathetic Listener & Wellness Mentor'"),
        ("experience_years", "INTEGER", "3"),
        ("education", "VARCHAR(300)", "'Master''s in Counseling & Guidance'"),
        ("city", "VARCHAR(120)", "'Pune, Maharashtra'"),
        ("timezone", "VARCHAR(60)", "'Asia/Kolkata (IST)'"),
        ("intro_video_url", "VARCHAR(500)", "NULL"),
        ("rank_level", "INTEGER", "10"),
        ("per_minute_rate_inr", "INTEGER", "10"),
        ("completeness_percentage", "INTEGER", "85"),
        ("bank_name", "VARCHAR(120)", "'HDFC Bank'"),
        ("bank_account_number_masked", "VARCHAR(50)", "'XXXX-XXXX-4829'"),
        ("bank_ifsc", "VARCHAR(30)", "'HDFC0001234'"),
        ("bank_account_holder", "VARCHAR(120)", "''"),
        ("bank_verified", "BOOLEAN", "1"),
        ("is_demo", "BOOLEAN", "0"),
        ("registration_fee_paid", "BOOLEAN", "0"),
        ("registration_paid_at", "DATETIME", "NULL"),
        ("activation_fee_paid", "BOOLEAN", "0"),
        ("activation_paid_at", "DATETIME", "NULL"),
        ("training_completed", "BOOLEAN", "0"),
        ("zoom_meeting_scheduled", "BOOLEAN", "0"),
        ("zoom_meeting_link", "VARCHAR(500)", "NULL"),
        ("zoom_meeting_datetime", "DATETIME", "NULL"),
        ("zoom_meeting_notes", "VARCHAR(500)", "NULL"),
        ("zoom_meeting_completed", "BOOLEAN", "0"),
    ]
    with engine.begin() as conn:
        for col_name, col_type, default_val in new_pp_columns:
            if col_name not in existing_pp_cols:
                try:
                    conn.execute(text(f"ALTER TABLE mm_partner_profiles ADD COLUMN {col_name} {col_type} DEFAULT {default_val}"))
                except Exception as e:
                    print(f"[Schema Upgrade Notice] Column {col_name} add skipped: {e}")

        # User columns
        existing_user_cols = {col["name"] for col in inspector.get_columns("mm_users")}
        user_cols_to_add = [
            ("is_demo", "BOOLEAN", "0"),
            ("registration_fee_paid", "BOOLEAN", "0"),
            ("registration_paid_at", "DATETIME", "NULL"),
            ("activation_fee_paid", "BOOLEAN", "0"),
            ("activation_paid_at", "DATETIME", "NULL"),
            ("training_completed", "BOOLEAN", "0"),
            ("subscription_paid", "BOOLEAN", "0"),
            ("subscription_paid_at", "DATETIME", "NULL"),
            ("subscription_amount", "INTEGER", "499"),
            ("wallet_balance_inr", "INTEGER", "0"),
        ]
        for col_name, col_type, default_val in user_cols_to_add:
            if col_name not in existing_user_cols:
                try:
                    conn.execute(text(f"ALTER TABLE mm_users ADD COLUMN {col_name} {col_type} DEFAULT {default_val}"))
                except Exception as e:
                    print(f"[Schema Upgrade Notice] Column mm_users.{col_name} add skipped: {e}")

        # UserProfile columns (mm_user_profiles)
        try:
            existing_up_cols = {col["name"] for col in inspector.get_columns("mm_user_profiles")}
            up_cols_to_add = [
                ("ai_messages_today", "INTEGER", "0"),
                ("ai_messages_reset_date", "DATE", "NULL"),
                ("is_visible", "BOOLEAN", "1"),
                ("height_cm", "INTEGER", "NULL"),
                ("religion", "VARCHAR(80)", "NULL"),
                ("mother_tongue", "VARCHAR(80)", "NULL"),
            ]
            for col_name, col_type, default_val in up_cols_to_add:
                if col_name not in existing_up_cols:
                    try:
                        conn.execute(text(f"ALTER TABLE mm_user_profiles ADD COLUMN {col_name} {col_type} DEFAULT {default_val}"))
                    except Exception as e:
                        print(f"[Schema Upgrade Notice] Column mm_user_profiles.{col_name} add skipped: {e}")
        except Exception:
            pass  # table may not exist yet; create_all handles it

        # Conversation columns (mm_conversations) for Per-Minute Realtime Billing
        try:
            existing_conv_cols = {col["name"] for col in inspector.get_columns("mm_conversations")}
            conv_cols_to_add = [
                ("rate_per_minute_inr", "INTEGER", "15"),
                ("total_billed_inr", "INTEGER", "0"),
                ("minutes_billed", "INTEGER", "0"),
            ]
            for col_name, col_type, default_val in conv_cols_to_add:
                if col_name not in existing_conv_cols:
                    try:
                        conn.execute(text(f"ALTER TABLE mm_conversations ADD COLUMN {col_name} {col_type} DEFAULT {default_val}"))
                    except Exception as e:
                        print(f"[Schema Upgrade Notice] Column mm_conversations.{col_name} add skipped: {e}")
        except Exception:
            pass


