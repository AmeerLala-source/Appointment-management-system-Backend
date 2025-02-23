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
    diagnosis: { type: String }, // Store AI-generated diagnosis
    recommendations: [{ type: String }], // List of recommendations
    specialist: { type: String }, // Suggested specialist based on symptoms
    finalRecommendation: { type: String } // Summary recommendation at end
  },
  { timestamps: true }
);

const ChatLog = mongoose.model("ChatLog", ChatLogSchema);
module.exports = ChatLog;
