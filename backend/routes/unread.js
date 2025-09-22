// backend/routes/unread.js
import express from "express";
import Message from "../models/Message.js";
import mongoose from "mongoose";

const router = express.Router();

// GET /api/unread-counts
router.get("/", async (req, res) => {
  try {
    const me = req.user.id;

    // unread private messages grouped by sender
    const unreadPrivate = await Message.aggregate([
      { $match: { receiver: mongoose.Types.ObjectId(me), seen: false, group: null } },
      { $group: { _id: "$sender", count: { $sum: 1 } } }
    ]);

    // unread group messages per group (optional)
    const unreadGroup = await Message.aggregate([
      { $match: { group: { $ne: null }, seen: false } }, // group seen handling requires per-user seen in production
      { $group: { _id: "$group", count: { $sum: 1 } } }
    ]);

    res.json({ private: unreadPrivate, groups: unreadGroup });
  } catch (err) {
    console.error("unread counts error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
