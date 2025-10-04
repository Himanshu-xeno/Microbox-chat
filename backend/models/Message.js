// import mongoose from "mongoose";

// const MessageSchema = new mongoose.Schema({
//   chatId: { type: String, required: true }, // e.g. for private: sorted "userA_userB", for group: groupId

//   sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // null for group
//   group: { type: String, default: null }, // group id when message belongs to a group

//   // text is now optional (plaintext or system messages)
//   text: { type: String, default: "" },

//   // encrypted payload (used from Day-5)
//   ciphertext: { type: String, default: "" },
//   iv: { type: String, default: "" },

//   seen: { type: Boolean, default: false }
// }, { timestamps: true });

// // Useful indexes for fast history & conversation queries
// MessageSchema.index({ chatId: 1, createdAt: -1 });
// MessageSchema.index({ receiver: 1, seen: 1 }); // for unread calculations

// export default mongoose.model("Message", MessageSchema);


// backend/models/Message.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  chatId: { type: String, required: true }, // e.g. for private: sorted "userA_userB", for group: groupId
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // null for group
  group: { type: String, default: null }, // group id when message belongs to a group
  // Make `text` optional so encrypted-only messages (ciphertext + iv) don't fail validation
  text: { type: String, default: "" },
  // ciphertext & iv for encrypted messages
  ciphertext: { type: String, default: "" },
  iv: { type: String, default: "" },
  seen: { type: Boolean, default: false }
}, { timestamps: true });

// Indexes for performance
MessageSchema.index({ chatId: 1, createdAt: -1 });
MessageSchema.index({ receiver: 1, seen: 1 });

export default mongoose.model("Message", MessageSchema);
