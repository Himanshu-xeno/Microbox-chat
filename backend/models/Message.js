// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema({
//   sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // null for group messages
//   group: { type: String, default: null }, // e.g. "global"
//   text: { type: String, required: true },
//   seen: { type: Boolean, default: false }, // <-- NEW
// }, 
// { timestamps: true });

// export default mongoose.model("Message", messageSchema);

import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  chatId: { type: String, required: true }, // e.g. for private: sorted "userA_userB", for group: groupId

  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // null for group
  group: { type: String, default: null }, // group id when message belongs to a group

  // text is now optional (plaintext or system messages)
  text: { type: String, default: "" },

  // encrypted payload (used from Day-5)
  ciphertext: { type: String, default: "" },
  iv: { type: String, default: "" },

  seen: { type: Boolean, default: false }
}, { timestamps: true });

// Useful indexes for fast history & conversation queries
MessageSchema.index({ chatId: 1, createdAt: -1 });
MessageSchema.index({ receiver: 1, seen: 1 }); // for unread calculations

export default mongoose.model("Message", MessageSchema);
