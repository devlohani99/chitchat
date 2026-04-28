import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    incomingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    outgoingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
