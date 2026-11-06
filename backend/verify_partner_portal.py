import sys
from fastapi.testclient import TestClient
from app.main import app

def test_portal():
    client = TestClient(app)
    
    # 1. Health check
    res = client.get("/api/health")
    print("1. Health check:", res.status_code, res.json())
    assert res.status_code == 200

    # 2. Login as Demo Mentor
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": "mentor.demo@maanmitra.com", "password": "Demo@12345"}
    )
    print("2. Mentor Login status:", login_res.status_code)
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token_data = login_res.json()
    token = token_data.get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    print("   Mentor Token received successfully.")

    # 3. Partner Dashboard
    dash_res = client.get("/api/v1/partner/dashboard", headers=headers)
    print("3. Partner Dashboard status:", dash_res.status_code)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    print("   Mentor Name:", dash_data.get("profile", {}).get("display_name"))
    print("   Wallet Balance (INR):", dash_data.get("wallet", {}).get("available_balance_inr"))
    print("   Rank Level:", dash_data.get("rank", {}).get("current_level"))
    print("   Rank Title:", dash_data.get("rank", {}).get("title"))

    # 4. Partner Wallet
    wallet_res = client.get("/api/v1/partner/wallet", headers=headers)
    print("4. Partner Wallet status:", wallet_res.status_code)
    assert wallet_res.status_code == 200
    w_data = wallet_res.json()
    print("   Available Balance (INR):", w_data.get("available_balance_inr"))
    print("   Total Earned (INR):", w_data.get("total_earned_inr"))
    print("   Bank Name:", w_data.get("bank_account", {}).get("bank_name"))

    # 4b. Partner Earnings & Ledger
    earn_res = client.get("/api/v1/partner/earnings", headers=headers)
    print("4b. Partner Earnings status:", earn_res.status_code)
    assert earn_res.status_code == 200
    print("   Ledger items count:", len(earn_res.json().get("ledger", [])))

    # 5. Partner Rank Info
    rank_res = client.get("/api/v1/partner/rank", headers=headers)
    print("5. Partner Rank status:", rank_res.status_code)
    assert rank_res.status_code == 200
    print("   Total Ranks defined:", len(rank_res.json().get("all_ranks", [])))

    # 6. Partner Bonuses
    bonus_res = client.get("/api/v1/partner/bonuses", headers=headers)
    print("6. Partner Bonuses status:", bonus_res.status_code)
    assert bonus_res.status_code == 200
    print("   Active Campaigns:", len(bonus_res.json().get("active_campaigns", [])))

    # 7. Partner Workshops
    ws_res = client.get("/api/v1/partner/workshops", headers=headers)
    print("7. Partner Workshops status:", ws_res.status_code)
    assert ws_res.status_code == 200
    print("   Workshops count:", len(ws_res.json()))

    # 8. Partner Live Streams
    live_res = client.get("/api/v1/partner/live", headers=headers)
    print("8. Partner Live Streams status:", live_res.status_code)
    assert live_res.status_code == 200
    print("   Live Streams count:", len(live_res.json()))

    # 9. Partner Reviews
    rev_res = client.get("/api/v1/partner/reviews", headers=headers)
    print("9. Partner Reviews status:", rev_res.status_code)
    assert rev_res.status_code == 200

    # 10. Partner Support
    sup_res = client.get("/api/v1/partner/support/tickets", headers=headers)
    print("10. Partner Support Tickets status:", sup_res.status_code)
    assert sup_res.status_code == 200

    # 11. Test Pending Mentor Login
    pending_login = client.post(
        "/api/v1/auth/login",
        json={"email": "pending.mentor@maanmitra.com", "password": "Demo@12345"}
    )
    print("11. Pending Mentor Login status:", pending_login.status_code)
    assert pending_login.status_code == 200
    pending_user = pending_login.json().get("user", {})
    print("    Pending Mentor status:", pending_user.get("partner_status"))

    print("\nALL 11 BACKEND SMOKE TESTS PASSED CLEANLY!")

if __name__ == "__main__":
    test_portal()
