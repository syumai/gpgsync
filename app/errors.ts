class APIError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

class InvalidArgumentError extends APIError {
  constructor(message: string) {
    super(400, "Invalid Argument: " + message);
  }
}

export {
  APIError,
  InvalidArgumentError,
};
