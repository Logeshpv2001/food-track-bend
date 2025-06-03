const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailer");
require("dotenv").config();
const {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} = require("../config/emailTemplates");

const userRegister = async (req, res) => {
  const { name, email, password, number, address } = req.body;

  // if ((!name, !email, !password, !number, !address)) {
  //   return res.json({ success: false, message: "Missing required fields" });
  // }
  if ((!name, !email, !password)) {
    return res.json({ success: false, message: "Missing required fields" });
  }
  console.log("Received register request:", req.body);

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already there" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      email,
      name,
      password: hashedPassword,
      // address,
      // number,
    });

    await user.save();
    console.log("User created:", user);
    // jwt.sign(payload, secret, options)

    // jwt.sign()= > create a JWT (JSON Web Token).

    const token = jwt.sign({ id: user._id }, process.env.jwt_secret, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure:
        process.env.node_env ===
        "production" /* How secure works initially cookie will work only on local ex:http,
         but if producstion is gone it will work for live servers also, i want to update in .env once productio hpnd */,
      sameSite:
        process.env.node_env === "production"
          ? "none"
          : "strict" /* for local it will have strict because both will run on local,
        but in production bend will run on some url fend will run on some server so that time  */,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to LV's Mern-Stack-Authentication",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <div style="text-align: center;">
            <img src="https://i.ibb.co/gL56LmNZ/logo.png" alt="MERN Logo" width="120" style="margin-bottom: 20px;" />
          </div>
          <h2 style="color: #2c3e50;">Welcome to LV's Mern-Stack-Authentication</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thank you for registering with us! Your account has been successfully created using the email: <strong>${email}</strong>.</p>
          <p>We're excited to have you on board. If you have any questions, feel free to reach out to our support team.</p>
          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} LV's Mern-Stack-Authentication. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// const userLogin = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.json({
//       success: false,
//       message: "Email and Password is required",
//     });
//   }

//   try {
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.json({ success: false, message: "Invalid Password" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.jwt_secret, {
//       expiresIn: "7d",
//     });

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.node_env === "production",
//       sameSite: process.env.node_env === "production" ? "none" : "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     const { userData } = user._doc;
//     // res.cookie("token", token, {
//     //   httpOnly: true,
//     //   secure: true, // since you're on HTTPS
//     //   sameSite: "none", // cross-origin
//     //   maxAge: 7 * 24 * 60 * 60 * 1000,
//     // });
//     return res.json({ success: true, message: "true", user: userData });
//   } catch (error) {
//     return res.json({ success: false, message: error.message });
//   }
// };

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and Password is required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.jwt_secret, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.node_env === "production",
      sameSite: process.env.node_env === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Exclude password from the user object
    const { password: _, ...userData } = user._doc;

    return res.json({
      success: true,
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const userLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      secure: process.env.node_env === "production",
      sameSite: process.env.node_env === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // res.clearCookie("token", {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    // });

    return res.json({ success: true, message: "Logout Successful" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.json({ success: false, message: "User id required" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User id not found" });
    }
    if (user.isaccountverified) {
      return res.json({
        success: false,
        message: "User account alreday verified",
      });
    }
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    user.verifyotp = otp;
    user.verifyotpexpiresat = Date.now() + 5 * 60 * 1000;
    await user.save();

    const mailoption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify Email Otp",
      // text: `Your acoount verify otp is ${otp}`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailoption);

    return res.json({ success: true, message: "Otp sent Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Required fields" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      res.json({ success: false, message: "User id not found" });
    }

    if (user.verifyotp === "" || user.verifyotp !== otp) {
      res.json({ success: false, message: "Enter a valid OTP" });
    }

    if (user.verifyotpexpiresat < Date.now()) {
      res.json({ success: false, message: "Otp is expired" });
    }

    (user.isaccountverified = "true"), (user.verifyotp = "");
    (user.verifyotpexpiresat = 0), await user.save();

    res.json({ success: true, message: "OTP verified Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const isAuthenticated = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Account is Authenticated",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({
      success: false,
      message: "Email is required",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.json({
        success: false,
        message: "Cant find the user",
      });
    }

    const otp = String(Math.floor(1000 + Math.random() * 9000));
    user.resetotp = otp;
    user.resetotpexpiresat = Date.now() + 2 * 60 * 1000;
    await user.save();

    const mailoption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset Email Otp",
      // text: `Your acoount Reset otp is ${otp}`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailoption);

    return res.json({ success: true, message: "Reset Otp sent Successfully" });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  if (!email || !otp || !password) {
    res.json({
      success: false,
      message: "Missing Required Fields",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetotp === "" || user.resetotp !== otp) {
      res.json({
        success: false,
        message: "Otp is Invalid",
      });
    }

    if (user.resetotpexpiresat < Date.now()) {
      res.json({
        success: false,
        message: "Otp is expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    (user.password = hashedPassword),
      (user.resetotp = ""),
      (user.resetotpexpiresat = 0);

    await user.save();

    return res.json({
      success: true,
      message: "Password changed succesfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const getData = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: {
        name: user.name,
        email: user.email,
        address: user.address,
        number: user.number,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
  getData,
};
