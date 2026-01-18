import React from 'react';
import './GenreSelector.css';

const GenreSelector = ({ genres, selectedGenres, onToggle }) => {
    return (
        <div className="genre-selector">
            <h3 className="selector-title">Select Your Favorite Genres</h3>
            <div className="genre-chips">
                {genres.map((genre) => (
                    <button
                        key={genre}
                        className={`genre-chip ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                        onClick={() => onToggle(genre)}
                    >
                        <span className="chip-icon">
                            {selectedGenres.includes(genre) ? '✓' : '+'}
                        </span>
                        {genre}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GenreSelector;
