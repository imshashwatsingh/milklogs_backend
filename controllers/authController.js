import db from "../config/database.config.js";
import { sendOTPEmail } from "../services/emailService.js";
import { generateOTP } from "../services/otpService.js";
import { generateToken } from "../utils/jwtUtils.js";

export const register = async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: "Username and email are required" });
  }

  try {
    // Check if user exists
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];
    const existingUser = await db.query(query, values);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Generate OTP and store it
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const otpQuery =
      "INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3)";
    await db.query(otpQuery, [email, otp, expiresAt]);

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ error: "Failed to send OTP" });
    }

    res.status(200).json({ message: "OTP sent to email", email });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp, username } = req.body;

  if (!email || !otp || !username) {
    return res
      .status(400)
      .json({ error: "Email, OTP, and username are required" });
  }

  try {
    // Check OTP
    const otpQuery =
      "SELECT * FROM otps WHERE email = $1 AND otp = $2 AND expires_at > NOW()";
    const otpResult = await db.query(otpQuery, [email, otp]);
    if (otpResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Insert user
    const insertQuery =
      "INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *";
    const insertValues = [username, email];
    const newUser = await db.query(insertQuery, insertValues);

    // Delete OTP
    await db.query("DELETE FROM otps WHERE email = $1", [email]);

    // Generate JWT
    const token = await generateToken({ id: newUser.rows[0].user_id });
    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Check if user exists and is verified
    const query = "SELECT * FROM users WHERE email = $1 ";
    const result = await db.query(query, [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found or not verified" });
    }

    // Generate OTP and store it
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const otpQuery =
      "INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3)";
    await db.query(otpQuery, [email, otp, expiresAt]);

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ error: "Failed to send OTP" });
    }

    res.status(200).json({ message: "OTP sent to email", email });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    // Check OTP
    const otpQuery =
      "SELECT * FROM otps WHERE email = $1 AND otp = $2 AND expires_at > NOW()";
    const otpResult = await db.query(otpQuery, [email, otp]);
    if (otpResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Get user
    const userQuery =
      "SELECT * FROM users WHERE email = $1";
    const userResult = await db.query(userQuery, [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    // Delete OTP
    await db.query("DELETE FROM otps WHERE email = $1", [email]);

    // Generate JWT
    const token = await generateToken({ id: userResult.rows[0].user_id });
    res.status(200).json({ token, user: userResult.rows[0] });
  } catch (error) {
    console.error("Error verifying login OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const authenticate  = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};