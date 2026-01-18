import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const movieApi = {
    // Get available genres
    getGenres: async () => {
        const response = await api.get('/genres');
        return response.data.genres;
    },

    // Get random movies
    getRandomMovies: async (count = 12) => {
        const response = await api.get(`/movies/random?count=${count}`);
        return response.data;
    },

    // Search movies
    searchMovies: async (query) => {
        const response = await api.get(`/movies/search?q=${query}`);
        return response.data;
    },

    // Get genre-based recommendations
    getGenreRecommendations: async (genres, count = 12) => {
        const response = await api.post('/recommend/genre', { genres, count });
        return response.data;
    },

    // Get feedback-based recommendations
    getFeedbackRecommendations: async (liked, disliked, count = 12) => {
        const response = await api.post('/recommend/feedback', { liked, disliked, count });
        return response.data;
    },
};

export default api;
