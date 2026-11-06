import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from app.main import app, startup, SessionLocal
from app.maanmitra_models import User, PartnerProfile, Booking, Payment, Conversation, Review

@pytest.fixture(scope="module")
def client():
    startup()
    with TestClient(app) as c:
        yield c

def test_admin_login_and_dashboard(client):
    # Valid admin login
    res = client.post("/api/v1/auth/login", json={
        "email": "admin@maanmitra.com",
        "password": "Admin@12345"
    })
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["role"] == "admin"
    token = data["access_token"]

    # Access Admin Dashboard
    headers = {"Authorization": f"Bearer {token}"}
    dash = client.get("/api/v1/admin/dashboard", headers=headers)
    assert dash.status_code == 200
    summary = dash.json()["summary"]
    assert "total_users" in summary
    assert "total_partners" in summary
    assert "total_revenue" in summary

def test_user_registration_and_browse_partners(client):
    # Register new user
    user_email = f"testuser_{datetime.utcnow().timestamp()}@example.com"
    reg = client.post("/api/v1/auth/register", json={
        "full_name": "Test User",
        "email": user_email,
        "password": "User@12345",
        "phone": "+919999999999",
        "terms_accepted": True
    })
    assert reg.status_code == 200, reg.text
    token = reg.json()["access_token"]
    assert reg.json()["role"] == "user"

    # Browse approved partners
    partners_res = client.get("/api/v1/partners")
    assert partners_res.status_code == 200
    partners = partners_res.json()
    assert len(partners) > 0
    # Every returned partner must be approved
    for p in partners:
        assert p["verification_status"] == "approved"

def test_partner_registration_and_admin_approval(client):
    partner_email = f"partner_{datetime.utcnow().timestamp()}@example.com"
    reg = client.post("/api/v1/partner/register", json={
        "full_name": "Kavita Rao",
        "display_name": "Kavita",
        "email": partner_email,
        "phone": "+919888888888",
        "password": "Partner@12345",
        "languages": "Hindi, English",
        "bio": "Warm and positive listener.",
        "terms_accepted": True
    })
    assert reg.status_code == 200, reg.text
    partner_token = reg.json()["access_token"]
    partner_id = reg.json()["partner_id"]
    partner_headers = {"Authorization": f"Bearer {partner_token}"}

    # Status must be pending initially
    status_res = client.get("/api/v1/partner/application-status", headers=partner_headers)
    assert status_res.status_code == 200
    assert status_res.json()["verification_status"] == "pending"
    assert status_res.json()["is_approved"] is False

    # Submit verification document
    doc_res = client.post("/api/v1/partner/documents", headers=partner_headers, json={
        "document_type": "aadhaar",
        "document_number": "123456789012",
        "document_data_url": "https://example.com/doc.pdf"
    })
    assert doc_res.status_code == 200

    # Admin Login to review and approve
    admin_login = client.post("/api/v1/auth/login", json={
        "email": "admin@maanmitra.com",
        "password": "Admin@12345"
    })
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Approve Partner
    appr = client.post(f"/api/v1/admin/partners/{partner_id}/approve", headers=admin_headers)
    assert appr.status_code == 200
    assert appr.json()["verification_status"] == "approved"

    # Partner check status again
    status_after = client.get("/api/v1/partner/application-status", headers=partner_headers)
    assert status_after.json()["is_approved"] is True

def test_booking_and_double_booking_prevention(client):
    # Login user
    u_login = client.post("/api/v1/auth/login", json={
        "email": "amit@example.com",
        "password": "User@12345"
    })
    u_token = u_login.json()["access_token"]
    u_headers = {"Authorization": f"Bearer {u_token}"}

    # Find partner Priya
    p_res = client.get("/api/v1/partners?search=Priya")
    priya_id = p_res.json()[0]["id"]

    # Dynamic future slot to avoid collision across repeated test runs
    import random
    slot_time = (datetime.utcnow() + timedelta(days=20, hours=random.randint(1, 1000))).replace(minute=0, second=0, microsecond=0)

    # 1. First booking
    b1 = client.post("/api/v1/bookings", headers=u_headers, json={
        "partner_id": priya_id,
        "communication_type": "audio",
        "duration_minutes": 30,
        "scheduled_start": slot_time.isoformat()
    })
    assert b1.status_code == 200, b1.text
    booking_id = b1.json()["booking_id"]

    # 2. Complete payment for booking 1 so it becomes confirmed
    pay_order = client.post("/api/v1/payments/create-order", headers=u_headers, json={
        "booking_id": booking_id
    })
    assert pay_order.status_code == 200
    order_id = pay_order.json()["order_id"]

    pay_verify = client.post("/api/v1/payments/verify", headers=u_headers, json={
        "booking_id": booking_id,
        "razorpay_order_id": order_id,
        "razorpay_payment_id": f"pay_{order_id}",
        "razorpay_signature": "valid_signature_simulated"
    })
    assert pay_verify.status_code == 200
    assert pay_verify.json()["success"] is True

    # 3. Second user attempts same overlapping slot
    u2_login = client.post("/api/v1/auth/login", json={
        "email": "rahul@example.com",
        "password": "User@12345"
    })
    u2_headers = {"Authorization": f"Bearer {u2_login.json()['access_token']}"}

    b2 = client.post("/api/v1/bookings", headers=u2_headers, json={
        "partner_id": priya_id,
        "communication_type": "video",
        "duration_minutes": 30,
        "scheduled_start": (slot_time + timedelta(minutes=10)).isoformat() # Overlapping!
    })
    # Must reject with 409 Conflict
    assert b2.status_code == 409
    assert "no longer available" in b2.json()["detail"].lower()
