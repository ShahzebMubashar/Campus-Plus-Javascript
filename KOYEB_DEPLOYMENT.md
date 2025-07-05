# Koyeb Deployment Guide for Campus Plus Backend

## Prerequisites
- [Koyeb account](https://app.koyeb.com/auth/signup) (free tier available)
- PostgreSQL database (you can use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for free)
- Your frontend deployed (e.g., on Vercel)

## Step 1: Prepare Your Database

### Option A: Using Neon (Recommended - Free)
1. Go to [Neon](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string (it looks like: `postgresql://username:password@host/database`)

### Option B: Using Supabase
1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → Database and copy the connection string

## Step 2: Set Up Your Database Schema
Run your SQL schema on your chosen database:
```sql
-- Use the contents of backend/Utils/Database.sql
-- Copy and paste the SQL commands into your database query editor
```

## Step 3: Deploy to Koyeb

### Method 1: Using Koyeb Dashboard (Recommended)
1. Go to [Koyeb Dashboard](https://app.koyeb.com)
2. Click "Create App"
3. Choose "GitHub" as source
4. Connect your GitHub repository
5. Select your repository and branch
6. Configure the following:
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
   - **Port**: `8080`
   - **Root Directory**: `backend`

### Method 2: Using Koyeb CLI
1. Install Koyeb CLI:
   ```bash
   npm install -g @koyeb/cli
   ```
2. Login to Koyeb:
   ```bash
   koyeb login
   ```
3. Deploy from the backend directory:
   ```bash
   cd backend
   koyeb app deploy campus-plus-backend
   ```

## Step 4: Configure Environment Variables

In your Koyeb app settings, add these environment variables:

### Required Variables:
- `NODE_ENV`: `production`
- `PORT`: `8080`
- `DB_HOST`: Your database host
- `DB_PORT`: `5432`
- `DB_NAME`: Your database name
- `DB_USER`: Your database username
- `DB_PASSWORD`: Your database password
- `SESSION_SECRET`: A secure random string
- `FRONTEND_URL`: Your frontend URL (e.g., `https://your-app.vercel.app`)

### Optional Variables:
- `EMAIL_USER`: Your Gmail address (for contact form)
- `EMAIL_PASS`: Your Gmail app password

## Step 5: Update Frontend Configuration

Update your frontend to point to the Koyeb backend URL:

1. In your frontend project, create/update `src/config/api.js`:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.koyeb.app'  // Replace with your Koyeb app URL
  : 'http://localhost:4000';

export default API_BASE_URL;
```

2. Update all your API calls to use this base URL.

## Step 6: Test Your Deployment

1. Visit your Koyeb app URL
2. Check the health endpoint: `https://your-app-name.koyeb.app/health`
3. Test your API endpoints
4. Verify the frontend can communicate with the backend

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check your database credentials
   - Ensure your database allows connections from Koyeb's IP ranges
   - Verify your connection string format

2. **CORS Errors**
   - Make sure `FRONTEND_URL` environment variable is set correctly
   - Check that your frontend domain is included in CORS configuration

3. **Session Issues**
   - Ensure `SESSION_SECRET` is set
   - Check cookie settings for production environment

4. **Port Issues**
   - Koyeb expects your app to listen on the PORT environment variable
   - Make sure your app binds to `0.0.0.0`, not just `localhost`

### Logs and Monitoring:
- Check logs in Koyeb dashboard under "Logs" tab
- Monitor your app's health using the `/health` endpoint
- Set up alerts in Koyeb for downtime notifications

## Free Tier Limits:
- 2 apps maximum
- 512MB RAM per app
- No sleep/downtime (always on!)
- 100GB bandwidth per month

## Next Steps:
1. Set up your database and get connection details
2. Deploy your backend to Koyeb
3. Configure environment variables
4. Update your frontend to use the Koyeb backend URL
5. Test everything works together

Your backend will be available at: `https://your-app-name.koyeb.app` 