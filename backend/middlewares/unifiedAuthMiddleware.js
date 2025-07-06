const unifiedAuthMiddleware = (req, res, next) => {
    console.log("=== UNIFIED AUTH MIDDLEWARE ===");
    console.log("Session ID:", req.sessionID);
    console.log("Session exists:", !!req.session);
    console.log("Session user:", req.session?.user);
    console.log("req.user (Passport):", req.user);
    console.log("isAuthenticated():", req.isAuthenticated ? req.isAuthenticated() : 'N/A');
    
    // Check if user is authenticated via OAuth
    if (req.isAuthenticated()) {
        console.log("✅ OAuth authentication successful");
        // OAuth user - user info is in req.user
        req.userid = req.user.userid;
        req.authType = 'oauth';
        return next();
    }

    // Check if user is authenticated via session
    if (req.session && req.session.user && req.session.user.userid) {
        console.log("✅ Session authentication successful");
        // Session user - user info is in req.session.user
        req.userid = req.session.user.userid;
        req.authType = 'session';
        return next();
    }

    console.log("❌ Authentication failed - no valid session or OAuth");
    console.log("=== END UNIFIED AUTH ===");
    // Not authenticated
    return res.status(401).json({ error: "Not authenticated" });
};

module.exports = unifiedAuthMiddleware; 