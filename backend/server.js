// backend/server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/authRoutes.js"; // from Day2
import verifyToken from "./middleware/verifyToken.js"; // from Day2
import User from "./models/User.js";
import Message from "./models/Message.js";
import conversationsRouter from "./routes/conversation.js";
import unreadRouter from "./routes/unread.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "microboxChat" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/conversations", verifyToken, conversationsRouter);
app.use("/api/unread-counts", verifyToken, unreadRouter);

// Get current user (protected)
app.get("/api/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// List users (protected)
app.get("/api/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ name: 1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get private messages between me and otherId with pagination
app.get("/api/messages/:otherId", verifyToken, async (req, res) => {
  try {
    const me = req.user.id;
    const other = req.params.otherId;
    const limit = parseInt(req.query.limit) || 50;
    const before = req.query.before ? new Date(req.query.before) : null;

    const q = {
      $or: [
        { sender: me, receiver: other },
        { sender: other, receiver: me },
      ],
    };
    if (before) q.createdAt = { $lt: before };

    const msgs = await Message.find(q).sort({ createdAt: -1 }).limit(limit);
    // Return in ascending order (oldest → newest)
    res.json(msgs.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get group messages for a groupId with pagination
app.get("/api/messages/group/:groupId", verifyToken, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const limit = parseInt(req.query.limit) || 50;
    const before = req.query.before ? new Date(req.query.before) : null;

    const q = { group: groupId };
    if (before) q.createdAt = { $lt: before };

    const msgs = await Message.find(q).sort({ createdAt: -1 }).limit(limit);
    res.json(msgs.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// --- Socket.IO with token verification ---
const onlineUsers = new Map(); // userId -> socketId

// Middleware to check token for socket handshake
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("No token provided"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // attach user info to socket
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user.id;
  onlineUsers.set(userId, socket.id);
  console.log("🔗 New client connected:", socket.id, "user:", userId);

  // Broadcast updated online users
  io.emit("onlineUsers", Array.from(onlineUsers.keys()));

  // Join default group
  socket.join("global");

  // Allow client to join a group
  socket.on("joinGroup", (groupId) => {
    socket.join(groupId);
    console.log(`User ${userId} joined group ${groupId}`);
  });

  // Handle typing events
  socket.on("typing", ({ to, isGroup, groupId }) => {
    if (isGroup) {
      socket.to(groupId || "global").emit("typing", { userId, groupId });
    } else if (to) {
      const recvSocketId = onlineUsers.get(String(to));
      if (recvSocketId) {
        io.to(recvSocketId).emit("typing", { userId });
      }
    }
  });

  // Handle stopTyping events
  socket.on("stopTyping", ({ to, isGroup, groupId }) => {
    if (isGroup) {
      socket.to(groupId || "global").emit("stopTyping", { userId, groupId });
    } else if (to) {
      const recvSocketId = onlineUsers.get(String(to));
      if (recvSocketId) {
        io.to(recvSocketId).emit("stopTyping", { userId });
      }
    }
  });

  // Handle marking messages as seen (private only)
  socket.on("markSeen", async ({ withUserId, isGroup }) => {
    try {
      if (isGroup) {
        // For now, ignore group seen
        return;
      }

      const res = await Message.updateMany(
        { sender: withUserId, receiver: userId, seen: false },
        { $set: { seen: true } }
      );

      const senderSocketId = onlineUsers.get(String(withUserId));
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", { by: userId, withUserId });
      }
    } catch (err) {
      console.error("markSeen error:", err);
    }
  });

  // sendMessage: payload { to, text, isGroup, groupId }
  // inside io.on("connection", (socket) => { ... })
socket.on("sendMessage", async (payload) => {
  try {
    const { to, text, isGroup, groupId, ciphertext, iv } = payload;

    // compute chatId
    let chatId;
    if (isGroup) {
      chatId = groupId || "global";
    } else {
      const a = String(socket.user.id);
      const b = String(to);
      chatId = [a, b].sort().join("_");
    }

    // If ciphertext provided, store it; otherwise fallback to plaintext (legacy)
    const msg = await Message.create({
      chatId,
      sender: userId,
      receiver: isGroup ? null : to,
      group: isGroup ? (groupId || "global") : null,
      text: ciphertext ? "" : (text || ""),
      ciphertext: ciphertext || "",
      iv: iv || "",
      seen: false
    });

    const out = {
      _id: msg._id,
      chatId: msg.chatId,
      sender: msg.sender,
      receiver: msg.receiver,
      group: msg.group,
      text: msg.text,           // will be empty if encrypted
      ciphertext: msg.ciphertext,
      iv: msg.iv,
      createdAt: msg.createdAt,
      seen: msg.seen,
      encrypted: !!msg.ciphertext
    };

    if (isGroup) {
      io.to(groupId || "global").emit("newMessage", out);
    } else {
      const recvSocketId = onlineUsers.get(String(to));
      if (recvSocketId) {
        io.to(recvSocketId).emit("newMessage", out);
      }
      socket.emit("newMessage", out);
    }
  } catch (err) {
    console.error("Error saving/sending message:", err);
  }
});


  // On disconnect
  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    console.log("❌ Client disconnected:", socket.id, "user:", userId);
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("MicroBox Chat Backend Running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
