const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, require: true },
  name: { type: String, required: true },
  // number: { type: String, required: true },
  // address: { type: String, required: true },
  verifyotp: { type: String, default: "" },
  verifyotpexpiresat: { type: Number, default: 0 },
  isaccountverified: { type: Boolean, default: false },
  resetotp: { type: String, default: "" },
  resetotpexpiresat: { type: Number, default: 0 },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
