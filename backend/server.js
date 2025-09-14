import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "microboxChat" })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// Test route
app.get("/", (req, res) => {
  res.send("MicroBox Chat Backend Running 🚀");
});

// Socket.io setup
io.on("connection", (socket) => {
  console.log("🔗 New client connected:", socket.id);

  // Listen for "hello" event from client
  socket.on("hello", (msg) => {
    console.log("Message from client:", msg);
    // Send response back to this client
    socket.emit("helloResponse", "Hello from server 👋");
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
