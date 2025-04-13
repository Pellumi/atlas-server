import app from "./src/app.js";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

export { io };

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
