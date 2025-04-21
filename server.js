const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const foodSchema = new mongoose.Schema({
  date: String,
  morning: String,
  morningSnack: String,
  afternoon: String,
  eveningSnack: String,
  night: String,
  calories: String,
});

const Food = mongoose.model("Food", foodSchema);

app.get("/api/foods", async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
});

app.get("/api/foods/:id", async (req, res) => {
  const food = await Food.findById(req.params.id);
  res.json(food);
});

app.post("/api/foods", async (req, res) => {
  const newFood = new Food(req.body);
  await newFood.save();
  res.json(newFood);
});

app.put("/api/foods/:id", async (req, res) => {
  const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedFood);
});

app.delete("/api/foods/:id", async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// app.listen(5000, () => console.log("Server running on port 5000"));
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server Running on ${PORT}`));

// Don't forget to create a .env file in backend directory:
// MONGO_URI=your_mongodb_connection_string
