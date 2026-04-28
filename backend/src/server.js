import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.on("join_user", (userId) => {
    if (!userId) return;
    socket.join(`user:${userId}`);
  });
  socket.on("typing", (payload) => {
    const { toUserId, fromUserId, fromName, isTyping } = payload || {};
    if (!toUserId || !fromUserId) return;
    io.to(`user:${toUserId}`).emit("typing:update", {
      fromUserId,
      fromName,
      isTyping: !!isTyping
    });
  });
});

app.set("io", io);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed", err.message);
    process.exit(1);
  });
