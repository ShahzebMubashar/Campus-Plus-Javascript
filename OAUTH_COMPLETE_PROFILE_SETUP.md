# OAuth with Profile Completion Setup Guide

This guide explains the new OAuth implementation that requires users to complete their profile after authentication.

## How It Works

### 1. OAuth Authentication Flow
1. User clicks "Continue with Google" or "Continue with GitHub"
2. User authenticates with the OAuth provider
3. Backend receives basic profile data (email, full name)
4. User is redirected based on profile completion status

### 2. Profile Completion Flow
- **New Users**: Redirected to `/complete-profile` to provide username and roll number
- **Existing Users**: Redirected to `/auth-success` and then to dashboard

### 3. Data Storage Strategy
- **OAuth Users**: Get temporary username (`temp_1234567890`) and roll number (`PENDING`)
- **Profile Complete**: Username and roll number updated with user-provided values

## Backend Changes

### 1. Updated Passport Configuration (`backend/config/passport.js`)
- OAuth users get temporary credentials
- Profile completion status is tracked
- No automatic username/rollnumber generation

### 2. New API Routes (`backend/routes/authRoutes.js`)
- `POST /auth/complete-profile` - Complete user profile
- Updated `GET /auth/current-user` - Includes profile completion status
- Smart OAuth callbacks - Redirect based on profile status

### 3. Database Strategy
```sql
-- OAuth users start with:
username: 'temp_1234567890' (temporary)
rollnumber: 'PENDING' (placeholder)

-- After profile completion:
username: 'user_provided_username'
rollnumber: 'user_provided_roll'
```

## Frontend Components

### 1. CompleteProfile Component (`src/Pages/SignIn/CompleteProfile.js`)
- Form to collect username and roll number
- Shows existing user info (email, full name)
- Validates unique username and roll number
- Redirects to dashboard after completion

### 2. Updated AuthSuccess Component
- Checks profile completion status
- Redirects to complete profile if needed
- Shows appropriate success messages

### 3. Routing Updates
- Added `/complete-profile` route
- Smart redirects based on authentication state

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install passport passport-google-oauth20 passport-github2
```

### 2. Environment Variables
Add to `backend/.env`:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 3. OAuth Provider Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 Client ID
3. Add redirect URI: `http://localhost:4000/auth/google/callback`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Add callback URL: `http://localhost:4000/auth/github/callback`

## User Experience Flow

### First-Time OAuth User
1. Click "Continue with Google/GitHub"
2. Authenticate with provider
3. Redirected to "Complete Your Profile" page
4. Enter username and roll number
5. Profile completed, redirected to dashboard

### Returning OAuth User
1. Click "Continue with Google/GitHub"
2. Authenticate with provider
3. Redirected directly to dashboard (profile already complete)

### Regular User (Non-OAuth)
1. Use email/password sign-in
2. No profile completion required
3. Redirected to dashboard

## Benefits

✅ **Better Data Quality**: Users provide their actual username and roll number
✅ **Flexible OAuth**: Works with limited OAuth provider data
✅ **User-Friendly**: Clear flow for completing missing information
✅ **Database Integrity**: Maintains unique constraints on username/rollnumber
✅ **Backward Compatible**: Existing users unaffected

## Error Handling

- **Duplicate Username**: Shows error message, user can try different username
- **Duplicate Roll Number**: Shows error message, user can try different roll number
- **Network Errors**: Graceful error handling with retry options
- **Session Expiry**: Redirects to sign-in page

## Testing

1. **New OAuth User Test**:
   - Sign in with Google/GitHub
   - Should redirect to complete profile page
   - Fill in username and roll number
   - Should redirect to dashboard

2. **Returning OAuth User Test**:
   - Sign in with same Google/GitHub account
   - Should redirect directly to dashboard

3. **Duplicate Data Test**:
   - Try to use existing username/roll number
   - Should show appropriate error message

## Production Considerations

- Update callback URLs to production domain
- Set up proper session management
- Configure CORS for production
- Add rate limiting for profile completion
- Consider email verification for OAuth users 