from datetime import datetime, date, timedelta
from typing import Optional
from sqlalchemy import String, Integer, Boolean, DateTime, Date, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Import Base from main so all models share the same declarative metadata and tables
from app.main import Base

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True) # "BASIC" or "PREMIUM" only
    name: Mapped[str] = mapped_column(String(100)) # "MANMITRA Basic" or "MANMITRA Premium"
    amount_inr: Mapped[int] = mapped_column(Integer) # 499 or 999
    billing_period: Mapped[str] = mapped_column(String(30), default="monthly") # Configurable billing period
    feature_configuration: Mapped[str] = mapped_column(Text) # JSON configuration of features & allowances
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserSubscription(Base):
    __tablename__ = "user_subscriptions"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("subscription_plans.id"), index=True)
    status: Mapped[str] = mapped_column(String(30), default="active", index=True) # active, expired, cancelled, pending_payment, failed
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    current_period_start: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    current_period_end: Mapped[datetime] = mapped_column(DateTime, index=True)
    cancelled_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    payment_provider: Mapped[str] = mapped_column(String(50), default="razorpay")
    provider_subscription_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    subscription_id: Mapped[Optional[int]] = mapped_column(ForeignKey("user_subscriptions.id", ondelete="SET NULL"), nullable=True, index=True)
    provider_order_id: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    provider_payment_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    amount: Mapped[int] = mapped_column(Integer) # In INR
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    status: Mapped[str] = mapped_column(String(30), default="created") # created, verified, failed, refunded
    idempotency_key: Mapped[Optional[str]] = mapped_column(String(120), unique=True, nullable=True, index=True)
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class ContentItem(Base):
    __tablename__ = "content_items"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(50), default="relationship_guidance", index=True) # relationship_guidance, co_living_harmony, lifestyle, wellness
    access_level: Mapped[str] = mapped_column(String(20), default="FREE", index=True) # "FREE" or "PREMIUM"
    summary: Mapped[str] = mapped_column(String(500))
    body: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str] = mapped_column(String(500), default="")
    author_name: Mapped[str] = mapped_column(String(120), default="MANMITRA Editorial")
    read_time_minutes: Mapped[int] = mapped_column(Integer, default=5)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class DailyUsageTracking(Base):
    __tablename__ = "daily_usage_tracking"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    usage_date: Mapped[date] = mapped_column(Date, default=date.today, index=True)
    text_messages_count: Mapped[int] = mapped_column(Integer, default=0)
    basic_ai_count: Mapped[int] = mapped_column(Integer, default=0)
    premium_ai_count: Mapped[int] = mapped_column(Integer, default=0)
    counselling_sessions_used: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (UniqueConstraint("user_id", "usage_date", name="uq_user_daily_usage"),)

class SystemConfig(Base):
    __tablename__ = "system_configs"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    key: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    value: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String(255), default="")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
