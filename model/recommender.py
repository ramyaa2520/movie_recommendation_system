import pandas as pd
import numpy as np

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class MovieRecommender:
    def __init__(self, csv_path):
        self.df = pd.read_csv(csv_path)

        # Keep only required columns
        self.df = self.df[[
            "title",
            "overview",
            "genres",
            "keywords",
            "poster_url",
            "vote_average"
        ]]

        self.df.fillna("", inplace=True)

        # Combine features
        self.df["combined_features"] = (
            self.df["overview"] + " " +
            self.df["genres"] + " " +
            self.df["keywords"]
        )

        # Train TF-IDF model
        self.tfidf = TfidfVectorizer(
            stop_words="english",
            max_features=5000
        )

        self.movie_vectors = self.tfidf.fit_transform(
            self.df["combined_features"]
        )

    # -------- GENRE BASED --------
    def recommend_by_genre(self, genres, top_n=10):
        import json
        
        # Create a user preference text from selected genres
        user_text = " ".join(genres)
        user_vector = self.tfidf.transform([user_text])

        # Calculate similarity scores
        scores = cosine_similarity(user_vector, self.movie_vectors).flatten()
        
        # Get more results than needed for randomization
        top_candidates = min(top_n * 5, len(self.df))
        
        # Get top candidates based on scores
        top_indices = np.argsort(scores)[::-1][:top_candidates]
        
        # Filter candidates to ensure they have at least one selected genre
        matching_movies = []
        for idx in top_indices:
            movie_genres_str = self.df.iloc[idx]["genres"]
            try:
                # Parse JSON to get genre names
                genres_list = json.loads(movie_genres_str) if movie_genres_str else []
                movie_genre_names = [g['name'] for g in genres_list if isinstance(g, dict) and 'name' in g]
                
                # Check if movie has at least one selected genre
                if any(genre in movie_genre_names for genre in genres):
                    matching_movies.append(idx)
            except (json.JSONDecodeError, TypeError, KeyError):
                pass
        
        # Randomly sample from matching movies to provide variety
        if len(matching_movies) > top_n:
            selected_indices = np.random.choice(matching_movies, size=top_n, replace=False)
        else:
            selected_indices = matching_movies[:top_n]
        
        return self.df.iloc[selected_indices]

    # -------- LIKE / DISLIKE BASED --------
    def recommend_by_feedback(self, liked, disliked, top_n=10):
        liked_idx = self.df[self.df["title"].isin(liked)].index
        disliked_idx = self.df[self.df["title"].isin(disliked)].index

        if len(liked_idx) == 0:
            return self.df.sample(top_n)

        liked_vec = self.movie_vectors[liked_idx].mean(axis=0)

        if len(disliked_idx) > 0:
            disliked_vec = self.movie_vectors[disliked_idx].mean(axis=0)
            user_vector = liked_vec - disliked_vec
        else:
            user_vector = liked_vec

        scores = cosine_similarity(user_vector, self.movie_vectors).flatten()
        self.df["score"] = scores

        return self.df.sort_values(
            "score",
            ascending=False
        ).head(top_n)

    # -------- HELPER METHODS --------
    def get_all_genres(self):
        """Extract all unique genres from the dataset"""
        import json
        all_genres = set()
        for genres_str in self.df["genres"]:
            if genres_str:
                try:
                    # Parse JSON array of genre objects
                    genres_list = json.loads(genres_str)
                    # Extract only the "name" field from each genre object
                    for genre_obj in genres_list:
                        if isinstance(genre_obj, dict) and 'name' in genre_obj:
                            all_genres.add(genre_obj['name'])
                except (json.JSONDecodeError, TypeError):
                    # If JSON parsing fails, skip this entry
                    pass
        return sorted(list(all_genres))

    def get_random_movies(self, count=10):
        """Get random movies from the dataset"""
        return self.df.sample(min(count, len(self.df)))

    def search_by_title(self, query, limit=20):
        """Search movies by title"""
        mask = self.df["title"].str.contains(query, case=False, na=False)
        return self.df[mask].head(limit)
