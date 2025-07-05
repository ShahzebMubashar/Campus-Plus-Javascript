# OAuth Setup Guide for Campus Plus

This guide will help you set up Google and GitHub OAuth authentication for the Campus Plus application.

## Prerequisites

1. Install the required packages in the backend:
```bash
cd backend
npm install passport passport-google-oauth20 passport-github2
```

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen:
   - Add your application name
   - Add your domain
   - Add scopes: `email` and `profile`
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:4000/auth/google/callback`
7. Copy the Client ID and Client Secret

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: Campus Plus
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:4000/auth/github/callback`
4. Click "Register application"
5. Copy the Client ID and Client Secret

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# Email Configuration
MAILER_PASS=your_gmail_app_password

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Server Configuration
PORT_BACKEND=4000
NODE_ENV=development
```

## How It Works

1. **User clicks "Continue with Google" or "Continue with GitHub"**
   - Frontend redirects to backend OAuth route
   - Backend redirects to OAuth provider

2. **OAuth Provider authenticates user**
   - User logs in with their Google/GitHub account
   - Provider redirects back to our callback URL

3. **Backend processes OAuth callback**
   - Passport.js handles the OAuth response
   - Creates or finds user in database
   - Sets up session

4. **User is redirected to success page**
   - Frontend checks authentication status
   - Stores user data in localStorage
   - Redirects to dashboard

## Database Changes

The OAuth implementation will automatically:
- Create new users if they don't exist
- Use email as the unique identifier
- Generate random usernames if conflicts occur
- Set rollnumber as 'OAUTH_USER' for OAuth users
- Store full name in UserInfo table

## Testing

1. Start the backend server: `npm run dev`
2. Start the frontend: `npm start`
3. Navigate to the sign-in page
4. Click "Continue with Google" or "Continue with GitHub"
5. Complete the OAuth flow
6. You should be redirected to the dashboard

## Troubleshooting

- **"Invalid redirect URI"**: Make sure the callback URLs in OAuth provider settings match exactly
- **"Client ID not found"**: Verify your environment variables are set correctly
- **"Session not working"**: Check that CORS is configured properly and credentials are included
- **"Database errors"**: Ensure your database is running and the Users/UserInfo tables exist

## Production Deployment

For production, update the callback URLs to your production domain:
- Google: `https://yourdomain.com/auth/google/callback`
- GitHub: `https://yourdomain.com/auth/github/callback`

Also update the CORS origin in `backend/src/Server.js` to your production frontend URL. 