const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  date: String,
  morning: String,
  morningCalories: String,
  morningSnack: String,
  morningSnackCalories: String,
  afternoon: String,
  afternoonCalories: String,
  eveningSnack: String,
  eveningSnackCalories: String,
  night: String,
  nightCalories: String,
  email: String,
  // calories: String,
});

const FoodModel = mongoose.model("Food", foodSchema);

module.exports = FoodModel;
