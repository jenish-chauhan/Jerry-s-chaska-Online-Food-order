const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

let io;

const getAllowedOrigins = () => {
  const configuredOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:8080",
    "http://localhost",
    ...configuredOrigins,
  ];
};

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: getAllowedOrigins(),
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_secret",
      );
      socket.user = decoded;
      return next();
    } catch (error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    if (socket.user?.id) {
      socket.join(`user:${socket.user.id}`);
    }

    if (socket.user?.role === "admin") {
      socket.join("admins");
    }
  });

  return io;
};

const emitOrderCreated = (order) => {
  if (!io) {
    return;
  }

  io.to("admins").emit("order:created", order);

  if (order.userId) {
    io.to(`user:${order.userId}`).emit("order:created", order);
  }
};

const emitOrderUpdated = (order) => {
  if (!io) {
    return;
  }

  io.to("admins").emit("order:updated", order);

  if (order.userId) {
    io.to(`user:${order.userId}`).emit("order:updated", order);
  }
};

module.exports = {
  emitOrderCreated,
  emitOrderUpdated,
  getAllowedOrigins,
  initSocket,
};
