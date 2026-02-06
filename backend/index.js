const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// TEMP OTP STORE (for demo)
const otpStore = {};

// SEND OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  console.log("OTP for", email, "is", otp);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "YOUR_GMAIL@gmail.com",
      pass: "YOUR_APP_PASSWORD"
    }
  });

  try {
    await transporter.sendMail({
      from: "Thinkative <YOUR_GMAIL@gmail.com>",
      to: email,
      subject: "Your Thinkative Verification Code",
      text: `Your verification code is ${otp}`
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// VERIFY OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email];
    return res.json({ success: true });
  }

  res.status(400).json({ success: false });
});

// 🔥 THIS IS THE PART YOU WERE MISSING
app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
