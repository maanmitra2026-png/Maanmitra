import pytest
from datetime import datetime, date, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import (
    app, get_db, Base, User, Connection, Message, Appointment,
    CounsellingCategory, Counsellor, hash_password, create_token
)
from app.subscription_models import (
    SubscriptionPlan,
    UserSubscription,
    PaymentTransaction,
    ContentItem,
    DailyUsageTracking,
    SystemConfig
)
from app.entitlements import SubscriptionEntitlementService
from app.payment_service import PaymentGatewayService

from sqlalchemy.pool import StaticPool

# Use an isolated SQLite test database
TEST_DB_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DB_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_test_database():
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    
    # Seed default plans: BASIC (499) and PREMIUM (999)
    basic_plan = SubscriptionPlan(
        code="BASIC",
        name="MANMITRA Basic",
        amount_inr=499,
        billing_period="monthly",
        feature_configuration='{"message_limit_daily": 20, "ai_limit_daily": 5}',
        is_active=True
    )
    premium_plan = SubscriptionPlan(
        code="PREMIUM",
        name="MANMITRA Premium",
        amount_inr=999,
        billing_period="monthly",
        feature_configuration='{"message_limit_daily": 200, "ai_limit_daily": 50, "calling_enabled": true, "counselling_sessions_included": 1}',
        is_active=True
    )
    db.add_all([basic_plan, premium_plan])

    # Seed default system configs
    db.add_all([
        SystemConfig(key="BASIC_DAILY_MESSAGE_LIMIT", value="20"),
        SystemConfig(key="PREMIUM_DAILY_MESSAGE_LIMIT", value="200"),
        SystemConfig(key="BASIC_AI_DAILY_LIMIT", value="5"),
        SystemConfig(key="PREMIUM_AI_DAILY_LIMIT", value="50"),
        SystemConfig(key="PREMIUM_INCLUDED_COUNSELLING_MONTHLY", value="1")
    ])

    # Seed sample content
    c_free = ContentItem(
        title="Free Astrology Guide",
        category="astrology",
        access_level="FREE",
        summary="A free sample guide",
        body="Full content of the free astrological guidance article."
    )
    c_prem = ContentItem(
        title="Premium Synastry Chart Analysis",
        category="astrology",
        access_level="PREMIUM",
        summary="A premium masterclass summary",
        body="Full secret deep analysis exclusively for Premium members."
    )
    db.add_all([c_free, c_prem])

    # Seed 7 Counselling Categories
    if db.query(CounsellingCategory).count() == 0:
        db.add_all([
            CounsellingCategory(slug="relationship", title="Relationship Counselling", description="For communication difficulties.", icon="HeartHandshake", badge="Primary Care", sort_order=1),
            CounsellingCategory(slug="personal", title="Personal Guidance", description="For self-understanding.", icon="Sparkles", badge="Self-Clarity", sort_order=2),
            CounsellingCategory(slug="emotional", title="Emotional Support", description="A respectful space for difficult feelings.", icon="Heart", badge="Compassionate Space", sort_order=3),
            CounsellingCategory(slug="marriage_compat", title="Marriage and Compatibility Guidance", description="For relationship expectations.", icon="Compass", badge="Cohabitation & Future", sort_order=4),
            CounsellingCategory(slug="family_comm", title="Family and Communication Guidance", description="For interpersonal difficulties.", icon="Users", badge="Interpersonal Harmony", sort_order=5),
            CounsellingCategory(slug="professional", title="Professional Guidance", description="For direction toward suitable professionals.", icon="ShieldCheck", badge="Clinical Direction", sort_order=6),
            CounsellingCategory(slug="other", title="Other Counselling Services", description="Configurable category.", icon="PlusCircle", badge="Configurable", sort_order=7),
        ])

    # Seed initial verified counsellor
    if db.query(Counsellor).count() == 0:
        db.add(Counsellor(
            name="Dr. Meera Kulkarni",
            title="Senior Counseling Psychologist",
            qualification="Ph.D. in Clinical Psychology",
            experience_years=10,
            license_number="RCI-PSY-49182",
            bio="Specializes in relational dynamics and premarital communication protocols.",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
            primary_category="relationship",
            categories="relationship,emotional,marriage_compat",
            languages="English, Hindi, Marathi",
            fee_inr=1200,
            included_with_premium=True,
            cancellation_terms="Free cancellation up to 4 hours prior.",
            scope_of_practice="Evidence-based interpersonal therapy and boundary definition.",
            verification_status="Approved",
            verified=True,
            is_active=True,
            collaboration_agreed=True,
            rating=4.9,
            reviews_count=48,
            available_days="Mon, Tue, Wed, Thu, Fri, Sat",
            time_slots="10:00 AM, 11:30 AM, 02:00 PM, 04:00 PM"
        ))

    # Seed users: admin, free_user, basic_user, premium_user, peer_user
    admin = User(
        email="admin@test.com",
        username="admin",
        password_hash=hash_password("adminpass123"),
        full_name="Admin User",
        role="admin"
    )
    free_u = User(
        email="free@test.com",
        username="freeuser",
        password_hash=hash_password("password123"),
        full_name="Free Member"
    )
    basic_u = User(
        email="basic@test.com",
        username="basicuser",
        password_hash=hash_password("password123"),
        full_name="Basic Member"
    )
    prem_u = User(
        email="prem@test.com",
        username="premuser",
        password_hash=hash_password("password123"),
        full_name="Premium Member"
    )
    peer_u = User(
        email="peer@test.com",
        username="peeruser",
        password_hash=hash_password("password123"),
        full_name="Peer Connection"
    )
    db.add_all([admin, free_u, basic_u, prem_u, peer_u])
    db.commit()

    # Create active subscriptions for basic_user and premium_user
    now = datetime.utcnow()
    sub_basic = UserSubscription(
        user_id=basic_u.id,
        plan_id=basic_plan.id,
        status="active",
        started_at=now,
        current_period_start=now,
        current_period_end=now + timedelta(days=30)
    )
    sub_prem = UserSubscription(
        user_id=prem_u.id,
        plan_id=premium_plan.id,
        status="active",
        started_at=now,
        current_period_start=now,
        current_period_end=now + timedelta(days=30)
    )
    db.add_all([sub_basic, sub_prem])
    
    # Establish mutual connections between users and peer_u
    db.add_all([
        Connection(requester_id=free_u.id, receiver_id=peer_u.id, status="accepted"),
        Connection(requester_id=basic_u.id, receiver_id=peer_u.id, status="accepted"),
        Connection(requester_id=prem_u.id, receiver_id=peer_u.id, status="accepted")
    ])
    db.commit()
    db.close()
    
    yield
    
    Base.metadata.drop_all(bind=test_engine)

