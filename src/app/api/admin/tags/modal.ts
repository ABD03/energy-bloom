import mongoose from "mongoose";
const { Schema } = mongoose;
const tagsSchema = new Schema(
  {
    value: { type: String, text: true },
    status: { type: Boolean, default: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);
const Tags = mongoose.models.tags || mongoose.model("tags", tagsSchema);
export default Tags;
