import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const normalizeOrigin = (value) => value.replace(/\/+$/, "");
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((item) => item.trim())
  .map((item) => normalizeOrigin(item))
  .filter(Boolean);

import jwt from "jsonwebtoken";

const io = new Server(server, {
  cors: {
    origin: [...allowedOrigins, /\.vercel\.app$/],
    methods: ["GET", "POST"]
  }
});

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
  
  if (!token) {
    return next(new Error("Authentication error: Token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id; // Matches the id from signToken payload
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
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
