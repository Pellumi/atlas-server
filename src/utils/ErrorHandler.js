class ErrorHandler extends Error {
  constructor(message, statusCode, name) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.name = name || "ErrorHandler";
  }

  static BadRequest(message) {
    return new ErrorHandler(message, 400, "ValidationError");
  }

  static Unauthenticated(message = "Authentication failed") {
    return new ErrorHandler(message, 401, "AuthenticationError");
  }

  static Unauthorized(message = "Not authorized to access this resource") {
    return new ErrorHandler(message, 403, "AuthorizationError");
  }

  static NotFound(resource) {
    return new ErrorHandler(`${resource} not found`, 404, "NotFoundError");
  }

  static Conflict(message) {
    return new ErrorHandler(message, 409, "ConflictError");
  }

  static InternalServer(message) {
    return new ErrorHandler(message, 500, "InternalServerError");
  }
}

export default ErrorHandler;
