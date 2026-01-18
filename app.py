import os
from flask import Flask, request, jsonify
from flask_cors import CORS

from model.recommender import MovieRecommender

app = Flask(__name__)

# Configure CORS for production
# Configure CORS
# In production, set FRONTEND_URL to your deployed frontend URL (e.g., https://myapp.vercel.app)
frontend_url = os.environ.get("FRONTEND_URL", "*")

CORS(app, resources={
    r"/*": {
        "origins": [frontend_url],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

# Initialize recommender
try:
    recommender = MovieRecommender("data/movies.csv")
except Exception as e:
    print(f"Error initializing recommender: {e}")
    recommender = None


# Helper function to clean genre data
def clean_genres(genres_str):
    """Convert JSON genre array to clean comma-separated string"""
    import json
    try:
        if not genres_str:
            return ""
        genres_list = json.loads(genres_str)
        genre_names = [g['name'] for g in genres_list if isinstance(g, dict) and 'name' in g]
        return ", ".join(genre_names)
    except (json.JSONDecodeError, TypeError):
        return ""


# Health check endpoint
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Movie Recommendation API is running"
    })


# Get available genres
@app.route("/genres", methods=["GET"])
def get_genres():
    if not recommender:
        return jsonify({"error": "Recommender not initialized"}), 500
    
    try:
        genres = recommender.get_all_genres()
        return jsonify({"genres": genres})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get random movies
@app.route("/movies/random", methods=["GET"])
def get_random_movies():
    if not recommender:
        return jsonify({"error": "Recommender not initialized"}), 500
    
    try:
        count = request.args.get("count", 12, type=int)
        movies = recommender.get_random_movies(count)
        result = movies[["title", "poster_url", "overview", "genres", "vote_average"]].copy()
        result["genres"] = result["genres"].apply(clean_genres)
        return jsonify(result.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Search movies by title
@app.route("/movies/search", methods=["GET"])
def search_movies():
    if not recommender:
        return jsonify({"error": "Recommender not initialized"}), 500
    
    try:
        query = request.args.get("q", "")
        if not query:
            return jsonify({"error": "Query parameter 'q' is required"}), 400
        
        movies = recommender.search_by_title(query)
        result = movies[["title", "poster_url", "overview", "genres", "vote_average"]].copy()
        result["genres"] = result["genres"].apply(clean_genres)
        return jsonify(result.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Genre-based recommendations
@app.route("/recommend/genre", methods=["POST"])
def recommend_genre():
    if not recommender:
        return jsonify({"error": "Recommender not initialized"}), 500
    
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        genres = data.get("genres", [])
        if not genres:
            return jsonify({"error": "At least one genre is required"}), 400
        
        count = data.get("count", 12)
        movies = recommender.recommend_by_genre(genres, top_n=count)
        
        result = movies[["title", "poster_url", "overview", "genres", "vote_average"]].copy()
        result["genres"] = result["genres"].apply(clean_genres)
        return jsonify(result.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Feedback-based recommendations
@app.route("/recommend/feedback", methods=["POST"])
def recommend_feedback():
    if not recommender:
        return jsonify({"error": "Recommender not initialized"}), 500
    
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body is required"}), 400
        
        liked = data.get("liked", [])
        disliked = data.get("disliked", [])
        
        if not liked and not disliked:
            return jsonify({"error": "At least one liked or disliked movie is required"}), 400
        
        count = data.get("count", 12)
        movies = recommender.recommend_by_feedback(liked, disliked, top_n=count)
        
        result = movies[["title", "poster_url", "overview", "genres", "vote_average"]].copy()
        result["genres"] = result["genres"].apply(clean_genres)
        return jsonify(result.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
