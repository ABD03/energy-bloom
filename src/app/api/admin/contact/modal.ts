import mongoose from "mongoose";
const { Schema } = mongoose;
const TeamsSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Contacts =
  mongoose.models.contacts || mongoose.model("contacts", TeamsSchema);
export default Contacts;