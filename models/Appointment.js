const mongoose = require("mongoose");
const AppointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    medicalField: { type: String, required: true, trim: true },
    dateTime: { type: Date, required: true },
  },
  { timestamps: true }
);
AppointmentSchema.pre("save", async function (next) {
  const appointmentDate = new Date(this.dateTime).setHours(0, 0, 0, 0); 

  const existingAppointment = await mongoose.model("Appointment").findOne({
    userId: this.userId,
    dateTime: { 
      $gte: new Date(appointmentDate), 
      $lt: new Date(appointmentDate + 86400000) 
    }
  });

  if (existingAppointment) {
    const error = new Error("❌ You already have an appointment on this date.");
    return next(error);
  }
  
  next();
});
const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;