def auth_headers(user_id: int, role: str = "user"):
    token = create_token(user_id, role)
    return {"Authorization": f"Bearer {token}"}

# ==============================================================================
# TESTS
# ==============================================================================

def test_1_get_plans():
    """Ensure exactly two paid plans exist: BASIC (499) and PREMIUM (999)."""
    res = client.get("/api/plans")
    assert res.status_code == 200
    plans = res.json()
    assert len(plans) == 2
    codes = {p["code"] for p in plans}
    assert codes == {"BASIC", "PREMIUM"}
    amounts = {p["amount_inr"] for p in plans}
    assert amounts == {499, 999}

def test_2_basic_plan_entitlements():
    """Verify Basic user receives basic messaging & AI limits, but calling/counselling/premium content are False."""
    db = TestingSessionLocal()
    basic_u = db.query(User).filter_by(username="basicuser").first()
    ent = SubscriptionEntitlementService.get_entitlements(db, basic_u.id)
    assert ent["plan_code"] == "BASIC"
    assert ent["features"]["basic_messaging"] is True
    assert ent["features"]["voice_calling"] is False
    assert ent["features"]["video_calling"] is False
    assert ent["features"]["personal_counselling"] is False
    assert ent["features"]["premium_content"] is False
    assert ent["limits"]["daily_messages_max"] == 20
    db.close()

def test_3_premium_plan_entitlements():
    """Verify Premium user has voice/video calling, counselling, and premium content."""
    db = TestingSessionLocal()
    prem_u = db.query(User).filter_by(username="premuser").first()
    ent = SubscriptionEntitlementService.get_entitlements(db, prem_u.id)
    assert ent["plan_code"] == "PREMIUM"
    assert ent["features"]["basic_messaging"] is True
    assert ent["features"]["premium_messaging"] is True
    assert ent["features"]["voice_calling"] is True
    assert ent["features"]["video_calling"] is True
    assert ent["features"]["personal_counselling"] is True
    assert ent["features"]["premium_content"] is True
    assert ent["limits"]["daily_messages_max"] == 200
    assert ent["limits"]["monthly_counselling_max"] == 1
    db.close()

