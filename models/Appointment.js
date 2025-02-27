const mongoose = require("mongoose");
const AppointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    medicalField: { type: String, required: true, trim: true },
    dateTime: { type: Date, required: true },
  },
  { timestamps: true }
);
const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;