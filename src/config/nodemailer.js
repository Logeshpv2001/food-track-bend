require("dotenv").config();

const nodemailer = require("nodemailer");

// console.log("SMTP USER:", process.env.SMTP_USER);
// console.log("SMTP PASS:", process.env.SMTP_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = transporter;
