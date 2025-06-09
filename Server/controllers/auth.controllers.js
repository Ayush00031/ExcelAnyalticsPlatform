import bcrypt from "bcryptjs"; // Also fix typo: was "bycrypt"
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashPassword,
      role: role || "user",
    }); // ✅ FIXED
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
