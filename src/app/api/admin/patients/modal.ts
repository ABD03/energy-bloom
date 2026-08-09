import mongoose from "mongoose";
const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    patientId: { type: String, unique: true, sparse: true, index: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    dob: Date,
    image: String,
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    address: String,
    status: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "users", index: true },
  },
  { timestamps: true }
);

const Patients =
  mongoose.models.patients || mongoose.model("patients", patientSchema);
export default Patients;
