exports.checkAuthorisation = (request, response, next) => {
  request.sessionStore.get(request.sessionID, (error, session) => {
    // console.log(session);
  });

  if (!request.session.user) return response.status(401).send("Unauthorized");
  next();
};

exports.checkAdmin = (request, response, next) => {
  if (request.session.user.role !== "Admin")
    return response.status(403).send("Forbidden");
  next();
};
