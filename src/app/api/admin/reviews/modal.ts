"use server";
import mongoose from "mongoose";
const { Schema } = mongoose;
const reviewsSchema = new Schema(
  {
    name: { type: String, text: true },
    description: { type: String, text: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    image: String,
    position: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);
const Reviews =
  mongoose.models.reviews || mongoose.model("reviews", reviewsSchema);
export default Reviews;
