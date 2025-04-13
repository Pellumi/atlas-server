import ErrorHandler from "../utils/ErrorHandler.js";
import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw ErrorHandler.Unauthenticated("No token provided");
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.userId).select("-passwordHash");
    next();
  } catch (error) {
    res.status(401);
    throw ErrorHandler.Unauthenticated("Invalid token");
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw ErrorHandler.Unauthorized();
    }
    next();
  };

export { protect, authorize };
