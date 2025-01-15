export const errorHandler = (err, request, response, next) => {
  console.error(err.stack);
  response.status(500).send("Something broke!");
};
