import sqlite3

conn = sqlite3.connect("living_relationships.db")
c = conn.cursor()
c.execute("PRAGMA table_info(users)")
cols = c.fetchall()
print("USERS COLUMNS:")
for col in cols:
    print(col[1], col[2], "notnull:", col[3])

