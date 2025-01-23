const checkAuthorisation = (request, response, next) => {
  request.sessionStore.get(request.sessionID, (error, session) => {
    console.log(session);
  });

  if (!request.session.user) {
    console.log("Authorization failed: No user in session");
    return response.status(401).send("Unauthorized");
  }

  console.log("Authorization successful: User found in session");
  next();
};

const checkAdmin = (request, response, next) => {
  console.log("checkAdmin: Checking if user is an Admin...");
  if (!request.session.user || request.session.user.role !== "Admin") {
    console.log("Forbidden: User is not an Admin.");
    return response.status(403).send("Forbidden");
  }
  console.log("checkAdmin: User is an Admin:", request.session.user);
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
    }
  );
};
