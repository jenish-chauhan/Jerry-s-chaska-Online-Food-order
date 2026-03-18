const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const AdminSession = require("../models/AdminSession");

// Validation rules
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .isEmail()
    .customSanitizer((value) => value.trim().toLowerCase())
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .customSanitizer((value) => value.trim().toLowerCase())
    .withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Register new user
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password with salt rounds
    const password_hash = await bcrypt.hash(password, 12);
    const userId = await User.create({ name, email, password_hash });

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email, role: "user" },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: userId, name, email, role: "user" },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res
      .status(500)
      .json({ error: "Registration failed. Please try again later." });
  }
};

// Login user/admin
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Admin single session enforcement
    if (user.role === "admin") {
      // Invalidate all previous sessions
      await AdminSession.updateMany(
        { adminId: user._id.toString() },
        { isActive: false },
      );
    }

    // Generate JWT token with appropriate expiry
    const tokenExpiry = user.role === "admin" ? "1h" : "7d";
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: tokenExpiry },
    );

    // Store admin session for server-side validation
    if (user.role === "admin") {
      await AdminSession.create({
        adminId: user._id.toString(),
        sessionToken: token,
        isActive: true,
      });
    }

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ error: "Login failed. Please try again later." });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    // Invalidate admin session
    await AdminSession.findOneAndUpdate(
      { sessionToken: token },
      { isActive: false },
    );

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ error: "Logout failed. Please try again later." });
  }
};

module.exports = {
  register,
  login,
  logout,
  registerValidation,
  loginValidation,
};
