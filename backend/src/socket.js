const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const { buildSocketCorsOptions } = require("./config/cors");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: buildSocketCorsOptions(),
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
  initSocket,
};
