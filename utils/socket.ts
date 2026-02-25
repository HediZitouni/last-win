import { io, Socket } from "socket.io-client";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://otrom.fr/lastwin/api/";
const BASE_URL = API_URL.replace(/\/lastwin\/api\/?$/, "");

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(BASE_URL, {
      transports: ["websocket"],
      autoConnect: true,
      path: "/lastwin/socket.io/",
    });
  }
  return socket;
}
