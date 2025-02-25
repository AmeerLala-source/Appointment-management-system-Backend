const express = require("express");
const { chatWithAI, getChatHistory } = require("../controllers/aiController");

const router = express.Router();

router.post("/chat", chatWithAI);
router.get("/chat/:userId", getChatHistory);

module.exports = router;