def test_4_unauthenticated_cannot_access_paid_endpoints():
    """Unauthenticated requests to protected endpoints return 401."""
    assert client.get("/api/subscriptions/me").status_code == 401
    assert client.post("/api/subscriptions/checkout", json={"plan_code": "BASIC"}).status_code == 401
    assert client.post("/api/subscriptions/cancel").status_code == 401
    assert client.get("/api/subscriptions/usage").status_code == 401

def test_5_free_user_messaging_blocked_without_plan():
    """Free user attempting to send text message is blocked with upgrade required prompt."""
    db = TestingSessionLocal()
    free_u = db.query(User).filter_by(username="freeuser").first()
    peer = db.query(User).filter_by(username="peeruser").first()
    res = client.post(
        f"/api/messages/{peer.id}",
        json={"body": "Hello peer!"},
        headers=auth_headers(free_u.id)
    )
    assert res.status_code == 403
    assert "paid MANMITRA membership" in res.json()["detail"]
    db.close()

def test_6_basic_user_can_message_up_to_daily_limit():
    """Basic user can message until hitting limit (20 messages/day)."""
    db = TestingSessionLocal()
    basic_u = db.query(User).filter_by(username="basicuser").first()
    peer = db.query(User).filter_by(username="peeruser").first()
    
    # Send 1 message
    res = client.post(
        f"/api/messages/{peer.id}",
        json={"body": "Message 1 from Basic member"},
        headers=auth_headers(basic_u.id)
    )
    assert res.status_code == 201

    # Simulate reaching daily limit
    usage = SubscriptionEntitlementService.get_or_create_daily_usage(db, basic_u.id)
    usage.text_messages_count = 20
    db.commit()

    # 21st message must be blocked with upgrade to Premium notice
    res_blocked = client.post(
        f"/api/messages/{peer.id}",
        json={"body": "Message 21 - should be blocked"},
        headers=auth_headers(basic_u.id)
    )
    assert res_blocked.status_code == 403
    assert "Daily message limit" in res_blocked.json()["detail"]
    assert "Upgrade to Premium" in res_blocked.json()["detail"]
    db.close()

def test_7_basic_user_cannot_call():
    """Basic user is blocked from initiating voice or video calls."""
    db = TestingSessionLocal()
    basic_u = db.query(User).filter_by(username="basicuser").first()
    peer = db.query(User).filter_by(username="peeruser").first()
    
    res = client.get(
        f"/api/calling/check/{peer.id}?mode=voice",
        headers=auth_headers(basic_u.id)
    )
    assert res.status_code == 403
    assert "exclusive feature of MANMITRA Premium" in res.json()["detail"]
    db.close()

def test_8_premium_user_can_call_accepted_connection():
    """Premium user can initiate voice/video call with accepted connection."""
    db = TestingSessionLocal()
    prem_u = db.query(User).filter_by(username="premuser").first()
    peer = db.query(User).filter_by(username="peeruser").first()

    res = client.get(
        f"/api/calling/check/{peer.id}?mode=video",
        headers=auth_headers(prem_u.id)
    )
    assert res.status_code == 200
    assert res.json()["eligible"] is True
    assert res.json()["mode"] == "video"
    db.close()

def test_9_calling_fails_if_not_connected():
    """Even Premium user cannot call strangers who are not mutual connections."""
    db = TestingSessionLocal()
    prem_u = db.query(User).filter_by(username="premuser").first()
    stranger = User(email="stranger@test.com", username="stranger", password_hash="hash", full_name="Stranger")
    db.add(stranger)
    db.commit()

    res = client.get(
        f"/api/calling/check/{stranger.id}?mode=voice",
        headers=auth_headers(prem_u.id)
    )
    assert res.status_code == 403
    assert "mutually accepted connections" in res.json()["detail"]
    db.close()

def test_10_content_access_free_vs_premium():
    """Free/Basic users see premium content as locked; Premium users view full content."""
    db = TestingSessionLocal()
    basic_u = db.query(User).filter_by(username="basicuser").first()
    prem_u = db.query(User).filter_by(username="premuser").first()
    c_prem = db.query(ContentItem).filter_by(access_level="PREMIUM").first()

    # Basic user direct view
    res_basic = client.get(f"/api/content/{c_prem.id}", params={"token": create_token(basic_u.id, "user")})
    assert res_basic.status_code == 403

    # Premium user direct view
    res_prem = client.get(f"/api/content/{c_prem.id}", params={"token": create_token(prem_u.id, "user")})
    assert res_prem.status_code == 200
    assert res_prem.json()["is_locked"] is False
    assert "Full secret deep analysis" in res_prem.json()["body"]
    db.close()

