import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from datetime import datetime, timedelta, date
from sqlalchemy.orm import Session
import bcrypt
import os
import uuid

from app.maanmitra_models import (
    User, PartnerProfile, PartnerVerificationDocument,
    PartnerAvailability, Package, Booking, Payment,
    Conversation, Message, Review, PartnerEarning,
    Notification, SystemSetting, AuditLog,
    PartnerExpertise, PartnerQualification, AvailabilitySlot,
    MentorWallet, FinancialLedger, WithdrawalRequest,
    RankDefinition, RankHistory, BonusCampaign, BonusTransaction,
    LiveSession, LiveSessionComment, WorkshopEvent, WorkshopRegistration,
    PartnerSupportTicket, PartnerSupportMessage
)

def hash_pwd(password: str) -> str:
    pwd_bytes = password.encode("utf-8")[:72]
    return bcrypt.hashpw(pwd_bytes, bcrypt.gensalt()).decode("utf-8")

def seed_maanmitra_data(db: Session):
    # 1. System Settings
    settings = {
        "platform_name": "MAANMITRA -- A Listening Friend, Always With You",
        "tagline": "A Listening Friend, Always With You.",
        "commission_percentage": "20",
        "support_email": "support@maanmitra.com",
        "support_phone": "+91 98765 43210",
        "maintenance_mode": "false",
        "cancellation_hours": "4",
        "supported_languages": "Hindi,English,Marathi,Bengali,Telugu,Punjabi,Tamil",
        "total_revenue_stats": "245780",
        "platform_revenue_stats": "122390",
        "partner_payouts_stats": "98320",
        "pending_payouts_stats": "24570"
    }
    for k, v in settings.items():
        if not db.query(SystemSetting).filter_by(key=k).first():
            db.add(SystemSetting(key=k, value=v))
    db.commit()

    # 2. Packages
    if db.query(Package).count() == 0:
        packages = [
            Package(
                name="15-Minute Friendly Chat",
                description="Fast and friendly real-time text chat session with your companion.",
                duration_minutes=15,
                communication_type="chat",
                price=99,
                badge="Affordable"
            ),
            Package(
                name="30-Minute Audio Conversation",
                description="Heart-to-heart voice call with a listening friend. High clarity and private.",
                duration_minutes=30,
                communication_type="audio",
                price=299,
                badge="Most Popular"
            ),
            Package(
                name="30-Minute Video Conversation",
                description="Face-to-face friendly video conversation with warm smiles and genuine connection.",
                duration_minutes=30,
                communication_type="video",
                price=499,
                badge="Best Value"
            ),
            Package(
                name="Extended Friendly Talk",
                description="Unwind and talk freely with extended 60-minute conversational session.",
                duration_minutes=60,
                communication_type="audio",
                price=599,
                badge="Deep Talk"
            ),
        ]
        db.add_all(packages)
        db.commit()

    # 3. Administrator
    admin = db.query(User).filter_by(email="admin@maanmitra.com").first()
    if not admin:
        admin = User(
            full_name="Maanmitra Administrator",
            email="admin@maanmitra.com",
            phone="+919800000001",
            password_hash=hash_pwd("Admin@12345"),
            role="admin",
            account_status="active",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        )
        db.add(admin)
        db.commit()

    # 4. Standard Users
    users_data = [
        ("Amit Kumar", "amit@example.com", "+919876543210", "User@12345", "active", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"),
        ("Rahul Sharma", "rahul@example.com", "+919876543211", "User@12345", "active", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"),
        ("Suresh Patil", "suresh@example.com", "+919876543212", "User@12345", "active", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"),
        ("Vikram Singh", "vikram@example.com", "+919876543213", "User@12345", "suspended", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80"),
    ]

    created_users = {}
    for name, email, phone, pwd, status, avatar in users_data:
        u = db.query(User).filter_by(email=email).first()
        if not u:
            u = User(
                full_name=name,
                email=email,
                phone=phone,
                password_hash=hash_pwd(pwd),
                role="user",
                account_status=status,
                avatar_url=avatar
            )
            db.add(u)
            db.commit()
        created_users[email] = u

    # 5. Maanmitra Partners
    partners_data = [
        {
            "full_name": "Priya Sharma",
            "display_name": "Priya Sharma",
            "email": "priya@example.com",
            "phone": "+919876500001",
            "password": "Partner@12345",
            "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=85",
            "languages": "Hindi, English",
            "bio": "Warm, empathetic listener. Ready to chat about your day, dreams, or anything on your mind with zero judgment.",
            "verification_status": "approved",
            "availability_status": "online",
            "rating": 4.8,
            "reviews": 236,
            "chats": 568,
            "calls": 324,
            "rate_chat": 99,
            "rate_audio": 299,
            "rate_video": 499
        },
        {
            "full_name": "Pooja Verma",
            "display_name": "Pooja",
            "email": "pooja@example.com",
            "phone": "+919876500002",
            "password": "Partner@12345",
            "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=85",
            "languages": "Hindi, English, Punjabi",
            "bio": "Friendly companion who loves deep conversations, storytelling, and sharing positive daily energy.",
            "verification_status": "approved",
            "availability_status": "online",
            "rating": 4.7,
            "reviews": 142,
            "chats": 312,
            "calls": 185,
            "rate_chat": 99,
            "rate_audio": 299,
            "rate_video": 499
        },
        {
            "full_name": "Molina Sen",
            "display_name": "Molina",
            "email": "molina@example.com",
            "phone": "+919876500003",
            "password": "Partner@12345",
            "avatar": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=85",
            "languages": "Bengali, Hindi, English",
            "bio": "Patient listener and gentle guide. Here whenever you need a calm ear and warm thoughts after a long hectic day.",
            "verification_status": "approved",
            "availability_status": "online",
            "rating": 4.9,
            "reviews": 189,
            "chats": 420,
            "calls": 260,
            "rate_chat": 99,
            "rate_audio": 299,
            "rate_video": 499
        },
        {
            "full_name": "Neha Patil",
            "display_name": "Neha",
            "email": "neha@example.com",
            "phone": "+919876500004",
            "password": "Partner@12345",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85",
            "languages": "Marathi, Hindi, English",
            "bio": "Cheerful spirit, great listener, and passionate about arts and books. Let's connect and share a smile!",
            "verification_status": "approved",
            "availability_status": "online",
            "rating": 4.8,
            "reviews": 95,
            "chats": 210,
            "calls": 115,
            "rate_chat": 99,
            "rate_audio": 299,
            "rate_video": 499
        },
        {
            "full_name": "Sneha Verma",
            "display_name": "Sneha Verma",
            "email": "sneha@example.com",
            "phone": "+919876500005",
            "password": "Partner@12345",
            "avatar": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=85",
            "languages": "Hindi, English",
            "bio": "Compassionate listener offering a safe, peaceful space to share your thoughts, stories, and emotions.",
            "verification_status": "under_review",
            "availability_status": "offline",
            "rating": 4.8,
            "reviews": 48,
            "chats": 85,
            "calls": 42,
            "rate_chat": 99,
            "rate_audio": 299,
            "rate_video": 499
        },
        {
            "full_name": "Ankita Rao",
            "display_name": "Ankita Rao",
            "email": "ankita@example.com",
            "phone": "+919876500006",
            "password": "Partner@12345",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=85",
            "languages": "Telugu, Hindi, English",
            "bio": "Positive, open-minded listener who enjoys conversations on lifestyle, hobbies, career, or daily musings.",
            "verification_status": "pending",
            "availability_status": "offline",
            "rating": 4.6,
            "reviews": 12,
            "chats": 30,
            "calls": 18,
            "rate_chat": 99,
            "rate_audio": 299,
            "rate_video": 499
        }
    ]

    created_partners = {}
    for p in partners_data:
        u = db.query(User).filter_by(email=p["email"]).first()
        if not u:
            u = User(
                full_name=p["full_name"],
                email=p["email"],
                phone=p["phone"],
                password_hash=hash_pwd(p["password"]),
                role="maanmitra_partner",
                account_status="active",
                avatar_url=p["avatar"]
            )
            db.add(u)
            db.commit()

        prof = db.query(PartnerProfile).filter_by(user_id=u.id).first()
        if not prof:
            prof = PartnerProfile(
                user_id=u.id,
                display_name=p["display_name"],
                bio=p["bio"],
                profile_photo_url=p["avatar"],
                languages=p["languages"],
                verification_status=p["verification_status"],
                availability_status=p["availability_status"],
                rating_average=p["rating"],
                review_count=p["reviews"],
                total_chats=p["chats"],
                total_calls=p["calls"],
                rate_chat_15m=p["rate_chat"],
                rate_audio_30m=p["rate_audio"],
                rate_video_30m=p["rate_video"],
            )
            db.add(prof)
            db.commit()

            # Add sample document
            doc = PartnerVerificationDocument(
                partner_id=prof.id,
                document_type="aadhaar",
                document_number_masked="XXXX-XXXX-8921",
                private_storage_key="/uploads/docs/aadhaar_sample.pdf",
                verification_status="approved" if p["verification_status"] == "approved" else "pending",
                submitted_at=datetime.utcnow() - timedelta(days=5)
            )
            db.add(doc)

            # Add availability
            days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            for d in days:
                db.add(PartnerAvailability(
                    partner_id=prof.id,
                    weekday=d,
                    start_time="09:00 AM",
                    end_time="10:00 PM",
                    communication_type="all",
                    is_available=True
                ))
            db.commit()

        created_partners[p["email"]] = prof

    # 6. Sample Bookings, Payments, Earnings & Reviews
    priya = created_partners.get("priya@example.com")
    neha = created_partners.get("neha@example.com")
    sneha = created_partners.get("sneha@example.com")
    amit = created_users.get("amit@example.com")
    rahul = created_users.get("rahul@example.com")
    suresh = created_users.get("suresh@example.com")

    if priya and amit and db.query(Booking).count() == 0:
        now = datetime.utcnow()

        # Booking 1: Amit + Priya (Today Upcoming / Ongoing)
        b1 = Booking(
            booking_code="MM-BKG-2026-001",
            user_id=amit.id,
            partner_id=priya.id,
            scheduled_start=now.replace(hour=10, minute=0, second=0, microsecond=0),
            scheduled_end=now.replace(hour=10, minute=30, second=0, microsecond=0),
            communication_type="video",
            booking_status="confirmed",
            payment_status="completed",
            total_amount=499
        )
        db.add(b1)
        db.commit()

        pay1 = Payment(
            booking_id=b1.id,
            user_id=amit.id,
            provider="razorpay",
            provider_order_id="order_MM92817281",
            provider_payment_id="pay_MM92817281A",
            amount=499,
            payment_status="captured",
            payment_method="UPI (GPay)",
            verified_at=now - timedelta(minutes=20)
        )
        db.add(pay1)

        earn1 = PartnerEarning(
            partner_id=priya.id,
            booking_id=b1.id,
            gross_amount=499,
            platform_commission=100, # ~20%
            net_amount=399,
            payout_status="pending"
        )
        db.add(earn1)

        # Conversation for B1
        c1 = Conversation(
            booking_id=b1.id,
            user_id=amit.id,
            partner_id=priya.id,
            communication_type="video",
            status="active",
            started_at=now - timedelta(minutes=10)
        )
        db.add(c1)
        db.commit()

        m1 = Message(
            conversation_id=c1.id,
            sender_id=priya.user_id,
            message_type="text",
            message_text="Hello Amit! Welcome to MAANMITRA. How has your day been so far?",
            sent_at=now - timedelta(minutes=9)
        )
        m2 = Message(
            conversation_id=c1.id,
            sender_id=amit.id,
            message_type="text",
            message_text="Hi Priya! It was quite busy at work, feeling great to unwind and chat.",
            sent_at=now - timedelta(minutes=8)
        )
        m3 = Message(
            conversation_id=c1.id,
            sender_id=priya.user_id,
            message_type="text",
            message_text="I completely understand! Workdays can be hectic. Tell me more, I'm all ears.",
            sent_at=now - timedelta(minutes=7)
        )
        db.add_all([m1, m2, m3])

        # Booking 2: Rahul + Neha
        if neha and rahul:
            b2 = Booking(
                booking_code="MM-BKG-2026-002",
                user_id=rahul.id,
                partner_id=neha.id,
                scheduled_start=now.replace(hour=12, minute=0, second=0, microsecond=0),
                scheduled_end=now.replace(hour=12, minute=30, second=0, microsecond=0),
                communication_type="audio",
                booking_status="confirmed",
                payment_status="completed",
                total_amount=299
            )
            db.add(b2)
            db.commit()

            db.add(Payment(
                booking_id=b2.id,
                user_id=rahul.id,
                provider="razorpay",
                provider_order_id="order_MM92817282",
                provider_payment_id="pay_MM92817282B",
                amount=299,
                payment_status="captured",
                payment_method="Credit Card",
                verified_at=now - timedelta(minutes=15)
            ))
            db.add(PartnerEarning(
                partner_id=neha.id,
                booking_id=b2.id,
                gross_amount=299,
                platform_commission=60,
                net_amount=239,
                payout_status="pending"
            ))

        # Booking 3: Suresh + Sneha (Completed)
        if sneha and suresh:
            b3 = Booking(
                booking_code="MM-BKG-2026-003",
                user_id=suresh.id,
                partner_id=sneha.id,
                scheduled_start=now - timedelta(days=1, hours=2),
                scheduled_end=now - timedelta(days=1, hours=1, minutes=30),
                communication_type="audio",
                booking_status="completed",
                payment_status="completed",
                total_amount=299
            )
            db.add(b3)
            db.commit()

            db.add(Payment(
                booking_id=b3.id,
                user_id=suresh.id,
                provider="razorpay",
                provider_order_id="order_MM92817280",
                provider_payment_id="pay_MM92817280C",
                amount=299,
                payment_status="captured",
                payment_method="UPI",
                verified_at=now - timedelta(days=1, hours=2)
            ))
            db.add(PartnerEarning(
                partner_id=sneha.id,
                booking_id=b3.id,
                gross_amount=299,
                platform_commission=60,
                net_amount=239,
                payout_status="paid",
                paid_at=now - timedelta(hours=12)
            ))
            db.add(Review(
                booking_id=b3.id,
                user_id=suresh.id,
                partner_id=sneha.id,
                rating=5,
                review_text="Sneha was such a thoughtful and warm listener. I felt so much lighter and happy after our talk!"
            ))
            db.commit()

    # -------------------------------------------------------------------
    # 7. Seed Rank Definitions (Level 10 down to Level 1)
    # -------------------------------------------------------------------
    if db.query(RankDefinition).count() == 0:
        rank_data = [
            (10, "Starter Companion", 10, 70, 30, 0, 0, 4.0, 20.0, "Standard", '["Standard profile listing", "1-on-1 text and audio sessions", "Access to partner dashboard"]'),
            (9, "Associate Companion", 12, 70, 30, 5, 120, 4.2, 18.0, "Bronze", '["Bronze badge on profile", "Increased rate ₹12/min", "Weekly payout cycle"]'),
            (8, "Certified Listener", 15, 70, 30, 15, 360, 4.4, 15.0, "Silver", '["Silver badge on profile", "Increased rate ₹15/min", "Priority customer matching"]'),
            (7, "Advanced Guide", 20, 70, 30, 30, 750, 4.5, 12.0, "Gold", '["Gold mentor badge", "Increased rate ₹20/min", "Ability to host live Q&A sessions"]'),
            (6, "Senior Guide", 25, 70, 30, 60, 1500, 4.6, 10.0, "Platinum", '["Platinum badge", "Increased rate ₹25/min", "Featured placement on Explore page"]'),
            (5, "Master Mentor", 30, 70, 30, 100, 3000, 4.7, 8.0, "Master", '["Master Mentor prestige badge", "Increased rate ₹30/min", "Host paid group workshops", "Access to bonus campaigns"]'),
            (4, "Lead Mentor", 35, 70, 30, 160, 5000, 4.75, 6.0, "Ruby", '["Ruby elite badge", "Increased rate ₹35/min", "Priority live streaming slot", "Direct mentor support hotline"]'),
            (3, "Distinguished Counsellor", 40, 70, 30, 240, 8000, 4.8, 5.0, "Emerald", '["Emerald counsellor badge", "Increased rate ₹40/min", "Exclusive enterprise workshop invitations"]'),
            (2, "Fellow Mentor", 45, 70, 30, 350, 12000, 4.85, 4.0, "Diamond", '["Diamond partner prestige", "Increased rate ₹45/min", "VIP concierge payouts within 12h"]'),
            (1, "Principal Mentor", 50, 70, 30, 500, 18000, 4.9, 3.0, "Crown", '["Crown Principal status", "Maximum rate ₹50/min", "Platform advisory board member", "Quarterly royalty pool share"]')
        ]
        for level, title, rate, m_pct, p_pct, min_sess, min_mins, min_rat, max_canc, badge, b_json in rank_data:
            db.add(RankDefinition(
                rank_level=level,
                title=title,
                price_per_minute_inr=rate,
                mentor_share_percentage=m_pct,
                platform_share_percentage=p_pct,
                min_completed_sessions=min_sess,
                min_billable_minutes=min_mins,
                min_rating=min_rat,
                max_cancellation_rate=max_canc,
                badge_label=badge,
                benefits_json=b_json
            ))
        db.commit()

    # -------------------------------------------------------------------
    # 8. Seed Bonus Campaigns
    # -------------------------------------------------------------------
    if db.query(BonusCampaign).count() == 0:
        campaigns = [
            BonusCampaign(
                title="New Mentor Launch Sprint",
                description="Complete 15 client sessions in your first 30 days to claim an instant ₹1,500 cash reward.",
                reward_amount_paise=150000,
                criteria_type="sessions_count",
                criteria_value=15,
                badge_text="₹1,500 Bonus",
                start_date=date.today() - timedelta(days=15),
                end_date=date.today() + timedelta(days=45),
                is_active=True
            ),
            BonusCampaign(
                title="Weekend Prime Availability Champion",
                description="Provide 12+ hours of active evening availability across Saturday and Sunday to earn ₹2,000.",
                reward_amount_paise=200000,
                criteria_type="weekend_hours",
                criteria_value=12,
                badge_text="₹2,000 Weekend Bonus",
                start_date=date.today() - timedelta(days=7),
                end_date=date.today() + timedelta(days=60),
                is_active=True
            ),
            BonusCampaign(
                title="5-Star Empathy Excellence Reward",
                description="Maintain a 4.90+ client satisfaction rating across 50 consecutive completed sessions.",
                reward_amount_paise=500000,
                criteria_type="rating_milestone",
                criteria_value=50,
                badge_text="₹5,000 Excellence Reward",
                start_date=date.today() - timedelta(days=30),
                end_date=date.today() + timedelta(days=90),
                is_active=True
            )
        ]
        db.add_all(campaigns)
        db.commit()

    # -------------------------------------------------------------------
    # 9. Seed Official Controlled DEMO ACCOUNTS
    # -------------------------------------------------------------------
    demo_approved = db.query(User).filter_by(email="mentor.demo@maanmitra.com").first()
    if not demo_approved:
        demo_user = User(
            full_name="Dr. Ananya Roy, Ph.D.",
            email="mentor.demo@maanmitra.com",
            phone="+919876000099",
            password_hash=hash_pwd("Demo@12345"),
            role="maanmitra_partner",
            account_status="active",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=85",
            is_demo=True
        )
        db.add(demo_user)
        db.commit()

        demo_partner = PartnerProfile(
            user_id=demo_user.id,
            display_name="Dr. Ananya Roy",
            headline="Senior Relationship & Pre-Cohabitation Mentor (Ph.D.)",
            bio="Certified Psychologist & Couples Mentor with 9+ years helping individuals and couples build deep emotional safety, healthy domestic boundaries, and compassionate conflict resolution.",
            profile_photo_url=demo_user.avatar_url,
            languages="Hindi, English, Bengali",
            verification_status="approved",
            availability_status="online",
            rating_average=4.94,
            review_count=148,
            total_chats=264,
            total_calls=182,
            rate_chat_15m=149,
            rate_audio_30m=449,
            rate_video_30m=899,
            experience_years=9,
            education="Ph.D. in Clinical & Relational Psychology (TISS Mumbai)",
            city="Mumbai / Pune, Maharashtra",
            timezone="Asia/Kolkata (IST)",
            rank_level=5, # Level 5: Master Mentor (₹30/min)
            per_minute_rate_inr=30,
            completeness_percentage=100,
            bank_name="HDFC Bank",
            bank_account_number_masked="••••••••9102",
            bank_ifsc="HDFC0001042",
            bank_account_holder="Dr. Ananya Roy",
            bank_verified=True,
            is_demo=True
        )
        db.add(demo_partner)
        db.commit()

        # Wallet & Financial Ledger for Demo Mentor
        wallet = MentorWallet(
            partner_id=demo_partner.id,
            available_balance_paise=1845000, # ₹18,450.00
            pending_balance_paise=320000,    # ₹3,200.00
            total_earned_paise=6480000,      # ₹64,800.00
            total_withdrawn_paise=4315000    # ₹43,150.00
        )
        db.add(wallet)

        # Ledger Entries (Demo)
        now_dt = datetime.utcnow()
        ledger_entries = [
            FinancialLedger(
                partner_id=demo_partner.id,
                transaction_type="session_earning",
                amount_paise=63000, # ₹630 (70% of ₹900 30m video session)
                balance_after_paise=1845000,
                reference_code=f"TXN-SES-{uuid.uuid4().hex[:8].upper()}",
                description="Session Earning (70% of ₹900) - 30m Video Consultation with Amit K.",
                is_demo=True,
                created_at=now_dt - timedelta(hours=3)
            ),
            FinancialLedger(
                partner_id=demo_partner.id,
                transaction_type="bonus",
                amount_paise=200000, # ₹2,000
                balance_after_paise=1782000,
                reference_code=f"TXN-BON-{uuid.uuid4().hex[:8].upper()}",
                description="Weekend Prime Availability Champion Bonus credited",
                is_demo=True,
                created_at=now_dt - timedelta(days=2)
            ),
            FinancialLedger(
                partner_id=demo_partner.id,
                transaction_type="withdrawal",
                amount_paise=-1500000, # -₹15,000
                balance_after_paise=1582000,
                reference_code=f"TXN-WTH-{uuid.uuid4().hex[:8].upper()}",
                description="Bank Payout to HDFC Bank ••••9102",
                is_demo=True,
                created_at=now_dt - timedelta(days=5)
            )
        ]
        db.add_all(ledger_entries)

        # Withdrawal Requests
        db.add(WithdrawalRequest(
            partner_id=demo_partner.id,
            reference_code=f"WTH-REQ-{uuid.uuid4().hex[:6].upper()}",
            amount_paise=1500000, # ₹15,000
            bank_name="HDFC Bank",
            account_number_masked="••••••••9102",
            ifsc_code="HDFC0001042",
            account_holder_name="Dr. Ananya Roy",
            status="paid",
            admin_notes="Processed via NEFT Ref: N10293847291",
            requested_at=now_dt - timedelta(days=6),
            processed_at=now_dt - timedelta(days=5)
        ))
        db.add(WithdrawalRequest(
            partner_id=demo_partner.id,
            reference_code=f"WTH-REQ-{uuid.uuid4().hex[:6].upper()}",
            amount_paise=500000, # ₹5,000
            bank_name="HDFC Bank",
            account_number_masked="••••••••9102",
            ifsc_code="HDFC0001042",
            account_holder_name="Dr. Ananya Roy",
            status="under_review",
            admin_notes="Verification under standard payout queue",
            requested_at=now_dt - timedelta(hours=14)
        ))

        # Demo Mentor Expertises
        db.add_all([
            PartnerExpertise(
                partner_id=demo_partner.id,
                category_name="Qualified Professional Counsellors",
                subcategories_json='["Couples & Cohabitation Therapy", "Conflict Mediation", "Pre-Commitment Alignment"]',
                skills_json='["Cognitive Behavioral Dialogue", "Gottman Method Principles", "Attachment Styles Analysis"]',
                is_primary=True
            ),
            PartnerExpertise(
                partner_id=demo_partner.id,
                category_name="Relationship & Personal Guidance",
                subcategories_json='["Pre-Cohabitation Domestic Alignment", "Breakup Recovery & Emotional Healing"]',
                skills_json='["Active Empathetic Listening", "Healthy Boundary Setting", "Domestic Chore Agreements"]',
                is_primary=False
            )
        ])

        # Demo Mentor Qualifications
        db.add_all([
            PartnerQualification(
                partner_id=demo_partner.id,
                degree_title="Ph.D. in Clinical & Relational Psychology",
                institution="Tata Institute of Social Sciences (TISS), Mumbai",
                year_completed=2018,
                verification_status="verified"
            ),
            PartnerQualification(
                partner_id=demo_partner.id,
                degree_title="M.A. Applied Psychology (Gold Medalist)",
                institution="University of Delhi",
                year_completed=2014,
                verification_status="verified"
            )
        ])

        # Demo Mentor Availability Slots
        today = date.today()
        slots = [
            AvailabilitySlot(partner_id=demo_partner.id, slot_date=today, start_time="10:00 AM", end_time="10:30 AM", communication_type="all", is_booked=True),
            AvailabilitySlot(partner_id=demo_partner.id, slot_date=today, start_time="11:30 AM", end_time="12:00 PM", communication_type="all", is_booked=False),
            AvailabilitySlot(partner_id=demo_partner.id, slot_date=today, start_time="03:00 PM", end_time="03:30 PM", communication_type="all", is_booked=False),
            AvailabilitySlot(partner_id=demo_partner.id, slot_date=today, start_time="05:00 PM", end_time="05:30 PM", communication_type="all", is_booked=False),
            AvailabilitySlot(partner_id=demo_partner.id, slot_date=today + timedelta(days=1), start_time="10:00 AM", end_time="10:30 AM", communication_type="all", is_booked=False),
            AvailabilitySlot(partner_id=demo_partner.id, slot_date=today + timedelta(days=1), start_time="04:00 PM", end_time="04:30 PM", communication_type="all", is_booked=False),
        ]
        db.add_all(slots)

        # Demo Workshop
        db.add(WorkshopEvent(
            partner_id=demo_partner.id,
            title="Masterclass: Resolving Everyday Couple Conflict Without Resentment",
            description="Join Dr. Ananya Roy for an interactive 75-minute workshop discovering proven frameworks to communicate unmet needs and de-escalate tension.",
            category="Relationship Wellness",
            scheduled_at=now_dt + timedelta(days=3, hours=4),
            duration_minutes=75,
            capacity=30,
            fee_paise=49900, # ₹499
            status="published"
        ))

        # Demo Live Stream
        db.add(LiveSession(
            partner_id=demo_partner.id,
            title="Live Q&A: Overcoming Loneliness & Anxiety in Moving to a New City",
            description="Live discussion answering audience questions about emotional grounding, making new friends, and coping with domestic transitions.",
            category="Personal Guidance",
            scheduled_at=now_dt + timedelta(days=1, hours=2),
            status="scheduled",
            viewer_count=0,
            stream_key=f"live_{uuid.uuid4().hex[:12]}"
        ))

        # Demo Support Ticket
        db.add(PartnerSupportTicket(
            ticket_code="TCK-9481",
            partner_id=demo_partner.id,
            user_id=demo_user.id,
            category="Earnings & Payouts",
            subject="Monthly TDS statement request for FY2026",
            description="Kindly provide the consolidated Form 16A TDS certificate for Q2 payouts for my tax filing.",
            priority="medium",
            status="resolved"
        ))

        db.commit()

    # Demo Pending Mentor
    demo_pending = db.query(User).filter_by(email="pending.mentor@maanmitra.com").first()
    if not demo_pending:
        pending_user = User(
            full_name="Vikram Malhotra",
            email="pending.mentor@maanmitra.com",
            phone="+919876000088",
            password_hash=hash_pwd("Demo@12345"),
            role="maanmitra_partner",
            account_status="pending_verification",
            avatar_url="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=85",
            is_demo=True
        )
        db.add(pending_user)
        db.commit()

        pending_partner = PartnerProfile(
            user_id=pending_user.id,
            display_name="Vikram Malhotra",
            headline="Mindfulness & Career Transitions Guide",
            bio="Passionate about guiding individuals through burnout, career pivots, and finding emotional equilibrium in fast-paced corporate careers.",
            profile_photo_url=pending_user.avatar_url,
            languages="Hindi, English",
            verification_status="under_review",
            availability_status="offline",
            rating_average=4.8,
            experience_years=5,
            education="M.B.A. & Certified Mindfulness Coach",
            city="Bengaluru, Karnataka",
            timezone="Asia/Kolkata (IST)",
            rank_level=10,
            per_minute_rate_inr=10,
            completeness_percentage=75,
            admin_notes="Documents received on 02-Nov-2026. Awaiting admin review of PAN card & Experience certificate.",
            is_demo=True
        )
        db.add(pending_partner)
        db.commit()

        # Uploaded KYC documents waiting for review
        db.add_all([
            PartnerVerificationDocument(
                partner_id=pending_partner.id,
                document_type="pan",
                document_number_masked="ABCDE••••F",
                private_storage_key="demo_kyc/vikram_pan.pdf",
                verification_status="pending"
            ),
            PartnerVerificationDocument(
                partner_id=pending_partner.id,
                document_type="experience_certificate",
                document_number_masked="EXP-CERT-2024",
                private_storage_key="demo_kyc/vikram_cert.pdf",
                verification_status="pending"
            )
        ])
        db.commit()

    # Ensure all existing partners have initialized wallets
    all_partners = db.query(PartnerProfile).all()
    for p in all_partners:
        if not db.query(MentorWallet).filter_by(partner_id=p.id).first():
            w = MentorWallet(
                partner_id=p.id,
                available_balance_paise=284000, # ₹2,840
                pending_balance_paise=50000,   # ₹500
                total_earned_paise=1420000,    # ₹14,200
                total_withdrawn_paise=1136000  # ₹11,360
            )
            db.add(w)
    db.commit()

    # Add sample notifications
    admin = db.query(User).filter_by(role="admin").first()
    if admin and db.query(Notification).count() == 0:
        db.add(Notification(
            user_id=admin.id,
            title="System Ready",
            message="Maanmitra Counsellor & Mentor Platform upgraded.",
            notification_type="system"
        ))

    # Add audit log
    if admin:
        db.add(AuditLog(
            actor_id=admin.id,
            action="SYSTEM_INIT",
            entity_type="SYSTEM",
            metadata_json='{"status": "Seed data loaded successfully", "roles": ["Admin", "Maanmitra Partner", "User"]}'
        ))

    db.commit()

if __name__ == "__main__":
    from app.main import SessionLocal, engine
    from app.maanmitra_models import ensure_maanmitra_schema_upgrades
    print("Running schema upgrades...")
    ensure_maanmitra_schema_upgrades(engine)
    db = SessionLocal()
    print("Seeding Maanmitra data...")
    seed_maanmitra_data(db)
    print("Seeding finished successfully!")
    db.close()
