from app.main import SessionLocal, User, verify_password, hash_password
from app.maanmitra_models import PartnerProfile

db = SessionLocal()
u = db.query(User).filter_by(email="mentor.demo@maanmitra.com").first()
print("User found:", bool(u))
if u:
    print("Email:", u.email)
    print("Role:", u.role)
    print("is_active:", getattr(u, "is_active", None))
    print("Hash matches Demo@12345:", verify_password("Demo@12345", u.password_hash))
    if not verify_password("Demo@12345", u.password_hash):
        print("Resetting password hash to correct bcrypt hash for Demo@12345...")
        u.password_hash = hash_password("Demo@12345")
        u.is_active = True
        db.commit()
        print("Updated! New verify:", verify_password("Demo@12345", u.password_hash))

p_u = db.query(User).filter_by(email="pending.mentor@maanmitra.com").first()
print("\nPending User found:", bool(p_u))
if p_u:
    print("Email:", p_u.email)
    print("Role:", p_u.role)
    print("is_active:", getattr(p_u, "is_active", None))
    print("Pending Hash matches Demo@12345:", verify_password("Demo@12345", p_u.password_hash))
    if not verify_password("Demo@12345", p_u.password_hash):
        print("Resetting pending mentor password hash...")
        p_u.password_hash = hash_password("Demo@12345")
        p_u.is_active = True
        db.commit()
        print("Pending Updated! New verify:", verify_password("Demo@12345", p_u.password_hash))
