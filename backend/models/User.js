import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // hashed password
  publicKey: { type: Object, default: null } // store user's exported publicKey (JWK)
}, { timestamps: true });

export default mongoose.model("User", userSchema);
