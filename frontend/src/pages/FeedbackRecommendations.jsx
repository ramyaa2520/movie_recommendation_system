import React, { useState, useEffect } from 'react';
import { movieApi } from '../services/api';
import MovieCard from '../components/MovieCard';
import {
    getLikedMovies,
    getDislikedMovies,
    clearAllPreferences
} from '../services/localStorage';
import './FeedbackRecommendations.css';

const FeedbackRecommendations = () => {
    const [currentMovies, setCurrentMovies] = useState([]);
    const [likedMovies, setLikedMovies] = useState([]);
    const [dislikedMovies, setDislikedMovies] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);

    useEffect(() => {
        // Load preferences from localStorage
        const storedLiked = getLikedMovies();
        const storedDisliked = getDislikedMovies();

        setLikedMovies(storedLiked);
        setDislikedMovies(storedDisliked);

        // If user has previous likes, auto-load recommendations
        if (storedLiked.length > 0 || storedDisliked.length > 0) {
            loadRecommendationsFromStorage(storedLiked, storedDisliked);
        } else {
            // Otherwise load initial random movies
            loadInitialMovies();
        }
    }, []);

    const loadInitialMovies = async () => {
        setLoading(true);
        try {
            const movies = await movieApi.getRandomMovies(12);
            setCurrentMovies(movies);
        } catch (err) {
            console.error('Failed to load movies:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadRecommendationsFromStorage = async (liked, disliked) => {
        setLoading(true);
        try {
            const movies = await movieApi.getFeedbackRecommendations(liked, disliked, 12);
            setRecommendations(movies);
            setShowRecommendations(true);
        } catch (err) {
            console.error('Failed to load recommendations from storage:', err);
            // Fall back to loading initial movies
            loadInitialMovies();
        } finally {
            setLoading(false);
        }
    };

    const handleLike = (title) => {
        setLikedMovies(prev => [...prev, title]);
    };

    const handleDislike = (title) => {
        setDislikedMovies(prev => [...prev, title]);
    };

    const getRecommendations = async () => {
        if (likedMovies.length === 0 && dislikedMovies.length === 0) {
            return;
        }

        setLoading(true);
        try {
            const movies = await movieApi.getFeedbackRecommendations(likedMovies, dislikedMovies, 12);
            setRecommendations(movies);
            setShowRecommendations(true);
        } catch (err) {
            console.error('Failed to get recommendations:', err);
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setLikedMovies([]);
        setDislikedMovies([]);
        setRecommendations([]);
        setShowRecommendations(false);
        loadInitialMovies();
    };

    const clearPreferences = () => {
        // Clear localStorage
        clearAllPreferences();
        // Reset state
        setLikedMovies([]);
        setDislikedMovies([]);
        setRecommendations([]);
        setShowRecommendations(false);
        // Load fresh movies
        loadInitialMovies();
    };

    if (loading && currentMovies.length === 0) {
        return (
            <div className="page loading-page">
                <div className="loading"></div>
                <p>Loading movies...</p>
            </div>
        );
    }

    return (
        <div className="feedback-recommendations page">
            <div className="container">
                <header className="page-header">
                    <h1>Rate & <span className="text-gradient">Discover</span></h1>
                    <p className="page-subtitle">
                        Like or dislike movies to help us understand your taste and get personalized recommendations
                    </p>
                </header>

                {/* Feedback Stats */}
                {!showRecommendations && (
                    <div className="feedback-stats">
                        <div className="stat-card glass-card">
                            <div className="stat-icon liked">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{likedMovies.length}</span>
                                <span className="stat-label">Liked</span>
                            </div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-icon disliked">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-number">{dislikedMovies.length}</span>
                                <span className="stat-label">Disliked</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {!showRecommendations && (
                    <div className="action-section">
                        <button
                            className="btn btn-primary"
                            onClick={getRecommendations}
                            disabled={loading || (likedMovies.length === 0 && dislikedMovies.length === 0)}
                        >
                            {loading ? (
                                <>
                                    <div className="loading"></div>
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                    </svg>
                                    <span>Get My Recommendations</span>
                                </>
                            )}
                        </button>
                        <button className="btn btn-secondary" onClick={loadInitialMovies}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="1 4 1 10 7 10"></polyline>
                                <polyline points="23 20 23 14 17 14"></polyline>
                                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                            </svg>
                            <span>Load More Movies</span>
                        </button>
                        {(likedMovies.length > 0 || dislikedMovies.length > 0) && (
                            <button className="btn btn-outline" onClick={clearPreferences}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                                <span>Clear My Preferences</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Current Movies to Rate */}
                {!showRecommendations && currentMovies.length > 0 && (
                    <div className="movies-section">
                        <h2 className="section-title">Rate These Movies</h2>
                        <div className="movie-grid">
                            {currentMovies.map((movie, index) => (
                                <MovieCard
                                    key={index}
                                    movie={movie}
                                    onLike={handleLike}
                                    onDislike={handleDislike}
                                    showActions={true}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommendations */}
                {showRecommendations && recommendations.length > 0 && (
                    <div className="results-section">
                        <h2 className="results-title">
                            Your Personalized Recommendations
                            <span className="results-count">{recommendations.length} movies</span>
                        </h2>
                        <div className="movie-grid">
                            {recommendations.map((movie, index) => (
                                <MovieCard key={index} movie={movie} />
                            ))}
                        </div>
                        <div className="action-section mt-5">
                            <button className="btn btn-primary" onClick={reset}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="1 4 1 10 7 10"></polyline>
                                    <polyline points="23 20 23 14 17 14"></polyline>
                                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                                </svg>
                                Start Over
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackRecommendations;
