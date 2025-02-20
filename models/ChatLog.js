const mongoose = require("mongoose");

const ChatLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    chatContent: { type: String, required: true },
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

const ChatLog = mongoose.model("ChatLog", ChatLogSchema);
module.exports = ChatLog;
