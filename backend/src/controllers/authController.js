import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) =>
  jwt.sign({ id: user._id, name: user.name, username: user.username, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const normalizedUsername = username?.toLowerCase().trim() || "";
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already used" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username: normalizedUsername, email, password: hashed });
    const token = signToken(user);
    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email }
    });
  } catch {
    return res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = signToken(user);
    return res.json({
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email }
    });
  } catch {
    return res.status(500).json({ message: "Login failed" });
  }
};
