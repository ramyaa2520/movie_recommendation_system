# Quick test to verify genre parsing fixes
import sys
sys.path.insert(0, '.')

from model.recommender import MovieRecommender

print("Testing genre parsing fixes...")
print("-" * 50)

# Initialize recommender
recommender = MovieRecommender("data/movies.csv")

# Test 1: Get all genres
print("\n1. Testing get_all_genres():")
genres = recommender.get_all_genres()
print(f"   Total genres found: {len(genres)}")
print(f"   First 10 genres: {genres[:10]}")
print(f"   ✓ Genres should be clean names like 'Action', 'Comedy', etc.")
print(f"   ✗ Should NOT contain numbers or JSON formatting")

# Test 2: Test genre-based recommendations
print("\n2. Testing genre recommendations with randomization:")
print("   Getting recommendations for ['Action', 'Thriller']...")

results1 = recommender.recommend_by_genre(['Action', 'Thriller'], top_n=5)
print(f"   First call - Found {len(results1)} movies:")
for i, row in results1.iterrows():
    print(f"      - {row['title']}")

results2 = recommender.recommend_by_genre(['Action', 'Thriller'], top_n=5)
print(f"\n   Second call - Found {len(results2)} movies:")
for i, row in results2.iterrows():
    print(f"      - {row['title']}")

# Check if results are different
titles1 = set(results1['title'].tolist())
titles2 = set(results2['title'].tolist())
if titles1 != titles2:
    print(f"\n   ✓ SUCCESS: Results are different (randomization working!)")
    print(f"      {len(titles1 - titles2)} different movies in first call")
    print(f"      {len(titles2 - titles1)} different movies in second call")
else:
    print(f"\n   ✗ WARNING: Results are identical (randomization may not be working)")

print("\n" + "-" * 50)
print("Test complete!")
