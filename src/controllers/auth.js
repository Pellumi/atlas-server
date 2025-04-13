import User from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import validateEmail from "../utils/validateEmail.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

const registerUser = async (req, res, next) => {
  const { email, password, first_name, last_name } = req.body;

  if (!email || !password || !first_name || !last_name) {
    return next(ErrorHandler.BadRequest("All fields must be submitted"));
  }

  if (!validateEmail(email)) {
    return next(ErrorHandler.BadRequest("Invalid email format"));
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(ErrorHandler.BadRequest("User already exists"));
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    passwordHash,
    first_name,
    last_name,
    role: "student",
  });

  await user.save();

  const token = generateToken(user);

  res.status(201).json({
    message: "User created successfully",
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
    token,
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      ErrorHandler.BadRequest("User email and password must be submitted")
    );
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    throw ErrorHandler.Unauthenticated(
      "Invalid Credentials, email or password is incorrect"
    );
  }

  const token = user.generateAuthToken();

  res.json({
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
    email: user.email,
    token,
  });
};

export { registerUser, login };
