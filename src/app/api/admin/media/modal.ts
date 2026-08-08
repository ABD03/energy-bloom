import mongoose from "mongoose";
const { Schema } = mongoose;
const mediaSchema = new Schema(
  {
    caption: { type: String, text: true },
    description: { type: String, text: true },
    name: { type: String, text: true },
    url: { type: String, text: true },
    type: { type: String, text: true },
    size: { type: String, text: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);
const Media = mongoose.models.media || mongoose.model("media", mediaSchema);
export default Media;
