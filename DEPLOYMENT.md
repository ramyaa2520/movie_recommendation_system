# Deployment Guide

This guide will help you deploy the Movie Recommendation System for free using Render (backend) and Vercel (frontend).

## Prerequisites

- GitHub account
- Git installed on your local machine
- Code pushed to a GitHub repository

## Push Code to GitHub

If you haven't already, push your code to GitHub:

```bash
cd e:\MRS
git init
git add .
git commit -m "Initial commit: Movie Recommendation System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Backend Deployment (Render)

### Step 1: Sign Up for Render

1. Go to [render.com](https://render.com/)
2. Sign up using your GitHub account

### Step 2: Create a New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select the repository containing your movie recommendation system

### Step 3: Configure the Service

Fill in the following settings:

- **Name**: `movie-recommender-api` (or any name you prefer)
- **Region**: Choose the closest region to you
- **Branch**: `main`
- **Root Directory**: Leave empty (or `.` if prompted)
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`

### Step 4: Environment Variables

Render will automatically detect the `render.yaml` file, but you can also manually set:

- **PYTHON_VERSION**: `3.11.0`

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for the deployment to complete (usually 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://movie-recommender-api.onrender.com`
4. **IMPORTANT**: Copy this URL - you'll need it for the frontend!

### Step 6: Test the Backend

Visit `https://YOUR-APP-NAME.onrender.com/` in your browser. You should see:
```json
{
  "status": "healthy",
  "message": "Movie Recommendation API is running"
}
```

> **Note**: Free tier on Render may "spin down" after 15 minutes of inactivity. The first request after inactivity might take 30-60 seconds.

## Frontend Deployment (Vercel)

### Step 1: Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com/)
2. Sign up using your GitHub account

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Vercel will detect it's a Vite project automatically

### Step 3: Configure Build Settings

Vercel should auto-detect these, but verify:

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 4: Environment Variables

Add the following environment variable:

- **Key**: `VITE_API_URL`
- **Value**: `https://YOUR-RENDER-APP-NAME.onrender.com` (the URL from Step 5 of backend deployment)

**Example**: `https://movie-recommender-api.onrender.com`

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for deployment (usually 1-2 minutes)
3. You'll get a URL like: `https://your-app-name.vercel.app`

### Step 6: Test the Application

1. Visit your Vercel URL
2. Try both recommendation flows:
   - Browse by Genre
   - Rate & Discover

## Alternative: Netlify (Frontend)

If you prefer Netlify over Vercel:

### Step 1: Sign Up

1. Go to [netlify.com](https://netlify.com/)
2. Sign up with GitHub

### Step 2: Deploy

1. **"Add new site"** → **"Import an existing project"**
2. Connect to GitHub and select your repository
3. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

### Step 3: Environment Variables

Go to **Site Settings** → **Environment variables** and add:

- **Key**: `VITE_API_URL`
- **Value**: Your Render backend URL

## Update CORS (Important!)

After deploying the frontend, update the backend CORS settings for better security:

1. Open `app.py` in your repository
2. Update the CORS origins:

```python
CORS(app, resources={
    r"/*": {
        "origins": ["https://your-vercel-app.vercel.app"],  # Replace with your frontend URL
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})
```

3. Commit and push the changes
4. Render will automatically redeploy

## Troubleshooting

### Backend Issues

**Problem**: "Recommender not initialized" error
- **Solution**: Check Render logs. The CSV file might be too large. Render free tier has memory limits.

**Problem**: Slow response times
- **Solution**: This is normal for free tier. First request after inactivity takes longer.

### Frontend Issues

**Problem**: API calls failing with CORS error
- **Solution**: Verify the `VITE_API_URL` environment variable is correctly set in Vercel/Netlify

**Problem**: Environment variable not updating
- **Solution**: Trigger a new deployment after changing environment variables

### General Tips

1. **Check Logs**: Both Render and Vercel provide deployment and runtime logs
2. **Free Tier Limits**: 
   - Render: 750 hours/month, spins down after 15 min inactivity
   - Vercel: Unlimited deployments, 100GB bandwidth/month
3. **Custom Domain**: Both platforms support custom domains for free

## Monitoring

- **Render Dashboard**: Monitor API uptime and requests
- **Vercel Analytics**: Track frontend performance (free tier available)

## Cost

Both platforms are **completely free** for this use case:
- No credit card required
- Suitable for portfolio projects and demos
- Production-ready with reasonable limits

## Need Help?

- Render Docs: [render.com/docs](https://render.com/docs)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Netlify Docs: [docs.netlify.com](https://docs.netlify.com)
