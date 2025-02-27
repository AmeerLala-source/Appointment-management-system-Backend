require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => {
  console.log("🟢 Server is running");
  res.send("Server is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/ai", require("./routes/aiRoutes")); 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
