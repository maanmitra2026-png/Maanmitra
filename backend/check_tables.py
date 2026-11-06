import sqlite3

conn = sqlite3.connect("living_relationships.db")
c = conn.cursor()
c.execute("SELECT id, email, full_name, role FROM users LIMIT 10")
rows = c.fetchall()
print("USERS IN TABLE 'users':")
for r in rows:
    print(r)

c.execute("SELECT id, email, full_name, role FROM mm_users LIMIT 10")
mm_rows = c.fetchall()
print("\nUSERS IN TABLE 'mm_users':")
for r in mm_rows:
    print(r)

