import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import GenreRecommendations from './pages/GenreRecommendations';
import FeedbackRecommendations from './pages/FeedbackRecommendations';
import './App.css';

const Navigation = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="nav-brand">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span>CineMatch</span>
                </Link>

                <div className="nav-links">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/genre"
                        className={`nav-link ${location.pathname === '/genre' ? 'active' : ''}`}
                    >
                        By Genre
                    </Link>
                    <Link
                        to="/feedback"
                        className={`nav-link ${location.pathname === '/feedback' ? 'active' : ''}`}
                    >
                        Rate Movies
                    </Link>
                </div>
            </div>
        </nav>
    );
};

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; 2026 CineMatch. Powered by AI recommendation engine.</p>
            </div>
        </footer>
    );
};

function App() {
    return (
        <Router>
            <div className="app">
                <Navigation />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/genre" element={<GenreRecommendations />} />
                        <Route path="/feedback" element={<FeedbackRecommendations />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
