import mongoose from "mongoose";
const { Schema } = mongoose;

const expenseSchema = new Schema(
  {
    // A calendar date as "YYYY-MM-DD" (no time, no timezone), so it can never
    // slip to a neighbouring day depending on who saved it or where.
    date: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    // Optional: the healer this expense belongs to.
    doctor: { type: Schema.Types.ObjectId, ref: "doctors", index: true },
    note: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "users", index: true },
  },
  { timestamps: true },
);

const Expenses =
  mongoose.models.expenses || mongoose.model("expenses", expenseSchema);
export default Expenses;
