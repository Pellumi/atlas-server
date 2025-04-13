import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },

  role: {
    type: String,
    enum: ["admin", "student"],
    default: "student",
  },
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.generateAuthToken = function () {
  return generateToken(this._id, this.role);
};

const User = mongoose.model("User", userSchema);

export default User;