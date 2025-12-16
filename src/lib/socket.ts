import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    console.log("[Socket] Creating new socket instance");
    socket = io({
      autoConnect: false,
    });
    
    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket?.id);
    });
    
    socket.on("disconnect", () => {
      console.log("[Socket] Disconnected");
    });
    
    socket.on("connect_error", (err) => {
      console.log("[Socket] Connection error:", err.message);
    });
  }
  return socket;
}

export function connectSocket(): Socket {
  const s = getSocket();
  console.log("[Socket] connectSocket called, already connected:", s.connected);
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function disconnectSocket(): void {
  console.log("[Socket] disconnectSocket called");
  if (socket?.connected) {
    socket.disconnect();
  }
}
