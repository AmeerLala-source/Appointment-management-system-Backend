const Appointment = require("../models/Appointment");

const bookAppointment = async (req, res) => {
  try {
    const { medicalField, dateTime } = req.body;
    if (!medicalField || !dateTime)
      return res.status(400).json({ message: "צריך למלא כל השדות" });

    const appointment = new Appointment({
      userId: req.user._id,
      medicalField,
      dateTime,
    });

    await appointment.save();
    res.status(201).json({ message: "התור נקבע בהצלחה", appointment });
  } catch (err) {
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

const cancelAppointment = async (req, res) => {
    try {
      const appointment = await Appointment.findByIdAndDelete(req.params.id);
      if (!appointment) 
        return res.status(404).json({ message: "תור לא נמצא" });
  
      res.json({ message: "התור בוטל בהצלחה" });
    } catch (err) {
      res.status(500).json({ message: "שגיאה בשרת" });
    }
  };
  
module.exports = { bookAppointment, getAppointments, cancelAppointment };
