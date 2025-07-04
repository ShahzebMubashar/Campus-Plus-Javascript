const checkAuthorisation = (request, response, next) => {
  console.log("\n[AUTH] Checking session:", request.sessionID);

  if (!request.session) {
    return response.status(401).send("No session found");
  }

  if (!request.session.user) {
    return response.status(401).send("Please log in");
  }

  console.log("[AUTH] User authenticated:", request.session.user.username);
  next();
};

const checkAdmin = (request, response, next) => {
  if (!request.session.user || request.session.user.role !== "Admin") {
    console.log("[AUTH] Admin check failed:", request.session.user?.username);
    return response.status(403).send("Admin access required");
  }
  console.log("[AUTH] Admin verified:", request.session.user.username);
  next();
};

module.exports = {
  checkAuthorisation,
  checkAdmin,
};

const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return response.sendStatus(401);

  const user = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, user) => {
      if (err) return response.sendStatus(403);

      request.user = user;
      next();
    },
  );
};