def test_11_counselling_booking_restricted_to_premium():
    """Basic users cannot book counselling appointments."""
    db = TestingSessionLocal()
    basic_u = db.query(User).filter_by(username="basicuser").first()
    res = client.post(
        "/api/appointments",
        json={
            "counsellor_name": "Dr. Meera Kulkarni",
            "appointment_date": (date.today() + timedelta(days=2)).isoformat(),
            "time_slot": "10:00 AM",
            "mode": "video"
        },
        headers=auth_headers(basic_u.id)
    )
    assert res.status_code == 403
    assert "exclusively included with MANMITRA Premium" in res.json()["detail"]
    db.close()

def test_12_counselling_booking_and_double_booking_prevention():
    """Premium user can book 1 included session, but cannot double book the same slot."""
    db = TestingSessionLocal()
    prem_u = db.query(User).filter_by(username="premuser").first()
    target_date = (date.today() + timedelta(days=3)).isoformat()

    # First booking succeeds
    res1 = client.post(
        "/api/appointments",
        json={
            "counsellor_name": "Dr. Meera Kulkarni",
            "appointment_date": target_date,
            "time_slot": "10:00 AM",
            "mode": "video"
        },
        headers=auth_headers(prem_u.id)
    )
    assert res1.status_code == 201

    # Second booking of the exact same slot is prevented (409 Conflict)
    res_double = client.post(
        "/api/appointments",
        json={
            "counsellor_name": "Dr. Meera Kulkarni",
            "appointment_date": target_date,
            "time_slot": "10:00 AM",
            "mode": "video"
        },
        headers=auth_headers(prem_u.id)
    )
    assert res_double.status_code == 409
    assert "already booked" in res_double.json()["detail"]
    db.close()

def test_13_counselling_monthly_allowance_enforcement():
    """Premium user cannot exceed included monthly session allowance without renewal/reschedule."""
    db = TestingSessionLocal()
    prem_u = db.query(User).filter_by(username="premuser").first()

    # Simulate 1 appointment already existing for this user in current billing period
    db.add(Appointment(
        user_id=prem_u.id,
        counsellor_name="Dr. Meera Kulkarni",
        appointment_date=date.today() + timedelta(days=5),
        time_slot="03:00 PM",
        mode="video",
        status="confirmed"
    ))
    db.commit()

    # Attempting to book a second session exceeds monthly limit (1/month)
    res = client.post(
        "/api/appointments",
        json={
            "counsellor_name": "Rohan Deshmukh",
            "appointment_date": (date.today() + timedelta(days=7)).isoformat(),
            "time_slot": "12:00 PM",
            "mode": "video"
        },
        headers=auth_headers(prem_u.id)
    )
    assert res.status_code == 403
    assert "counselling allowance" in res.json()["detail"]
    db.close()

def test_14_checkout_and_invalid_signature_rejected():
    """Checkout creates order; fake or tampered signature is rejected."""
    db = TestingSessionLocal()
    free_u = db.query(User).filter_by(username="freeuser").first()

    # Create checkout order
    res_order = client.post(
        "/api/subscriptions/checkout",
        json={"plan_code": "PREMIUM"},
        headers=auth_headers(free_u.id)
    )
    assert res_order.status_code == 200
    order_id = res_order.json()["order_id"]

    # Verify with invalid signature fails
    res_bad_sig = client.post(
        "/api/subscriptions/verify",
        json={
            "razorpay_order_id": order_id,
            "razorpay_payment_id": "pay_fake_12345",
            "razorpay_signature": "tampered_signature_hex"
        },
        headers=auth_headers(free_u.id)
    )
    assert res_bad_sig.status_code == 400
    assert "signature verification failed" in res_bad_sig.json()["detail"]
    db.close()

