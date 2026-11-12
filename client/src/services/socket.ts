import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getLiveSocket(): Socket {
  if (!socket) {
    const backendUrl = (import.meta.env.VITE_API_URL || window.location.origin).replace(/\/$/, "");
    socket = io(backendUrl, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });
  }
  return socket;
}

