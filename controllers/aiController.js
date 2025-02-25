const { OpenAI } = require("openai");
const ChatLog = require("../models/ChatLog");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MAX_HISTORY = 5; 

const chatWithAI = async (req, res) => {
  try {
    const { userId, message, endConversation } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message are required" });
    }

    let chatLog = await ChatLog.findOne({ userId });

    if (!chatLog) {
      chatLog = new ChatLog({ userId, conversation: [], diagnosis: "", specialist: "", finalRecommendation: "" });
    }

    const recentMessages = chatLog.conversation.slice(-MAX_HISTORY);
    const formattedHistory = recentMessages.map((chat) => ({
      role: chat.role,
      content: chat.content,
    }));

    formattedHistory.push({ role: "user", content: message });

    if (!chatLog.diagnosis) {
      const diagnosisResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Analyze the symptoms and provide ONLY the diagnosis in a short sentence." },
          ...formattedHistory,
        ],
        temperature: 0.5,
        max_tokens: 50,
      });

      chatLog.diagnosis = diagnosisResponse.choices[0].message.content;
    }

    if (!chatLog.specialist) {
      const specialistResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Based on the diagnosis, recommend ONLY a medical specialist (e.g., General Physician, ENT, Neurologist)." },
          { role: "assistant", content: chatLog.diagnosis },
        ],
        temperature: 0.5,
        max_tokens: 20,
      });

      chatLog.specialist = specialistResponse.choices[0].message.content;
    }

    let botReply = `Diagnosis: ${chatLog.diagnosis}\nSpecialist: ${chatLog.specialist}`;

    if (endConversation && !chatLog.finalRecommendation) {
      const finalRecommendationResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Summarize the diagnosis and specialist recommendation into a FINAL recommendation." },
          { role: "assistant", content: `Diagnosis: ${chatLog.diagnosis}` },
          { role: "assistant", content: `Recommended Specialist: ${chatLog.specialist}` },
        ],
        temperature: 0.6,
        max_tokens: 100,
      });

      chatLog.finalRecommendation = finalRecommendationResponse.choices[0].message.content;
      botReply += `\nFinal Recommendation: ${chatLog.finalRecommendation}`;
    }

    chatLog.conversation.push(
      { role: "user", content: message },
      { role: "assistant", content: botReply }
    );

    await chatLog.save();

    res.json({
      diagnosis: chatLog.diagnosis,
      specialist: chatLog.specialist,
      finalRecommendation: chatLog.finalRecommendation || null,
    });
  } catch (error) {
    console.error("❌ Chat error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const chatLog = await ChatLog.findOne({ userId });

    if (!chatLog) {
      return res.status(404).json({ error: "No chat history found." });
    }

    res.json({
      conversation: chatLog.conversation,
      diagnosis: chatLog.diagnosis,
      specialist: chatLog.specialist,
      finalRecommendation: chatLog.finalRecommendation || "No final recommendation yet.",
    });
  } catch (error) {
    console.error("❌ Fetch chat history error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { chatWithAI, getChatHistory };