def test_15_valid_payment_activates_subscription_idempotently():
    """Valid signature activates subscription; repeating verification is idempotent."""
    db = TestingSessionLocal()
    free_u = db.query(User).filter_by(username="freeuser").first()

    # Checkout Basic (₹499)
    res_order = client.post(
        "/api/subscriptions/checkout",
        json={"plan_code": "BASIC"},
        headers=auth_headers(free_u.id)
    )
    order_id = res_order.json()["order_id"]

    # Test signature in mock mode
    test_sig = f"sig_mock_{order_id}_pay_valid_123"
    res_verify = client.post(
        "/api/subscriptions/verify",
        json={
            "razorpay_order_id": order_id,
            "razorpay_payment_id": "pay_valid_123",
            "razorpay_signature": test_sig
        },
        headers=auth_headers(free_u.id)
    )
    assert res_verify.status_code == 200
    assert res_verify.json()["activated"] is True
    assert res_verify.json()["plan_code"] == "BASIC"

    # Repeat verification: must be idempotent, return existing subscription
    res_repeat = client.post(
        "/api/subscriptions/verify",
        json={
            "razorpay_order_id": order_id,
            "razorpay_payment_id": "pay_valid_123",
            "razorpay_signature": test_sig
        },
        headers=auth_headers(free_u.id)
    )
    assert res_repeat.status_code == 200
    assert res_repeat.json()["idempotent"] is True
    db.close()

def test_16_subscription_cancellation_grace_period():
    """Cancellation updates status but preserves access until current_period_end."""
    db = TestingSessionLocal()
    basic_u = db.query(User).filter_by(username="basicuser").first()

    res_cancel = client.post("/api/subscriptions/cancel", headers=auth_headers(basic_u.id))
    assert res_cancel.status_code == 200
    assert res_cancel.json()["status"] == "cancelled"

    # User still retains entitlements during grace period
    ent = SubscriptionEntitlementService.get_entitlements(db, basic_u.id)
    assert ent["status"] == "cancelled"
    assert ent["has_active_subscription"] is True
    assert ent["features"]["basic_messaging"] is True
    db.close()

def test_17_subscription_expiration():
    """Expired subscription removes paid entitlements."""
    db = TestingSessionLocal()
    basic_u = db.query(User).filter_by(username="basicuser").first()
    sub = db.query(UserSubscription).filter_by(user_id=basic_u.id).first()
    sub.current_period_end = datetime.utcnow() - timedelta(days=1)
    db.commit()

    ent = SubscriptionEntitlementService.get_entitlements(db, basic_u.id)
    assert ent["has_active_subscription"] is False
    assert ent["plan_code"] is None
    assert ent["features"]["basic_messaging"] is False
    db.close()

def test_18_admin_endpoints_require_admin_role():
    """Non-admin user cannot access admin subscription management."""
    db = TestingSessionLocal()
    basic_u = db.query(User).filter_by(username="basicuser").first()
    admin_u = db.query(User).filter_by(username="admin").first()

    # Forbidden for basic member
    assert client.get("/api/admin/subscriptions", headers=auth_headers(basic_u.id)).status_code == 403
    assert client.get("/api/admin/subscriptions/stats", headers=auth_headers(basic_u.id)).status_code == 403
    assert client.get("/api/admin/payments", headers=auth_headers(basic_u.id)).status_code == 403

    # Permitted for admin
    res_admin = client.get("/api/admin/subscriptions/stats", headers=auth_headers(admin_u.id, "admin"))
    assert res_admin.status_code == 200
    stats = res_admin.json()
    assert "basic_members" in stats
    assert "premium_members" in stats
    db.close()

def test_19_ai_guidance_limits_and_disclaimer():
    """AI guidance endpoint enforces limits and includes required non-clinical disclaimer."""
    db = TestingSessionLocal()
    basic_u = db.query(User).filter_by(username="basicuser").first()
    
    res = client.post(
        "/api/ai/guidance",
        json={"topic": "communication", "query": "How can we handle chore divisions peacefully?"},
        headers=auth_headers(basic_u.id)
    )
    assert res.status_code == 200
    data = res.json()
    assert "guidance" in data
    assert "disclaimer" in data
    assert "does not constitute professional psychological evaluation" in data["disclaimer"]
    db.close()

def test_20_webhook_signature_and_idempotency():
    """Webhook verifies signature and processes order.paid event idempotently."""
    db = TestingSessionLocal()
    free_u = db.query(User).filter_by(username="freeuser").first()

    # Create an order
    res_order = client.post(
        "/api/subscriptions/checkout",
        json={"plan_code": "PREMIUM"},
        headers=auth_headers(free_u.id)
    )
    order_id = res_order.json()["order_id"]

    webhook_payload = {
        "event": "order.paid",
        "payload": {
            "payment": {
                "entity": {
                    "id": "pay_wh_123",
                    "order_id": order_id,
                    "amount": 99900,
                    "status": "captured"
                }
            }
        }
    }
    import json
    raw_bytes = json.dumps(webhook_payload).encode("utf-8")
    
    # Send with mock webhook signature
    res_wh = client.post(
        "/api/payments/webhook",
        content=raw_bytes,
        headers={"Content-Type": "application/json", "X-Razorpay-Signature": "sig_webhook_mock_test"}
    )
    assert res_wh.status_code == 200
    assert res_wh.json()["status"] in ("activated", "already_processed")

    # Repeat webhook: must return already_processed without duplicate activation
    res_repeat = client.post(
        "/api/payments/webhook",
        content=raw_bytes,
        headers={"Content-Type": "application/json", "X-Razorpay-Signature": "sig_webhook_mock_test"}
    )
    assert res_repeat.status_code == 200
    assert res_repeat.json()["status"] == "already_processed"
    db.close()

