import mongoose from "mongoose";
const { Schema } = mongoose;
const categorySchema = new Schema(
  {
    value: { type: String, text: true },
    image: String,
    position: { type: Number },
    show_home: { type: Boolean, default: true },
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
const Categories =
  mongoose.models.categories || mongoose.model("categories", categorySchema);
export default Categories;
