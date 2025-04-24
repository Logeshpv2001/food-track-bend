const express = require("express");
const {
  userRegister,
  userLogin,
  userLogout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
  getData,
} = require("../controllers/authController");
const userAuth = require("../middleware/userAuth");

const userRouter = express.Router();

userRouter.post("/user-register", userRegister);
userRouter.post("/user-login", userLogin);
userRouter.post("/user-logout", userLogout);
userRouter.post("/send-otp", userAuth, sendVerifyOtp);
userRouter.post("/verify-otp", userAuth, verifyEmail);
userRouter.post("/verify-account", userAuth, isAuthenticated);
userRouter.post("/reset-otp", sendResetOtp);
userRouter.post("/reset-password", resetPassword);
userRouter.get("/get-userData", userAuth, getData);

module.exports = userRouter;
