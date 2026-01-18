/**
 * localStorage utility service for managing user movie preferences
 * Handles liked and disliked movies with error handling for corrupted data
 */

const LIKED_MOVIES_KEY = 'cinematch_liked_movies';
const DISLIKED_MOVIES_KEY = 'cinematch_disliked_movies';

/**
 * Safely parse JSON from localStorage with error handling
 * @param {string} key - localStorage key
 * @param {any} defaultValue - default value if parsing fails
 * @returns {any} parsed value or default
 */
const safeGetItem = (key, defaultValue = []) => {
    try {
        const item = localStorage.getItem(key);
        if (!item) return defaultValue;
        return JSON.parse(item);
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        // Clear corrupted data
        localStorage.removeItem(key);
        return defaultValue;
    }
};

/**
 * Safely save JSON to localStorage with error handling
 * @param {string} key - localStorage key
 * @param {any} value - value to store
 */
const safeSetItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing ${key} to localStorage:`, error);
    }
};

// ============ Liked Movies ============

/**
 * Get all liked movie titles from localStorage
 * @returns {string[]} array of liked movie titles
 */
export const getLikedMovies = () => {
    return safeGetItem(LIKED_MOVIES_KEY, []);
};

/**
 * Add a movie to the liked list
 * @param {string} title - movie title to add
 */
export const addLikedMovie = (title) => {
    const liked = getLikedMovies();
    if (!liked.includes(title)) {
        liked.push(title);
        safeSetItem(LIKED_MOVIES_KEY, liked);
    }
};

/**
 * Remove a movie from the liked list
 * @param {string} title - movie title to remove
 */
export const removeLikedMovie = (title) => {
    const liked = getLikedMovies();
    const updated = liked.filter(t => t !== title);
    safeSetItem(LIKED_MOVIES_KEY, updated);
};

/**
 * Check if a movie is in the liked list
 * @param {string} title - movie title to check
 * @returns {boolean} true if movie is liked
 */
export const isMovieLiked = (title) => {
    const liked = getLikedMovies();
    return liked.includes(title);
};

// ============ Disliked Movies ============

/**
 * Get all disliked movie titles from localStorage
 * @returns {string[]} array of disliked movie titles
 */
export const getDislikedMovies = () => {
    return safeGetItem(DISLIKED_MOVIES_KEY, []);
};

/**
 * Add a movie to the disliked list
 * @param {string} title - movie title to add
 */
export const addDislikedMovie = (title) => {
    const disliked = getDislikedMovies();
    if (!disliked.includes(title)) {
        disliked.push(title);
        safeSetItem(DISLIKED_MOVIES_KEY, disliked);
    }
};

/**
 * Remove a movie from the disliked list
 * @param {string} title - movie title to remove
 */
export const removeDislikedMovie = (title) => {
    const disliked = getDislikedMovies();
    const updated = disliked.filter(t => t !== title);
    safeSetItem(DISLIKED_MOVIES_KEY, updated);
};

/**
 * Check if a movie is in the disliked list
 * @param {string} title - movie title to check
 * @returns {boolean} true if movie is disliked
 */
export const isMovieDisliked = (title) => {
    const disliked = getDislikedMovies();
    return disliked.includes(title);
};

// ============ General Operations ============

/**
 * Clear all movie preferences from localStorage
 */
export const clearAllPreferences = () => {
    localStorage.removeItem(LIKED_MOVIES_KEY);
    localStorage.removeItem(DISLIKED_MOVIES_KEY);
};

/**
 * Get statistics about stored preferences
 * @returns {object} statistics object
 */
export const getPreferencesStats = () => {
    return {
        likedCount: getLikedMovies().length,
        dislikedCount: getDislikedMovies().length,
        totalCount: getLikedMovies().length + getDislikedMovies().length
    };
};
