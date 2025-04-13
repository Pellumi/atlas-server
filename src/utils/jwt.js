import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const generateToken = (userId, role) =>
  sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const verifyToken = (token) => verify(token, JWT_SECRET);

export { generateToken, verifyToken };
