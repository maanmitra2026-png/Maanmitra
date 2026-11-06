import os
import hmac
import hashlib
import uuid
from typing import Optional, Dict, Any, Tuple
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

try:
    import razorpay
except ImportError:
    razorpay = None

from app.subscription_models import (
    SubscriptionPlan,
    UserSubscription,
    PaymentTransaction
)

class PaymentGatewayService:
    """
    Razorpay Payment Gateway integration service.
    Handles order creation, cryptographic HMAC-SHA256 signature verification,
    webhook verification, and idempotent subscription activations.
    """

    @staticmethod
    def get_credentials() -> Tuple[str, str, str]:
        key_id = os.getenv("RAZORPAY_KEY_ID", "rzp_test_placeholder_key_id")
        key_secret = os.getenv("RAZORPAY_KEY_SECRET", "placeholder_secret_key_never_commit_real_secrets")
        webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "placeholder_webhook_secret")
        return key_id, key_secret, webhook_secret

    @classmethod
    def is_live_configured(cls) -> bool:
        key_id, key_secret, _ = cls.get_credentials()
        return (
            razorpay is not None and
            not key_id.startswith("rzp_test_placeholder") and
            not key_secret.startswith("placeholder_") and
            len(key_id) > 8 and
            len(key_secret) > 8
        )

    @classmethod
    def create_order(cls, db: Session, user_id: int, plan: SubscriptionPlan) -> Dict[str, Any]:
        """
        Create a Razorpay order for the selected subscription plan.
        Stores the created payment transaction in the database.
        """
        amount_paise = plan.amount_inr * 100
        receipt = f"rcpt_u{user_id}_{uuid.uuid4().hex[:10]}"
        key_id, key_secret, _ = cls.get_credentials()

        provider_order_id = None
        if cls.is_live_configured():
            try:
                client = razorpay.Client(auth=(key_id, key_secret))
                order_data = {
                    "amount": amount_paise,
                    "currency": "INR",
                    "receipt": receipt,
                    "notes": {
                        "user_id": str(user_id),
                        "plan_code": plan.code,
                        "plan_name": plan.name
                    }
                }
                rzp_order = client.order.create(data=order_data)
                provider_order_id = rzp_order["id"]
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Payment gateway error while creating order: {str(e)}"
                )
        else:
            # Deterministic, unique test order ID for development and automated test environments
            provider_order_id = f"order_mock_{uuid.uuid4().hex[:16]}"

        # Record payment transaction in status 'created'
        transaction = PaymentTransaction(
            user_id=user_id,
            provider_order_id=provider_order_id,
            amount=plan.amount_inr,
            currency="INR",
            status="created",
            idempotency_key=f"checkout_{provider_order_id}"
        )
        db.add(transaction)
        db.commit()
        db.refresh(transaction)

        return {
            "order_id": provider_order_id,
            "amount": amount_paise,
            "currency": "INR",
            "key_id": key_id,
            "plan_code": plan.code,
            "plan_name": plan.name,
            "amount_inr": plan.amount_inr,
            "billing_period": plan.billing_period,
            "is_mock": not cls.is_live_configured()
        }

    @classmethod
    def verify_payment_signature(
        cls,
        order_id: str,
        payment_id: str,
        signature: str
    ) -> bool:
        """
        Verify Razorpay HMAC-SHA256 signature server-side.
        Formula: HMAC-SHA256(order_id + "|" + payment_id, secret)
        """
        _, key_secret, _ = cls.get_credentials()
        msg = f"{order_id}|{payment_id}".encode("utf-8")
        secret_bytes = key_secret.encode("utf-8")
        expected_signature = hmac.new(secret_bytes, msg, hashlib.sha256).hexdigest()

        # Constant-time comparison
        if hmac.compare_digest(expected_signature, signature):
            return True

        # In mock mode, allow test signature format
        if not cls.is_live_configured() and signature.startswith("sig_mock_"):
            return True

        return False

    @classmethod
    def verify_and_activate(
        cls,
        db: Session,
        user_id: int,
        order_id: str,
        payment_id: str,
        signature: str
    ) -> Dict[str, Any]:
        """
        Verify payment signature and activate the corresponding UserSubscription.
        Ensures idempotent activation without duplicate records.
        """
        # 1. Signature check
        if not cls.verify_payment_signature(order_id, payment_id, signature):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment signature verification failed. Untrusted or tampered payment request."
            )

        # 2. Find transaction
        transaction = db.query(PaymentTransaction).filter_by(provider_order_id=order_id).first()
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment order not found."
            )
        if transaction.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Payment order does not belong to the authenticated user."
            )

        # 3. Idempotency check: if already verified, return existing active subscription
        if transaction.status == "verified" and transaction.subscription_id:
            existing_sub = db.get(UserSubscription, transaction.subscription_id)
            if existing_sub:
                plan = db.get(SubscriptionPlan, existing_sub.plan_id)
                return {
                    "activated": True,
                    "idempotent": True,
                    "subscription_id": existing_sub.id,
                    "plan_code": plan.code if plan else "UNKNOWN",
                    "plan_name": plan.name if plan else "MANMITRA Plan",
                    "status": existing_sub.status,
                    "current_period_end": existing_sub.current_period_end.isoformat()
                }

        # 4. Resolve plan from order amount (₹499 -> BASIC, ₹999 -> PREMIUM)
        plan = db.query(SubscriptionPlan).filter_by(amount_inr=transaction.amount, is_active=True).first()
        if not plan:
            # Fallback to amount matching
            plan = db.query(SubscriptionPlan).filter_by(amount_inr=transaction.amount).first()
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"No matching active subscription plan found for amount ₹{transaction.amount}."
            )

        # 5. Create or extend UserSubscription
        now = datetime.utcnow()
        period_end = now + timedelta(days=30) # Monthly subscription

        subscription = UserSubscription(
            user_id=user_id,
            plan_id=plan.id,
            status="active",
            started_at=now,
            current_period_start=now,
            current_period_end=period_end,
            payment_provider="razorpay",
            provider_subscription_id=payment_id
        )
        db.add(subscription)
        db.flush()

        # Update transaction
        transaction.subscription_id = subscription.id
        transaction.provider_payment_id = payment_id
        transaction.status = "verified"
        transaction.verified_at = now
        db.commit()
        db.refresh(subscription)

        return {
            "activated": True,
            "idempotent": False,
            "subscription_id": subscription.id,
            "plan_code": plan.code,
            "plan_name": plan.name,
            "status": subscription.status,
            "current_period_end": subscription.current_period_end.isoformat(),
            "message": f"Welcome to {plan.name}! Your membership is now active."
        }

    @classmethod
    def verify_webhook_signature(cls, raw_body: bytes, webhook_signature: str) -> bool:
        """
        Verify Razorpay Webhook signature against raw payload.
        """
        _, _, webhook_secret = cls.get_credentials()
        expected = hmac.new(
            webhook_secret.encode("utf-8"),
            raw_body,
            hashlib.sha256
        ).hexdigest()

        if hmac.compare_digest(expected, webhook_signature):
            return True

        if not cls.is_live_configured() and webhook_signature.startswith("sig_webhook_mock_"):
            return True

        return False

    @classmethod
    def process_webhook(cls, db: Session, payload: Dict[str, Any], raw_body: bytes, signature: str) -> Dict[str, Any]:
        """
        Idempotent Webhook event processor for Razorpay.
        """
        if not cls.verify_webhook_signature(raw_body, signature):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid webhook signature."
            )

        event = payload.get("event")
        event_payload = payload.get("payload", {})
        payment_entity = event_payload.get("payment", {}).get("entity", {})
        order_id = payment_entity.get("order_id")
        payment_id = payment_entity.get("id")

        if not order_id:
            return {"status": "ignored", "reason": "No order_id in webhook payload"}

        tx = db.query(PaymentTransaction).filter_by(provider_order_id=order_id).first()
        if not tx:
            return {"status": "ignored", "reason": "Order not found in system"}

        if event in ("payment.captured", "order.paid"):
            if tx.status == "verified":
                return {"status": "already_processed", "order_id": order_id}

            plan = db.query(SubscriptionPlan).filter_by(amount_inr=tx.amount).first()
            if plan:
                now = datetime.utcnow()
                sub = UserSubscription(
                    user_id=tx.user_id,
                    plan_id=plan.id,
                    status="active",
                    started_at=now,
                    current_period_start=now,
                    current_period_end=now + timedelta(days=30),
                    payment_provider="razorpay",
                    provider_subscription_id=payment_id
                )
                db.add(sub)
                db.flush()
                tx.subscription_id = sub.id
                tx.provider_payment_id = payment_id
                tx.status = "verified"
                tx.verified_at = now
                db.commit()
                return {"status": "activated", "order_id": order_id}

        elif event == "payment.failed":
            tx.status = "failed"
            db.commit()
            return {"status": "marked_failed", "order_id": order_id}

        elif event == "refund.processed":
            tx.status = "refunded"
            if tx.subscription_id:
                sub = db.get(UserSubscription, tx.subscription_id)
                if sub:
                    sub.status = "expired"
            db.commit()
            return {"status": "refund_processed", "order_id": order_id}

        return {"status": "unhandled_event", "event": event}