def test_21_counselling_categories_and_triage():
    """Verify categories and onboarding triage endpoints."""
    res_cats = client.get("/api/counselling/categories")
    assert res_cats.status_code == 200
    slugs = [c["slug"] for c in res_cats.json()]
    assert "relationship" in slugs
    assert "personal" in slugs
    assert "emotional" in slugs

    res_triage = client.get("/api/counselling/triage-options")
    assert res_triage.status_code == 200
    assert len(res_triage.json()) == 6

def test_22_counsellor_directory_and_filter():
    """Verify counsellor directory returns approved counsellors with filtering."""
    res = client.get("/api/counsellors")
    assert res.status_code == 200
    c_list = res.json()
    assert len(c_list) >= 1
    assert c_list[0]["name"] == "Dr. Meera Kulkarni"
    assert c_list[0]["verified"] is True

    res_filter = client.get("/api/counsellors?category=relationship")
    assert res_filter.status_code == 200
    assert len(res_filter.json()) >= 1

    res_empty = client.get("/api/counsellors?category=non_existent_category")
    assert res_empty.status_code == 200
    assert len(res_empty.json()) == 0

def test_23_counsellor_application_and_admin_workflow():
    """Verify professional application, status tracking, and admin verification."""
    db = TestingSessionLocal()
    c_user = db.query(User).filter_by(username="freeuser").first()
    admin_u = db.query(User).filter_by(username="admin").first()

    payload = {
        "name": "Dr. Sunil Sharma",
        "title": "Clinical Psychologist",
        "qualification": "M.Phil Clinical Psychology",
        "experience_years": 8,
        "license_number": "RCI-9912",
        "bio": "Experienced clinical psychologist in adult emotional wellbeing.",
        "primary_category": "personal",
        "categories": ["personal", "emotional"],
        "languages": ["English", "Hindi"],
        "fee_inr": 1100,
        "scope_of_practice": "Emotional regulation and personal clarity.",
        "available_days": ["Mon", "Wed", "Fri"],
        "time_slots": ["10:00 AM", "03:00 PM"],
        "avatar_url": "",
        "collaboration_agreed": True
    }
    res_apply = client.post("/api/counsellors/apply", json=payload, headers=auth_headers(c_user.id))
    assert res_apply.status_code == 201
    c_id = res_apply.json()["id"]
    assert res_apply.json()["verification_status"] == "Application Submitted"

    # Profile shows status
    res_me = client.get("/api/counsellor/me", headers=auth_headers(c_user.id))
    assert res_me.status_code == 200
    assert res_me.json()["has_profile"] is True
    assert res_me.json()["verified"] is False

    # Admin approves
    res_approve = client.patch(
        f"/api/admin/counsellors/{c_id}/status",
        json={"verification_status": "Approved", "note": "Verified"},
        headers=auth_headers(admin_u.id, role="admin")
    )
    assert res_approve.status_code == 200
    assert res_approve.json()["verified"] is True
    db.close()

def test_24_ai_guidance_reflection_with_ethical_disclaimer():
    """Verify structured reflection endpoint includes disclaimer and returns exercise."""
    db = TestingSessionLocal()
    prem_u = db.query(User).filter_by(username="premuser").first()
    res = client.post(
        "/api/guidance/reflect",
        json={
            "category": "relationship",
            "topic": "Conflict communication",
            "user_reflection": "I want to communicate more calmly when discussing shared responsibilities."
        },
        headers=auth_headers(prem_u.id)
    )
    assert res.status_code == 200
    data = res.json()
    assert "perspective" in data
    assert "reflective_questions" in data
    assert "recommended_exercise" in data
    assert "disclaimer" in data
    assert "not psychotherapy" in data["disclaimer"].lower()
    db.close()

