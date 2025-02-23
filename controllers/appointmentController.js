const Appointment = require("../models/Appointment");

const bookAppointment = async (req, res) => {
  try {
    const { medicalField, dateTime } = req.body;
    if (!medicalField || !dateTime)
      return res.status(400).json({ message: "All fields are required" });

    const appointment = new Appointment({
      userId: req.user._id,
      medicalField,
      dateTime,
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) 
      return res.status(404).json({ message: "Appointment not found" });

    res.json({ message: "Appointment canceled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { bookAppointment, getAppointments, cancelAppointment };
