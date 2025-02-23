const { generateToken } = require("../helpers/token");
const User = require("../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) 
      return res.status(400).json({ message: "All fields are required" });

    const userExists = await User.findOne({ email });
    if (userExists) 
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Registration successful", token: generateToken(user._id) });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) 
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) 
      return res.status(400).json({ message: "Invalid email or password" });

    console.log(password, user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    
    if (!isMatch) 
      return res.status(400).json({ message: "Invalid email or password" });

    res.json({ message: "Login successful", token: generateToken(user._id) });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
