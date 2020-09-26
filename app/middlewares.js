const invalidURIValidatorHandler = (req, res, next) => {
  let err;
  try {
    decodeURIComponent(req.path);
  } catch (e) {
    err = e;
  }
  if (err) {
    throw new InvalidArgumentError("Invalid URI format");
  }
  next();
};

const errorHandler = (err, req, res, next) => {
  if (err instanceof APIError) {
    if (err.code !== 400) {
      console.error(err.stack);
    }
    res.status(err.code).send(err.message);
    return;
  }
  console.error(err.stack);
  res.status(500).send({
    error: "Internal Server Error",
  });
};

module.exports = {
  invalidURIValidatorHandler,
  errorHandler,
};
