"""Pure logic smoke tests; API integration tests require PostgreSQL and configured dependencies."""
from datetime import date

def compatibility_score(my_interests, their_interests, same_location=False):
    shared=set(x.strip().lower() for x in my_interests.split(",") if x.strip()) & set(x.strip().lower() for x in their_interests.split(",") if x.strip())
    return min(99,55+len(shared)*9+(10 if same_location else 0))

def test_compatibility_score_shared_interests():
    assert compatibility_score("travel,fitness,food","travel,fitness,music") == 73

def test_compatibility_score_location_bonus_and_cap():
    assert compatibility_score("travel,fitness,food","travel,fitness,food",True) == 92
    assert compatibility_score("a,b,c,d,e,f","a,b,c,d,e,f",True) == 99

def test_age_boundary():
    today=date(2026,10,9)
    adult=date(2008,10,9)
    assert today.year-adult.year-((today.month,today.day)<(adult.month,adult.day)) == 18
