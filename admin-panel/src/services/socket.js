import { io } from "socket.io-client";
import { API_URL } from "../config/runtime";

const SOCKET_URL = API_URL.startsWith("http")
  ? API_URL.replace(/\/api\/?$/, "")
  : window.location.origin;

let socket;

export const getAdminSocket = () => {
  const token = sessionStorage.getItem("admin_token");

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket", "polling"],
    });
  }

  socket.auth = token ? { token } : {};

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectAdminSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};
