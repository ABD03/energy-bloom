import mongoose from "mongoose";
const { Schema } = mongoose;

const pagesSchema = new Schema(
  {
    name: { type: String, required: true },
    sections: { type: String, required: true },
    permalink: { type: String, required: true, unique: true },
    meta_description: { type: String, required: false },
    meta_image: { type: String, required: false, default: "/default/placeholder.png" },
    author: { type: String, required: true },
    status: { type: Boolean, default: true },
    editor: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: false,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);
const Pages = mongoose.models.pages || mongoose.model("pages", pagesSchema);
export default Pages;
