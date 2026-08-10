import mongoose from "mongoose";
const { Schema } = mongoose;

const appointmentSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "patients", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "doctors", required: true },
    date: { type: Date, required: true },
    slot: {
      day: String,
      startTime: String,
      endTime: String,
    },
    token: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    notes: String,
    briefing: String,
    remark: String,
    attachments: { type: [String], default: [] },
    feedback: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["upcoming", "expired", "cancelled", "attended"],
      default: "upcoming",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "users", index: true },
  },
  { timestamps: true }
);

const Appointments =
  mongoose.models.appointments ||
  mongoose.model("appointments", appointmentSchema);
export default Appointments;
