import mongoose from "mongoose";
const { Schema } = mongoose;
const staticsSchema = new Schema(
  {
    date: { type: Date, required: true, unique: true },
    views: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    desktop: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Statics =
  mongoose.models.statics || mongoose.model("statics", staticsSchema);
export default Statics;
