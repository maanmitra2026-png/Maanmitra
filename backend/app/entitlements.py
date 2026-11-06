from datetime import datetime, date, timedelta
from typing import Optional, Dict, Any
import json
import os
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.subscription_models import (
    SubscriptionPlan,
    UserSubscription,
    DailyUsageTracking,
    SystemConfig
)

def get_system_config(db: Session, key: str, default: int) -> int:
    """Retrieve numeric system configuration with fallback to env var and code default."""
    cfg = db.query(SystemConfig).filter_by(key=key).first()
    if cfg and cfg.value.isdigit():
        return int(cfg.value)
    env_val = os.getenv(key)
    if env_val and env_val.isdigit():
        return int(env_val)
    return default

class SubscriptionEntitlementService:
    """
    Central entitlement service determining feature access, subscription status,
    and server-side usage allowances for MANMITRA.
    """

    @staticmethod
    def get_active_subscription(db: Session, user_id: int) -> Optional[UserSubscription]:
        """
        Fetch the current valid subscription for a user.
        A subscription is active if status is 'active' or 'cancelled' (grace period)
        and current_period_end is in the future.
        """
        now = datetime.utcnow()
        sub = (
            db.query(UserSubscription)
            .filter(
                UserSubscription.user_id == user_id,
                UserSubscription.status.in_(["active", "cancelled"]),
                UserSubscription.current_period_end >= now
            )
            .order_by(UserSubscription.id.desc())
            .first()
        )
        return sub

    @classmethod
    def get_user_plan_code(cls, db: Session, user_id: int) -> Optional[str]:
        sub = cls.get_active_subscription(db, user_id)
        if not sub:
            return None
        plan = db.get(SubscriptionPlan, sub.plan_id)
        return plan.code if plan else None

    @classmethod
    def get_or_create_daily_usage(cls, db: Session, user_id: int, target_date: Optional[date] = None) -> DailyUsageTracking:
        today = target_date or date.today()
        usage = db.query(DailyUsageTracking).filter_by(user_id=user_id, usage_date=today).first()
        if not usage:
            usage = DailyUsageTracking(user_id=user_id, usage_date=today)
            db.add(usage)
            db.commit()
            db.refresh(usage)
        return usage

    @classmethod
    def get_entitlements(cls, db: Session, user_id: int) -> Dict[str, Any]:
        """
        Calculate full entitlement matrix, remaining limits, and active subscription details.
        """
        sub = cls.get_active_subscription(db, user_id)
        plan_code = None
        plan_name = "Free Member"
        status_str = "no_subscription"
        current_period_end_iso = None
        plan_id = None
        amount_inr = 0
        billing_period = "monthly"

        if sub:
            plan = db.get(SubscriptionPlan, sub.plan_id)
            if plan:
                plan_code = plan.code # "BASIC" or "PREMIUM"
                plan_name = plan.name
                plan_id = plan.id
                amount_inr = plan.amount_inr
                billing_period = plan.billing_period
            status_str = sub.status
            current_period_end_iso = sub.current_period_end.isoformat()

        # Configurable limits
        basic_msg_limit = get_system_config(db, "BASIC_DAILY_MESSAGE_LIMIT", 20)
        prem_msg_limit = get_system_config(db, "PREMIUM_DAILY_MESSAGE_LIMIT", 200)
        basic_ai_limit = get_system_config(db, "BASIC_AI_DAILY_LIMIT", 5)
        prem_ai_limit = get_system_config(db, "PREMIUM_AI_DAILY_LIMIT", 50)
        prem_counselling_limit = get_system_config(db, "PREMIUM_INCLUDED_COUNSELLING_MONTHLY", 1)

        usage = cls.get_or_create_daily_usage(db, user_id)

        # Build feature map
        is_premium = (plan_code == "PREMIUM")
        is_basic = (plan_code == "BASIC")
        is_paid = is_premium or is_basic

        daily_message_limit = prem_msg_limit if is_premium else (basic_msg_limit if is_basic else 0)
        remaining_messages = max(0, daily_message_limit - usage.text_messages_count) if is_paid else 0

        daily_ai_limit = prem_ai_limit if is_premium else (basic_ai_limit if is_basic else 0)
        ai_used = (usage.premium_ai_count if is_premium else usage.basic_ai_count) if is_paid else 0
        remaining_ai = max(0, daily_ai_limit - ai_used) if is_paid else 0

        # Calculate monthly counselling allowance used for Premium
        counselling_sessions_used = 0
        if is_premium and sub:
            # Query appointments in current billing period
            from app.main import Appointment
            counselling_sessions_used = (
                db.query(Appointment)
                .filter(
                    Appointment.user_id == user_id,
                    Appointment.created_at >= sub.current_period_start,
                    Appointment.created_at <= sub.current_period_end,
                    Appointment.status.in_(["requested", "confirmed", "completed"])
                )
                .count()
            )
        remaining_counselling = max(0, prem_counselling_limit - counselling_sessions_used) if is_premium else 0

        features = {
            "matchmaking": True,
            "basic_messaging": is_paid,
            "premium_messaging": is_premium,
            "voice_calling": is_premium,
            "video_calling": is_premium,
            "free_content": True,
            "premium_content": is_premium,
            "basic_ai_guidance": is_paid,
            "advanced_ai_guidance": is_premium,
            "personal_counselling": is_premium,
            "advanced_compatibility": is_premium,
            "personal_growth_tracking": is_paid
        }

        return {
            "has_active_subscription": is_paid,
            "plan_code": plan_code,
            "plan_name": plan_name,
            "plan_id": plan_id,
            "amount_inr": amount_inr,
            "billing_period": billing_period,
            "status": status_str,
            "current_period_end": current_period_end_iso,
            "features": features,
            "limits": {
                "daily_messages_max": daily_message_limit,
                "daily_messages_used": usage.text_messages_count,
                "daily_messages_remaining": remaining_messages,
                "daily_ai_max": daily_ai_limit,
                "daily_ai_used": ai_used,
                "daily_ai_remaining": remaining_ai,
                "monthly_counselling_max": prem_counselling_limit if is_premium else 0,
                "monthly_counselling_used": counselling_sessions_used,
                "monthly_counselling_remaining": remaining_counselling
            }
        }

    @classmethod
    def check_message_permission(cls, db: Session, user_id: int):
        """
        Validate whether the user is permitted to send a text message right now.
        Raises HTTPException(403) with upgrade instructions if not permitted.
        """
        entitlements = cls.get_entitlements(db, user_id)
        if not entitlements["features"]["basic_messaging"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="A paid MANMITRA membership (Basic or Premium) is required to send messages to your connections.",
                headers={"X-Upgrade-Required": "BASIC"}
            )
        
        limits = entitlements["limits"]
        if limits["daily_messages_remaining"] <= 0:
            plan = entitlements["plan_code"]
            if plan == "BASIC":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Daily message limit ({limits['daily_messages_max']} messages/day) reached for MANMITRA Basic. Upgrade to Premium for 200 messages/day.",
                    headers={"X-Upgrade-Required": "PREMIUM"}
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Daily message limit ({limits['daily_messages_max']} messages/day) reached for today. Allowance resets at midnight.",
                    headers={"X-Upgrade-Required": "NONE"}
                )

    @classmethod
    def increment_message_count(cls, db: Session, user_id: int):
        usage = cls.get_or_create_daily_usage(db, user_id)
        usage.text_messages_count += 1
        db.commit()

    @classmethod
    def check_calling_permission(cls, db: Session, user_id: int, mode: str = "voice"):
        """
        Voice and video calling are strictly reserved for MANMITRA Premium members.
        """
        entitlements = cls.get_entitlements(db, user_id)
        if not entitlements["features"]["voice_calling"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"{mode.capitalize()} calling is an exclusive feature of MANMITRA Premium (₹999/month). Please upgrade to connect live.",
                headers={"X-Upgrade-Required": "PREMIUM"}
            )

    @classmethod
    def check_counselling_permission(cls, db: Session, user_id: int):
        """
        Validate personal counselling allowance for Premium members.
        """
        entitlements = cls.get_entitlements(db, user_id)
        if not entitlements["features"]["personal_counselling"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Personal counselling sessions are exclusively included with MANMITRA Premium (₹999/month).",
                headers={"X-Upgrade-Required": "PREMIUM"}
            )
        
        limits = entitlements["limits"]
        if limits["monthly_counselling_remaining"] <= 0:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Included counselling allowance ({limits['monthly_counselling_max']} session/month) for this billing period has already been scheduled.",
                headers={"X-Upgrade-Required": "RENEWAL"}
            )

    @classmethod
    def check_content_access(cls, db: Session, user_id: Optional[int], access_level: str):
        """
        Check if user is entitled to view FREE or PREMIUM content.
        """
        if access_level == "FREE":
            return True
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required to view Premium content."
            )
        entitlements = cls.get_entitlements(db, user_id)
        if not entitlements["features"]["premium_content"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This resource is exclusively available to MANMITRA Premium members (₹999/month).",
                headers={"X-Upgrade-Required": "PREMIUM"}
            )
        return True

    @classmethod
    def check_ai_permission(cls, db: Session, user_id: int, is_advanced: bool = False):
        """
        Check AI relationship guidance permission and daily usage limits.
        """
        entitlements = cls.get_entitlements(db, user_id)
        if is_advanced and not entitlements["features"]["advanced_ai_guidance"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Advanced AI compatibility analysis and deep relationship guidance are exclusive to MANMITRA Premium (₹999/month).",
                headers={"X-Upgrade-Required": "PREMIUM"}
            )
        if not entitlements["features"]["basic_ai_guidance"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="AI relationship guidance is available for MANMITRA Basic and Premium members.",
                headers={"X-Upgrade-Required": "BASIC"}
            )
        
        limits = entitlements["limits"]
        if limits["daily_ai_remaining"] <= 0:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Daily AI guidance limit of {limits['daily_ai_max']} queries reached for today. Allowance resets tomorrow.",
                headers={"X-Upgrade-Required": "PREMIUM" if entitlements["plan_code"] == "BASIC" else "NONE"}
            )

    @classmethod
    def increment_ai_count(cls, db: Session, user_id: int, is_advanced: bool = False):
        usage = cls.get_or_create_daily_usage(db, user_id)
        if is_advanced:
            usage.premium_ai_count += 1
        else:
            usage.basic_ai_count += 1
        db.commit()
