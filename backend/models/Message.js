import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // null for group messages
  group: { type: String, default: null }, // e.g. "global"
  text: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
