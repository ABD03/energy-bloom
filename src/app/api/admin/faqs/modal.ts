"use server";
import mongoose from "mongoose";
const { Schema } = mongoose;

const faqsSchema = new Schema(
  {
    question: { type: String, required: true, text: true },
    answer: { type: String, required: true },
    position: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      index: true,
    },
  },
  { timestamps: true },
);

const Faqs = mongoose.models.faqs || mongoose.model("faqs", faqsSchema);
export default Faqs;
