import nodemailer from "nodemailer";

// Ensure that the environment variables are loaded
import dotenv from "dotenv";  
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Doodh Hisaab OTP Verification",
    text: `Your OTP for Doodh Hisaab is: ${otp}. It is valid for 10 minutes.`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};