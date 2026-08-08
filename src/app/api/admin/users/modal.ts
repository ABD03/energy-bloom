import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    username: { type: String, text: true },
    password: String,
    name: String,
    email: { type: String, unique: true },
    phone: String,
    image: String,
    bio: String,
    access: { type: Array, default: [] },
    role: { type: String, default: "user" },
    verify: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    token: String,
    type: {
      type: String,
      default: "subscriber",
      enum: ["subscriber", "editor"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      index: true,
    },
    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
const Users = mongoose.models.users || mongoose.model("users", userSchema);
export default Users;
