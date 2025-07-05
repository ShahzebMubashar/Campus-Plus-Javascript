# Koyeb Deployment Guide for Campus Plus Backend

This guide will help you deploy your Campus Plus backend application to Koyeb using Docker.

## Prerequisites

1. **Koyeb Account**: Sign up at [koyeb.com](https://koyeb.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Database**: PostgreSQL database (you can use Koyeb's managed PostgreSQL or external services like Supabase, Railway, etc.)
4. **Environment Variables**: Prepare your environment variables

## Step 1: Prepare Your Repository

Make sure your repository contains:
- `Dockerfile` (already created)
- `.dockerignore` (already created)
- `koyeb.yaml` (already created)
- All your backend code

## Step 2: Set Up Database

### Option A: External Database (Recommended)
Use services like:
- **Supabase**: Free tier available
- **Railway**: Free tier available
- **Neon**: Free tier available
- **PlanetScale**: Free tier available

### Option B: Koyeb Managed PostgreSQL
1. Go to Koyeb Dashboard
2. Create a new PostgreSQL database
3. Note down the connection details

## Step 3: Configure Environment Variables

In your Koyeb dashboard, you'll need to set these environment variables:

### Required Environment Variables:
```
NODE_ENV=production
PORT=4000
SESSION_SECRET=your-super-secret-session-key
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=your-database-name
FRONTEND_URL=https://your-frontend-domain.com
```

### Optional Environment Variables:
```
JWT_SECRET=your-jwt-secret-key
EMAIL_USER=your-email-username
EMAIL_PASS=your-email-password
```

## Step 4: Deploy to Koyeb

### Method 1: Using Koyeb Dashboard (Recommended)

1. **Login to Koyeb Dashboard**
   - Go to [console.koyeb.com](https://console.koyeb.com)
   - Sign in with your account

2. **Create New App**
   - Click "Create App"
   - Choose "GitHub" as deployment method
   - Connect your GitHub account if not already connected

3. **Select Repository**
   - Choose your Campus Plus backend repository
   - Select the branch (usually `main` or `master`)

4. **Configure Build Settings**
   - **Build Command**: Leave empty (Docker will handle this)
   - **Run Command**: Leave empty (Docker will handle this)
   - **Dockerfile Path**: `backend/Dockerfile`

5. **Set Environment Variables**
   - Add all the environment variables listed in Step 3
   - Make sure to use the correct database connection details

6. **Configure Resources**
   - **Instance Type**: Choose based on your needs (Free tier available)
   - **Region**: Choose closest to your users
   - **Scaling**: Set min/max instances as needed

7. **Deploy**
   - Click "Deploy" and wait for the build to complete

### Method 2: Using Koyeb CLI

1. **Install Koyeb CLI**
   ```bash
   # macOS
   brew install koyeb/tap/cli
   
   # Windows
   scoop install koyeb
   
   # Linux
   curl -fsSL https://cli.koyeb.com/install.sh | bash
   ```

2. **Login to Koyeb**
   ```bash
   koyeb login
   ```

3. **Deploy using koyeb.yaml**
   ```bash
   cd backend
   koyeb app init campus-plus-backend --docker
   koyeb app deploy
   ```

## Step 5: Configure Custom Domain (Optional)

1. In your Koyeb dashboard, go to your app
2. Click on "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS records as instructed

## Step 6: Set Up Secrets (Recommended)

For sensitive data like database credentials:

1. Go to Koyeb Dashboard → "Secrets"
2. Create new secrets for:
   - `session-secret`
   - `db-user`
   - `db-password`
   - `db-host`
   - `db-name`

3. Reference these secrets in your environment variables:
   ```
   SESSION_SECRET=@session-secret
   DB_USER=@db-user
   DB_PASSWORD=@db-password
   DB_HOST=@db-host
   DB_NAME=@db-name
   ```

## Step 7: Monitor Your Deployment

1. **Check Logs**
   - Go to your app in Koyeb dashboard
   - Click on "Logs" to monitor application logs

2. **Health Checks**
   - Your app has a health check endpoint at `/health`
   - Koyeb will automatically monitor this endpoint

3. **Metrics**
   - Monitor CPU, memory usage, and response times
   - Set up alerts if needed

## Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check if all dependencies are in `package.json`
   - Verify Dockerfile syntax
   - Check build logs in Koyeb dashboard

2. **Database Connection Issues**
   - Verify database credentials
   - Check if database is accessible from Koyeb
   - Ensure SSL settings are correct

3. **Environment Variables**
   - Double-check all environment variables are set
   - Verify variable names match your code

4. **CORS Issues**
   - Update `FRONTEND_URL` to match your frontend domain
   - Check CORS configuration in your code

### Useful Commands:

```bash
# Check app status
koyeb app status campus-plus-backend

# View logs
koyeb app logs campus-plus-backend

# Update environment variables
koyeb app update campus-plus-backend --env NODE_ENV=production

# Scale app
koyeb app update campus-plus-backend --min-scale 1 --max-scale 3
```

## Cost Optimization

1. **Use Free Tier**: Koyeb offers a generous free tier
2. **Auto-scaling**: Set appropriate min/max scale values
3. **Resource Limits**: Monitor and adjust CPU/memory as needed
4. **Database**: Use external free tier databases when possible

## Security Best Practices

1. **Use Secrets**: Store sensitive data in Koyeb secrets
2. **Environment Variables**: Never commit secrets to your repository
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS properly for your frontend domain
5. **Session Security**: Use strong session secrets

## Support

- **Koyeb Documentation**: [docs.koyeb.com](https://docs.koyeb.com)
- **Koyeb Community**: [community.koyeb.com](https://community.koyeb.com)
- **GitHub Issues**: For application-specific issues

---

Your Campus Plus backend should now be successfully deployed on Koyeb! 🚀 