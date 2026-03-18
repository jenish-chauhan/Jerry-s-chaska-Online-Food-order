const jwt = require("jsonwebtoken");
const AdminSession = require("../models/AdminSession");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret",
    );
    req.user = decoded;

    // For admin users, verify session is active
    if (req.user.role === "admin") {
      const session = await AdminSession.findOne({
        sessionToken: token,
        isActive: true,
      });

      if (!session) {
        return res
          .status(401)
          .json({
            error: "Session expired or invalidated. Please login again.",
          });
      }
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token expired. Please login again." });
    }
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
