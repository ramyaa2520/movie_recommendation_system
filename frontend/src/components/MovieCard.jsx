import React, { useState, useEffect } from 'react';
import './MovieCard.css';
import {
    isMovieLiked,
    isMovieDisliked,
    addLikedMovie,
    addDislikedMovie,
    removeLikedMovie,
    removeDislikedMovie
} from '../services/localStorage';

const MovieCard = ({ movie, onLike, onDislike, showActions = false }) => {
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);

    // Check localStorage on mount to initialize state
    useEffect(() => {
        if (movie && movie.title) {
            setLiked(isMovieLiked(movie.title));
            setDisliked(isMovieDisliked(movie.title));
        }
    }, [movie]);

    const handleLike = () => {
        if (!liked && movie && movie.title) {
            setLiked(true);
            setDisliked(false);
            // Save to localStorage
            addLikedMovie(movie.title);
            removeDislikedMovie(movie.title);
            // Call parent callback
            onLike && onLike(movie.title);
        }
    };

    const handleDislike = () => {
        if (!disliked && movie && movie.title) {
            setDisliked(true);
            setLiked(false);
            // Save to localStorage
            addDislikedMovie(movie.title);
            removeLikedMovie(movie.title);
            // Call parent callback
            onDislike && onDislike(movie.title);
        }
    };

    return (
        <div className="movie-card">
            <div className="movie-poster">
                <img
                    src={movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Poster'}
                    alt={movie.title}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                    }}
                />
                <div className="movie-overlay">
                    <div className="movie-info">
                        <h3 className="movie-title">{movie.title}</h3>
                        {movie.vote_average && (
                            <div className="movie-rating">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                </svg>
                                <span>{Number(movie.vote_average).toFixed(1)}/10</span>
                            </div>
                        )}
                        {movie.overview && (
                            <p className="movie-overview">{movie.overview.substring(0, 120)}...</p>
                        )}
                        {movie.genres && (
                            <div className="movie-genres">
                                {movie.genres.split(',').slice(0, 3).map((genre, idx) => (
                                    <span key={idx} className="genre-tag">{genre.trim()}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showActions && (
                <div className="movie-actions">
                    <button
                        className={`action-btn like-btn ${liked ? 'active' : ''}`}
                        onClick={handleLike}
                        disabled={liked}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                        {liked && <span>Liked</span>}
                    </button>
                    <button
                        className={`action-btn dislike-btn ${disliked ? 'active' : ''}`}
                        onClick={handleDislike}
                        disabled={disliked}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                        </svg>
                        {disliked && <span>Disliked</span>}
                    </button>
                </div>
            )}
        </div>
    );
};

export default MovieCard;
