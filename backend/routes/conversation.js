// backend/routes/conversations.js
import express from "express";
import Message from "../models/Message.js";
import mongoose from "mongoose";

const router = express.Router();

// GET /api/conversations
// Returns list of conversations (private and groups) with last message.
// For private conversations we return otherUserId as "peer"
router.get("/", async (req, res) => {
  try {
    const me = req.user.id;

    // 1) Last private messages grouped by chatId
    const privateAgg = await Message.aggregate([
      { $match: { group: null, $or: [{ sender: mongoose.Types.ObjectId(me) }, { receiver: mongoose.Types.ObjectId(me) }] } },
      { $sort: { createdAt: -1 } },
      { $group: {
          _id: "$chatId",
          lastMessage: { $first: "$$ROOT" }
      } },
      { $replaceRoot: { newRoot: "$lastMessage" } }
    ]);

    // 2) Last group messages where user is in group (we assume client shows groups; you can later filter by memberships)
    const groupAgg = await Message.aggregate([
      { $match: { group: { $ne: null } } },
      { $sort: { createdAt: -1 } },
      { $group: {
          _id: "$group",
          lastMessage: { $first: "$$ROOT" }
      } },
      { $replaceRoot: { newRoot: "$lastMessage" } }
    ]);

    // return combined list (sort by createdAt desc)
    const combined = privateAgg.concat(groupAgg).sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
    res.json(combined);
  } catch (err) {
    console.error("conversations error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
