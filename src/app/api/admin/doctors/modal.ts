import mongoose from "mongoose";
const { Schema } = mongoose;

const slotSchema = new Schema(
  {
    day: {
      type: String,
      enum: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    },
    startTime: String,
    endTime: String,
  },
  { _id: false }
);

const doctorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: String,
    gender: { type: String, enum: ["male", "female", "other"] },
    image: String,
    specialization: String,
    qualification: String,
    experienceYears: { type: Number, default: 0 },
    consultationFee: { type: Number, default: 0 },
    bio: String,
    slots: { type: [slotSchema], default: [] },
    status: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "users", index: true },
  },
  { timestamps: true }
);

const Doctors =
  mongoose.models.doctors || mongoose.model("doctors", doctorSchema);
export default Doctors;
