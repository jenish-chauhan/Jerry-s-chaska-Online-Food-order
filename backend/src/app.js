const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");
const analyticsRoutes = require("./routes/analytics");
const adminRoutes = require("./routes/admin");
const User = require("./models/User");
const FoodItem = require("./models/FoodItem");
const Order = require("./models/Order");
const AdminSession = require("./models/AdminSession");
const { buildExpressCorsOptions, getAllowedOrigins } = require("./config/cors");
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const mongoUri =
  process.env.MONGO_URI || "mongodb://localhost:27017/jerrys_chaska";
const defaultMenuItems = [
  {
    name: "Classic Cheese Burger",
    description:
      "Juicy beef patty with cheddar cheese, lettuce, tomato, and house sauce.",
    price: 8.99,
    image_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
    category: "Burgers",
    available: true,
  },
  {
    name: "Spicy Chicken Burger",
    description: "Crispy chicken fillet with spicy mayo and pickles.",
    price: 9.99,
    image_url:
      "https://images.unsplash.com/photo-1615557960916-5f4791effe9?w=500",
    category: "Burgers",
    available: true,
  },
  {
    name: "Margherita Pizza",
    description: "Classic tomato and mozzarella pizza with fresh basil.",
    price: 12.99,
    image_url:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
    category: "Pizza",
    available: true,
  },
  {
    name: "Pepperoni Pizza",
    description: "Spicy pepperoni with mozzarella and tomato sauce.",
    price: 14.99,
    image_url:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
    category: "Pizza",
    available: true,
  },
  {
    name: "Cola",
    description: "Chilled cola beverage.",
    price: 2.99,
    image_url:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500",
    category: "Beverages",
    available: true,
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center.",
    price: 6.99,
    image_url:
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=500",
    category: "Desserts",
    available: true,
  },
];
const removableDemoEmails = [
  "admin@jerryschaska.com",
  "user20260317164931@example.com",
  "socketuser1773746468854@example.com",
];

const seedDefaultAdmin = async () => {
  const adminEmail = (
    process.env.ADMIN_EMAIL || "jenishchauhan.08@gmail.com"
  ).toLowerCase();
  const adminName = process.env.ADMIN_NAME || "Jenish Chauhan";
  const adminPassword = process.env.ADMIN_PASSWORD || "jerry@612";

  const password_hash = await bcrypt.hash(adminPassword, 12);
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    existingAdmin.name = adminName;
    existingAdmin.role = "admin";
    existingAdmin.password_hash = password_hash;
    await existingAdmin.save();
    console.log(`Updated default admin account: ${adminEmail}`);
    return;
  }

  await User.create({
    name: adminName,
    email: adminEmail,
    password_hash,
    role: "admin",
  });

  console.log(`Seeded default admin account: ${adminEmail}`);
};

const seedDefaultMenu = async () => {
  const existingCount = await FoodItem.countDocuments();
  if (existingCount > 0) {
    return;
  }

  await FoodItem.insertMany(defaultMenuItems);
  console.log(`Seeded ${defaultMenuItems.length} default menu items`);
};

const cleanupDemoData = async () => {
  const demoUsers = await User.find({
    $or: [
      { email: { $in: removableDemoEmails } },
      { email: { $regex: /^(user\d+|socketuser\d+)@example\.com$/i } },
      { name: { $in: ["Realtime User", "Socket User"] } },
    ],
  }).select("_id email");

  if (demoUsers.length === 0) {
    return;
  }

  const demoUserIds = demoUsers.map((user) => user._id.toString());
  const demoEmails = demoUsers.map((user) => user.email);

  await Promise.all([
    User.deleteMany({ _id: { $in: demoUsers.map((user) => user._id) } }),
    Order.deleteMany({ userId: { $in: demoUserIds } }),
    AdminSession.deleteMany({ adminId: { $in: demoUserIds } }),
  ]);

  console.log(`Removed demo users: ${demoEmails.join(", ")}`);
};

app.use(
  cors(buildExpressCorsOptions()),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("API error:", err);
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    error: statusCode === 403 ? "CORS origin denied" : "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");

    await cleanupDemoData();
    await seedDefaultAdmin();
    await seedDefaultMenu();
    initSocket(server);

    server.listen(PORT, () => {
      const allowedOrigins = getAllowedOrigins();

      console.log(`\nBackend running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API ready at http://localhost:${PORT}/api`);
      console.log(
        `CORS allowed origins: ${
          allowedOrigins.length > 0 ? allowedOrigins.join(", ") : "(none configured)"
        }`,
      );
      console.log(
        `\nConnected to MongoDB: ${mongoUri.split("@")[1] || "local"}\n`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server };
