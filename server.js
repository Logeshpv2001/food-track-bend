const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const FoodModel = require("./src/models/foodModel");
const userModel = require("./src/models/userModel");
const router = require("./src/routes/route");
require("dotenv").config();
const app = express();

const cors = require("cors");
const verifyUser = require("./src/middleware/verifyUser");

// const corsOptions = {
//   origin: process.env.FRONTEND_URL, // Frontend URL (adjust if using a different port)
//   credentials: true, // Allow sending cookies and authorization headers
// };

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // MUST match exactly
    credentials: true, // Required to allow cookies
  })
);

// app.use(cors({ credentials: true }));
app.use(cookieParser());

app.use(express.json());

connectDB();

app.use("/api", router);

// app.post("/api/user-register", async (req, res) => {
//   console.log("New userrrrrrrrrrrrrrrrr", req.body);
//   const newUsers = new userModel(req.body);
//   await newUsers.save();
//   res.json(newUsers);
// });

// app.post("/api/user-login", async (req, res) => {
//   const { email, password } = req.body;
//   const findUser = await userModel.findOne({ email, password });
//   if (!findUser) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }
//   res.json(findUser);
// });

app.get("/api/foods", async (req, res) => {
  const foods = await FoodModel.find();
  res.json(foods);
});

app.get("/api/foods/:id", async (req, res) => {
  const food = await FoodModel.findById(req.params.id);
  res.json(food);
});

// app.get("/api/foodsforusers/:email", async (req, res) => {
//   const foodforUsers = await FoodModel.find({ email: req.params.email });
//   res.json(foodforUsers);
// });

app.get("/api/foodsforusers", verifyUser, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const foodforUsers = await FoodModel.find({ email: user.email });
    res.json(foodforUsers);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/foods", async (req, res) => {
  console.log("received data", req.body);
  const newFood = new FoodModel(req.body);
  await newFood.save();
  res.json(newFood);
});

app.patch("/api/foods/:id", async (req, res) => {
  const updatedFood = await FoodModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.json(updatedFood);
});

app.delete("/api/foods/:id", async (req, res) => {
  await FoodModel.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// app.listen(5000, () => console.log("Server running on port 5000"));
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});

// Don't forget to create a .env file in backend directory:
// MONGO_URI=your_mongodb_connection_string
