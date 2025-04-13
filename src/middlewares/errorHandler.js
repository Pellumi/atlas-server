import ErrorHandler from "../utils/ErrorHandler.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ErrorHandler) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      status: "fail",
      message: "Duplicate entry: A record with this value already exists.",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "fail",
      message: Object.values(err.errors).map((e) => e.message).join(", "),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      status: "fail",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  res.status(500).json({
    status: "error",
    message: "Internal server error",
    error: err.message,
  });

  return next();
};

export default errorHandler;
