from datetime import datetime, date
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, EmailStr, Field, model_validator

# --- Auth Schemas ---

class UserRegisterIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=32)
    password: str = Field(min_length=6, max_length=128)
    terms_accepted: bool = True

class PartnerRegisterIn(BaseModel):
    full_name: Optional[str] = Field(default=None, max_length=120)
    legal_name: Optional[str] = Field(default=None, max_length=120)
    display_name: str = Field(min_length=2, max_length=60)
    email: EmailStr
    phone: str = Field(min_length=8, max_length=32)
    password: str = Field(min_length=6, max_length=128)
    languages: str = Field(default="Hindi, English")
    bio: str = Field(default="", max_length=1000)
    profile_photo_url: Optional[str] = Field(default="")
    rate_chat_15m: Optional[int] = Field(default=99, ge=10, le=10000)
    rate_audio_30m: Optional[int] = Field(default=299, ge=10, le=10000)
    rate_video_30m: Optional[int] = Field(default=499, ge=10, le=10000)
    hourly_rate: Optional[int] = Field(default=None)
    allows_chat: Optional[bool] = True
    allows_audio: Optional[bool] = True
    allows_video: Optional[bool] = False
    terms_accepted: bool = True

    @model_validator(mode="before")
    @classmethod
    def populate_defaults(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if not data.get("full_name") and data.get("legal_name"):
                data["full_name"] = data["legal_name"]
            if not data.get("legal_name") and data.get("full_name"):
                data["legal_name"] = data["full_name"]
            if data.get("hourly_rate") and not data.get("rate_chat_15m"):
                try:
                    data["rate_chat_15m"] = int(data["hourly_rate"])
                except Exception:
                    data["rate_chat_15m"] = 99
        return data

class LoginIn(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=1)
    remember_me: bool = False

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    full_name: str
    email: str
    avatar_url: Optional[str] = None
    partner_id: Optional[int] = None
    partner_status: Optional[str] = None
    subscription_paid: Optional[bool] = False
    wallet_balance_inr: Optional[int] = 0

class UserProfileOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str
    account_status: str
    avatar_url: Optional[str] = None
    subscription_paid: Optional[bool] = False
    wallet_balance_inr: Optional[int] = 0
    created_at: datetime

class PartnerProfileOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    display_name: str
    bio: str
    profile_photo_url: str
    languages: List[str]
    verification_status: str
    availability_status: str
    rating_average: float
    review_count: int
    total_chats: int
    total_calls: int
    rate_chat_15m: int
    rate_audio_30m: int
    rate_video_30m: int
    created_at: datetime

# --- Availability & Booking Schemas ---

class AvailabilityItem(BaseModel):
    weekday: str
    start_time: str
    end_time: str
    communication_type: str = "all"
    is_available: bool = True

class AvailabilityUpdateIn(BaseModel):
    slots: List[AvailabilityItem]

class BookingCreateIn(BaseModel):
    partner_id: int
    package_id: Optional[int] = None
    scheduled_start: datetime
    communication_type: str = Field(..., pattern="^(chat|audio|video)$")
    duration_minutes: int = Field(default=30, ge=15, le=120)

class BookingOut(BaseModel):
    id: int
    booking_code: str
    user_id: int
    user_name: str
    partner_id: int
    partner_name: str
    partner_photo: Optional[str] = None
    scheduled_start: datetime
    scheduled_end: datetime
    communication_type: str
    booking_status: str
    payment_status: str
    total_amount: int
    created_at: datetime

# --- Payment Schemas ---

class CreateOrderIn(BaseModel):
    booking_id: int

class VerifyPaymentIn(BaseModel):
    booking_id: int
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class StandardCreateOrderIn(BaseModel):
    amount: int = Field(..., ge=100, description="Amount in paise (minimum 100 paise = 1 INR)")
    currency: Optional[str] = "INR"
    receipt: Optional[str] = None
    notes: Optional[Dict[str, Any]] = None

class StandardVerifyPaymentIn(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class PaymentOut(BaseModel):
    id: int
    booking_id: int
    amount: int
    currency: str
    payment_status: str
    provider_order_id: str
    provider_payment_id: Optional[str] = None
    created_at: datetime

# --- Partner Document Verification ---

class DocumentSubmitIn(BaseModel):
    document_type: str = Field(..., pattern="^(aadhaar|pan|driving_license|passport)$")
    document_number: Optional[str] = None
    document_data_url: str # Base64 or uploaded URL

# --- Conversation & Message Schemas ---

class MessageSendIn(BaseModel):
    message_text: str = Field(min_length=1, max_length=4000)
    message_type: str = "text"

class MessageOut(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    sender_name: str
    sender_role: str
    message_type: str
    message_text: str
    sent_at: datetime

class ConversationOut(BaseModel):
    id: int
    booking_id: Optional[int] = None
    user_id: int
    partner_id: int
    partner_name: str
    partner_photo: Optional[str] = None
    user_name: str
    communication_type: str
    status: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    duration_seconds: int = 0
    last_message: Optional[str] = None

# --- Reviews & Reports ---

class ReviewCreateIn(BaseModel):
    booking_id: int
    rating: int = Field(ge=1, le=5)
    review_text: str = Field(default="", max_length=1000)

class ReviewOut(BaseModel):
    id: int
    booking_id: int
    user_id: int
    user_name: str
    partner_id: int
    rating: int
    review_text: str
    created_at: datetime

class ReportCreateIn(BaseModel):
    reported_user_id: int
    booking_id: Optional[int] = None
    reason: str = Field(min_length=3, max_length=100)
    description: str = Field(default="", max_length=1000)

class BlockUserIn(BaseModel):
    blocked_user_id: int

# --- Admin Schemas ---

class PartnerStatusUpdateIn(BaseModel):
    verification_status: str = Field(..., pattern="^(approved|rejected|under_review|suspended)$")
    reason: Optional[str] = None
    admin_notes: Optional[str] = None

class UserStatusUpdateIn(BaseModel):
    account_status: str = Field(..., pattern="^(active|suspended|rejected)$")
    reason: Optional[str] = None

class PackageCreateIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    description: str = Field(default="", max_length=500)
    duration_minutes: int = Field(ge=5, le=240)
    communication_type: str = Field(..., pattern="^(chat|audio|video)$")
    price: int = Field(ge=0, le=100000)
    badge: Optional[str] = None

class SettingsUpdateIn(BaseModel):
    platform_name: Optional[str] = None
    commission_percentage: Optional[int] = Field(default=None, ge=0, le=100)
    support_email: Optional[str] = None
    support_phone: Optional[str] = None
    maintenance_mode: Optional[bool] = None
    cancellation_hours: Optional[int] = None


# ============================================================================
# EXTENDED COUNSELLOR & MENTOR PORTAL SCHEMAS
# ============================================================================

class PartnerProfileUpdateIn(BaseModel):
    headline: Optional[str] = Field(default=None, max_length=200)
    bio: Optional[str] = Field(default=None, max_length=2000)
    languages: Optional[str] = Field(default=None, max_length=255)
    experience_years: Optional[int] = Field(default=None, ge=0, le=50)
    education: Optional[str] = Field(default=None, max_length=300)
    city: Optional[str] = Field(default=None, max_length=120)
    timezone: Optional[str] = Field(default=None, max_length=60)
    intro_video_url: Optional[str] = Field(default=None, max_length=500)
    rate_chat_15m: Optional[int] = Field(default=None, ge=10, le=10000)
    rate_audio_30m: Optional[int] = Field(default=None, ge=10, le=10000)
    rate_video_30m: Optional[int] = Field(default=None, ge=10, le=10000)
    bank_name: Optional[str] = Field(default=None, max_length=120)
    bank_account_number: Optional[str] = Field(default=None, max_length=50)
    bank_ifsc: Optional[str] = Field(default=None, max_length=30)
    bank_account_holder: Optional[str] = Field(default=None, max_length=120)


class ExpertiseItem(BaseModel):
    category_name: str
    subcategories: List[str] = []
    skills: List[str] = []
    is_primary: bool = False


class ExpertiseUpdateIn(BaseModel):
    expertises: List[ExpertiseItem]


class QualificationIn(BaseModel):
    degree_title: str = Field(min_length=2, max_length=150)
    institution: str = Field(min_length=2, max_length=200)
    year_completed: int = Field(ge=1960, le=2030)
    certificate_url: Optional[str] = None


class SlotItem(BaseModel):
    slot_date: date
    start_time: str
    end_time: str
    communication_type: str = "all"


class SlotBatchIn(BaseModel):
    slots: List[SlotItem]
    block_dates: Optional[List[date]] = []


class WithdrawalRequestIn(BaseModel):
    amount_inr: int = Field(ge=500, le=500000)
    bank_name: Optional[str] = None
    account_number: Optional[str] = None
    ifsc_code: Optional[str] = None
    account_holder: Optional[str] = None


class WorkshopCreateIn(BaseModel):
    title: str = Field(min_length=5, max_length=200)
    description: str = Field(default="", max_length=3000)
    category: str = Field(default="Relationship Wellness", max_length=100)
    scheduled_at: datetime
    duration_minutes: int = Field(default=60, ge=15, le=240)
    capacity: int = Field(default=25, ge=2, le=500)
    fee_inr: int = Field(default=499, ge=0, le=100000)
    cover_image_url: Optional[str] = None


class LiveSessionCreateIn(BaseModel):
    title: str = Field(min_length=5, max_length=200)
    description: str = Field(default="", max_length=2000)
    category: str = Field(default="General Guidance", max_length=100)
    scheduled_at: datetime


class LiveSessionCommentIn(BaseModel):
    comment_text: str = Field(min_length=1, max_length=500)
    is_question: bool = False


class SupportTicketCreateIn(BaseModel):
    category: str = Field(default="Earnings & Payouts", max_length=60)
    subject: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=5, max_length=3000)
    priority: str = Field(default="medium", pattern="^(low|medium|high|urgent)$")


class SupportMessageIn(BaseModel):
    message: str = Field(min_length=1, max_length=3000)
    attachment_url: Optional[str] = None


class ReviewReplyIn(BaseModel):
    reply_text: str = Field(min_length=2, max_length=1000)


# --- User Wallet Schemas ---

class UserWalletTopupOrderIn(BaseModel):
    amount_inr: int = Field(ge=50, le=100000, description="Top-up amount in INR (minimum 50)")

class UserWalletVerifyTopupIn(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    amount_inr: int = Field(ge=50, le=100000)

class UserWalletDeductIn(BaseModel):
    session_type: str = Field(pattern="^(chat|audio|video)$")
    partner_id: Optional[int] = None
    minutes: int = Field(default=15, ge=1, le=480)
    amount_inr: int = Field(ge=1, le=50000)
    description: Optional[str] = None


