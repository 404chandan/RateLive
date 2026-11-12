import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getLiveSocket(): Socket {
  if (!socket) {
    socket = io(window.location.origin, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });
  }
  return socket;
}

