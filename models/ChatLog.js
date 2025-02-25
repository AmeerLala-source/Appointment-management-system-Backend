const mongoose = require("mongoose");

const ChatLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    conversation: [
      {
        role: { type: String, enum: ["user", "assistant"], required: true },
        content: { type: String, required: true }
      }
    ],
    diagnosis: { type: String },
    recommendations: [{ type: String }], 
    specialist: { type: String },
    finalRecommendation: { type: String } 
  },
  { timestamps: true }
);

const ChatLog = mongoose.model("ChatLog", ChatLogSchema);
module.exports = ChatLog;
