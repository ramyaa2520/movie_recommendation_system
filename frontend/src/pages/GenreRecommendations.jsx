import React, { useState, useEffect } from 'react';
import { movieApi } from '../services/api';
import GenreSelector from '../components/GenreSelector';
import MovieCard from '../components/MovieCard';
import './GenreRecommendations.css';

const GenreRecommendations = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadGenres();
    }, []);

    const loadGenres = async () => {
        try {
            const genreList = await movieApi.getGenres();
            setGenres(genreList);
        } catch (err) {
            setError('Failed to load genres. Please try again.');
            console.error(err);
        }
    };

    const toggleGenre = (genre) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const getRecommendations = async () => {
        if (selectedGenres.length === 0) {
            setError('Please select at least one genre');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const movies = await movieApi.getGenreRecommendations(selectedGenres, 12);
            setRecommendations(movies);
        } catch (err) {
            setError('Failed to get recommendations. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="genre-recommendations page">
            <div className="container">
                <header className="page-header">
                    <h1>Browse by <span className="text-gradient">Genre</span></h1>
                    <p className="page-subtitle">
                        Select your favorite genres and discover amazing movies tailored to your taste
                    </p>
                </header>

                {error && (
                    <div className="error-message glass-card">
                        {error}
                    </div>
                )}

                <GenreSelector
                    genres={genres}
                    selectedGenres={selectedGenres}
                    onToggle={toggleGenre}
                />

                <div className="action-section">
                    <button
                        className="btn btn-primary"
                        onClick={getRecommendations}
                        disabled={loading || selectedGenres.length === 0}
                    >
                        {loading ? (
                            <>
                                <div className="loading"></div>
                                <span>Finding Movies...</span>
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.35-4.35"></path>
                                </svg>
                                <span>Get Recommendations</span>
                            </>
                        )}
                    </button>
                </div>

                {recommendations.length > 0 && (
                    <div className="results-section">
                        <h2 className="results-title">
                            Recommended for You
                            <span className="results-count">{recommendations.length} movies</span>
                        </h2>
                        <div className="movie-grid">
                            {recommendations.map((movie, index) => (
                                <MovieCard key={index} movie={movie} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenreRecommendations;
