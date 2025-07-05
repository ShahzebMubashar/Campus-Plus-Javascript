# Quick OAuth Setup for Testing

## 1. Install Required Packages

```bash
cd backend
npm install passport passport-google-oauth20 passport-github2
```

## 2. Set Up Environment Variables

Add these to your `backend/.env` file:

```env
# OAuth Configuration (for testing, you can use placeholder values)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

## 3. Quick Google OAuth Setup (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application type: "Web application"
6. Add Authorized redirect URI: `http://localhost:4000/auth/google/callback`
7. Copy Client ID and Client Secret to your `.env` file

## 4. Quick GitHub OAuth Setup (3 minutes)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - Application name: Campus Plus
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:4000/auth/github/callback`
4. Copy Client ID and Client Secret to your `.env` file

## 5. Test the Implementation

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm start`
3. Go to sign-in page
4. Click "Continue with Google" or "Continue with GitHub"
5. Complete OAuth flow

## What's Fixed

✅ **Database constraint issue**: Rollnumber now fits within 8-character limit
✅ **Unique rollnumbers**: Each OAuth user gets a unique rollnumber
✅ **Error handling**: Proper error handling and rollback on failures
✅ **Session management**: OAuth users are properly authenticated

## Expected Behavior

- First OAuth user gets rollnumber: `OAUTH`
- Second OAuth user gets rollnumber: `O00001`
- Third OAuth user gets rollnumber: `O00002`
- And so on...

The system will handle up to 99,999 OAuth users with this format. 