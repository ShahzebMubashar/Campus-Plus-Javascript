const unifiedAuthMiddleware = (req, res, next) => {
    // Check if user is authenticated via OAuth
    if (req.isAuthenticated()) {
        // OAuth user - user info is in req.user
        req.userid = req.user.userid;
        req.authType = 'oauth';
        return next();
    }

    // Check if user is authenticated via session
    if (req.session && req.session.user && req.session.user.userid) {
        // Session user - user info is in req.session.user
        req.userid = req.session.user.userid;
        req.authType = 'session';
        return next();
    }

    // Not authenticated
    return res.status(401).json({ error: "Not authenticated" });
};

module.exports = unifiedAuthMiddleware; 