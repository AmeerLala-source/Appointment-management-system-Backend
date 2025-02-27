const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/validate-token", authMiddleware, (req, res) => {
    res.json({ valid: true, message: "Token is valid", user: req.user });
});

module.exports = router;
