class APIError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

class InvalidArgumentError extends APIError {
  constructor(message) {
    super(400, "Invalid Argument: " + message);
  }
}
