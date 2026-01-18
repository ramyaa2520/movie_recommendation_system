# Movie Recommendation System

An AI-powered movie recommendation web application with a modern dark-themed UI. Get personalized movie suggestions based on genres or your viewing preferences.

## Features

- 🎬 **Genre-Based Recommendations**: Select your favorite genres and discover movies
- 👍 **Feedback-Based Recommendations**: Rate movies and get personalized suggestions
- 🎨 **Modern Dark UI**: Beautiful glassmorphism design with smooth animations
- 🚀 **Fast & Responsive**: Built with React and Vite for optimal performance
- 🤖 **AI-Powered**: Uses TF-IDF machine learning for smart recommendations

## Tech Stack

### Backend
- Flask (Python web framework)
- scikit-learn (TF-IDF recommendation model)
- pandas & numpy (data processing)
- CORS support for API access

### Frontend
- React 18
- Vite (build tool)
- React Router (navigation)
- Axios (API calls)
- Modern CSS with glassmorphism effects

## Local Development

### Backend Setup

1. Navigate to the project directory:
```bash
cd e:\MRS
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to:
- **Backend**: Render (free tier)
- **Frontend**: Vercel or Netlify (free tier)

## Project Structure

```
MRS/
├── app.py                    # Flask backend API
├── model/
│   └── recommender.py        # ML recommendation engine
├── data/
│   └── movies.csv            # Movie database
├── requirements.txt          # Python dependencies
├── render.yaml              # Render deployment config
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── services/        # API service layer
    │   ├── App.jsx         # Main app component
    │   └── index.css       # Global styles
    ├── package.json
    └── vercel.json         # Vercel deployment config
```

## API Endpoints

- `GET /` - Health check
- `GET /genres` - Get all available genres
- `GET /movies/random?count=12` - Get random movies
- `GET /movies/search?q=query` - Search movies by title
- `POST /recommend/genre` - Get genre-based recommendations
- `POST /recommend/feedback` - Get feedback-based recommendations

## License

MIT License - feel free to use this project for learning or personal use.
