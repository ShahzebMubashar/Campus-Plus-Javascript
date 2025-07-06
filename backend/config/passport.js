const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const pool = require('./database.js');
const bcrypt = require('bcrypt');

// No session serialization needed for JWT
// Remove serializeUser and deserializeUser

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Validate required profile data
        if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
            return done(new Error('No email provided by Google'), null);
        }

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT u.*, ui.name as fullName FROM Users u LEFT JOIN UserInfo ui ON u.userid = ui.userid WHERE u.email = $1',
            [profile.emails[0].value]
        );

        if (existingUser.rows.length > 0) {
            // User exists, return user data for JWT
            const user = existingUser.rows[0];
            return done(null, {
                userid: user.userid,
                email: user.email,
                username: user.username,
                fullName: user.fullname || profile.displayName,
                role: user.role || 'Student',
                isProfileComplete: user.username && user.rollnumber && user.rollnumber !== 'PENDING'
            });
        }

        // Create new user with pending status
        const client = await pool.connect();
        await client.query('BEGIN');

        try {
            // Generate a random password for OAuth users
            const randomPassword = Math.random().toString(36).slice(-10);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            // Create temporary username and rollnumber for OAuth users
            const tempUsername = `temp_${Date.now()}`;
            const tempRollnumber = 'PENDING';

            // Insert new user
            const newUser = await client.query(
                `INSERT INTO Users (username, email, password, rollnumber, role) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING userid, username, email, role`,
                [tempUsername, profile.emails[0].value, hashedPassword, tempRollnumber, 'Student']
            );

            // Insert user info
            await client.query(
                `INSERT INTO UserInfo (userid, name) VALUES ($1, $2)`,
                [newUser.rows[0].userid, profile.displayName]
            );

            await client.query('COMMIT');

            return done(null, {
                userid: newUser.rows[0].userid,
                email: newUser.rows[0].email,
                username: tempUsername,
                fullName: profile.displayName,
                role: 'Student',
                isProfileComplete: false
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
    }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    console.log('GitHub OAuth profile:', {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        emails: profile.emails
    });
    try {
        // GitHub might not provide email in profile, so we need to handle this
        let userEmail = null;

        // Try to get email from profile
        if (profile.emails && profile.emails.length > 0 && profile.emails[0].value) {
            userEmail = profile.emails[0].value;
        } else {
            // If no email in profile, create a temporary email using GitHub username
            userEmail = `${profile.username}@github.temp`;
        }

        // Check if user already exists by email
        const existingUser = await pool.query(
            'SELECT u.*, ui.name as fullName FROM Users u LEFT JOIN UserInfo ui ON u.userid = ui.userid WHERE u.email = $1',
            [userEmail]
        );

        if (existingUser.rows.length > 0) {
            // User exists, return user data for JWT
            const user = existingUser.rows[0];
            return done(null, {
                userid: user.userid,
                email: user.email,
                username: user.username,
                fullName: user.fullname || profile.displayName,
                role: user.role || 'Student',
                isProfileComplete: user.username && user.rollnumber && user.rollnumber !== 'PENDING'
            });
        }

        // Create new user with pending status
        const client = await pool.connect();
        await client.query('BEGIN');

        try {
            // Generate a random password for OAuth users
            const randomPassword = Math.random().toString(36).slice(-10);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            // Create temporary username and rollnumber for OAuth users
            const tempUsername = `temp_${Date.now()}`;
            const tempRollnumber = 'PENDING';

            // Insert new user
            const newUser = await client.query(
                `INSERT INTO Users (username, email, password, rollnumber, role) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING userid, username, email, role`,
                [tempUsername, userEmail, hashedPassword, tempRollnumber, 'Student']
            );

            // Insert user info
            await client.query(
                `INSERT INTO UserInfo (userid, name) VALUES ($1, $2)`,
                [newUser.rows[0].userid, profile.displayName || profile.username]
            );

            await client.query('COMMIT');

            return done(null, {
                userid: newUser.rows[0].userid,
                email: newUser.rows[0].email,
                username: tempUsername,
                fullName: profile.displayName || profile.username,
                role: 'Student',
                isProfileComplete: false
            });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('GitHub OAuth error:', error);
        return done(error, null);
    }
}));

module.exports = passport; 