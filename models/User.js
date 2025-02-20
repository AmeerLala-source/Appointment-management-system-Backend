const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


const User = mongoose.model("User", UserSchema);
module.exports = User;
